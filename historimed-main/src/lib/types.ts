
import type { Timestamp } from 'firebase/firestore';

export type HealthHistoryItem = {
  id: string;
  date: Timestamp;
  title: string;
  summary: string;
  details: string;
  category: string;
};

export type StoredFile = {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: Date;
};
