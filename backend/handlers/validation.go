package handlers

import (
	"strings"

	"desafio-fullstack-veritas/back/models"
)

type taskRequest struct {
	Title       string        `json:"title"`
	Description string        `json:"description"`
	Status      models.Status `json:"status"`
}

func validateTask(req taskRequest, requireStatus bool) []string {
	var errs []string

	if strings.TrimSpace(req.Title) == "" {
		errs = append(errs, "title é obrigatório")
	}

	if req.Status == "" {
		if requireStatus {
			errs = append(errs, "status é obrigatório")
		}
	} else if !models.ValidStatuses[req.Status] {
		errs = append(errs, "status inválido (use: todo, in_progress ou done)")
	}

	return errs
}
