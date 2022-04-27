import User from "../lib/auth/user";

/**
 * Message interface
 */
export interface IMessage {
  readonly id: string;
  patientId: string;
  teamId: string;
  author: string;
  destAck: boolean;
  text: string;
  timezone: string;
  timestamp?: string;
  user: User;
}
