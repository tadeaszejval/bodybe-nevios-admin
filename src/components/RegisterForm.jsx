"use client";
import {
  Box,
  IconButton,
  Link,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import * as React from "react";
import { TbEye, TbEyeOff, TbUserPlus } from "react-icons/tb";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import { NeviosInput } from "../components/nevios/NeviosInput";
import { NeviosPrimaryButton } from "../components/nevios/NeviosButtons";

export function RegisterForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  
  const { signUp } = useAuth();
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate password match
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password);
      if (!result.success) {
        setError(result.error || "Failed to sign up");
        return;
      }
      
      // Show success message
      setSuccess(true);
      
      // Redirect after a delay 
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      setError(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 1,
        }}
      >
        <Logo height={20} />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2xl", sm: "3xl" },
            lineHeight: 1.25,
          }}
        >
          Create your account
        </Typography>
        <Typography>
          Already have an account?{" "}
          <Link
            href="/login"
            sx={{
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
      
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "max-content",
          borderRadius: 2,
          borderStyle: "solid",
          borderWidth: 1,
          maxWidth: "420px",
          width: "100%",
          gap: 3,
          p: { xs: 0, sm: 4 },
          borderColor: { xs: "transparent", sm: "gray.200" },
          boxShadow: { xs: 0, sm: 1 },
          bgcolor: { xs: "none", sm: "background.paper" },
        }}
      >
        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ width: "100%" }}>
            Registration successful! Check your email to verify your account. Redirecting to login...
          </Alert>
        )}
        
        <Stack
          spacing={2}
          component="form"
          onSubmit={handleRegister}
          sx={{
            maxWidth: "24rem",
            width: "100%",
            mb: 0,
          }}
        >
          <NeviosInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={success}
          />
          
          <NeviosInput
            label="Password"
            type={passwordVisibility ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            disabled={success}
            endAdornment={
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setPasswordVisibility(!passwordVisibility)}
                edge="end"
                size="small"
              >
                {passwordVisibility ? <TbEye size={18} /> : <TbEyeOff size={18} />}
              </IconButton>
            }
          />
          
          <NeviosInput
            label="Confirm Password"
            type={passwordVisibility ? "text" : "password"}
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="new-password"
            required
            disabled={success}
          />
          
          <NeviosPrimaryButton
            type="submit"
            loading={isLoading}
            disabled={isLoading || success}
            iconBefore={<TbUserPlus size={18} />}
            width="100%"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </NeviosPrimaryButton>
          
          <Typography 
            variant="caption" 
            color="text.secondary" 
            align="center" 
            sx={{ mt: 2 }}
          >
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
} 