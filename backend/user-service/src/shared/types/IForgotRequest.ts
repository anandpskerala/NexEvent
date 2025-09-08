export interface IForgotRequest {
  id: string;
  userId: string;
  requestId: string;
  expiry: Date
}