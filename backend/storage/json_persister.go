package storage

import (
	"encoding/json"
	"os"
	"path/filepath"

	"desafio-fullstack-veritas/backend/models"
)

type JSONFilePersister struct {
	path string
}

func NewJSONFilePersister(path string) *JSONFilePersister {
	return &JSONFilePersister{path: path}
}

func (p *JSONFilePersister) Load() (map[string]models.Task, error) {
	data, err := os.ReadFile(p.path)
	if err != nil {
		if os.IsNotExist(err) {
			return make(map[string]models.Task), nil
		}
		return nil, err
	}

	var list []models.Task
	if err := json.Unmarshal(data, &list); err != nil {
		return nil, err
	}

	tasks := make(map[string]models.Task, len(list))
	for _, t := range list {
		tasks[t.ID] = t
	}
	return tasks, nil
}

func (p *JSONFilePersister) Save(tasks map[string]models.Task) error {
	list := make([]models.Task, 0, len(tasks))
	for _, t := range tasks {
		list = append(list, t)
	}

	data, err := json.MarshalIndent(list, "", "  ")
	if err != nil {
		return err
	}

	if dir := filepath.Dir(p.path); dir != "." {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return err
		}
	}

	tmpPath := p.path + ".tmp"
	if err := os.WriteFile(tmpPath, data, 0o644); err != nil {
		return err
	}
	return os.Rename(tmpPath, p.path)
}
