import { useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MedicationIcon from '@mui/icons-material/Medication';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { //TODO: Either figure out CSS styling or use something else like Dialog (or code it raw) for a better looking popup
  Menu,
  MenuItem
} from '@mui/material';

  export default function TopBar({ title, titleColor }) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handlePFPOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePFPClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    handlePFPClose();
  };

  const handleLogoutClick = () => {
    // Perform logout action, clear session, etc.
    navigate("/");
    handlePFPClose();
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem disablePadding component={Link} to="/dashboard">
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon/>
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} to="/gymfinder">
          <ListItemButton>
            <ListItemIcon>
              <MapIcon/>
            </ListItemIcon>
            <ListItemText primary="Gym Finder" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} to="/workouts">
          <ListItemButton>
            <ListItemIcon>
              <FitnessCenterIcon/>
            </ListItemIcon>
            <ListItemText primary="Workouts" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} to="/mealplans">
          <ListItemButton>
            <ListItemIcon>
              <RestaurantIcon/>
            </ListItemIcon>
            <ListItemText primary="Meal Plans" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} to="/supplements">
          <ListItemButton>
            <ListItemIcon>
              <MedicationIcon/>
            </ListItemIcon>
            <ListItemText primary="Supplements" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} to="/">
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon/>
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
);

  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar color="customColor">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: titleColor }}>
                {title}
              </Typography>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handlePFPOpen}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handlePFPClose}
              >
                <MenuItem onClick={handleSettingsClick}>
                  <SettingsIcon />
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogoutClick}>
                  <LogoutIcon />
                  Logout
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </Box>
    </ThemeProvider>
  );
}
