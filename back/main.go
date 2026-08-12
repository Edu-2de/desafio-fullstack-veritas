package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"desafio-fullstack-veritas/back/handlers"
	"desafio-fullstack-veritas/back/middleware"
	"desafio-fullstack-veritas/back/storage"
)

func main() {
	persister := storage.NewJSONFilePersister(dataFilePath())
	store := storage.NewTaskStore(persister)

	mux := http.NewServeMux()
	mux.Handle("/tasks", handlers.TasksHandler(store))
	mux.Handle("/tasks/", handlers.TasksHandler(store))

	handler := middleware.CORS(mux)

	port := getPort()
	server := &http.Server{
		Addr:    ":" + port,
		Handler: handler,
		// Sem timeouts, uma conexão lenta/travada (por acidente ou de
		// propósito, tipo slowloris) prende uma goroutine pra sempre.
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("servidor rodando em http://localhost:%s\n", port)
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		return "8080"
	}
	return port
}

func dataFilePath() string {
	if path := os.Getenv("DATA_FILE"); path != "" {
		return path
	}
	return "data/tasks.json"
}
