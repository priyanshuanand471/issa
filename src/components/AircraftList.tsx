import React from "react";
import { Aircraft } from "../types";

type Props = {
  aircraft: Aircraft[];
  onSelect: (a: Aircraft) => void;
};

const AircraftList: React.FC<Props> = ({ aircraft, onSelect }) => (
  <table border={1} cellPadding={8} style={{ minWidth: 600 }}>
    <thead>
      <tr>
        <th>ID</th>
        <th>Latitude</th>
        <th>Longitude</th>
        <th>Altitude</th>
        <th>Status</th>
        <th>Last Seen</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {aircraft.map(a => (
        <tr key={a.id}>
          <td>{a.id}</td>
          <td>{a.position.latitude}</td>
          <td>{a.position.longitude}</td>
          <td>{a.position.altitude}</td>
          <td>{a.status}</td>
          <td>{a.lastSeen}</td>
          <td>
            <button onClick={() => onSelect(a)}>Details</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default AircraftList;