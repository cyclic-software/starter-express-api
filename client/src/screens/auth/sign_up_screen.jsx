import React, { useState } from "react";

import { Grid, Typography, CircularProgress, Button } from "@mui/material";
import backgroundImage from "../../assets/images/background.jpeg";
import { useSnackbar } from "notistack";
import { primaryColor, secondaryColor } from "../../constants/colors";

import { useNavigate, useLocation } from "react-router-dom";
import { signUp } from "../../controllers/auth_controller";
import MyTextField from "../../components/my_text_field";
import { signinRoute } from "../../constants/routes";

const SignUpScreen = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    var isValidEmail = email.trim().length;
    var isValidPassword = password.trim().length;
    var isSamePasswords = password.trim() === confirmPassword.trim();
    var isValidFirstName = firstName.trim().length;
    var isValidLastName = lastName.trim().length;
    setSubmitting(true);

    if (isValidEmail && isValidPassword && isSamePasswords && isValidFirstName && isValidLastName) {
      // valid
      var response = await signUp(email, password, firstName, lastName);
      if (response.status === "NOT_OK") {
        enqueueSnackbar(response.errorMessage, { variant: "error" });
      } else {
        enqueueSnackbar("Successfull Sign-Up", { variant: "success" });
        navigate(signinRoute);
      }

      setSubmitting(false);
      return;
    }

    enqueueSnackbar("Please fill all fields", { variant: "warning" });
    setSubmitting(false);
  };

  function navigateToSignIn() {
    navigate(signinRoute);
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
        lg={5}
        style={{ backgroundColor: primaryColor, borderRadius: 12, padding: 35 }}
        boxShadow={20}
      >
        <Grid item xs={12}>
          <Typography variant="h4" style={{ color: "white", fontWeight: "bold" }}>
            Sign Up
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ height: "20px" }} />
        <Grid item xs={5.9}>
          <MyTextField
            label="First Name"
            placeholder="Type your first name"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={0.2} />
        <Grid item xs={5.9}>
          <MyTextField
            fullWidth
            label="Last Name"
            placeholder="Type your email"
            onChange={(e) => setLastName(e.target.value)}
          />
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
        <Grid item xs={12} lg={5.9}>
          <MyTextField
            label="Password"
            labelStyle={{ fontSize: 24 }}
            placeholder="Type your password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} lg={0.2} style={{ height: "20px" }} />
        <Grid item xs={12} lg={5.9}>
          <MyTextField
            label="Confirm Password"
            labelStyle={{ fontSize: 24 }}
            placeholder="Confirm your password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Already Have an account?
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ height: "20px" }} />
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="outlined"
            fullWidth
            onClick={navigateToSignIn}
            style={{
              color: secondaryColor,
              fontSize: 20,
              fontWeight: "bold",
              backgroundColor: "white",
              borderRadius: 12,
              border: `3px solid ${secondaryColor}`,
            }}
          >
            Sign In
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignUpScreen;
