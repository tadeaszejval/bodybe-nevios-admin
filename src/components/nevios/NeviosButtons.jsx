import { Button, CircularProgress } from "@mui/material";

export function NeviosPrimaryButton({ size = "small", children, loading = false, disabled = false, iconBefore, iconAfter, onClick, height, width, ...props }) {
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

export function NeviosSecondaryButton({ size = "small", children, loading = false, disabled = false, iconBefore, iconAfter, onClick, height, width, ...props }) {
	return (
		<Button 
			disabled={disabled || loading}
			onClick={onClick}
			size={size} 
			{...props}
			sx={{
				backgroundColor: loading || disabled ? "gray.200" : "white",
				color: loading || disabled ? "gray.500" : "gray.900",
				borderRadius: "10px",
				boxShadow: loading || disabled
					? "0rem -.065rem 0rem 0rem #d1d5db inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .05) inset, 0rem .03125rem 0rem .09375rem #f3f4f6 inset"
					: "0rem -.065rem 0rem 0rem #b5b5b5 inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .1) inset, 0rem .03125rem 0rem .09375rem #FFF inset",
				opacity: loading || disabled ? 0.7 : 1,
				cursor: loading || disabled ? "not-allowed" : "pointer",
				...(height && { height }),
				...(width && { width, minWidth: width }),
				"&:hover": {
					backgroundColor: loading || disabled ? "gray.200" : "gray.100",
					boxShadow: loading || disabled
						? "0rem -.065rem 0rem 0rem #d1d5db inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .05) inset, 0rem .03125rem 0rem .09375rem #f3f4f6 inset"
						: "0rem -.065rem 0rem 0rem #b5b5b5 inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .1) inset, 0rem .03125rem 0rem .09375rem #FFF inset"
				},
				"&:active": {
					backgroundColor: loading || disabled ? "gray.200" : "gray.50",
					boxShadow: loading || disabled
						? "0rem -.065rem 0rem 0rem #d1d5db inset, 0rem 0rem 0rem .1rem rgba(0, 0, 0, .05) inset, 0rem .03125rem 0rem .09375rem #f3f4f6 inset"
						: "0rem -.065rem 0rem 0rem #ffffff inset, 0rem 0rem 0rem .1rem rgba(0, 0, 0, .15) inset, 0rem .03125rem 0rem .09375rem #e5e7eb inset",
					"& .nevios-button-content": {
						transform: "translateY(1px)"
					}
				}
			}} 
		>
			{loading ? (
				<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", gap: "4px", paddingLeft: "5px", paddingRight: "5px" }}>
					<CircularProgress size={16} sx={{ color: "gray.600" }} />
					{children}
				</span>
			) : (
				<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", gap: "4px", paddingLeft: "5px", paddingRight: "5px" }}>
					{iconBefore && <span style={{ display: "flex", alignItems: "center" }}>{iconBefore}</span>}
					{children}
					{iconAfter && <span style={{ display: "flex", alignItems: "center" }}>{iconAfter}</span>}
				</span>
			)}
		</Button>
	);
}

export function NeviosShadowButton({ size = "small", children, loading = false, disabled = false, iconBefore, iconAfter, onClick, sx, height, width, ...props }) {
	return <Button 
		disabled={disabled || loading}
		onClick={onClick}
		size={size} 
		{...props}
		sx={{
			backgroundColor: loading || disabled ? "gray.200" : "gray.250",
			color: loading || disabled ? "gray.500" : "gray.900",
			borderRadius: "10px",
			border: "1px solid",
			borderColor: "gray.300",
			opacity: loading || disabled ? 0.7 : 1,
			cursor: loading || disabled ? "not-allowed" : "pointer",
			...(height && { height }),
			...(width && { width, minWidth: width }),
			"&:hover": {
				backgroundColor: loading || disabled ? "gray.200" : "gray.300",
			},
			"&:active": {
				boxShadow: loading || disabled
					? "0rem -.0625rem 0rem .0625rem hsl(0, 0.00%, 65.00%) inset, 0rem 0rem 0rem .0625rem hsl(0, 0.00%, 65.00%) inset, 0rem .125rem 0rem .0625rem hsl(0, 0.00%, 65.00%) inset"
					: "0rem -.0625rem .1rem .002rem hsl(0, 0.00%, 65.00%) inset, 0rem 0rem .08rem .0625rem hsl(0, 0.00%, 65.00%) inset, 0rem .09rem .08rem .0625rem hsl(0, 0.00%, 65.00%) inset",
				"& .nevios-button-content": {
					transform: "translateY(1px)"
				}
			},
			...sx
		}} 
	>
		{loading ? (
			<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "5px", paddingRight: "5px" }}>
				<CircularProgress size={16} sx={{ color: "gray.600" }} />
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

export function NeviosDangerButton({ size = "small", children, loading = false, disabled = false, iconBefore, iconAfter, onClick, height, width, ...props }) {
	return <Button 
		disabled={disabled || loading}
		onClick={onClick}
		size={size} 
		{...props}
		sx={{
			backgroundColor: loading || disabled ? "red.300" : "red.main",
			color: "white",
			borderRadius: "10px",
			boxShadow: loading || disabled
				? "0rem -.09rem 0rem 0rem hsl(0, 40%, 60%) inset, 0rem 0rem 0rem .09rem hsl(0, 40%, 60%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 50%, 70%) inset"
				: "0rem -.09rem 0rem 0rem hsl(0, 70%, 35%) inset, 0rem 0rem 0rem .09rem hsl(0, 70%, 35%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 84%, 60%) inset",
			opacity: loading || disabled ? 0.7 : 1,
			cursor: loading || disabled ? "not-allowed" : "pointer",
			...(height && { height }),
			...(width && { width, minWidth: width }),
			"&:hover": {
				backgroundColor: loading || disabled ? "red.300" : "red.800",
				boxShadow: loading || disabled
					? "0rem -.09rem 0rem 0rem hsl(0, 40%, 60%) inset, 0rem 0rem 0rem .09rem hsl(0, 40%, 60%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 50%, 70%) inset"
					: "0rem -.09rem 0rem 0rem hsl(0, 70%, 35%) inset, 0rem 0rem 0rem .09rem hsl(0, 70%, 35%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 84%, 60%) inset",
			},
			"&:active": {
				backgroundColor: loading || disabled ? "red.300" : "red.700",
				boxShadow: loading || disabled
					? "0rem -.09rem 0rem 0rem hsl(0, 40%, 60%) inset, 0rem 0rem 0rem .1rem hsl(0, 40%, 60%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 50%, 70%) inset"
					: "0rem -.09rem 0rem 0rem hsl(0, 84%, 60%) inset, 0rem 0rem 0rem .1rem hsl(0, 65%, 30%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 70%, 35%) inset",
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

export function NeviosPrimaryIconButton({ size = "small", children, loading = false, disabled = false, onClick, height, width, ...props }) {
	const iconSize = size === "small" ? "32px" : size === "medium" ? "40px" : "48px";
	
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
			minWidth: width || iconSize,
			width: width || iconSize,
			height: height || iconSize,
			padding: 0,
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
			<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "5px", paddingRight: "5px" }}>
				<CircularProgress size={16} sx={{ color: "white" }} />
			</span>
		) : (
			<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "5px", paddingRight: "5px" }}>
				{children}
			</span>
		)}
	</Button>;
}

