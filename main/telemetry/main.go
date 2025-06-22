package main

import (

	"encoding/json"
	"log"
	"net/http"
	"time"
	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
)

var redisClient *redis.Client

func main() {
	// Initialize Redis
	redisClient = redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: "",
		DB:       0,
	})

	router := mux.NewRouter()
	router.HandleFunc("/telemetry", telemetryHandler).Methods("POST")
	
	server := &http.Server{
		Addr:         ":8083",
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	
	log.Println("Telemetry service started on :8083")
	log.Fatal(server.ListenAndServe())
}

func telemetryHandler(w http.ResponseWriter, r *http.Request) {
	var telemetry struct {
		AircraftID string  `json:"aircraftId"`
		Latitude   float64 `json:"latitude"`
		Longitude  float64 `json:"longitude"`
		Altitude   float64 `json:"altitude"`
		Speed      float64 `json:"speed"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&telemetry); err != nil {
		http.Error(w, "Invalid telemetry data", http.StatusBadRequest)
		return
	}

	
	err := redisClient.SetEX(r.Context(), 
		"telemetry:"+telemetry.AircraftID, 
		telemetry, 
		30*time.Second,
	).Err()
	
	if err != nil {
		http.Error(w, "Failed to store telemetry", http.StatusInternalServerError)
		return
	}
	
	// Publish update to channel
	payload, _ := json.Marshal(telemetry)
	redisClient.Publish(r.Context(), "telemetry.updates", payload)
	
	w.WriteHeader(http.StatusAccepted)
}
