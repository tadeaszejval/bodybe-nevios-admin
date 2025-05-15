"use client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "../theme";
import { Toaster } from "sonner";
import { BroadcastTourProvider } from "../context/BroadcastTourProvider";
import { ThemeCustomizationProvider } from "../context/ThemeCustomizationProvider";
import { TourProvider } from "../context/TourProvider";
import { AuthProvider } from "../context/AuthProvider";

export function AppProviders({ children }) {
	return (
		<ThemeCustomizationProvider>
			<ThemeProvider>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<BroadcastTourProvider>
						<TourProvider>
							<AuthProvider>
							<CssBaseline />
							<Toaster />
							{children}
							</AuthProvider>
						</TourProvider>
					</BroadcastTourProvider>
				</LocalizationProvider>
			</ThemeProvider>
		</ThemeCustomizationProvider>
	);
}
