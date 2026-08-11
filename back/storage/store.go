package storage

import (
	"crypto/rand"
	"fmt"
	"log"
	"sync"
	"time"

	"desafio-fullstack-veritas/back/models"
)

// Persister abstrai onde as tasks são guardadas entre execuções do
// servidor. O TaskStore depende só desta interface, não de um arquivo
// JSON específico — permite trocar a implementação (memória em testes,
// arquivo em produção, banco de dados no futuro) sem tocar na lógica de
// negócio.
type Persister interface {
	Load() (map[string]models.Task, error)
	Save(tasks map[string]models.Task) error
}

type TaskStore struct {
	mu        sync.Mutex
	tasks     map[string]models.Task
	persister Persister
}

// NewTaskStore cria um TaskStore carregando o estado inicial do
// persister informado. Toda escrita (Create, Update, Delete) é
// persistida em seguida via o mesmo persister.
func NewTaskStore(persister Persister) *TaskStore {
	tasks, err := persister.Load()
	if err != nil {
		log.Printf("storage: falha ao carregar dados persistidos, iniciando vazio: %v", err)
	}
	if tasks == nil {
		tasks = make(map[string]models.Task)
	}

	return &TaskStore{
		tasks:     tasks,
		persister: persister,
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
	s.save()
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
	s.save()
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
	s.save()
	return true
}

// save grava o estado atual através do persister. Chamada apenas com s.mu
// já travado. Falhas de persistência são logadas, não interrompem a
// operação em memória: a API continua respondendo mesmo que o disco
// esteja indisponível.
func (s *TaskStore) save() {
	if err := s.persister.Save(s.tasks); err != nil {
		log.Printf("storage: falha ao salvar tasks: %v", err)
	}
}

func generateID() string {
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	return fmt.Sprintf("%x", b)
}
