"use client";
import * as React from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";
import { TbLogout, TbSettings, TbUser } from "react-icons/tb";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";

export function UserProfileMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await signOut();
    router.push("/login");
  };

  // If no user, don't render anything
  if (!user) return null;

  // Get first letter of user's email for avatar
  const userInitial = user.email ? user.email[0].toUpperCase() : "U";

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: "primary.main" 
            }}
          >
            {userInitial}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 200,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => {
          handleClose();
          router.push("/dashboard/account");
        }}>
          <TbUser style={{ marginRight: 8 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          router.push("/dashboard/account/settings");
        }}>
          <TbSettings style={{ marginRight: 8 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <TbLogout style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
} 