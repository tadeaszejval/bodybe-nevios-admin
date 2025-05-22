"use client";
import { CopyBlock } from "../components/CopyBlock";
import { Box } from "@mui/material";
import {
	formatReadableDate,
	formatCurrencyNumber,
} from "../core/formatters";
import { useRouter } from "next/navigation";
/** ------------------- **/
/*  Column Factory builders
/** ------------------- **/
// accept some arguments and spit out a MUI column definition with some defaults set
export function genericColumnFactory(columnParams = {}) {
	return {
		flex: 1,
		...columnParams,
	};
}
export function clickableColumnFactory(columnParams = {}) {	
	const router = useRouter();
	return genericColumnFactory({
		...columnParams,
		renderCell: (params) => {
			let link;
			if (typeof columnParams.link === "function") {
				link = columnParams.link(params);
			} else {
				link = columnParams.link;
			}
			return (
				<Box
					sx={{
						fontWeight: 500,
						cursor: link ? "pointer" : "default",
						"&:hover": link ? { textDecoration: "underline" } : {},
					}}
					onClick={() => {
						if (link) router.push(link);
					}}
				>
					{params.value}
				</Box>
			);
		},
	});
}
export function dateColumnFactory(columnParams = {}) {
	return genericColumnFactory({
		...columnParams,
		field: columnParams?.field || "date",
		minWidth: columnParams?.minWidth || 100,
		headerName: columnParams?.headerName || "Date",
		valueFormatter: (value) => (value ? formatReadableDate(value) : null),
	});
}
export function currencyColumnFactory(columnParams = {}) {
	return genericColumnFactory({
		...columnParams,
		field: columnParams?.field || "price",
		minWidth: columnParams?.minWidth || 100,
		type: "number",
		headerName: columnParams?.headerName || "Price",
		valueFormatter: (value) =>
			value ? `$${formatCurrencyNumber(value)}` : null,
	});
}
export function numericColumnFactory(columnParams = {}) {
	return genericColumnFactory({
		...columnParams,
		field: columnParams.field,
		minWidth: columnParams?.minWidth || 100,
		type: "number",
	});
}
export function idColumnFactory(columnParams = {}) {
	return genericColumnFactory({
		...columnParams,
		field: columnParams?.field || "id",
		minWidth: columnParams?.minWidth || 100,
		headerName: columnParams?.headerName || "ID",
		renderCell: (params) => <CopyBlock copyValue={params.value} />,
	});
}
