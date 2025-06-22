package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
)

var (
	redisClient *redis.Client
	aircraftMap sync.Map
)

type Aircraft struct {
	ID       string    `json:"id"`
	Position Position  `json:"position"`
	Status   string    `json:"status"`
	LastSeen time.Time `json:"lastSeen"`
}

type Position struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Altitude  float64 `json:"altitude"`
}

func main() {
	// Initialize Redis
	redisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	router := mux.NewRouter()
	router.HandleFunc("/aircraft", getAircraftHandler).Methods("GET")
	router.HandleFunc("/aircraft/{id}", updateAircraftHandler).Methods("POST")

	go telemetryConsumer()

	server := &http.Server{
		Addr:         ":8082",
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Println("Aircraft Control service started on :8082")
	log.Fatal(server.ListenAndServe())
}

func telemetryConsumer() {
	// Subscribe to Redis channel for telemetry updates
	pubsub := redisClient.Subscribe(context.Background(), "telemetry.updates")
	defer pubsub.Close()

	ch := pubsub.Channel()

	for msg := range ch {
		var aircraft Aircraft
		if err := json.Unmarshal([]byte(msg.Payload), &aircraft); err != nil {
			log.Printf("Error decoding telemetry: %v", err)
			continue
		}

		aircraft.LastSeen = time.Now()
		aircraftMap.Store(aircraft.ID, aircraft)

		log.Printf("Telemetry received for aircraft %s", aircraft.ID)
	}
}

func getAircraftHandler(w http.ResponseWriter, r *http.Request) {
	aircraftList := []Aircraft{}
	haircraftMap.Range(func(key, value any) bool {
		aircraftList = append(aircraftList, value.(Aircraft))
		return true
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(aircraftList)
}

func updateAircraftHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var position Position
	if err := json.NewDecoder(r.Body).Decode(&position); err != nil {
		http.Error(w, "Invalid position format", http.StatusBadRequest)
		return
	}

	aircraft := Aircraft{
		ID:       id,
		Position: position,
		Status:   "updated",
		LastSeen: time.Now(),
	}

	aircraftMap.Store(id, aircraft)
	redisClient.Publish(context.Background(), "telemetry.updates", toJSON(aircraft))
	w.WriteHeader(http.StatusNoContent)
}

func toJSON(v any) string {
	b, _ := json.Marshal(v)
	return string(b)
}