"use client";
import {
	Box,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Popover,
	Tooltip,
	Typography,
} from "@mui/material";
import { NeviosSecondaryButton } from "./nevios/NeviosButtons";
import * as React from "react";
import { HiPlus, HiX } from "react-icons/hi";
import { FILTER_FIELDS } from "../core/filters";
import { useDisclosure } from "../hooks/useDisclosure";

export function CustomFilterButton({
	value,
	onRemove,
	onEdit,
	fieldType,
	operatorType,
	filterIndex,
	disabled,
	filterDefinition,
}) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [selectedField, setSelectedField] = React.useState(fieldType);
	const [selectedOperator, setSelectedOperator] = React.useState(operatorType);
	const [selectedValue, setSelectedValue] = React.useState(value);
	const editFilterDisclosure = useDisclosure();
	function applyNewFilter() {
		editFilterDisclosure.onClose();
		if (!selectedOperator) {
			throw new Error("No operator selected");
		}
		onEdit(
			{
				field: selectedField,
				operator: selectedOperator,
				value: selectedValue,
			},
			filterIndex,
		);
	}
	const incompleteFilter = !selectedOperator || !value;
	return (
		<>
			<NeviosSecondaryButton
				size="small"
				onClick={(event) => {
					setAnchorEl(event.currentTarget);
					editFilterDisclosure.onOpen();
				}}
				sx={{
					fontSize: "12px",
					maxHeight: "24px",
				}}
			>
				{FILTER_FIELDS[fieldType].icon}
				<FilterLabel filterField={fieldType} />
				{operatorType && (
					<Box
						sx={{
							color: "primary.700",
							letterSpacing: 0,
							lineHeight: 1,
							px: 0.25,
							display: "flex",
							alignItems: "center",
							flexDirection: "row",
							gap: 0.5,
						}}
					>
						<FilterValue
							filterField={fieldType}
							operatorType={operatorType}
							value={value}
						/>
					</Box>
				)}
				{operatorType && value && (
					<Tooltip
						title={disabled ? "Must have at least one filter applied" : ""}
					>
						<Box>
							<IconButton
								onClick={(event) => {
									event.stopPropagation();
									onRemove({ field: fieldType, operator: operatorType, value });
									// reset local state as well
									setSelectedValue("");
								}}
								size="small"
								disabled={disabled}
								sx={{
									padding: "3px",
									height: "100%",
									pointerEvents: "all",
									// hide this when the parent div has the class demo-dynamic-filters
									".demo-dynamic-filters &": {
										visibility: "hidden",
										width: 0,
									},
								}}
							>
								<HiX size={16} />
							</IconButton>
						</Box>
					</Tooltip>
				)}
			</NeviosSecondaryButton>
			<EditFilterPopover
				anchorEl={anchorEl}
				selectedField={selectedField}
				setSelectedField={setSelectedField}
				selectedOperator={selectedOperator}
				setSelectedOperator={setSelectedOperator}
				selectedValue={selectedValue}
				setSelectedValue={setSelectedValue}
				disclosure={editFilterDisclosure}
				filterDefinition={filterDefinition}
				applyFilter={applyNewFilter}
				resetOnClose={false}
			/>
		</>
	);
}

export function NewCustomFilterButton({
	addNewFilter,
	disabled,
	availableFilters = [],
	placeholder,
}) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [selectedField, setSelectedField] = React.useState("subject");
	const [selectedOperator, setSelectedOperator] = React.useState(undefined);
	const [selectedValue, setSelectedValue] = React.useState("");
	const selectFilterMenu = useDisclosure();
	const configureFilterPopover = useDisclosure();
	const placeholderLabel = placeholder
		? FILTER_FIELDS[placeholder].displayLabel
		: undefined;
	function chooseFilter(filterName) {
		setSelectedField(filterName);
		selectFilterMenu.onClose();
		configureFilterPopover.onOpen();
	}
	function applyFilter() {
		configureFilterPopover.onClose();
		if (!selectedOperator) {
			throw new Error("No operator selected");
		}
		addNewFilter({
			field: selectedField,
			operator: selectedOperator,
			value: selectedValue,
		});
		// reset the selected field, operator, and value
		setSelectedField("subject");
		setSelectedOperator(undefined);
		setSelectedValue("");
	}
	const matchingDefinition = availableFilters?.find(
		(filterConfig) => filterConfig.field === selectedField,
	) || {
		field: "subject",
		operatorValueBlock: () => <></>,
	};
	return (
		<>
			<Button
				sx={{
					height: "20px",
					minWidth: "unset",
					// make it a dotted border
					borderRadius: 0.75,
					borderStyle: "dashed",
					borderWidth: 1,
					borderColor: "gray.300",
					fontSize: "xs",
					gap: 0.5,
				}}
				color="secondary"
				onClick={(event) => {
					setAnchorEl(event.currentTarget);
					if (placeholder) {
						setSelectedField(placeholder);
						configureFilterPopover.onOpen();
					} else {
						selectFilterMenu.onOpen();
					}
				}}
				size="medium"
				disabled={disabled}
			>
				<HiPlus size={12} />
				{placeholderLabel}
			</Button>
			<Menu
				open={selectFilterMenu.isOpen}
				onClose={selectFilterMenu.onClose}
				anchorEl={anchorEl}
				sx={{
					".MuiPaper-root": {
						minWidth: 160,
						height: "40px",
					},
				}}
			>
				{availableFilters.map((filterConfig) => {
					return (
						<MenuItem
							key={filterConfig.field}
							dense
							onClick={() => chooseFilter(filterConfig.field)}
							sx={{
								display: "flex",
								flexDirection: "row",
								width: "100%",
								justifyContent: "space-between",
								gap: 1.5,
							}}
						>
							<FilterFieldMenuItem filterField={filterConfig.field} />
						</MenuItem>
					);
				})}
			</Menu>
			<EditFilterPopover
				disclosure={configureFilterPopover}
				filterDefinition={matchingDefinition}
				anchorEl={anchorEl}
				selectedField={selectedField}
				setSelectedField={setSelectedField}
				selectedOperator={selectedOperator}
				setSelectedOperator={setSelectedOperator}
				selectedValue={selectedValue}
				setSelectedValue={setSelectedValue}
				applyFilter={applyFilter}
			/>
		</>
	);
}

