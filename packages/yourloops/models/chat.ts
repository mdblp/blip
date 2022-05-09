import User from "../lib/auth/user";

/**
 * Message interface
 */
export interface IMessage {
  readonly id: string;
  patientId: string;
  teamId: string;
  authorId: string;
  destAck: boolean;
  private: boolean;
  text: string;
  timezone: string;
  timestamp?: string;
  user: User;
}
