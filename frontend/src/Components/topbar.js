import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Link } from 'react-router-dom';

  export default function TopBar({ title, titleColor }) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem disablePadding component={Link} to="/">
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
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </Box>
    </ThemeProvider>
  );
}
