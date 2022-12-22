import React from "react";

import {
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { primaryColor, secondaryColor } from "../constants/colors";

const AppbarMenu = (props) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { menu, shortName } = props;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar sx={{ backgroundColor: secondaryColor, padding: 0.5 }}>
          <Typography variant="h6">{shortName}</Typography>
        </Avatar>
      </IconButton>
      <Menu
        sx={{ mt: "48px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {menu.map((menuItem) => (
          <MenuItem
            key={menuItem.id}
            onClick={() => {
              menuItem.onClickFunction();
              handleCloseUserMenu();
            }}
          >
            <ListItemIcon style={{ color: secondaryColor }}>{menuItem.icon}</ListItemIcon>
            <ListItemText style={{ color: secondaryColor }}>{menuItem.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default AppbarMenu;
