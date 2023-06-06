import { AuthLayout } from '@/components/layout';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { NextPage } from 'next';
import NextLink from 'next/link';

const LoginPage: NextPage = () => {
  return (
    <AuthLayout title='Login'>
			<Box sx={{ width: 350, padding: '10px 20px' }}>
				<Grid container spacing={2}>
					<Grid item xs={ 12 }>
						<Typography variant='h1' component='h1'>Login</Typography>
					</Grid>
					<Grid item xs={ 12 }>
						<TextField label='Email' variant='outlined' fullWidth />
					</Grid>
					<Grid item xs={ 12 }>
						<TextField label='Password' type='password' variant='outlined' fullWidth />
					</Grid>
					<Grid item xs={ 12 }>
						<Button color='secondary' className='circular-btn' size='large' fullWidth>
							Login
						</Button>
					</Grid>
					<Grid item xs={ 12 } display='flex' justifyContent='end'>
						<NextLink legacyBehavior passHref href='/auth/register'>
							<Link>
								<Typography variant='body2'>Not have an account</Typography>
							</Link>
						</NextLink>
					</Grid>
				</Grid>
			</Box>
    </AuthLayout>
  )
}

export default LoginPage