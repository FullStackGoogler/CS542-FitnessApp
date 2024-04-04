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
import { Link, useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { //TODO: Either figure out CSS styling or use something else like Dialog (or code it raw) for a better looking popup
  Menu,
  MenuItem
} from '@mui/material';

import AppLogoIcon from './AppLogoIcon.png';

const topBarColors = {
  '/dashboard': 'homePage',
  '/gymfinder': 'gymFinderPage',
  '/workouts': 'workoutPage',
  '/mealplans': 'mealPage',
  '/nutritionplans': 'nutritionPlanPage',
  '/supplements': 'supplementPage',
  'settings': 'settingsPage',
};

export default function TopBar({ title, titleColor }) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = location.pathname;
  const defaultTopBarColor = 'homePage';
  const topBarColor = topBarColors[currentPage] || defaultTopBarColor;

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
    // Perform logout action, clear session, etc. TODO: Or maybe put this logic elsewhere
    navigate("/");
    handlePFPClose();
  };

  const DrawerList = (
    <Box sx={{ width: 250, height: '100%', backgroundColor: '#7364D2' }} role="presentation" onClick={toggleDrawer(false)}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <img src={AppLogoIcon} alt="App Logo Icon" style={{ width: '50px', height: '50px'}} />
        <Typography variant="subtitle" sx={{ color: 'white', textAlign: 'center' }}>Fitness App</Typography>
      </div>
      <List>
        <ListItem disablePadding component={Link} to="/dashboard">
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon/>
            </ListItemIcon>
            <ListItemText primary="Home" sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} to="/gymfinder">
          <ListItemButton>
            <ListItemIcon>
              <MapIcon/>
            </ListItemIcon>
            <ListItemText primary="Gym Finder" sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} to="/workouts">
          <ListItemButton>
            <ListItemIcon>
              <FitnessCenterIcon/>
            </ListItemIcon>
            <ListItemText primary="Workouts" sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} to="/mealplans">
          <ListItemButton>
            <ListItemIcon>
              <RestaurantIcon/>
            </ListItemIcon>
            <ListItemText primary="Meal Plans" sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} to="/nutritionplans">
          <ListItemButton>
            <ListItemIcon>
              <RestaurantIcon/>
            </ListItemIcon>
            <ListItemText primary="Nutrition Plans" sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} to="/supplements">
          <ListItemButton>
            <ListItemIcon>
              <MedicationIcon/>
            </ListItemIcon>
            <ListItemText primary="Supplements" sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} to="/">
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon/>
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar color={topBarColor}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon style={{ color: '#FFFFFF' }} />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: titleColor }}>
                {title}
              </Typography>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 1, }}
                onClick={handlePFPOpen}
              >
                <AccountCircleIcon style={{ color: '#FFFFFF', width: '50px', height: '50px' }} />
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
