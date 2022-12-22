import React, { useState, useEffect } from "react";

import { Grid, Typography, CircularProgress, Button } from "@mui/material";
import backgroundImage from "../../assets/images/background.jpeg";
import { useSnackbar } from "notistack";
import { primaryColor, secondaryColor } from "../../constants/colors";

import { useNavigate, useLocation } from "react-router-dom";
import { signIn } from "../../controllers/auth_controller";
import MyTextField from "../../components/my_text_field";
import { useUserContext } from "../../components/contexts/user_context_provider";
import { homeRoute, signupRoute } from "../../constants/routes";

const SignInScreen = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { setToken } = useUserContext();
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    var localToken = localStorage.getItem("token");
    if (localToken != null) {
      navigate(homeRoute);
      return;
    }
  }, []);

  const handleSubmit = async (e) => {
    var isValidEmail = email.trim().length;
    var isValidPassword = password.trim().length;

    setSubmitting(true);

    if (isValidEmail && isValidPassword) {
      // valid
      var response = await signIn(email, password);
      if (response.status == "NOT_OK") {
        enqueueSnackbar(response.errorMessage, { variant: "error" });
      } else {
        enqueueSnackbar("Successfull Sign-In", { variant: "success" });
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        navigate(homeRoute);
      }

      setSubmitting(false);
      return;
    }

    enqueueSnackbar("Please fill all fields", { variant: "warning" });
    setSubmitting(false);
  };

  function navigateToSignUp() {
    navigate(signupRoute);
  }

  return (
    <Grid
      container
      style={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Grid
        item
        container
        xs={11}
        md={7}
        lg={4}
        style={{ backgroundColor: primaryColor, borderRadius: 12, padding: 35 }}
        boxShadow={20}
      >
        <Grid item xs={12}>
          <Typography variant="h4" style={{ color: "white", fontWeight: "bold" }}>
            Sign In
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ height: "20px" }} />
        <Grid item xs={12}>
          <MyTextField
            label="Email"
            placeholder="Type your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} style={{ height: "20px" }} />
        <Grid item xs={12}>
          <MyTextField
            label="Password"
            placeholder="Type your password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} style={{ height: "20px" }} />

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              backgroundColor: secondaryColor,
              borderRadius: 12,
              border: "3px solid white",
            }}
          >
            {submitting ? <CircularProgress color="inherit" /> : "Submit"}
          </Button>
        </Grid>
        <Grid item xs={12} style={{ height: "20px" }} />
        <Grid item xs={12}>
          <Typography variant="h6" textAlign={"center"} style={{ color: "white", fontWeight: "bold" }}>
            Not yet registered? Join Us
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ height: "20px" }} />
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="outlined"
            fullWidth
            onClick={navigateToSignUp}
            style={{
              color: secondaryColor,
              fontSize: 20,
              fontWeight: "bold",
              backgroundColor: "white",
              borderRadius: 12,
              border: `3px solid ${secondaryColor}`,
            }}
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignInScreen;
