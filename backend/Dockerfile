FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o clipper .

FROM python:3.11-slim
RUN apt-get update && apt-get install -y ffmpeg nodejs && rm -rf /var/lib/apt/lists/*
RUN pip install --upgrade yt-dlp
WORKDIR /app
COPY --from=builder /app/clipper .
EXPOSE 8080
CMD ["./clipper"]