package main

import (
	"context"
	"time"

	"github.com/cenkalti/backoff/v4"
	"go.uber.org/zap"
)

// Aircraft represents the aircraft data structure
type Aircraft struct {
	ID       string    `json:"id"`
	Position Position  `json:"position"`
	Status   string    `json:"status"`
	LastSeen time.Time `json:"lastSeen"`
}

// Position represents the geographical position of the aircraft
type Position struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Altitude  float64 `json:"altitude"`
}

// PublishPosition publishes the aircraft position to DDS
func (dds *DDSController) PublishPosition(aircraft Aircraft) error {
	// Implementation for publishing to DDS
	// This is a placeholder for the actual DDS publish logic
	return nil // Replace with actual publish logic
}

// queueFallback handles fallback to Redis queue
func queueFallback(aircraft Aircraft) {
	// Serialize aircraft data
	data, err := json.Marshal(aircraft)
	if err != nil {
		logger.Error("Failed to serialize aircraft data for Redis fallback", zap.Error(err))
		return
	}

	// Publish to Redis queue
	err = redisClient.Publish(context.Background(), "fallback.queue", data).Err()
	if err != nil {
		logger.Error("Failed to publish to Redis fallback queue", zap.Error(err))
	}
}

// resilientDDSPublisher attempts to publish aircraft position to DDS with retries
func resilientDDSPublisher(aircraft Aircraft) {
	retryPolicy := backoff.NewExponentialBackOff()
	retryPolicy.MaxElapsedTime = 5 * time.Minute

	operation := func() error {
		return ddsMiddleware.PublishPosition(aircraft)
	}

	notify := func(err error, dur time.Duration) {
		logger.Warn("Failed to publish to DDS, retrying",
			zap.String("aircraft_id", aircraft.ID),
			zap.Error(err),
			zap.Duration("after", dur),
		)
	}

	err := backoff.RetryNotify(operation, retryPolicy, notify)
	if err != nil {
		// Fallback to Redis queue
		queueFallback(aircraft)
	}
}
