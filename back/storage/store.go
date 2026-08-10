package storage

import (
	"crypto/rand"
	"fmt"
	"sync"
	"time"

	"desafio-fullstack-veritas/back/models"
)

type TaskStore struct {
	mu    sync.Mutex
	tasks map[string]models.Task
}

func NewTaskStore() *TaskStore {
	return &TaskStore{
		tasks: make(map[string]models.Task),
	}
}

// List
func (s *TaskStore) List() []models.Task {
	s.mu.Lock()
	defer s.mu.Unlock()

	list := make([]models.Task, 0, len(s.tasks))
	for _, t := range s.tasks {
		list = append(list, t)
	}
	return list
}

// Create
func (s *TaskStore) Create(title, description string, status models.Status) models.Task {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now().UTC()
	task := models.Task{
		ID:          generateID(),
		Title:       title,
		Description: description,
		Status:      status,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	s.tasks[task.ID] = task
	return task
}

// Update
func (s *TaskStore) Update(id, title, description string, status models.Status) (models.Task, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	task, ok := s.tasks[id]
	if !ok {
		return models.Task{}, false
	}

	task.Title = title
	task.Description = description
	task.Status = status
	task.UpdatedAt = time.Now().UTC()

	s.tasks[id] = task
	return task, true
}

// Delete
func (s *TaskStore) Delete(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.tasks[id]; !ok {
		return false
	}
	delete(s.tasks, id)
	return true
}

func generateID() string {
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	return fmt.Sprintf("%x", b)
}
