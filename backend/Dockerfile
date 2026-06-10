FROM golang:1.24

WORKDIR /app

RUN apt-get update && \
    apt-get install -y ffmpeg curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Download yt-dlp binary directly from GitHub (always latest)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp && chmod a+rx /usr/local/bin/yt-dlp

COPY . .

RUN go build -o clipper .

EXPOSE 8080

CMD ["./clipper"]