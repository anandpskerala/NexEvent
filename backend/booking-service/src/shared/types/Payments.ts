export enum PaymentMethod {
  STRIPE = "stripe",
  RAZORPAY = "razorpay",
  WALLET = "wallet",
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  REFUNDED = "refunded",
}