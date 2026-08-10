package handlers

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"desafio-fullstack-veritas/back/storage"
)

func TestHandleCreate_Success(t *testing.T) {
	store := storage.NewTaskStore()
	handler := TasksHandler(store)

	body := strings.NewReader(`{"title": "Estudar Go", "status": "todo"}`)
	req := httptest.NewRequest(http.MethodPost, "/tasks", body)
	rec := httptest.NewRecorder()

	handler(rec, req)

	if rec.Code != http.StatusCreated {
		t.Errorf("esperava status 201, veio %d", rec.Code)
	}
}

func TestHandleCreate_MissingTitle(t *testing.T) {
	store := storage.NewTaskStore()
	handler := TasksHandler(store)

	body := strings.NewReader(`{"description": "sem título"}`)
	req := httptest.NewRequest(http.MethodPost, "/tasks", body)
	rec := httptest.NewRecorder()

	handler(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Errorf("esperava status 400, veio %d", rec.Code)
	}
}

func TestHandleList_Empty(t *testing.T) {
	store := storage.NewTaskStore()
	handler := TasksHandler(store)

	req := httptest.NewRequest(http.MethodGet, "/tasks", nil)
	rec := httptest.NewRecorder()

	handler(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("esperava status 200, veio %d", rec.Code)
	}
}

func TestHandleUpdate_NotFound(t *testing.T) {
	store := storage.NewTaskStore()
	handler := TasksHandler(store)

	body := strings.NewReader(`{"title": "Não existe", "status": "todo"}`)
	req := httptest.NewRequest(http.MethodPut, "/tasks/id-inexistente", body)
	rec := httptest.NewRecorder()

	handler(rec, req)

	if rec.Code != http.StatusNotFound {
		t.Errorf("esperava status 404, veio %d", rec.Code)
	}
}

func TestHandleDelete_Success(t *testing.T) {
	store := storage.NewTaskStore()
	handler := TasksHandler(store)
	task := store.Create("Tarefa a remover", "", "todo")

	req := httptest.NewRequest(http.MethodDelete, "/tasks/"+task.ID, nil)
	rec := httptest.NewRecorder()

	handler(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Errorf("esperava status 204, veio %d", rec.Code)
	}
}

func TestHandleDelete_NotFound(t *testing.T) {
	store := storage.NewTaskStore()
	handler := TasksHandler(store)

	req := httptest.NewRequest(http.MethodDelete, "/tasks/id-inexistente", nil)
	rec := httptest.NewRecorder()

	handler(rec, req)

	if rec.Code != http.StatusNotFound {
		t.Errorf("esperava status 404, veio %d", rec.Code)
	}
}
