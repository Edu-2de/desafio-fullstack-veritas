package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

type errorResponse struct {
	Error  string   `json:"error"`
	Fields []string `json:"fields,omitempty"`
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("handlers: falha ao codificar resposta JSON: %v", err)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, errorResponse{Error: message})
}

func writeValidationError(w http.ResponseWriter, fields []string) {
	writeJSON(w, http.StatusBadRequest, errorResponse{
		Error:  "validação falhou",
		Fields: fields,
	})
}
