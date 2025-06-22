import React, { useEffect, useState } from "react";
import { Aircraft, Message, Position } from "./types";
import AircraftList from "./components/AircraftList";
import AircraftDetail from "./components/AircraftDetail";
import TelemetryForm from "./components/TelemetryForm";
import CommsPanel from "./components/CommsPanel";

// Dummy data for demonstration
const dummyAircraft: Aircraft = {
  id: "A1",
  position: { latitude: 0, longitude: 0, altitude: 0 },
  status: "Active",
  lastSeen: "2025-06-22T12:00:00Z",
};
const dummyAircraftList: Aircraft[] = [
  dummyAircraft,
  {
    id: "A2",
    position: { latitude: 1, longitude: 1, altitude: 100 },
    status: "Active",
    lastSeen: "2025-06-22T12:01:00Z",
  },
];
const dummyMessages: Message[] = [
  {
    from: "A1",
    to: "A2",
    content: "Hello",
    timestamp: "2025-06-22T12:02:00Z",
  },
];

function App() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [selected, setSelected] = useState<Aircraft | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch aircraft list
  const fetchAircraft = () => {
    setLoading(true);
    fetch("/api/v1/aircraft")
      .then((res) => res.json())
      .then((data) => {
        setAircraft(data);
        setLoading(false);
      });
  };

  // Fetch comms
  const fetchMessages = () => {
    fetch("/api/v1/comms")
      .then((res) => res.json())
      .then(setMessages);
  };

  useEffect(() => {
    fetchAircraft();
    fetchMessages();
    // Optionally, refresh every 5 seconds:
    // const interval = setInterval(() => { fetchAircraft(); fetchMessages(); }, 5000);
    // return () => clearInterval(interval);
  }, []);

  // Update aircraft position
  const updatePosition = (id: string, pos: Position) => {
    fetch(`/api/v1/aircraft/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pos),
    }).then(() => {
      setSelected(null);
      fetchAircraft();
    });
  };

  // Send a message
  const sendMessage = (from: string, to: string, content: string) => {
    fetch("/api/v1/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, content }),
    }).then(fetchMessages);
  };

  const handleSend = (from: string, to: string, content: string) => {
    alert(`Send from ${from} to ${to}: ${content}`);
  };

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Defence Aircraft Dashboard</h1>
      <button onClick={fetchAircraft} disabled={loading}>
        Refresh
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <AircraftList aircraft={aircraft} onSelect={setSelected} />
      )}

      {selected && (
        <div>
          <AircraftDetail aircraft={selected} onClose={() => setSelected(null)} />
          <TelemetryForm aircraft={selected} onSubmit={updatePosition} />
          <CommsPanel
            aircraft={selected}
            aircraftList={aircraft}
            messages={messages}
            onSend={sendMessage}
          />
        </div>
      )}
    </div>
  );
}

export default App;