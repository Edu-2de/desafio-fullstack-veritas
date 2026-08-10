package storage

import (
	"testing"

	"desafio-fullstack-veritas/back/models"
)

func TestTaskStore_CreateAndList(t *testing.T) {
	store := NewTaskStore()
	task := store.Create("Estudar Go", "Ler documentação", models.StatusTodo)

	if task.ID == "" {
		t.Error("esperava um ID gerado, veio vazio")
	}
	if len(store.List()) != 1 {
		t.Errorf("esperava 1 task, veio %d", len(store.List()))
	}
}

func TestTaskStore_UpdateNotFound(t *testing.T) {
	store := NewTaskStore()
	_, ok := store.Update("id-inexistente", "Título", "", models.StatusDone)
	if ok {
		t.Error("esperava false ao atualizar ID inexistente")
	}
}

func TestTaskStore_Delete(t *testing.T) {
	store := NewTaskStore()
	task := store.Create("Tarefa temporária", "", models.StatusTodo)

	if !store.Delete(task.ID) {
		t.Error("esperava sucesso ao deletar task existente")
	}
	if store.Delete(task.ID) {
		t.Error("esperava false ao deletar ID já removido")
	}
}
