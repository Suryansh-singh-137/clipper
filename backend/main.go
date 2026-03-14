package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	
)
import "github.com/joho/godotenv"
var port string

func main() {
	    godotenv.Load()
	port = os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "server is running")
	})
	http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello World!")
	})
	http.HandleFunc("/clip", clip)
	http.HandleFunc("/download/", func(w http.ResponseWriter, r *http.Request) {
		filePath := "download/" + r.URL.Path[len("/download/"):]
		http.ServeFile(w, r, filePath)
	})

	fmt.Println("Server started on port", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal(err)
	}
}