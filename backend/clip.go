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
	Outputs  []string `json:"outputs"`
}

func contains(slice []string, item string) bool {
	for _, v := range slice {
		if v == item {
			return true
		}
	}
	return false
}

func sendError(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{
		"error": message,
	})
}

func clip(w http.ResponseWriter, r *http.Request) {
	 ytdlpPath, _ := exec.Command("which", "yt-dlp").CombinedOutput()
    ffmpegPath, _ := exec.Command("which", "ffmpeg").CombinedOutput()
    fmt.Println("yt-dlp location:", string(ytdlpPath))
    fmt.Println("ffmpeg location:", string(ffmpegPath))
    
	if r.Method != "POST" {
		sendError(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var body RequestBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		sendError(w, "Invalid request body.", 400)
		return
	}

	if body.TweetURL == "" {
		sendError(w, "Please provide a video URL.", 400)
		return
	}

	os.MkdirAll("download", os.ModePerm)

	id := time.Now().Unix()
	videoFile := fmt.Sprintf("download/%d.mp4", id)
	clippedFile := fmt.Sprintf("download/clipped_%d.mp4", id)
	audioFile := fmt.Sprintf("download/clipped_%d.mp3", id)

out, err := exec.Command("yt-dlp", "-f", "bestvideo+bestaudio/best", "--merge-output-format", "mp4", "-o", videoFile, body.TweetURL).CombinedOutput()
if err != nil {
    fmt.Println("yt-dlp error:", err)
    fmt.Println("yt-dlp output:", string(out))
    sendError(w, "Could not download video. Make sure the URL is valid and contains a video.", 500)
    return
}
fmt.Println("yt-dlp success:", string(out))

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
		sendError(w, "Failed to clip video. Try different timestamps.", 500)
		return
	}

	response := map[string]string{}

	if contains(body.Outputs, "mp4") {
		response["mp4Url"] = fmt.Sprintf("https://clipper-q2jf.onrender.com/clip/%s", clippedFile)
	}

	if contains(body.Outputs, "mp3") {
		_, err = exec.Command("ffmpeg", "-i", clippedFile, "-q:a", "0", "-map", "a", audioFile).CombinedOutput()
		if err != nil {
			sendError(w, "Failed to extract audio from video.", 500)
			return
		}
		response["mp3Url"] = fmt.Sprintf("https://clipper-q2jf.onrender.com/clip/%s",  audioFile)
	}

	needsAudio := contains(body.Outputs, "transcript") || contains(body.Outputs, "summary")
	if needsAudio && !contains(body.Outputs, "mp3") {
		_, err = exec.Command("ffmpeg", "-i", clippedFile, "-q:a", "0", "-map", "a", audioFile).CombinedOutput()
		if err != nil {
			sendError(w, "Failed to extract audio from video.", 500)
			return
		}
	}

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

	go func() {
		time.Sleep(10 * time.Minute)
		os.Remove(videoFile)
		os.Remove(clippedFile)
		os.Remove(audioFile)
		fmt.Println("🗑️ Cleaned up files:", id)
	}()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}