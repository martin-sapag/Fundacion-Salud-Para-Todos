
export enum FileStatus {
  InProgress = 'En ejecución',
  Resolved = 'Ya Resuelto',
}

export interface TrackingUpdate {
  id: string;
  date: string;
  note: string;
}

export interface FileRecord {
  id: string;
  name: string;
  creationDate: string;
  status: FileStatus;
  trackingHistory: TrackingUpdate[];
}