export function NeviosSecondaryIconButton({ size = "small", children, loading = false, disabled = false, onClick, height, width, ...props }) {
	const iconSize = size === "small" ? "32px" : size === "medium" ? "40px" : "48px";
	
	return (
		<Button 
			disabled={disabled || loading}
			onClick={onClick}
			size={size} 
			{...props}
			sx={{
				backgroundColor: loading || disabled ? "gray.200" : "white",
				color: loading || disabled ? "gray.500" : "gray.900",
				borderRadius: "10px",
				boxShadow: loading || disabled
					? "0rem -.065rem 0rem 0rem #d1d5db inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .05) inset, 0rem .03125rem 0rem .09375rem #f3f4f6 inset"
					: "0rem -.065rem 0rem 0rem #b5b5b5 inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .1) inset, 0rem .03125rem 0rem .09375rem #FFF inset",
				opacity: loading || disabled ? 0.7 : 1,
				cursor: loading || disabled ? "not-allowed" : "pointer",
				minWidth: width || iconSize,
				width: width || iconSize,
				height: height || iconSize,
				padding: 0,
				"&:hover": {
					backgroundColor: loading || disabled ? "gray.200" : "gray.100",
					boxShadow: loading || disabled
						? "0rem -.065rem 0rem 0rem #d1d5db inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .05) inset, 0rem .03125rem 0rem .09375rem #f3f4f6 inset"
						: "0rem -.065rem 0rem 0rem #b5b5b5 inset, 0rem 0rem 0rem .065rem rgba(0, 0, 0, .1) inset, 0rem .03125rem 0rem .09375rem #FFF inset"
				},
				"&:active": {
					backgroundColor: loading || disabled ? "gray.200" : "gray.50",
					boxShadow: loading || disabled
						? "0rem -.065rem 0rem 0rem #d1d5db inset, 0rem 0rem 0rem .1rem rgba(0, 0, 0, .05) inset, 0rem .03125rem 0rem .09375rem #f3f4f6 inset"
						: "0rem -.065rem 0rem 0rem #ffffff inset, 0rem 0rem 0rem .1rem rgba(0, 0, 0, .15) inset, 0rem .03125rem 0rem .09375rem #e5e7eb inset",
					"& .nevios-button-content": {
						transform: "translateY(1px)"
					}
				}
			}} 
		>
			{loading ? (
				<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "5px", paddingRight: "5px" }}>
					<CircularProgress size={16} sx={{ color: "gray.600" }} />
				</span>
			) : (
				<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "5px", paddingRight: "5px" }}>
					{children}
				</span>
			)}
		</Button>
	);
}

