"use client";
import { Box } from "@mui/material";
import { AuthThirdParty } from "../components/AuthThirdParty";
import { PageContainer } from "../components/PageContainer";
export function Login() {
	return (
		<Box
			sx={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundImage: "url(/wallpapers/wallpaper_1.jpg)",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			<PageContainer
				customSx={{
					minHeight: "80vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "transparent",
				}}
			>
				<AuthThirdParty />	
			</PageContainer>
		</Box>
	);
}
