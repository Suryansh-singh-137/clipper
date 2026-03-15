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

	payload, _ := json.Marshal(map[string]interface{}{
	"model": "deepseek/deepseek-r1-distill-qwen-1.5b:free",
		"messages": []map[string]string{
			{"role": "user", "content": "Summarize this in 3 bullet points: " + transcript},
		},
	})
	req ,_:= http.NewRequest("POST","https://openrouter.ai/api/v1/chat/completions",bytes.NewReader(payload))
req.Header.Set("Authorization", "Bearer " + os.Getenv("OPENROUTER_KEY"))
req.Header.Set("Content-Type","application/json")
client:= http.Client{}
res ,_:= client.Do(req)

    respBody, err := io.ReadAll(res.Body)
		fmt.Println("summarize response:", string(respBody))
    if err != nil {
        return "", fmt.Errorf("failed to read response: %v", err)
    }
		 var result struct {
        Choices []struct {
            Message struct {
                Content string `json:"content"`
            } `json:"message"`
        } `json:"choices"`
    }
    json.Unmarshal(respBody, &result)
		json.Unmarshal(respBody, &result)

// ✅ add this check
if len(result.Choices) == 0 {
    return "", fmt.Errorf("no response from OpenRouter: %s", string(respBody))
}

return result.Choices[0].Message.Content, nil
    return result.Choices[0].Message.Content, nil
}