export function EditFilterPopover({
	disclosure,
	filterDefinition,
	anchorEl,
	selectedField,
	setSelectedField,
	selectedOperator,
	setSelectedOperator,
	selectedValue,
	setSelectedValue,
	applyFilter,
	resetOnClose,
}) {
	// try to autofocus the filter when we open the popover, but forget React since it's not that bad if it fails
	React.useEffect(() => {
		const filterValueInput = document.querySelector('[name="filterValue"]');
		if (filterValueInput && disclosure.isOpen) {
			// use the next tick in the event loop to focus the input
			setTimeout(() => {
				filterValueInput.focus();
			}, 0);
		}
	}, [disclosure.isOpen]);
	const OperatorValueBlock = filterDefinition?.operatorValueBlock?.({
		selectedOperator,
		setSelectedOperator,
		selectedValue,
		setSelectedValue,
	});
	return (
		<Popover
			id="new-filter-menu"
			open={disclosure.isOpen}
			disablePortal={true}
			anchorEl={anchorEl}
			onClose={async () => {
				disclosure.onClose();
				// reset the selected field, operator, and value, but give a brief delay so we don't see a flash
				if (resetOnClose) {
					await new Promise((resolve) => setTimeout(resolve, 200));
					setSelectedField("subject");
					setSelectedOperator(undefined);
					setSelectedValue("");
				}
			}}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "left",
			}}
			sx={{
				".MuiPaper-root": {
					// offset a few pixels vertically
					boxShadow: 2,
					transform: "translateY(4px) !important",
					borderRadius: "12px",
				},
			}}
		>
			<Box
				id="new-filter-form"
				component="form"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					applyFilter();
				}}
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 1,
					p: 1.5,
				}}
			>
				<Typography
					variant="h4"
					sx={{
						fontSize: "xs",
						fontWeight: 600,
						lineHeight: 1.25,
					}}
				>
					Filter by {FILTER_FIELDS[selectedField].displayLabel}{" "}
				</Typography>
				{disclosure.isOpen && OperatorValueBlock}
				{OperatorValueBlock && disclosure.isOpen && (
					<Button
						variant="contained"
						size="small"
						form="new-filter-form"
						type="submit"
						disabled={
							Array.isArray(selectedValue)
								? selectedValue?.length === 0
								: selectedValue === ""
						}
					>
						Add Filter
					</Button>
				)}
			</Box>
		</Popover>
	);
}

export function FilterFieldMenuItem({ filterField }) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				width: "100%",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 1.5,
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: 1,
				}}
			>
				{FILTER_FIELDS[filterField].icon}
				{FILTER_FIELDS[filterField].displayLabel}
			</Box>
		</Box>
	);
}

export function FilterLabel({ filterField, customSx, includeIcon = false }) {
	return (
		<Box
			sx={{
				px: 0.5,
				lineHeight: 1,
				display: "flex",
				alignItems: "center",
				flexDirection: "row",
				gap: 0.25,
				color: "gray.700",
				...customSx,
			}}
		>
			{includeIcon && FILTER_FIELDS[filterField]?.icon}
			{FILTER_FIELDS[filterField]?.displayLabel}
		</Box>
	);
}

export function FilterValue({ filterField, operatorType, value, customSx }) {
	const contents = FILTER_FIELDS[filterField]?.valueRenderer;
	return (
		<Box
			sx={{
				// hide with ellipsis after 50ch
				maxWidth: "24ch",
				overflow: "hidden",
				textOverflow: "ellipsis",
				...customSx,
			}}
		>
			{contents(value, operatorType)}
		</Box>
	);
}
