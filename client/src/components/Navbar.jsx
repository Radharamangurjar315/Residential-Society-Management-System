import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge,
  MenuItem, Menu, Drawer, List, ListItem, ListItemIcon, ListItemText,
  useScrollTrigger, Paper, Button, Fade, Tooltip, Avatar, Divider,
  useTheme, useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  PieChart as PollIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Login as LoginIcon,
  PersonAdd as SignupIcon,
  Explore as ExploreIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Close as CloseIcon
} from '@mui/icons-material';

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: {
      transition: 'all 0.3s ease-in-out',
      backdropFilter: 'blur(8px)',
      backgroundColor: trigger ? 'rgba(25, 118, 210, 0.95)' : 'rgba(25, 118, 210, 0.8)',
    }
  });
}

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          mt: 1,
          '& .MuiMenuItem-root': {
            py: 1,
            px: 2,
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Signed in as
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          user@example.com
        </Typography>
      </Box>
      <Divider />
      <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
        <ListItemIcon><AccountCircle /></ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem component={Link} to="/bookmarks" onClick={handleMenuClose}>
        <ListItemIcon><BookmarkIcon /></ListItemIcon>
        Bookmarks
      </MenuItem>
      <MenuItem component={Link} to="/settings" onClick={handleMenuClose}>
        <ListItemIcon><SettingsIcon /></ListItemIcon>
        Settings
      </MenuItem>
      <Divider />
      <MenuItem onClick={toggleDarkMode}>
        <ListItemIcon>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </ListItemIcon>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </MenuItem>
    </Menu>
  );

  const notificationMenu = (
    <Menu
      anchorEl={notificationAnchor}
      open={Boolean(notificationAnchor)}
      onClose={handleMenuClose}
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          mt: 1,
          width: 320,
          maxHeight: 400,
        },
      }}
    >
      <Typography variant="h6" sx={{ px: 2, py: 1 }}>
        Notifications
      </Typography>
      <Divider />
      {[1, 2, 3].map((notification) => (
        <MenuItem key={notification} onClick={handleMenuClose}>
          <ListItemIcon>
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
          </ListItemIcon>
          <Box>
            <Typography variant="body2" noWrap>
              User liked your post
            </Typography>
            <Typography variant="caption" color="text.secondary">
              2 hours ago
            </Typography>
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
    { text: 'Polls', icon: <PollIcon />, path: '/polls' },
    { text: 'Login', icon: <LoginIcon />, path: '/signin' },
    { text: 'Signup', icon: <SignupIcon />, path: '/signup' },
  ];

  const drawer = (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
        <Typography variant="h6" color="primary">
          Societyy
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={location.pathname === item.path}
            onClick={handleDrawerToggle}
            sx={{
              my: 0.5,
              borderRadius: 1,
              mx: 1,
              color: 'inherit',
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              transition: 'all 0.2s',
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ElevationScroll>
        <AppBar>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h6"
              component={Link}
              sx={{
                display: { xs: 'none', sm: 'block' },
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                letterSpacing: 1,
                '&:hover': {
                  transform: 'scale(1.05)',
                },
                transition: 'transform 0.2s',
              }}
            >
              Societyy
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: 'inherit',
                    mx: 0.5,
                    px: 2,
                    borderRadius: 2,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: location.pathname === item.path ? '100%' : '0%',
                      height: '2px',
                      backgroundColor: 'white',
                      transition: 'all 0.3s',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Paper
                component="form"
                sx={{
                  p: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  width: searchFocused ? 300 : 300,
                  mr: 2,
                  borderRadius:'pill',
                  transition: 'all 0.3s',
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
              >
                <InputBase
                  sx={{ 
                    ml: 1, 
                    flex: 1,
                    color: 'inherit',
                    '& ::placeholder': {
                      color: 'black',
                    },
                  }}
                  placeholder="Search..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <IconButton sx={{ color: 'inherit' }}>
                  <SearchIcon />
                </IconButton>
              </Paper>

              <Tooltip title="Notifications">
                <IconButton 
                  color="inherit"
                  onClick={handleNotificationClick}
                  sx={{ 
                    mx: 1,
                    '&:hover': { transform: 'scale(1.1)' },
                    transition: 'transform 0.2s',
                  }}
                >
                  <Badge badgeContent={4} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Account">
                <IconButton
                  edge="end"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ 
                    '&:hover': { transform: 'scale(1.1)' },
                    transition: 'transform 0.2s',
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>U</Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              borderRadius: '0 16px 16px 0',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      {renderMenu}
      {notificationMenu}
      <Toolbar />
    </Box>
  );
};

export default NavBar;