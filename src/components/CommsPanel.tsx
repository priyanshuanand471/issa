import React, { useState } from "react";
import { Message, Aircraft } from "../types";

type Props = {
  aircraft: Aircraft;
  aircraftList: Aircraft[];
  messages: Message[];
  onSend: (from: string, to: string, content: string) => void;
};

const CommsPanel: React.FC<Props> = ({ aircraft, aircraftList, messages, onSend }) => {
  const [recipient, setRecipient] = useState("");
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (recipient && msg) {
      onSend(aircraft.id, recipient, msg);
      setMsg("");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label>
          <b>Send as:</b> {aircraft.id}
        </label>
        <select value={recipient} onChange={e => setRecipient(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="">Select recipient</option>
          {aircraftList.filter(a => a.id !== aircraft.id).map(a => (
            <option key={a.id} value={a.id}>{a.id}</option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", marginBottom: 12 }}>
        <input
          type="text"
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Type your message"
          style={{ flex: 1, marginRight: 8 }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <h4>Messages</h4>
      <ul style={{ background: "#fff", border: "1px solid #eee", borderRadius: 4, padding: 12, minHeight: 60 }}>
        {messages
          .filter(
            m =>
              (m.from === aircraft.id && m.to === recipient) ||
              (m.from === recipient && m.to === aircraft.id)
          )
          .map((m, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              <b>{m.from}</b> to <b>{m.to}</b>: {m.content} <span style={{ color: "#888", fontSize: 12 }}>({m.timestamp})</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CommsPanel;