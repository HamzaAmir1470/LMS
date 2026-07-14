import React, { useEffect, useRef } from "react";
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
import { useRouter } from "next/navigation";
import socketIO from "socket.io-client";

const ENDPOINT =
  process.env.NEXT_PUBLIC_SOCKET_ENDPOINT || "http://localhost:8000";
const isSocketEnabled = process.env.NEXT_PUBLIC_ENABLE_SOCKET === "true";
const socketId = isSocketEnabled
  ? socketIO(ENDPOINT, { transports: ["websocket"] })
  : null;

type Props = {
  setOpen: any;
  data: any;
  user: any;
  setIsLoading: (loading: boolean) => void;
};

const CheckoutForm = ({ setOpen, data, user, setIsLoading }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = React.useState<string | null>(null);
  const [
    createOrder,
    { data: orderData, error: stripeError, isLoading: orderLoading },
  ] = useCreateOrderMutation();
  const [loadUser, setLoadUser] = React.useState(false);

  const { refetch } = useLoadUserQuery(undefined, {
    skip: !loadUser,
    refetchOnMountOrArgChange: true,
  });

  const [localLoading, setLocalLoading] = React.useState(false);
  const hasNavigated = useRef(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setLocalLoading(true);

    // FIX: Provide confirmParams with a return_url
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/course-access/${data._id}`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setMessage(stripeError.message || "An unexpected error occurred.");
      setLocalLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setLocalLoading(false);
      setIsLoading(true); // Triggers full-screen Loader overlay

      createOrder({
        courseId: data._id,
        payment_info: paymentIntent,
      });
    }
  };

  useEffect(() => {
    if (orderData && !hasNavigated.current) {
      hasNavigated.current = true;

      // Setting this to true will automatically trigger useLoadUserQuery
      // because 'skip' becomes false. RTQ Query handles the fetch instantly.
      setLoadUser(true);

      socketId?.emit("notification", {
        title: "New Order",
        message: `You have a new order for the course: ${data.name}`,
        userId: user._id,
      });

      // Navigate immediately while the global loader covers the screen
      router.push(`/course-access/${data._id}`);

      // Close the modal after routing begins
      const timer = setTimeout(() => {
        setOpen(false);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (stripeError) {
      setIsLoading(false);
      hasNavigated.current = false;
      if ("data" in stripeError) {
        const errorMessage = stripeError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [
    orderData,
    stripeError,
    data._id,
    data.name,
    user._id,
    router,
    setIsLoading,
    setOpen,
    // Removed refetch from dependency array as we no longer call it here
  ]);

  // Clean up component-specific loading on unmount safely
  useEffect(() => {
    return () => {
      hasNavigated.current = false;
    };
  }, []);

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-3 sm:gap-4 px-2 sm:px-0"
    >
      <div className="w-full max-h-[250px] sm:max-h-[300px] md:max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <LinkAuthenticationElement
          id="link-authentication-element"
          className="mb-2 sm:mb-3 [&_.LinkAuthenticationElement]:text-sm sm:[&_.LinkAuthenticationElement]:text-base"
        />
        <PaymentElement
          id="payment-element"
          className="[&_.PaymentElement]:text-sm sm:[&_.PaymentElement]:text-base"
        />
      </div>

      <button
        disabled={localLoading || orderLoading || !stripe || !elements}
        id="submit"
        className="w-full"
      >
        <span
          id="button-text"
          className={`${styles.button} w-full mt-3 sm:mt-4 flex items-center justify-center !h-[40px] sm:!h-[44px] rounded-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm sm:text-base font-medium`}
        >
          {localLoading || orderLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            `Pay Now`
          )}
        </span>
      </button>

      {message && (
        <div
          id="payment-message"
          className="text-red-500 font-Poppins text-xs sm:text-sm text-center mt-2 font-medium px-2"
        >
          {message}
        </div>
      )}

      <div className="block sm:hidden text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
        Secure payment powered by Stripe
      </div>
    </form>
  );
};

export default CheckoutForm;
