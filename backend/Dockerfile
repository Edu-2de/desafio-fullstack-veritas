# syntax=docker/dockerfile:1

# ---- build ---------------------------------------------------------------
FROM golang:1.26-alpine AS build
WORKDIR /src

# Camada de dependências isolada: só invalida o cache se go.mod mudar.
COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/server .
RUN mkdir -p /out/data

# ---- runtime ---------------------------------------------------------------
# Binário estático, sem libc: cabe numa imagem "distroless" sem shell nem
# gerenciador de pacotes — menor superfície de ataque possível.
FROM gcr.io/distroless/static-debian12:nonroot AS runtime
WORKDIR /app
COPY --from=build /out/server ./server
# Dono correto pro mountpoint do volume (uid/gid 65532 = usuário "nonroot"
# do distroless). Sem isso, um volume nomeado novo nasce dono de root e o
# processo (que roda como nonroot) não consegue escrever em /data.
COPY --from=build --chown=65532:65532 /out/data /data

ENV PORT=8080
ENV DATA_FILE=/data/tasks.json
EXPOSE 8080
VOLUME ["/data"]

USER nonroot:nonroot
ENTRYPOINT ["./server"]
