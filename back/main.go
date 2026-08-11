package main

import (
	"log"
	"net/http"
	"os"

	"desafio-fullstack-veritas/back/handlers"
	"desafio-fullstack-veritas/back/storage"
)

func main() {
	store := storage.NewTaskStore()

	mux := http.NewServeMux()
	mux.Handle("/tasks", handlers.TasksHandler(store))
	mux.Handle("/tasks/", handlers.TasksHandler(store))

	handler := withCORS(mux)

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

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
