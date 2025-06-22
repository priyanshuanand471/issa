package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	router := mux.NewRouter()

	// Service endpoints
	router.HandleFunc("/api/v1/auth", authProxy).Methods("POST")
	router.HandleFunc("/api/v1/aircraft", aircraftProxy).Methods("GET", "POST")
	router.HandleFunc("/api/v1/telemetry", telemetryProxy).Methods("GET", "POST")
	router.HandleFunc("/api/v1/comms", commsProxy).Methods("GET", "POST")

	// Middleware	
	router.Use(loggingMiddleware(logger))
	router.Use(authMiddleware)

	server := &http.Server{
		Addr:         ":8081", // Change to 8081 or any free port
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	logger.Info("Starting API Gateway on :8081")
	log.Fatal(server.ListenAndServe())
}

func loggingMiddleware(logger *zap.Logger) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			next.ServeHTTP(w, r)
			logger.Info("Request",
				zap.String("method", r.Method),
				zap.String("url", r.URL.Path),
				zap.Duration("duration", time.Since(start)),
			)
		})
	}
}


func authProxy(w http.ResponseWriter, r *http.Request) {                   // Stub handler function
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("authProxy"))
}

func aircraftProxy(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("aircraftProxy"))
}

func telemetryProxy(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("telemetryProxy"))
}

func commsProxy(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("commsProxy"))
}


func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// For now, just call the next handler
		next.ServeHTTP(w, r)
	})
}
