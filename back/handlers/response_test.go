package handlers

import (
	"encoding/json"
	"net/http/httptest"
	"testing"
)

func TestWriteJSON(t *testing.T) {
	rec := httptest.NewRecorder()
	writeJSON(rec, 201, map[string]string{"foo": "bar"})

	if rec.Code != 201 {
		t.Errorf("esperava status 201, veio %d", rec.Code)
	}
	if ct := rec.Header().Get("Content-Type"); ct != "application/json" {
		t.Errorf("esperava Content-Type application/json, veio %s", ct)
	}

	var body map[string]string
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatalf("resposta não é JSON válido: %v", err)
	}
	if body["foo"] != "bar" {
		t.Errorf("esperava foo=bar, veio %v", body)
	}
}

func TestWriteError(t *testing.T) {
	rec := httptest.NewRecorder()
	writeError(rec, 404, "task não encontrada")

	var body errorResponse
	json.Unmarshal(rec.Body.Bytes(), &body)

	if body.Error != "task não encontrada" {
		t.Errorf("esperava 'task não encontrada', veio '%s'", body.Error)
	}
	if len(body.Fields) != 0 {
		t.Errorf("esperava fields vazio, veio %v", body.Fields)
	}
}

func TestWriteValidationError(t *testing.T) {
	rec := httptest.NewRecorder()
	writeValidationError(rec, []string{"title é obrigatório"})

	var body errorResponse
	json.Unmarshal(rec.Body.Bytes(), &body)

	if body.Error != "validação falhou" {
		t.Errorf("esperava 'validação falhou', veio '%s'", body.Error)
	}
	if len(body.Fields) != 1 || body.Fields[0] != "title é obrigatório" {
		t.Errorf("esperava fields com 1 item, veio %v", body.Fields)
	}
}
