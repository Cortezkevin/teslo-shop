import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  DashboardOutlined,
  EscalatorWarningOutlined,
  FemaleOutlined,
  LoginOutlined,
  MaleOutlined,
  SearchOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import { useContext, useState } from "react";
import { AuthContext, UIContext } from "@/context";
import { useRouter } from "next/router";

export const SideMenu = () => {

  const { push, asPath } = useRouter();
  const { isMenuOpen, toggleSideMenu } = useContext( UIContext );  
  const { user, isLogged, logout } = useContext( AuthContext );  

  const [searchTerm, setSearchTerm] = useState('');

  const onSearchTerm = () => {
    if( searchTerm.trim().length === 0 ) return ;
    navigateTo(`/search/${ searchTerm }`);
  }

  const navigateTo = ( url: string ) => {
    toggleSideMenu( false );
    push( url );
  }

  return (
    <Drawer
      open={ isMenuOpen }
      anchor="right"
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
      onClose={() => toggleSideMenu( false )}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              autoFocus
              value={ searchTerm }
              onChange={ (e) => setSearchTerm(e.target.value) }
              type="text"
              placeholder="Search..."
              onKeyDown={ (e) => e.key === 'Enter' ? onSearchTerm() : null}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => onSearchTerm()}
                  >
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {
            isLogged && 
            (
              <>
                <ListItem button>
                  <ListItemIcon>
                    <AccountCircleOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Profile"} />
                </ListItem>

                <ListItem button onClick={() => navigateTo('/orders/history')}>
                  <ListItemIcon>
                    <ConfirmationNumberOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"My Orders"} />
                </ListItem>
              </>
            )
          }

          <ListItem 
            button 
            sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo('/category/men')}
          >
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Mens"} />
          </ListItem>

          <ListItem 
            button 
            sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo('/category/women')}
          >
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Women"} />
          </ListItem>

          <ListItem 
            button 
            sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo('/category/kid')}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={"Kids"} />
          </ListItem>
          
          {
            isLogged 
            ? (
              <ListItem button onClick={ logout }>
                <ListItemIcon>
                  <LoginOutlined />
                </ListItemIcon>
                <ListItemText primary={"Logout"} />
              </ListItem>
            )
            : (
              <ListItem button onClick={() => push(`/auth/login?prevPage=${asPath}`)}>
                <ListItemIcon>
                  <VpnKeyOutlined />
                </ListItemIcon>
                <ListItemText primary={"Log In"} />
              </ListItem>
            )
          }

          {/* Admin */}
          {
            isLogged && user?.role === 'admin' 
            && (
              <>
                <Divider />
                <ListSubheader>Admin Panel</ListSubheader>
                <ListItem button onClick={() => navigateTo('/admin')}>
                  <ListItemIcon>
                    <DashboardOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Dashboard"} />
                </ListItem>
                <ListItem button onClick={() => navigateTo('/admin/products')}>
                  <ListItemIcon>
                    <CategoryOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Products"} />
                </ListItem>
                <ListItem button onClick={() => navigateTo('/admin/orders')}>
                  <ListItemIcon>
                    <ConfirmationNumberOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Orders"} />
                </ListItem>

                <ListItem button onClick={() => navigateTo('/admin/users')}>
                  <ListItemIcon>
                    <AdminPanelSettings />
                  </ListItemIcon>
                  <ListItemText primary={"Users"} />
                </ListItem>
              </>
            )
          }
        </List>
      </Box>
    </Drawer>
  );
};
