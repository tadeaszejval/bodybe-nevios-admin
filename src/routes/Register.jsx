"use client";
import { PageContainer } from "../components/PageContainer";
import { RegisterForm } from "../components/RegisterForm";

export function Register() {
	return (
		<PageContainer
			customSx={{
				minHeight: "80vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<RegisterForm />
		</PageContainer>
	);
}
