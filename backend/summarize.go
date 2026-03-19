package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func summarize(transcript string) (string, error) {
	fmt.Println("summarize called with:", transcript)

	payload, err := json.Marshal(map[string]interface{}{
		"model": "llama3-8b-8192",
		"messages": []map[string]string{
			{
				"role": "user",
				"content": "Summarize this video properly with details and bullet points:\n" + transcript,
			},
		},
	})
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest(
		"POST",
		"https://api.groq.com/openai/v1/chat/completions",
		bytes.NewReader(payload),
	)
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+os.Getenv("GROQ_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	client := http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	respBody, err := io.ReadAll(res.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %v", err)
	}

	fmt.Println("summarize response:", string(respBody))

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	err = json.Unmarshal(respBody, &result)
	if err != nil {
		return "", err
	}

	// ✅ important check
	if len(result.Choices) == 0 {
		return "", fmt.Errorf("no response from GROQ: %s", string(respBody))
	}

	return result.Choices[0].Message.Content, nil
}