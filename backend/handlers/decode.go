package handlers

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

const maxBodySize = 1 << 20

func decodeBody(r *http.Request, dst any) error {
	r.Body = http.MaxBytesReader(nil, r.Body, maxBodySize)

	if err := json.NewDecoder(r.Body).Decode(dst); err != nil {
		if errors.Is(err, io.EOF) {
			return errors.New("corpo da requisição vazio")
		}
		return errors.New("JSON inválido: " + err.Error())
	}
	return nil
}
