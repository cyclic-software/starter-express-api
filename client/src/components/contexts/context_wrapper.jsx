import React from "react";
import UserContextProvider from "../contexts/user_context_provider";
import AppointmentContextProvider from "./appointment_context";

const ContextWrapper = ({ children }) => (
  <UserContextProvider>
    <AppointmentContextProvider>{children}</AppointmentContextProvider>
  </UserContextProvider>
);

export default ContextWrapper;
