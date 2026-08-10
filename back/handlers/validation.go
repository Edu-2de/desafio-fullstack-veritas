package handlers

import "strings"

func validateTask(req taskRequest, requireStatus bool) []string {
	var errs []string

	if strings.TrimSpace(req.Title) == "" {
		errs = append(errs, "title é obrigatório")
	}

	if req.Status == "" {
		if requireStatus {
			errs = append(errs, "status é obrigatório")
		}
	} else if !validStatuses[req.Status] {
		errs = append(errs, "status inválido (use: todo, in_progress ou done)")
	}

	return errs
}
