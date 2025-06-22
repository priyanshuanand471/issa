import React, { useState } from "react";
import { Position, Aircraft } from "../types";

type Props = {
  aircraft: Aircraft;
  onSubmit: (id: string, pos: Position) => void;
};

const TelemetryForm: React.FC<Props> = ({ aircraft, onSubmit }) => {
  const [form, setForm] = useState<Position>(aircraft.position);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(aircraft.id, form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <label>
        Latitude:
        <input
          type="number"
          name="latitude"
          value={form.latitude}
          onChange={handleChange}
          step="0.0001"
          required
        />
      </label>
      <br />
      <label>
        Longitude:
        <input
          type="number"
          name="longitude"
          value={form.longitude}
          onChange={handleChange}
          step="0.0001"
          required
        />
      </label>
      <br />
      <label>
        Altitude:
        <input
          type="number"
          name="altitude"
          value={form.altitude}
          onChange={handleChange}
          step="0.1"
          required
        />
      </label>
      <br />
      <button type="submit" style={{ marginTop: 8 }}>Update Position</button>
    </form>
  );
};

export default TelemetryForm;