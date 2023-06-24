import NextLink from 'next/link';
import { AppBar, Link, Toolbar, Badge, Typography, Box, Button, IconButton, Input, InputAdornment } from "@mui/material";
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'

import { FC, useContext, useState } from "react";
import { useRouter } from 'next/router';
import { CartContext, UIContext } from '@/context';

interface Props {    
}

export const Navbar: FC<Props> = () => {

	const { toggleSideMenu } = useContext( UIContext );
	const { details: { numberOfItems } } = useContext( CartContext );

	const { pathname, push } = useRouter();

	const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if( searchTerm.trim().length === 0 ) return ;
    push(`/search/${ searchTerm }`);
    toggleSideMenu( false );
  }

  return (
    <AppBar>
			<Toolbar>
				<NextLink legacyBehavior href={'/'} passHref>
					<Link display='flex' alignItems='center'>
						<Typography variant='h6'>
							Teslo | 
						</Typography>
						<Typography sx={{ marginLeft: 0.5 }}>
							Shop 
						</Typography>
					</Link>
				</NextLink>

				<Box flex={1} />

				<Box className='fadeIn' sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}>
					<NextLink legacyBehavior href={'/category/men'} passHref>
						<Link>
							<Button color={ pathname === '/category/men' ? 'secondary' : 'info' }>Men</Button>
						</Link>
					</NextLink>
					<NextLink legacyBehavior href={'/category/women'} passHref>
						<Link>
							<Button color={ pathname === '/category/women' ? 'secondary' : 'info'}>Women</Button>
						</Link>
					</NextLink>
					<NextLink legacyBehavior href={'/category/kid'} passHref>
						<Link>
							<Button color={ pathname === '/category/kid' ? 'secondary' : 'info'}>Kid</Button>
						</Link>
					</NextLink>
				</Box>

				<Box flex={1} />

        {
          isSearchVisible
            ? (
              <Input
              sx={{ display: { xs: 'none', sm: 'flex' } }}
                className='fadeIn'
                autoFocus
                value={ searchTerm }
                onChange={ (e) => setSearchTerm(e.target.value) }
                type="text"
                placeholder="Search..."
                onKeyDown={ (e) => e.key === 'Enter' ? onSearchTerm() : null}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSearchTerm('');
                        setIsSearchVisible(false);
                      }}
                    >
                      <ClearOutlined />
                    </IconButton>
                  </InputAdornment>
                }
              />
            )
            : (
              <IconButton 
                onClick={() => setIsSearchVisible(true)}
                className='fadeIn'
                sx={{ display: { xs: 'none', sm: 'flex' }}}
              >
                <SearchOutlined />
              </IconButton>
            )
        }
				

				<IconButton
					sx={{ display: { xs: 'flex', sm: 'none' }}}
					onClick={ () => toggleSideMenu( true ) }
				>
					<SearchOutlined />
				</IconButton>

				<NextLink legacyBehavior href={'/cart'} passHref>
					<Link>
						<IconButton>
							<Badge badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color='secondary'>
								<ShoppingCartOutlined />
							</Badge>
						</IconButton>
					</Link>
				</NextLink>

				<Button color='info' onClick={() => toggleSideMenu( true )}>
					Menu
				</Button>
			</Toolbar>
    </AppBar>
  )
}
