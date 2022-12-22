import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

import { useUserContext } from "./components/contexts/user_context_provider";
import SignInScreen from "./screens/auth/sign_in_screen";
import SignUpScreen from "./screens/auth/sign_up_screen";
import SnackBar from "./components/snack_bar";
import DashboardScreen from "./screens/dashboard/dashboard_screen";

function App() {
  const { setToken } = useUserContext();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    var token = localStorage.getItem("token");
    if (token == null && !location.pathname.startsWith("/sign")) {
      navigate("/sign-in");
      return;
    }
    setToken(token);
  }, []);

  return (
    <SnackBar>
      <Routes>
        <Route path="/sign-in" element={<SignInScreen />} />
        <Route path="/sign-up" element={<SignUpScreen />} />
        <Route path="/*" element={<DashboardScreen />} />
      </Routes>
    </SnackBar>
  );
}

export default App;
