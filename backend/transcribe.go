package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

// upload the file, get back a URL
func uploadAudio(filePath string, apiKey string) (string, error) {
	fileData, err := os.ReadFile(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to read file: %v", err)
	}

	req, err := http.NewRequest("POST", "https://api.assemblyai.com/v2/upload", bytes.NewReader(fileData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %v", err)
	}

	var result struct {
		UploadURL string `json:"upload_url"`
	}
	json.Unmarshal(respBody, &result)

	return result.UploadURL, nil
}

// start transcription job
func startTranscription(uploadURL string, apiKey string) (string, error) {
	payload, _ := json.Marshal(map[string]interface{}{
		"audio_url":     uploadURL,
		"speech_models": []string{"universal-3-pro", "universal-2"},
	})

	req, err := http.NewRequest("POST", "https://api.assemblyai.com/v2/transcript", bytes.NewReader(payload))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %v", err)
	}

	var result struct {
		ID string `json:"id"`
	}
	json.Unmarshal(respBody, &result)

	return result.ID, nil
}

func pollTranscription(id string, apiKey string) (string, error) {
	for {
		req, err := http.NewRequest("GET", "https://api.assemblyai.com/v2/transcript/"+id, nil)
		if err != nil {
			return "", fmt.Errorf("failed to create request: %v", err)
		}
		req.Header.Set("Authorization", apiKey)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return "", fmt.Errorf("failed to send request: %v", err)
		}

		respBody, err := io.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil {
			return "", fmt.Errorf("failed to read response: %v", err)
		}

		var result struct {
			Status string `json:"status"`
			Text   string `json:"text"`
		}
		json.Unmarshal(respBody, &result)

		if result.Status == "completed" {
			return result.Text, nil
		} else if result.Status == "error" {
			return "", fmt.Errorf("transcription failed on assemblyai side")
		} else {
			time.Sleep(3 * time.Second)
		}
	}
}

func transcribeAudio(filePath string) (string, error) {
	apiKey := os.Getenv("ASSEMBLYAI_API_KEY")

	uploadURL, err := uploadAudio(filePath, apiKey)
	if err != nil {
		return "", err
	}

	id, err := startTranscription(uploadURL, apiKey)
	if err != nil {
		return "", err
	}

	return pollTranscription(id, apiKey)
}