export function NeviosShadowIconButton({ size = "small", children, loading = false, disabled = false, onClick, height, width, ...props }) {
	const iconSize = size === "small" ? "32px" : size === "medium" ? "40px" : "48px";
	
	return <Button 
		disabled={disabled || loading}
		onClick={onClick}
		size={size} 
		{...props}
		sx={{
			backgroundColor: loading || disabled ? "gray.300" : "gray.250",
			color: loading || disabled ? "gray.500" : "gray.900",
			borderRadius: "10px",
			opacity: loading || disabled ? 0.7 : 1,
			cursor: loading || disabled ? "not-allowed" : "pointer",
			minWidth: width || iconSize,
			width: width || iconSize,
			height: height || iconSize,
			padding: 0,
			"&:hover": {
				backgroundColor: loading || disabled ? "gray.200" : "gray.300",
			},
			"&:active": {
				boxShadow: loading || disabled
					? "0rem -.0625rem 0rem .0625rem hsl(0, 0.00%, 65.00%) inset, 0rem 0rem 0rem .0625rem hsl(0, 0.00%, 65.00%) inset, 0rem .125rem 0rem .0625rem hsl(0, 0.00%, 65.00%) inset"
					: "0rem -.0625rem .1rem .002rem hsl(0, 0.00%, 65.00%) inset, 0rem 0rem .08rem .0625rem hsl(0, 0.00%, 65.00%) inset, 0rem .09rem .08rem .0625rem hsl(0, 0.00%, 65.00%) inset",
				"& .nevios-button-content": {
					transform: "translateY(1px)"
				}
			}
		}} 
	>
		{loading ? (
			<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "5px", paddingRight: "5px" }}>
				<CircularProgress size={16} sx={{ color: "gray.600" }} />
			</span>
		) : (
			<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "5px", paddingRight: "5px" }}>
				{children}
			</span>
		)}
	</Button>;
}

export function NeviosDangerIconButton({ size = "small", children, loading = false, disabled = false, onClick, height, width, ...props }) {
	const iconSize = size === "small" ? "32px" : size === "medium" ? "40px" : "48px";
	
	return <Button 
		disabled={disabled || loading}
		onClick={onClick}
		size={size} 
		{...props}
		sx={{
			backgroundColor: loading || disabled ? "red.300" : "red.main",
			color: "white",
			borderRadius: "10px",
			boxShadow: loading || disabled
				? "0rem -.09rem 0rem 0rem hsl(0, 40%, 60%) inset, 0rem 0rem 0rem .09rem hsl(0, 40%, 60%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 50%, 70%) inset"
				: "0rem -.09rem 0rem 0rem hsl(0, 70%, 35%) inset, 0rem 0rem 0rem .09rem hsl(0, 70%, 35%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 84%, 60%) inset",
			opacity: loading || disabled ? 0.7 : 1,
			cursor: loading || disabled ? "not-allowed" : "pointer",
			minWidth: width || iconSize,
			width: width || iconSize,
			height: height || iconSize,
			padding: 0,
			"&:hover": {
				backgroundColor: loading || disabled ? "red.300" : "red.800",
				boxShadow: loading || disabled
					? "0rem -.09rem 0rem 0rem hsl(0, 40%, 60%) inset, 0rem 0rem 0rem .09rem hsl(0, 40%, 60%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 50%, 70%) inset"
					: "0rem -.09rem 0rem 0rem hsl(0, 70%, 35%) inset, 0rem 0rem 0rem .09rem hsl(0, 70%, 35%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 84%, 60%) inset",
			},
			"&:active": {
				backgroundColor: loading || disabled ? "red.300" : "red.700",
				boxShadow: loading || disabled
					? "0rem -.09rem 0rem 0rem hsl(0, 40%, 60%) inset, 0rem 0rem 0rem .1rem hsl(0, 40%, 60%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 50%, 70%) inset"
					: "0rem -.09rem 0rem 0rem hsl(0, 84%, 60%) inset, 0rem 0rem 0rem .1rem hsl(0, 65%, 30%) inset, 0rem .03125rem 0rem .09375rem hsl(0, 70%, 35%) inset",
				"& .nevios-button-content": {
					transform: "translateY(1px)"
				}
			}
		}} 
	>
		{loading ? (
			<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "5px", paddingRight: "5px" }}>
				<CircularProgress size={16} sx={{ color: "white" }} />
			</span>
		) : (
			<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "5px", paddingRight: "5px" }}>
				{children}
			</span>
		)}
	</Button>;
}

