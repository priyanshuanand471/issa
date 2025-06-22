export type Position = {
  latitude: number;
  longitude: number;
  altitude: number;
};

export type Aircraft = {
  id: string;
  position: Position;
  status: string;
  lastSeen: string;
};

export type Message = {
  from: string;
  to: string;
  content: string;
  timestamp: string;
};