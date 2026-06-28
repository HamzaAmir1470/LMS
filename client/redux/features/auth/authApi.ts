import { apiSlice } from "../api/apiSlice";
import { userRegistration } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "/registeration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;

          dispatch(userRegistration({ token: result.data.activationToken }));
        } catch (error) {
          console.error("Error during registration:", error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "/activate-user",
        method: "POST",
        body: {
          activation_token,
          activation_code,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useRegisterMutation, useActivationMutation } = authApi;
