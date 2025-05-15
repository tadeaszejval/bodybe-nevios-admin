"use client";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { TbClipboardCheck, TbClipboardList } from "react-icons/tb";
import { useClipboard } from "../../hooks/useClipboard";
export function NeviosCopyBlock({ 
    copyValue, 
    variant = "body2"
}) 
{
	const { onCopy, hasCopied } = useClipboard(copyValue);
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				gap: 0.5,
				height: "100%",
			}}
		>
			<Box
				sx={{
					lineHeight: 1.5,
					display: "flex",
					gap: 0.5,
					alignItems: "center",
				}}
			>
				<Typography variant={variant} fontWeight={500}>{copyValue}</Typography>
				<Tooltip title={hasCopied ? "Copied!" : "Copy"}>
					{hasCopied ? (
						<IconButton onClick={onCopy}>
							<TbClipboardCheck size={14} />
						</IconButton>
					) : (
						<IconButton onClick={onCopy}>
							<TbClipboardList size={14} />
						</IconButton>
					)}
				</Tooltip>
			</Box>
		</Box>
	);
}
