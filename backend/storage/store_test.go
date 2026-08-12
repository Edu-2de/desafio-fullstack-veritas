package storage

import (
	"testing"
	"time"

	"desafio-fullstack-veritas/backend/models"
)

func TestTaskStore_CreateAndList(t *testing.T) {
	store := NewTaskStore(NoopPersister{})
	task := store.Create("Estudar Go", "Ler documentação", models.StatusTodo)

	if task.ID == "" {
		t.Error("esperava um ID gerado, veio vazio")
	}
	if len(store.List()) != 1 {
		t.Errorf("esperava 1 task, veio %d", len(store.List()))
	}
}

func TestTaskStore_UpdateNotFound(t *testing.T) {
	store := NewTaskStore(NoopPersister{})
	_, ok := store.Update("id-inexistente", "Título", "", models.StatusDone)
	if ok {
		t.Error("esperava false ao atualizar ID inexistente")
	}
}

// List() itera um map, cuja ordem o Go aleatoriza a cada execução — sem
// o sort em List(), este teste pegaria isso de vez em quando.
func TestTaskStore_List_OrderedByCreatedAt(t *testing.T) {
	store := NewTaskStore(NoopPersister{})

	first := store.Create("Primeira", "", models.StatusTodo)
	time.Sleep(time.Millisecond)
	second := store.Create("Segunda", "", models.StatusTodo)
	time.Sleep(time.Millisecond)
	third := store.Create("Terceira", "", models.StatusTodo)

	list := store.List()
	if len(list) != 3 {
		t.Fatalf("esperava 3 tasks, veio %d", len(list))
	}
	if list[0].ID != first.ID || list[1].ID != second.ID || list[2].ID != third.ID {
		t.Errorf("esperava ordem de criação (primeira, segunda, terceira), veio (%s, %s, %s)",
			list[0].Title, list[1].Title, list[2].Title)
	}
}

func TestTaskStore_Delete(t *testing.T) {
	store := NewTaskStore(NoopPersister{})
	task := store.Create("Tarefa temporária", "", models.StatusTodo)

	if !store.Delete(task.ID) {
		t.Error("esperava sucesso ao deletar task existente")
	}
	if store.Delete(task.ID) {
		t.Error("esperava false ao deletar ID já removido")
	}
}
