import React from "react";
import { Aircraft } from "../types";

type Props = {
  aircraft: Aircraft;
  onClose: () => void;
};

const AircraftDetail: React.FC<Props> = ({ aircraft, onClose }) => (
  <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8, marginTop: 24 }}>
    <h2>Aircraft {aircraft.id} Details</h2>
    <p>
      <b>Status:</b> {aircraft.status}<br />
      <b>Position:</b> {aircraft.position.latitude}, {aircraft.position.longitude}, Alt: {aircraft.position.altitude}<br />
      <b>Last Seen:</b> {aircraft.lastSeen}
    </p>
    <button onClick={onClose}>Close</button>
  </div>
);

export default AircraftDetail;