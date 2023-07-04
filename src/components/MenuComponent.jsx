import { useState, useEffect } from "react";

import { Menu } from "@mui/material";

function MenuComponent({ children, menuId, openMenu }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (openMenu) setAnchorEl(true);
  }, [openMenu]);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {children}
    </Menu>
  );
}

export default MenuComponent;
