import { Document } from 'mongoose';

export interface Contract extends Document {
  transactionId: string;
  commitmentId: string;
  userId: string;
  nodeId: string;
  manufacturerName: string;
  deviceName: string;
  hardwareVersion: string;
  firmwareVersion: string;
  commitmentData: string;
  createdAt: Date;
}
