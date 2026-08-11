package storage

import (
	"path/filepath"
	"testing"

	"desafio-fullstack-veritas/back/models"
)

func TestJSONFilePersister_LoadMissingFile(t *testing.T) {
	path := filepath.Join(t.TempDir(), "tasks.json")
	persister := NewJSONFilePersister(path)

	tasks, err := persister.Load()
	if err != nil {
		t.Fatalf("esperava sem erro ao carregar arquivo inexistente, veio %v", err)
	}
	if len(tasks) != 0 {
		t.Errorf("esperava mapa vazio, veio %d tasks", len(tasks))
	}
}

func TestJSONFilePersister_SaveAndLoadRoundTrip(t *testing.T) {
	path := filepath.Join(t.TempDir(), "nested", "tasks.json")
	persister := NewJSONFilePersister(path)

	want := map[string]models.Task{
		"1": {ID: "1", Title: "Estudar Go", Status: models.StatusTodo},
	}

	if err := persister.Save(want); err != nil {
		t.Fatalf("esperava sem erro ao salvar, veio %v", err)
	}

	got, err := persister.Load()
	if err != nil {
		t.Fatalf("esperava sem erro ao carregar, veio %v", err)
	}
	if len(got) != 1 || got["1"].Title != "Estudar Go" {
		t.Errorf("esperava task persistida de volta, veio %+v", got)
	}
}
