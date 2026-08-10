package handlers

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestDecodeBody_Success(t *testing.T) {
	var req taskRequest
	body := strings.NewReader(`{"title": "Estudar Go", "status": "todo"}`)
	r := httptest.NewRequest(http.MethodPost, "/tasks", body)

	err := decodeBody(r, &req)

	if err != nil {
		t.Errorf("esperava sucesso, veio erro: %v", err)
	}
	if req.Title != "Estudar Go" {
		t.Errorf("esperava title 'Estudar Go', veio '%s'", req.Title)
	}
}

func TestDecodeBody_EmptyBody(t *testing.T) {
	var req taskRequest
	body := strings.NewReader("")
	r := httptest.NewRequest(http.MethodPost, "/tasks", body)

	err := decodeBody(r, &req)

	if err == nil {
		t.Fatal("esperava erro para corpo vazio, veio nil")
	}
	if err.Error() != "corpo da requisição vazio" {
		t.Errorf("esperava mensagem 'corpo da requisição vazio', veio '%s'", err.Error())
	}
}

func TestDecodeBody_InvalidJSON(t *testing.T) {
	var req taskRequest
	body := strings.NewReader(`{title: sem aspas}`)
	r := httptest.NewRequest(http.MethodPost, "/tasks", body)

	err := decodeBody(r, &req)

	if err == nil {
		t.Fatal("esperava erro para JSON inválido, veio nil")
	}
	if !strings.Contains(err.Error(), "JSON inválido") {
		t.Errorf("esperava mensagem contendo 'JSON inválido', veio '%s'", err.Error())
	}
}

func TestDecodeBody_ExceedsMaxSize(t *testing.T) {
	var req taskRequest
	hugeValue := strings.Repeat("a", maxBodySize+1)
	body := strings.NewReader(`{"title": "` + hugeValue + `"}`)
	r := httptest.NewRequest(http.MethodPost, "/tasks", body)

	err := decodeBody(r, &req)

	if err == nil {
		t.Fatal("esperava erro por corpo excedendo o tamanho máximo, veio nil")
	}
}
