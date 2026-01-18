"use client";
import {
	Box,
	Checkbox,
	FormControlLabel,
	Link,
	Stack,
	Typography,
	Alert,
	IconButton,
} from "@mui/material";
import * as React from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { TbEye, TbEyeOff, TbLock } from "react-icons/tb";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import { NeviosInput } from "../components/nevios/NeviosInput";
import { NeviosPrimaryButton, NeviosSecondaryButton } from "../components/nevios/NeviosButtons";

// auth form with 3rd party integrations included
export function AuthThirdParty() {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [passwordVisibility, setPasswordVisibility] = React.useState(false);
	const [error, setError] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);
	const { signIn, signInWithGoogle, signInWithGithub } = useAuth();
	const router = useRouter();

	const handleLogin = async (event) => {
		event.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const result = await signIn(email, password);
			if (!result.success) {
				setError(result.error || "Failed to sign in");
				setIsLoading(false);
				return;
			}
			// Redirect to dashboard on successful login
			// Keep loading state active until redirect completes
			router.push("/dashboard/home");
		} catch (error) {
			setError(error.message || "An error occurred during sign in");
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setError("");
		try {
			await signInWithGoogle();
			// OAuth redirects happen automatically
		} catch (error) {
			setError(error.message || "Failed to sign in with Google");
		}
	};

	const handleGithubSignIn = async () => {
		setError("");
		try {
			await signInWithGithub();
			// OAuth redirects happen automatically
		} catch (error) {
			setError(error.message || "Failed to sign in with GitHub");
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
					justifyContent: "center",
					height: "max-content",
					borderRadius: 2,
					maxWidth: "420px",
					width: "100%",
					gap: 3,
					p: { xs: 0, sm: 4 },
					bgcolor: "background.defaultDark",
				}}
			>
				<Logo height={40} width={160} />
				{error && (
					<Alert severity="error" sx={{ width: "100%" }}>
						{error}
					</Alert>
				)}
				<Stack
					spacing={2}
					component="form"
					onSubmit={handleLogin}
					sx={{
						maxWidth: "24rem",
						width: "100%",
						mb: 0,
					}}
				>
					<NeviosInput
						type="email"
						name="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						required
					/>
					<NeviosInput
						type={passwordVisibility ? "text" : "password"}
						name="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="current-password"
						required
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
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							fontSize: "sm",
							flexWrap: "wrap",
						}}
					>
						<FormControlLabel
							sx={{
								".MuiFormControlLabel-label": {
									fontSize: "sm",
								},
							}}
							control={<Checkbox defaultChecked />}
							label="Remember me?"
						/>
						<Box
							component="a"
							href="/forgot-password"
							sx={{
								color: "primary.600",
								cursor: "pointer",
							}}
						>
							Forgot password?
						</Box>
					</Box>
					<NeviosPrimaryButton
						type="submit"
						loading={isLoading}
						disabled={isLoading}
						iconBefore={<TbLock size={18} />}
						height="40px"
						width="100%"
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</NeviosPrimaryButton>
					
					{/*
					<Box
						role="separator"
						sx={{
							display: "flex",
							alignItems: "center",
							color: "gray.400",
							fontSize: "sm",
							width: "100%",
							"&::before": {
								content: '""',
								flex: 1,
								height: "1px",
								backgroundColor: "gray.300",
								marginRight: 2,
							},
							"&::after": {
								content: '""',
								flex: 1,
								height: "1px",
								backgroundColor: "gray.300",
								marginLeft: 2,
							},
						}}
					>
						Continue with
					</Box>
					<NeviosSecondaryButton 
						iconBefore={<FaGoogle size={18} />}
						onClick={handleGoogleSignIn}
						height="40px"
						width="100%"
					>
						Sign in with Google
					</NeviosSecondaryButton>
					<NeviosSecondaryButton 
						iconBefore={<FaGithub size={18} />}
						onClick={handleGithubSignIn}
						height="40px"
						width="100%"
					>
						Sign in with GitHub
					</NeviosSecondaryButton>
					*/}
				</Stack>
			</Box>
		</Box>
	);
}
