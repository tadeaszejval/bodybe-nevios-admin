"use client";
import {
	Box,
	Button,
	Checkbox,
	FilledInput,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	Link,
	Stack,
	Typography,
	Alert,
} from "@mui/material";
import * as React from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { TbEye, TbEyeOff, TbLock } from "react-icons/tb";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";

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
				return;
			}
			// Redirect to dashboard on successful login
			router.push("/dashboard/home");
		} catch (error) {
			setError(error.message || "An error occurred during sign in");
		} finally {
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
					Welcome back to UI Kit
				</Typography>
				<Typography>
					Sign in, or{" "}
					<Link
						href="/register"
						sx={{
							textDecoration: "none",
						}}
					>
						create an account
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
					<FormControl>
						<FormLabel>Email</FormLabel>
						<FilledInput
							type="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
							required
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<FilledInput
							type={passwordVisibility ? "text" : "password"}
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
							required
							endAdornment={
								<IconButton
									aria-label="toggle password visibility"
									onClick={() => setPasswordVisibility(!passwordVisibility)}
									edge="end"
								>
									{passwordVisibility ? <TbEye /> : <TbEyeOff />}
								</IconButton>
							}
						/>
					</FormControl>
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
					<Button
						variant="contained"
						size="large"
						type="submit"
						startIcon={<TbLock />}
						disabled={isLoading}
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</Button>
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
					<Button 
						startIcon={<FaGoogle />} 
						variant="outlined"
						onClick={handleGoogleSignIn}
					>
						Sign in with Google
					</Button>
					<Button 
						startIcon={<FaGithub />} 
						variant="outlined"
						onClick={handleGithubSignIn}
					>
						Sign in with GitHub
					</Button>
				</Stack>
			</Box>
		</Box>
	);
}
