import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { getPublicPath } from '../envConfig';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Chat,
  Description,
  CloudUpload,
  Person,
  Work,
  Analytics,
  AccountCircle,
  ExitToApp,
  Warning,
  Folder,
  Logout,
  Settings
} from '@mui/icons-material';
import './Header.css';


const Header = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const publicPath = getPublicPath();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  // Check if in bypass mode
  const bypassMode = sessionStorage.getItem('bypass_auth') === 'true';

  // Helper function to get user initials
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (bypassMode) return 'Deepak Singh';
    return accounts[0]?.name || accounts[0]?.username || 'User';
  };

  // Helper function to get user email
  const getUserEmail = () => {
    if (bypassMode) return 'deepak.singh@nitor.infortech.com';
    return accounts[0]?.username || '';
  };
  
  const handleLogin = () => {
    // Clear any existing session data that might be causing issues
    sessionStorage.removeItem('msal_login_error');
    localStorage.removeItem('msal.interaction.status');
    
    // Store origin for after login completed
    sessionStorage.setItem('loginRedirectOrigin', window.location.href);
    
    instance.loginRedirect(loginRequest)
      .catch(error => {
        console.error("Login error:", error);
        sessionStorage.setItem('msal_login_error', JSON.stringify({
          message: error.message || "Login failed",
          timestamp: new Date().toISOString()
        }));
      });
  };

  const handleLogout = () => {
    // Clear any application state here before logout
    sessionStorage.removeItem('msal_login_error');
    sessionStorage.removeItem('msal_return_url');
    
    const logoutRequest = {
      account: instance.getActiveAccount(),
      postLogoutRedirectUri: window.location.origin + publicPath,
      authority: instance.getConfiguration().auth.authority
    };
    
    instance.logoutRedirect(logoutRequest)
      .catch(error => console.error("Logout error:", error));
  };

  // Handle exiting bypass mode
  const handleExitBypass = () => {
    sessionStorage.removeItem('bypass_auth');
    console.log("Exiting bypass mode");
    navigate('/login', { replace: true });
  };

  // Check if the current path is one of the MCP paths
  const isMCPPath = ['/mcp-chat', '/mcp-tools', '/mcp-analytics'].includes(location.pathname);

  // Show navigation if authenticated normally OR in bypass mode
  const showNavigation = isAuthenticated || bypassMode;

  const navigationItems = [
    { path: '/documents', label: 'Document Library', icon: <Folder /> },
    { path: '/document-chat', label: 'Research Chat', icon: <Description /> },
    { path: '/chatbot', label: 'AI Assistant', icon: <Chat /> },
    { path: '/upload', label: 'Upload Documents', icon: <CloudUpload /> },
    { path: '/file-list', label: 'Manage Files', icon: <Person /> },
  ];

  const mcpItems = [
    { path: '/mcp-chat', label: 'Advanced Research', icon: <Work /> },
    { path: '/mcp-tools', label: 'Research Tools', icon: <Dashboard /> },
    { path: '/mcp-analytics', label: 'Document Analytics', icon: <Analytics /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const isActive = (path) => location.pathname === path;

  const renderNavigationItem = (item) => (
    <ListItemButton
      key={item.path}
      component={Link}
      to={item.path}
      selected={isActive(item.path)}
      onClick={() => setMobileOpen(false)}
      className="nav-item-material"
      sx={{
        borderRadius: 2,
        mx: 1,
        my: 0.5,
        height: 48,
        color: isActive(item.path) ? '#1e293b' : '#e2e8f0',
        backgroundColor: isActive(item.path) ? '#f1f5f9' : 'transparent',
        fontWeight: isActive(item.path) ? 600 : 500,
        fontSize: '0.875rem',
        '&:hover': {
          backgroundColor: '#f8fafc',
          color: '#1e293b',
          transform: 'translateX(4px)',
        },
        '&.Mui-selected': {
          backgroundColor: '#f1f5f9',
          color: '#1e293b',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      }}
    >
      <ListItemIcon sx={{ 
        color: 'inherit', 
        minWidth: 40,
        '& .MuiSvgIcon-root': {
          fontSize: '1.25rem'
        }
      }}>
        {item.icon}
      </ListItemIcon>
      <ListItemText 
        primary={item.label} 
        primaryTypographyProps={{
          fontWeight: 'inherit',
          fontSize: '0.875rem'
        }}
      />
    </ListItemButton>
  );

  const renderDesktopNavigation = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          component={Link}
          to={item.path}
          startIcon={item.icon}
          variant="text"
          size="medium"
          sx={{
            mx: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: isActive(item.path) ? 600 : 500,
            color: isActive(item.path) ? '#1e293b' : '#e2e8f0',
            backgroundColor: isActive(item.path) ? '#f1f5f9' : 'transparent',
            height: 40,
            minWidth: 120,
            padding: '8px 16px',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
            '& .MuiButton-startIcon': {
              color: isActive(item.path) ? '#1e293b' : '#e2e8f0',
              marginRight: 1,
            },
            '&:hover .MuiButton-startIcon': {
              color: '#1e293b',
            }
          }}
        >
          {item.label}
        </Button>
      ))}
      
      <Button
        onClick={handleMenuOpen}
        startIcon={<Dashboard />}
        variant="text"
        size="medium"
        sx={{
          mx: 1,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: isMCPPath ? 600 : 500,
          color: isMCPPath ? '#1e293b' : '#64748b',
          backgroundColor: isMCPPath ? '#f1f5f9' : 'transparent',
          height: 40,
          minWidth: 120,
          padding: '8px 16px',
          fontSize: '0.875rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#f8fafc',
            color: '#1e293b',
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
          '& .MuiButton-startIcon': {
            color: isMCPPath ? '#1e293b' : '#64748b',
            marginRight: 1,
          },
          '&:hover .MuiButton-startIcon': {
            color: '#1e293b',
          }
        }}
      >
        Research Tools
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          }
        }}
      >
        {mcpItems.map((item) => (
          <MenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleMenuClose}
            selected={isActive(item.path)}
            sx={{
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'secondary.50',
                color: 'secondary.main',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );

  const renderMobileNavigation = () => (
    <Drawer
      variant="temporary"
      anchor="left"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box', 
          width: 280,
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: '#1e293b',
          fontSize: '1.25rem'
        }}>
          Research Assistant
        </Typography>
      </Box>
      <Divider sx={{ borderColor: '#e2e8f0' }} />
      <List>
        {navigationItems.map(renderNavigationItem)}
        <Divider sx={{ my: 1, borderColor: '#e2e8f0' }} />
        <ListItem>
          <ListItemText 
            primary="Research Tools" 
            primaryTypographyProps={{ 
              variant: 'subtitle2', 
              color: '#64748b',
              fontWeight: 600,
              fontSize: '0.875rem'
            }} 
          />
        </ListItem>
        {mcpItems.map(renderNavigationItem)}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'white',
          borderBottom: '2px solid #e2e8f0',
          color: 'text.primary',
          borderRadius: 0,
        }}
      >
        <Toolbar>
          {showNavigation && isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 0, 
              fontWeight: 700,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '1.5rem'
            }}
          >
            Research AI Assistant
            {bypassMode && (
              <Chip
                icon={<Warning />}
                label="STATIC MODE"
                color="warning"
                size="small"
                sx={{ 
                  ml: 1,
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'inherit' }
                }}
              />
            )}
          </Typography>

          {showNavigation && !isMobile && renderDesktopNavigation()}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            {(bypassMode || isAuthenticated) ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ 
                    color: '#ffffff', 
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    display: { xs: 'none', sm: 'block' }
                  }}>
                    {getUserDisplayName()}
                  </Typography>
                  <IconButton
                    onClick={handleUserMenuOpen}
                    sx={{
                      p: 0,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: bypassMode ? '#f59e0b' : '#3b82f6',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1rem',
                        border: '2px solid #e2e8f0',
                        '&:hover': {
                          borderColor: bypassMode ? '#f59e0b' : '#3b82f6',
                        }
                      }}
                    >
                      {getUserInitials(getUserDisplayName())}
                    </Avatar>
                  </IconButton>
                </Box>
                
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      boxShadow: theme.shadows[8],
                      minWidth: 200,
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#ffffff' }}>
                      {getUserDisplayName()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#ffffff ' }}>
                      {getUserEmail()}
                    </Typography>
                  </Box>
                  {bypassMode && (
                    <>
                      <MenuItem
                        onClick={() => {
                          handleUserMenuClose();
                          handleExitBypass();
                        }}
                        sx={{
                          borderRadius: 1,
                          mx: 1,
                          my: 0.5,
                          color: '#f59e0b',
                          '&:hover': {
                            backgroundColor: '#fef3c7',
                            color: '#d97706',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                          <ExitToApp />
                        </ListItemIcon>
                        Exit Static Mode
                      </MenuItem>
                      <Divider sx={{ my: 1 }} />
                    </>
                  )}
                  <MenuItem
                    onClick={handleUserMenuClose}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: '#64748b', minWidth: 36 }}>
                      <Settings />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  {!bypassMode && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <MenuItem
                        onClick={() => {
                          handleUserMenuClose();
                          handleLogout();
                        }}
                        sx={{
                          borderRadius: 1,
                          mx: 1,
                          my: 0.5,
                          color: '#dc2626',
                          '&:hover': {
                            backgroundColor: '#fef2f2',
                            color: '#b91c1c',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                          <Logout />
                        </ListItemIcon>
                        Sign Out
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                size="medium"
                onClick={handleLogin}
                startIcon={<AccountCircle />}
                sx={{
                  borderColor: '#cbd5e1',
                  color: '#64748b',
                  fontWeight: 500,
                  borderRadius: 2,
                  height: 40,
                  minWidth: 120,
                  fontSize: '0.875rem',
                  '&:hover': {
                    borderColor: '#94a3b8',
                    backgroundColor: '#f8fafc',
                    color: '#1e293b',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {showNavigation && renderMobileNavigation()}
    </>
  );
};

export default Header; 