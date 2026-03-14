package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"time"
)

type RequestBody struct {
	TweetURL string   `json:"tweetUrl"`
	Start    string   `json:"start"`
	End      string   `json:"end"`
	Outputs  []string `json:"outputs"` // e.g. ["mp4", "mp3", "transcript", "summary"]
}

func contains(slice []string, item string) bool {
	for _, v := range slice {
		if v == item {
			return true
		}
	}
	return false
}

func clip(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var body RequestBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	os.MkdirAll("download", os.ModePerm)

	id := time.Now().Unix()
	videoFile := fmt.Sprintf("download/%d.mp4", id)
	clippedFile := fmt.Sprintf("download/clipped_%d.mp4", id)
	audioFile := fmt.Sprintf("download/clipped_%d.mp3", id)

	// ── Step 1: download ─────────────────────────────────────────────
	_, err = exec.Command("yt-dlp", "-f", "bestvideo+bestaudio/best", "--merge-output-format", "mp4", "-o", videoFile, body.TweetURL).CombinedOutput()
	if err != nil {
		http.Error(w, "Failed to download video", http.StatusInternalServerError)
		return
	}

	// ── Step 2: clip first regardless of output format ───────────────
	var ffmpegErr error
	if body.Start == "" && body.End == "" {
		_, ffmpegErr = exec.Command("ffmpeg", "-i", videoFile, "-c", "copy", clippedFile).CombinedOutput()
	} else if body.Start != "" && body.End == "" {
		_, ffmpegErr = exec.Command("ffmpeg", "-i", videoFile, "-ss", body.Start, "-c", "copy", clippedFile).CombinedOutput()
	} else if body.Start == "" && body.End != "" {
		_, ffmpegErr = exec.Command("ffmpeg", "-i", videoFile, "-to", body.End, "-c", "copy", clippedFile).CombinedOutput()
	} else {
		_, ffmpegErr = exec.Command("ffmpeg", "-i", videoFile, "-ss", body.Start, "-to", body.End, "-c", "copy", clippedFile).CombinedOutput()
	}
	if ffmpegErr != nil {
		http.Error(w, "Failed to clip video", http.StatusInternalServerError)
		return
	}

	// ── Step 3: build response based on what user asked for ──────────
	response := map[string]string{}

	if contains(body.Outputs, "mp4") {
		response["mp4Url"] = fmt.Sprintf("http://localhost:%s/%s", port, clippedFile)
	}

	if contains(body.Outputs, "mp3") {
		_, err = exec.Command("ffmpeg", "-i", clippedFile, "-q:a", "0", "-map", "a", audioFile).CombinedOutput()
		if err != nil {
			http.Error(w, "Failed to extract audio", http.StatusInternalServerError)
			return
		}
		response["mp3Url"] = fmt.Sprintf("http://localhost:%s/%s", port, audioFile)
	}

	// extract audio for transcript/summary if not already done for mp3
	needsAudio := contains(body.Outputs, "transcript") || contains(body.Outputs, "summary")
	if needsAudio && !contains(body.Outputs, "mp3") {
		_, err = exec.Command("ffmpeg", "-i", clippedFile, "-q:a", "0", "-map", "a", audioFile).CombinedOutput()
		if err != nil {
			http.Error(w, "Failed to extract audio", http.StatusInternalServerError)
			return
		}
	}

	// transcribe if asked — also needed for summary
	var transcript string
	if contains(body.Outputs, "transcript") || contains(body.Outputs, "summary") {
		transcript, err = transcribeAudio(audioFile)
		if err != nil {
			fmt.Println("transcription failed:", err)
			transcript = ""
		}
		if contains(body.Outputs, "transcript") {
			response["transcript"] = transcript
		}
	}

	// summarize if asked
	if contains(body.Outputs, "summary") {
		if transcript == "" {
			response["summary"] = "summary unavailable — transcription failed"
		} else {
			summary, err := summarize(transcript)
			if err != nil {
				fmt.Println("summarization failed:", err)
				response["summary"] = "summary unavailable"
			} else {
				response["summary"] = summary
			}
		}
	}

	// ── Step 4: cleanup after 10 mins ────────────────────────────────
	go func() {
		time.Sleep(10 * time.Second)
		os.Remove(videoFile)
		os.Remove(clippedFile)
		os.Remove(audioFile)
		fmt.Println("🗑️ Cleaned up files:", id)
	}()

	// ── Step 5: send response ─────────────────────────────────────────
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}