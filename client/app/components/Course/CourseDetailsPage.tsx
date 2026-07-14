import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";

import Loader from "../Loader/Loader";
import Header from "../Header";
import Footer from "../Route/Footer";
import CourseDetails from "./CourseDetails";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishableKeyQuery,
} from "@/redux/features/orders/orderApi";
import { loadStripe } from "@stripe/stripe-js";

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: stripeConfig } = useGetStripePublishableKeyQuery({});
  const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation();

  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const publishableKey = stripeConfig?.publishableKey;

    if (publishableKey) {
      setStripePromise(loadStripe(publishableKey));
    } else if (stripeConfig) {
      console.error(
        "stripeConfig loaded, but publishableKey is missing from response payload:",
        stripeConfig,
      );
    }

    if (data?.course?.price) {
      const amount = Math.round(data.course.price * 100);
      createPaymentIntent(amount);
    }
  }, [stripeConfig, data, createPaymentIntent]);

  useEffect(() => {
    if (paymentIntentData?.client_secret) {
      setClientSecret(paymentIntentData.client_secret);
    }
  }, [paymentIntentData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          {data?.course && (
            <CourseDetails
              data={data.course}
              stripePromise={stripePromise}
              clientSecret={clientSecret}
              setOpen={setOpen}
              setRoute={setRoute}
            />
          )}
          <Footer />
        </>
      )}
    </>
  );
};

export default CourseDetailsPage;
