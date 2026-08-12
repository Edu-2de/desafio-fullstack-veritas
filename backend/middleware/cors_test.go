package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCORS_SetsHeadersOnRequest(t *testing.T) {
	handler := CORS(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest(http.MethodGet, "/tasks", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "*" {
		t.Errorf("esperava Access-Control-Allow-Origin \"*\", veio %q", got)
	}
	if rec.Code != http.StatusOK {
		t.Errorf("esperava status 200, veio %d", rec.Code)
	}
}

func TestCORS_RespectsOriginEnvVar(t *testing.T) {
	t.Setenv("CORS_ORIGIN", "http://localhost:5173")

	handler := CORS(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest(http.MethodGet, "/tasks", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5173" {
		t.Errorf("esperava origem configurada via env, veio %q", got)
	}
}

func TestCORS_PreflightShortCircuits(t *testing.T) {
	called := false
	handler := CORS(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		called = true
	}))

	req := httptest.NewRequest(http.MethodOptions, "/tasks", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if called {
		t.Error("esperava que o handler seguinte não fosse chamado num preflight OPTIONS")
	}
	if rec.Code != http.StatusNoContent {
		t.Errorf("esperava status 204, veio %d", rec.Code)
	}
}