export function NeviosSimpleToggleButton({ children, size = "small", toggled = false, onActivate, onDisabled, height, width, ...props }) {
	const handleClick = () => {
		if (toggled) {
			onDisabled?.();
		} else {
			onActivate?.();
		}
	};

	return (
		<Button
			onClick={handleClick}
			{...props}
			size={size}
			sx={{
				backgroundColor: toggled ? "gray.250" : "transparent",
				fontWeight: "500",
				color: toggled ? "gray.900" : "gray.900",
				borderRadius: "10px",
				...(height && { height }),
				...(width && { width, minWidth: width }),
				"&:hover": {
					backgroundColor: toggled ? "gray.200" : "gray.200",
				},
				...props.sx
			}}
		>
			<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "5px", paddingRight: "5px" }}>
				{children}
			</span>
		</Button>
	);
}

export function NeviosTextButton({ size = "small", children, loading = false, disabled = false, iconBefore, iconAfter, onClick, height, width, fontSize, fontWeight, ...props }) {
	return <Button 
		disabled={disabled || loading}
		onClick={onClick}
		size={size} 
		{...props}
		sx={{
			fontSize: {fontSize},
			fontWeight: {fontWeight},
			backgroundColor: "transparent",
			color: loading || disabled ? "gray.500" : "gray.900",
			borderRadius: "10px",
			opacity: loading || disabled ? 0.7 : 1,
			cursor: loading || disabled ? "not-allowed" : "pointer",
			border: "none",
			boxShadow: "none",
			...(height && { height }),
			...(width && { width, minWidth: width }),
			"&:hover": {
				backgroundColor: loading || disabled ? "transparent" : "gray.100",
				boxShadow: loading || disabled ? "none" : "none",
			},
			"&:active": {
				backgroundColor: loading || disabled ? "transparent" : "gray.100",
				boxShadow: loading || disabled
					? "none"
					: "0rem -.0625rem .1rem .002rem hsl(0, 0.00%, 65.00%) inset, 0rem 0rem .08rem .0625rem hsl(0, 0.00%, 65.00%) inset, 0rem .09rem .08rem .0625rem hsl(0, 0.00%, 65.00%) inset",
				"& .nevios-button-content": {
					transform: "translateY(1px)"
				}
			}
		}} 
	>
		{loading ? (
			<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "5px", paddingRight: "5px" }}>
				<CircularProgress size={16} sx={{ color: "gray.600" }} />
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

export function NeviosFilterButton({ size = "small", children, loading = false, disabled = false, iconBefore, iconAfter, onClick, height, width, ...props }) {
	return (
		<Button 
			disabled={disabled || loading}
			onClick={onClick}
			size={size} 
			{...props}
			sx={{
				backgroundColor: loading || disabled ? "gray.200" : "white",
				color: loading || disabled ? "gray.500" : "gray.900",
				borderRadius: "10px",
				border: "1px solid",
				borderColor: "gray.400",
				borderStyle: "dashed",
				fontWeight: "500",
				opacity: loading || disabled ? 0.7 : 1,
				cursor: loading || disabled ? "not-allowed" : "pointer",
				...(height && { height }),
				...(width && { width, minWidth: width }),
				"&:hover": {
					backgroundColor: loading || disabled ? "gray.200" : "gray.100",
				},
				"&:active": {
					backgroundColor: loading || disabled ? "gray.200" : "gray.50",
					
					"& .nevios-button-content": {
						transform: "translateY(1px)"
					}
				}
			}} 
		>
			{loading ? (
				<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", gap: "4px", paddingLeft: "5px", paddingRight: "5px" }}>
					<CircularProgress size={16} sx={{ color: "gray.600" }} />
					{children}
				</span>
			) : (
				<span className="nevios-button-content" style={{ display: "flex", alignItems: "center", gap: "4px", paddingLeft: "5px", paddingRight: "5px" }}>
					{iconBefore && <span style={{ display: "flex", alignItems: "center" }}>{iconBefore}</span>}
					{children}
					{iconAfter && <span style={{ display: "flex", alignItems: "center" }}>{iconAfter}</span>}
				</span>
			)}
		</Button>
	);
}



