import React, { useState, useContext } from "react";

const appointmentContext = React.createContext();

export const useAppointmentContext = () => {
  return useContext(appointmentContext);
};

const AppointmentContextProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  return (
    <appointmentContext.Provider value={{ appointments, setAppointments }}>
      {children}
    </appointmentContext.Provider>
  );
};

export default AppointmentContextProvider;
