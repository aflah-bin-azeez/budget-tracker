import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import AccountBalanceIcon from "@mui/icons-material/AccountBalanceWallet";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navButtonStyle = ({ isActive }) => ({
    color: isActive ? "#ffeb3b" : "#fff",
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
  });

  const drawerActiveStyle = ({ isActive }) => ({
    backgroundColor: isActive ? "rgba(25,118,210,0.15)" : "transparent",
    borderRadius: 8,
    fontWeight: isActive ? "bold" : "normal",
  });

  const authLinks = [
    { to: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/categories", label: "Categories", icon: <CategoryIcon /> },
    { to: "/budgets", label: "Budgets", icon: <AccountBalanceIcon /> },
    { to: "/reports", label: "Reports", icon: <AssessmentIcon /> },
  ];

  return (
    <>
      <AppBar
        position="static"
        sx={{
          mb: 2,
          background: "#1565c0",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 0.5 }}
          >
            Budget Tracker
          </Typography>

          {/* Desktop */}
          {token && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {authLinks.map((link) => (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  style={navButtonStyle}
                >
                  {link.label}
                </Button>
              ))}
              <Button color="error" variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}

          {/* Mobile Hamburger */}
          {token && (
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
                color: "white",
                borderRadius: 2,
                padding: "8px",
              }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon sx={{ fontSize: 28 }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Modern Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            padding: 1.5,
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{ px: 2, py: 1, fontWeight: "bold", color: "#1565c0" }}
        >
          Menu
        </Typography>

        <Divider sx={{ mb: 1 }} />

        <List>
          {authLinks.map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.to}
                style={drawerActiveStyle}
                onClick={() => setOpen(false)}
                sx={{
                  gap: 2,
                  borderRadius: 2,
                  py: 1.2,
                  mb: 0.5,
                }}
              >
                {item.icon}
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          <Divider sx={{ my: 1 }} />

          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                gap: 2,
                borderRadius: 2,
                py: 1.2,
                backgroundColor: "rgba(255,0,0,0.1)",
              }}
            >
              <LogoutIcon color="error" />
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  sx: { color: "red", fontWeight: "bold" },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
