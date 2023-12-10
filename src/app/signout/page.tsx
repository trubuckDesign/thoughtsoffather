"use client";
// pages/signout.tsx
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Container, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

const SignOutPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Log the user out
    signOut({
      callbackUrl: "/", // Redirect to the index page after logout
    });
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Logging you out, please wait...
      </Typography>
      <CircularProgress />
    </Container>
  );
};

export default SignOutPage;
