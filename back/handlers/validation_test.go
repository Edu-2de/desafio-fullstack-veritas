package handlers

import "testing"

func TestValidateTask_MissingTitle(t *testing.T) {
	req := taskRequest{Title: "", Status: "todo"}
	errs := validateTask(req, false)

	if len(errs) != 1 {
		t.Fatalf("esperava 1 erro, veio %d: %v", len(errs), errs)
	}
}

func TestValidateTask_InvalidStatus(t *testing.T) {
	req := taskRequest{Title: "Válido", Status: "banana"}
	errs := validateTask(req, false)

	if len(errs) != 1 {
		t.Fatalf("esperava 1 erro, veio %d: %v", len(errs), errs)
	}
}

func TestValidateTask_StatusRequired(t *testing.T) {
	req := taskRequest{Title: "Válido", Status: ""}
	errs := validateTask(req, true)

	if len(errs) != 1 {
		t.Fatalf("esperava 1 erro, veio %d: %v", len(errs), errs)
	}
}

func TestValidateTask_StatusOptional(t *testing.T) {
	req := taskRequest{Title: "Válido", Status: ""}
	errs := validateTask(req, false)

	if len(errs) != 0 {
		t.Errorf("esperava 0 erros, veio %d: %v", len(errs), errs)
	}
}

func TestValidateTask_Valid(t *testing.T) {
	req := taskRequest{Title: "Tarefa válida", Status: "in_progress"}
	errs := validateTask(req, true)

	if len(errs) != 0 {
		t.Errorf("esperava 0 erros, veio %d: %v", len(errs), errs)
	}
}
