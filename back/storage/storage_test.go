package main

import "testing"

func TestTaskStore_CreateAndList(t *testing.T) {
	store := NewTaskStore()

	task := store.Create("Estudar Go", "Ler documentação", StatusTodo)

	if task.ID == "" {
		t.Error("esperava um ID gerado, veio vazio")
	}

	tasks := store.List()
	if len(tasks) != 1 {
		t.Errorf("esperava 1 task na lista, veio %d", len(tasks))
	}
}

func TestTaskStore_UpdateNotFound(t *testing.T) {
	store := NewTaskStore()

	_, ok := store.Update("id-inexistente", "Título", "", StatusDone)
	if ok {
		t.Error("esperava false ao atualizar ID inexistente, veio true")
	}
}

func TestTaskStore_Delete(t *testing.T) {
	store := NewTaskStore()
	task := store.Create("Tarefa temporária", "", StatusTodo)

	ok := store.Delete(task.ID)
	if !ok {
		t.Error("esperava sucesso ao deletar task existente")
	}

	ok = store.Delete(task.ID)
	if ok {
		t.Error("esperava false ao deletar ID já removido")
	}
}
