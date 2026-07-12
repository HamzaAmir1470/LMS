import React, { useEffect } from "react";
import {
  useStripe,
  useElements,
  LinkAuthenticationElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/orderApi";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {
  setOpen: any;
  data: any;
};

const CheckoutForm = ({ setOpen, data }: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState<string | null>(null);
  const [createOrder, { data: orderData, error: stripeError }] =
    useCreateOrderMutation();
  const [loadUser, setLoadUser] = React.useState(false);
  const {} = useLoadUserQuery({ skip: loadUser ? false : true });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (stripeError) {
      setMessage(stripeError.message || "An unexpected error occurred.");
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);
      createOrder({
        courseId: data._id,
        payment_info: paymentIntent,
      });
    }
  };

  useEffect(() => {
    if (orderData) {
      setLoadUser(true);
      redirect(`/course-access/${data._id}`);
    }
    if (stripeError) {
      if ("data" in stripeError) {
        const errorMessage = stripeError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [orderData, stripeError]);
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
          {isLoading ? "Processing..." : "Pay Now"}
        </span>
      </button>
      {message && (
        <div id="payment-message" className="text-red-500 font-Poppins mt-2">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
