package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

type taskRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      Status `json:"status"`
}

// tasksHandler roteia /tasks (GET, POST) e /tasks/{id} (PUT, DELETE).
func tasksHandler(store *TaskStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := strings.TrimPrefix(r.URL.Path, "/tasks/")
		hasID := id != "" && id != "tasks"

		switch r.Method {
		case http.MethodGet:
			handleList(store, w, r)

		case http.MethodPost:
			handleCreate(store, w, r)

		case http.MethodPut:
			if !hasID {
				writeError(w, http.StatusBadRequest, "ID da task não informado na URL")
				return
			}
			handleUpdate(store, w, r, id)

		case http.MethodDelete:
			if !hasID {
				writeError(w, http.StatusBadRequest, "ID da task não informado na URL")
				return
			}
			handleDelete(store, w, r, id)

		default:
			writeError(w, http.StatusMethodNotAllowed, "método não suportado")
		}
	}
}

func handleList(store *TaskStore, w http.ResponseWriter, r *http.Request) {
	tasks := store.List()
	writeJSON(w, http.StatusOK, tasks)
}

func handleCreate(store *TaskStore, w http.ResponseWriter, r *http.Request) {
	var req taskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	if errs := validateTask(req, false); len(errs) > 0 {
		writeError(w, http.StatusBadRequest, strings.Join(errs, "; "))
		return
	}

	status := req.Status
	if status == "" {
		status = StatusTodo
	}

	task := store.Create(req.Title, req.Description, status)
	writeJSON(w, http.StatusCreated, task)
}

func handleUpdate(store *TaskStore, w http.ResponseWriter, r *http.Request, id string) {
	var req taskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	if errs := validateTask(req, true); len(errs) > 0 {
		writeError(w, http.StatusBadRequest, strings.Join(errs, "; "))
		return
	}

	task, ok := store.Update(id, req.Title, req.Description, req.Status)
	if !ok {
		writeError(w, http.StatusNotFound, "task não encontrada")
		return
	}
	writeJSON(w, http.StatusOK, task)
}

func handleDelete(store *TaskStore, w http.ResponseWriter, r *http.Request, id string) {
	if ok := store.Delete(id); !ok {
		writeError(w, http.StatusNotFound, "task não encontrada")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
