import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useScrollTrigger,
  Button,
  Fade,
  Tooltip,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  Badge,
  Container
} from '@mui/material';

import {
  Menu as MenuIcon,
  Home as HomeIcon,
  PieChart as PollIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Explore as ExploreIcon,
  Close as CloseIcon,
  Event as EventIcon,
} from '@mui/icons-material';

// Elevation scroll effect for navbar
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
      backdropFilter: 'blur(10px)',
      backgroundColor: trigger ? 'rgba(33, 43, 54, 0.96)' : 'rgba(33, 43, 54, 0.85)',
      boxShadow: trigger ? '0 8px 16px rgba(0, 0, 0, 0.1)' : 'none',
    }
  });
}

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [name, setName] = useState(user ? user.name : '');
  
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle profile menu opening
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle notification click
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  // Close all menus
  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  // Toggle drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Events', icon: <EventIcon />, path: '/events' },
    { text: 'Polls', icon: <PollIcon />, path: '/polls' },
    { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
  ];

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(part => part.charAt(0).toUpperCase()).join('');
  };

  // Profile menu
  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      id="profile-menu"
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      TransitionComponent={Fade}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          borderRadius: 2,
          minWidth: 200,
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Signed in as
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          {name}
        </Typography>
      </Box>
      <Divider />
      <MenuItem component={Link} to="/profile" onClick={handleMenuClose} sx={{ py: 1.5 }}>
        <ListItemIcon><AccountCircle color="primary" /></ListItemIcon>
        <ListItemText primary="Profile" />
      </MenuItem>
      
    </Menu>
  );

  // Notifications menu
  const notificationMenu = (
    <Menu
      anchorEl={notificationAnchor}
      open={Boolean(notificationAnchor)}
      onClose={handleMenuClose}
      TransitionComponent={Fade}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          width: 320,
          maxHeight: 400,
          borderRadius: 2,
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Typography variant="subtitle1" sx={{ p: 2 }}>Notifications</Typography>
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">No new notifications</Typography>
      </Box>
    </Menu>
  );

  // Mobile drawer content
  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2, 
        justifyContent: 'space-between',
        backgroundColor: 'primary.main',
        color: 'white'
      }}>
        <Typography variant="h6" fontWeight="bold" letterSpacing={1}>
          Societyy
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      {user && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: 'primary.main',
              mr: 2
            }}
          >
            {getInitials(name)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">{name}</Typography>
            <Typography variant="body2" color="text.secondary">Member</Typography>
          </Box>
        </Box>
      )}
      
      <Divider />
      
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem 
              key={item.text} 
              component={Link} 
              to={item.path}
              onClick={handleDrawerToggle}
              disablePadding
              sx={{
                display: 'block',
                my: 0.5,
                mx: 1,
                borderRadius: 2,
                overflow: 'hidden',
                color: isActive ? 'primary.main' : 'text.primary',
                backgroundColor: isActive ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                transition: 'all 0.2s',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                px: 2, 
                py: 1.5,
                alignItems: 'center'
              }}>
                <ListItemIcon 
                  sx={{ 
                    color: 'inherit', 
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 600 : 400 
                  }}
                />
                {isActive && (
                  <Box sx={{ 
                    width: 4, 
                    height: 36, 
                    borderRadius: 1, 
                    bgcolor: 'primary.main',
                    position: 'absolute',
                    right: 0
                  }} />
                )}
              </Box>
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="caption" color="text.secondary">
          &copy; {new Date().getFullYear()} Societyy
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ElevationScroll>
        <AppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ height: 70 }}>
              {/* Mobile hamburger icon */}
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2, 
                  display: { md: 'none' },
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              
              {/* Logo - always visible */}
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 700,
                  letterSpacing: 1,
                  background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mr: isSmall ? 0 : 3,
                  flexGrow: { xs: 1, md: 0 },
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s',
                }}
              >
                Societyy
              </Typography>

              {/* Desktop menu items */}
              <Box sx={{ 
                flexGrow: 1, 
                display: { xs: 'none', md: 'flex' }, 
                justifyContent: 'center' 
              }}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Button
                      key={item.text}
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        color: 'white',
                        mx: 1,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        position: 'relative',
                        fontWeight: isActive ? 600 : 400,
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 8,
                          left: '50%',
                          width: isActive ? '30%' : '0%',
                          height: '3px',
                          backgroundColor: 'primary.light',
                          borderRadius: '3px',
                          transition: 'all 0.3s',
                          transform: 'translateX(-50%)',
                        },
                        '&:hover::after': {
                          width: '30%',
                        },
                      }}
                    >
                      {item.text}
                    </Button>
                  );
                })}
              </Box>

              {/* Action buttons - always visible */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Notifications button */}
                <Tooltip title="Notifications">
                  <IconButton 
                    onClick={handleNotificationClick}
                    color="inherit"
                    sx={{ 
                      '&:hover': { 
                        transform: 'scale(1.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'  
                      },
                      transition: 'transform 0.2s',
                      display: { xs: 'none', sm: 'flex' }
                    }}
                  >
                    <Badge badgeContent={0} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* Profile button */}
                <Tooltip title="Account">
                  <IconButton
                    edge="end"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    sx={{ 
                      '&:hover': { 
                        transform: 'scale(1.05)',
                      },
                      transition: 'transform 0.2s',
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 35, 
                        height: 35, 
                        bgcolor: 'primary.light',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {getInitials(name)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            borderRadius: '0 16px 16px 0',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {renderProfileMenu}
      {notificationMenu}
      <Toolbar sx={{ height: 70 }} />
    </Box>
  );
};

export default NavBar;