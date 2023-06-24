import NextLink from 'next/link';
import { AppBar, Link, Toolbar, Typography, Box, Button, IconButton, Input, InputAdornment } from "@mui/material";

import { FC, useContext } from "react";
import { useRouter } from 'next/router';
import { UIContext } from '@/context';

interface Props {
}

export const AdminNavbar: FC<Props> = () => {

	const { toggleSideMenu } = useContext( UIContext );
	const { query, push } = useRouter();

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

				<Button color='info' onClick={() => toggleSideMenu( true )}>
					Menu
				</Button>
			</Toolbar>
    </AppBar>
  )
}
