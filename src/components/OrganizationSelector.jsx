"use client";
import { Avatar, Box, Button, Menu, MenuItem, Stack } from "@mui/material";
import {
	TbArrowsDiff,
	TbChevronDown,
	TbPlus,
	TbSettings,
} from "react-icons/tb";
import { CreateOrganizationDialog } from "../components/CreateOrganizationDialog";
import { MenuDivider } from "../components/MenuDivider";
import { useDisclosure } from "../hooks/useDisclosure";
export function OrganizationSelector() {
	const selectorDisclosure = useDisclosure({ provideAnchorEl: true });
	const createOrgDisclosure = useDisclosure();
	return (
		<>
			<Button
				id="org-button"
				aria-controls={selectorDisclosure.isOpen ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={selectorDisclosure.isOpen ? "true" : undefined}
				onClick={selectorDisclosure.onOpen}
				startIcon={
					<Avatar
						sx={{ height: 30, width: 30, fontSize: "sm" }}
						variant="rounded"
						src="https://botas.cz/cdn/shop/files/favicon_67fc487f-68d0-41a4-84af-004846b06ff7.svg?crop=center&height=32&v=1713705256&width=32"
						alt="Active organization avatar"
					>
					</Avatar>
				}
				endIcon={<TbChevronDown size={16} />}
				sx={{
					px: 1.5,
					fontWeight: 600,
					color: "white",
					width: "100%",
					backgroundColor: "rgba(255, 255, 255, 0.1)",
					boxShadow: "0px 0px 3px 0px rgb(0, 0, 0) inset",
					justifyContent: "flex-start",
					fontSize: "base",
				}}
			>
				<Box
					sx={{
						textAlign: "left",
						width: "100%"
					}}
				>
					Botas
				</Box>
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={selectorDisclosure.anchorEl}
				open={selectorDisclosure.isOpen}
				onClose={selectorDisclosure.onClose}
				MenuListProps={{
					"aria-labelledby": "org-button",
				}}
				slotProps={{
					paper: {
						sx: {
							minWidth: 250,
							fontSize: "sm"
						},
					},
				}}
			>
				<MenuItem disabled>
					<TbArrowsDiff />
					Switch Organization
				</MenuItem>
				<MenuDivider />
				<MenuItem onClick={selectorDisclosure.onClose}>
					<OrganizationRow name="Botas" src="https://botas.cz/cdn/shop/files/favicon_67fc487f-68d0-41a4-84af-004846b06ff7.svg?crop=center&height=32&v=1713705256&width=32" />
				</MenuItem>
				<MenuItem onClick={selectorDisclosure.onClose}>
					<OrganizationRow name="Vasky" src="/gem-events.svg" />
				</MenuItem>
				<MenuDivider />
				<MenuItem onClick={selectorDisclosure.onClose}>
					<TbSettings />
					Settings
				</MenuItem>
				<MenuItem
					onClick={() => {
						selectorDisclosure.onClose();
						createOrgDisclosure.onOpen();
					}}
				>
					<TbPlus />
					Create New Organization
				</MenuItem>
			</Menu>
			<CreateOrganizationDialog disclosure={createOrgDisclosure} />
		</>
	);
}
function OrganizationRow({ name, src }) {
	return (
		<Stack direction="row" spacing={1}>
			<Avatar src={src} sx={{ height: 24, width: 24, fontSize: "sm" }}>
				UI
			</Avatar>
			<Box>{name}</Box>
		</Stack>
	);
}
