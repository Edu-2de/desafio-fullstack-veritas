package middleware

import (
	"net/http"
	"os"
)

const (
	allowedMethods = "GET, POST, PUT, DELETE, OPTIONS"
	allowedHeaders = "Content-Type"
)

func CORS(next http.Handler) http.Handler {
	origin := allowedOrigin()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", allowedMethods)
		w.Header().Set("Access-Control-Allow-Headers", allowedHeaders)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func allowedOrigin() string {
	if origin := os.Getenv("CORS_ORIGIN"); origin != "" {
		return origin
	}
	return "*"
}
