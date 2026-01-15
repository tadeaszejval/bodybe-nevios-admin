import { Box } from "@mui/material";
import { SettingsSidebar } from "../../../components/SettingsSidebar";

export default function SettingsLayout({ children }) {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				width: "100%",
				height: "100%",
				py: 4,
			}}
		>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", sm: "288px 1fr" },
					gap: 3,
					width: "100%",
					maxWidth: "1100px",
					height: "fit-content",
					px: 3,
				}}
			>
				{/* Settings Sidebar */}
				<Box
					sx={{
						display: { xs: "none", sm: "block" },
						pr: 1,
					}}
				>
					<SettingsSidebar />
				</Box>

				{/* Content Area */}
				<Box
					sx={{
						minWidth: 0, // Prevents grid blowout
						paddingBottom: 10,
					}}
				>
					{children}
				</Box>
			</Box>
		</Box>
	);
}

export const metadata = {
	title: `Settings • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};

