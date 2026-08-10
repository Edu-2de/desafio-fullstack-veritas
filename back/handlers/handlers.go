package handlers

import (
	"net/http"
	"strings"

	"desafio-fullstack-veritas/back/models"
	"desafio-fullstack-veritas/back/storage"
)

// /tasks (GET, POST) e /tasks/{id} (PUT, DELETE).
func TasksHandler(store *storage.TaskStore) http.HandlerFunc {
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

func handleList(store *storage.TaskStore, w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, store.List())
}

func handleCreate(store *storage.TaskStore, w http.ResponseWriter, r *http.Request) {
	var req taskRequest
	if err := decodeBody(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if errs := validateTask(req, false); len(errs) > 0 {
		writeValidationError(w, errs)
		return
	}

	status := req.Status
	if status == "" {
		status = models.StatusTodo
	}

	task := store.Create(req.Title, req.Description, status)
	writeJSON(w, http.StatusCreated, task)
}

func handleUpdate(store *storage.TaskStore, w http.ResponseWriter, r *http.Request, id string) {
	var req taskRequest
	if err := decodeBody(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if errs := validateTask(req, true); len(errs) > 0 {
		writeValidationError(w, errs)
		return
	}

	task, ok := store.Update(id, req.Title, req.Description, req.Status)
	if !ok {
		writeError(w, http.StatusNotFound, "task não encontrada")
		return
	}
	writeJSON(w, http.StatusOK, task)
}

func handleDelete(store *storage.TaskStore, w http.ResponseWriter, r *http.Request, id string) {
	if !store.Delete(id) {
		writeError(w, http.StatusNotFound, "task não encontrada")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
