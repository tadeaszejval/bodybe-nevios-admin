"use client";
import { AuthThirdParty } from "../components/AuthThirdParty";
import { PageContainer } from "../components/PageContainer";
export function Login() {
	return (
		<PageContainer
			customSx={{
				minHeight: "80vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<AuthThirdParty />	
		</PageContainer>
	);
}
