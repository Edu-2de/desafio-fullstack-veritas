package storage

import "desafio-fullstack-veritas/backend/models"

type NoopPersister struct{}

func (NoopPersister) Load() (map[string]models.Task, error) { return nil, nil }
func (NoopPersister) Save(map[string]models.Task) error     { return nil }
