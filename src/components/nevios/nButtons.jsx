import { Button, CircularProgress } from "@mui/material";

export function nButtonPrimary({ size = "small", children, loading = false, disabled = false, iconBefore, iconAfter, onClick, height, width, ...props }) {
	return <Button 
		disabled={disabled || loading}
		onClick={onClick}
		size={size} 
		{...props}
		sx={{
			background: loading || disabled 
				? "linear-gradient(180deg, hsl(236, 30%, 70%) 63.53%, hsl(236, 30%, 75%) 100%)"
				: "linear-gradient(180deg, hsl(236, 70%, 45%) 63.53%, hsl(236, 91%, 60%) 100%)",
			color: "white",
			borderRadius: "10px",
			boxShadow: loading || disabled
				? "0rem -.09rem 0rem 0rem hsl(236, 30%, 65%) inset, 0rem 0rem 0rem .09rem hsl(236, 30%, 65%) inset, 0rem .03125rem 0rem .09375rem hsl(236, 30%, 75%) inset"
				: "0rem -.09rem 0rem 0rem hsl(236, 71%, 40%) inset, 0rem 0rem 0rem .09rem hsl(236, 71%, 40%) inset, 0rem .03125rem 0rem .09375rem hsl(236, 91%, 60%) inset",
			opacity: loading || disabled ? 0.7 : 1,
			cursor: loading || disabled ? "not-allowed" : "pointer",
			...(height && { height }),
			...(width && { width, minWidth: width }),
			"&:hover": {
				background: loading || disabled
					? "linear-gradient(180deg, hsl(236, 30%, 70%) 63.53%, hsl(236, 30%, 75%) 100%)"
					: "linear-gradient(180deg, hsl(236, 71%, 40%) 63.53%, hsl(236, 91%, 60%) 100%)",
				boxShadow: loading || disabled
					? "0rem -.09rem 0rem 0rem hsl(236, 30%, 65%) inset, 0rem 0rem 0rem .09rem hsl(236, 30%, 65%) inset, 0rem .03125rem 0rem .09375rem hsl(236, 30%, 75%) inset"
					: "0rem -.09rem 0rem 0rem hsl(236, 71%, 40%) inset, 0rem 0rem 0rem .09rem hsl(236, 71%, 40%) inset, 0rem .03125rem 0rem .09375rem hsl(236, 91%, 60%) inset",
			},
			"&:active": {
				background: loading || disabled
					? "linear-gradient(180deg, hsl(236, 30%, 70%) 63.53%, hsl(236, 30%, 75%) 100%)"
					: "linear-gradient(180deg, hsl(236, 71%, 40%) 63.53%, hsl(236, 91%, 60%) 100%)",
				boxShadow: loading || disabled
					? "0rem -.09rem 0rem 0rem hsl(236, 30%, 65%) inset, 0rem 0rem 0rem .1rem hsl(236, 30%, 65%) inset, 0rem .03125rem 0rem .09375rem hsl(236, 30%, 75%) inset"
					: "0rem -.09rem 0rem 0rem hsl(236, 91%, 60%) inset, 0rem 0rem 0rem .1rem hsl(236, 65%, 34%) inset, 0rem .03125rem 0rem .09375rem hsl(236, 71%, 40%) inset",
				"& .nevios-button-content": {
					transform: "translateY(1px)"
				}
			}
		}} 
	>
		{loading ? (
			<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "5px", paddingRight: "5px" }}>
				<CircularProgress size={16} sx={{ color: "white" }} />
				{children}
			</span>
		) : (
			<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "5px", paddingRight: "5px" }}>
				{iconBefore && <span style={{ display: "flex", alignItems: "center" }}>{iconBefore}</span>}
				{children}
				{iconAfter && <span style={{ display: "flex", alignItems: "center" }}>{iconAfter}</span>}
			</span>
		)}
	</Button>;
}