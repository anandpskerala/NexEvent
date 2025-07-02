import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosResponse } from "axios";
import axiosInstance from "../utils/axiosInstance";
import config from "../config/config";
import type { AllEventData } from "../interfaces/entities/FormState";
import type { Booking } from "../interfaces/entities/Booking";
import type { RazorpayOptions, RazorpayResponse } from "../interfaces/entities/RazorPay";
import type { User } from "../interfaces/entities/User";


export const usePaymentHandler = (user: User, sessionId?: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.opener && sessionId) {
      window.opener.postMessage({ sessionId }, window.location.origin);
      window.close();
    }
  }, [sessionId]);

  const handlePayment = async ({
    event,
    tickets,
    total,
    paymentMethod,
    promoCode,
    handleBooking,
  }: {
    event: AllEventData;
    tickets: {
        [ticketId: string]: {
            quantity: number;
            price: number;
            name: string;
        };
    };
    total: number;
    paymentMethod: "razorpay" | "stripe" | "wallet";
    promoCode?: string;
    handleBooking: (
        eventId: string, 
        tickets: {
        [ticketId: string]: {
            quantity: number;
            price: number;
            name: string;
        };
    }, 
    total: number, 
    method: string) => Promise<Booking | null>;
  }) => {
    try {
      if (!event) return;

      const booking = await handleBooking(event.id as string, tickets, total, paymentMethod);

      if (paymentMethod === "razorpay") {
        const res: AxiosResponse<{ order: { id: string; amount: number; currency: string } }> =
          await axiosInstance.post("/payment/razorpay/order", {
            amount: total,
            currency: event.currency || "INR",
          });

        const options: RazorpayOptions = {
          key: config.payment.RPayKey,
          amount: res.data.order.amount,
          currency: res.data.order.currency,
          name: event.title,
          description: "Ticket Booking",
          order_id: res.data.order.id,
          handler: async (response: RazorpayResponse) => {
            await axiosInstance.post("/payment/razorpay/verify", {
              ...response,
              bookingId: booking?.id,
              eventId: event.id,
              amount: res.data.order.amount,
              currency: res.data.order.currency,
            });
            toast.success("Payment successful");
            navigate(`/payment/${booking?.orderId}`);
          },
          prefill: {
            name: user?.firstName || "",
            email: user?.email || "",
          },
          theme: {
            color: "#0193ff",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

      else if (paymentMethod === "stripe") {
        const res: AxiosResponse<{ order: string }> = await axiosInstance.post(
          "/payment/stripe/order",
          {
            eventId: event.id,
            tickets,
            promoCode,
            amount: total * 100,
            bookingId: booking?.id,
            currency: event.currency || "INR",
            orderId: booking?.orderId,
          }
        );

        window.open(res.data.order, "_blank", "width=500,height=700");

        const handleMessage = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          const { sessionId } = event.data;
          if (sessionId) {
            try {
              const res = await axiosInstance.post("/payment/stripe/verify", { sessionId });
              if (res.data) {
                toast.success(res.data.message);
                navigate(`/payment/${res.data.paymentId}`);
              }
            } catch (err) {
                console.error(err);
              toast.error("Stripe verification failed");
            }
          }
        };

        window.addEventListener("message", handleMessage, { once: true });
      }

      else if (paymentMethod === "wallet") {
        const res = await axiosInstance.post("/payment/wallet/pay", {
          eventId: event.id,
          currency: event.currency,
          amount: total,
          bookingId: booking?.id,
        });

        if (res.data.paymentId) {
          toast.success("Payment successful via Wallet!");
          navigate(`/payment/${booking?.orderId}`);
        } else {
          toast.error("Insufficient wallet balance.");
        }
      }

    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Please try again.");
    }
  };

  return { handlePayment };
};
