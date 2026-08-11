package storage

import "desafio-fullstack-veritas/back/models"

// NoopPersister não lê nem grava nada; usado onde persistência em disco é
// indesejada (testes, por exemplo).
type NoopPersister struct{}

func (NoopPersister) Load() (map[string]models.Task, error) { return nil, nil }
func (NoopPersister) Save(map[string]models.Task) error     { return nil }
