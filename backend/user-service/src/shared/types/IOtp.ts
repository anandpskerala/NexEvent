export interface IOtp {
  id: string;
  userId: string;
  otp: number;
  expiry: Date;
  createdAt: string;
}