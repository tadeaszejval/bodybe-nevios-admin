"use client";
export const formatWithCommas = (number) =>
	`${Intl.NumberFormat("us").format(number).toString()}`;
export const formatAbbreviatedNumber = (number) =>
	Intl.NumberFormat("us", {
		notation: "compact",
		compactDisplay: "short",
	}).format(number);
export const formatCurrencyNumber = (number, decimals = 2) => {
	// Convert to number if it's a string
	const num = typeof number === 'string' ? parseFloat(number) : number;
	// Format with space as thousands separator and "." as decimal
	return num.toLocaleString('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
		useGrouping: true,
	}).replace(/,/g, ' ');
};
export const formatShortDate = (date) => {
	const formattableDate = typeof date === "string" ? new Date(date) : date;
	return Intl.DateTimeFormat("us", {
		month: "short",
		day: "numeric",
	}).format(formattableDate);
};
export const formatReadableDate = (date) => {
	const formattableDate = typeof date === "string" ? new Date(date) : date;
	return Intl.DateTimeFormat("us", {
		month: "long",
		day: "2-digit",
		year: "numeric",
	}).format(formattableDate);
};
export const formatReadableDatetime = (date) => {
	const formattableDate = typeof date === "string" ? new Date(date) : date;
	return Intl.DateTimeFormat("us", {
		month: "long",
		day: "2-digit",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	}).format(formattableDate);
};
