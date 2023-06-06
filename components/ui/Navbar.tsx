import NextLink from 'next/link';
import { AppBar, Link, Toolbar, Badge, Typography, Box, Button, IconButton } from "@mui/material";
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'

import { FC } from "react";

interface Props {    
}

export const Navbar: FC<Props> = () => {
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

				<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
					<NextLink legacyBehavior href={'/category/men'} passHref>
						<Link>
							<Button>Men</Button>
						</Link>
					</NextLink>
					<NextLink legacyBehavior href={'/category/women'} passHref>
						<Link>
							<Button>Woman</Button>
						</Link>
					</NextLink>
					<NextLink legacyBehavior href={'/category/kid'} passHref>
						<Link>
							<Button>Kid</Button>
						</Link>
					</NextLink>
				</Box>

				<Box flex={1} />

				<IconButton>
					<SearchOutlined />
				</IconButton>

				<NextLink legacyBehavior href={'/cart'} passHref>
					<Link>
						<IconButton>
							<Badge badgeContent={2} color='secondary'>
								<ShoppingCartOutlined />
							</Badge>
						</IconButton>
					</Link>
				</NextLink>

				{/* <Button>
					Menu
				</Button> */}
			</Toolbar>
    </AppBar>
  )
}
