package main

import (
	"log"
	"net/http"
	"os"

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
	log.Printf("servidor rodando em http://localhost:%s\n", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
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
