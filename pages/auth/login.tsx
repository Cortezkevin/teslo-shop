import { AuthLayout } from '@/components/layout';
import { validations } from '@/utils';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, signIn, getProviders } from 'next-auth/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string,
  password: string,
};

const LoginPage: NextPage = () => {

	const { replace, query } = useRouter();

	const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({ mode: 'all' });
	const [showError, setShowError] = useState(false);
	const [providers, setProviders] = useState<any>({});

	useEffect(() => {
		(async() => {
			await getProviders().then( prov => {
				setProviders( prov );
			});
		})();
	}, []);

	const onLoginUser = async ( { email, password }: FormData ) => {
		setShowError(false);
		/* signIn('credentials', { 
			email, password,
			redirect: true, 
			callbackUrl: query.prevPage as string || '/'
		});	 */
		signIn('credentials', {
			email, password
		});
	}
	
  return (
    <AuthLayout title='Login'>
			<form onSubmit={ handleSubmit(onLoginUser) } noValidate>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={ 12 }>
							<Typography variant='h1' component='h1'>Login</Typography>
							<Chip
								label='Invalid Credentials'
								variant='outlined'
								icon={ <ErrorOutline /> }
								className='fadeIn'
								color='error'
								sx={{ display: showError ? 'flex' : 'none'}}
							/>
						</Grid>
						<Grid item xs={ 12 }>
							<TextField
								type='email'
								label='Email'
								variant='outlined'
								fullWidth
								{ 
									...register('email', {
										required: 'Email is required',
										validate: validations.isEmail
									})
								}
								error={ !!errors.email }
								helperText={ errors.email?.message }
							/>
						</Grid>
						<Grid item xs={ 12 }>
							<TextField
								label='Password'
								type='password'
								variant='outlined'
								fullWidth
								{
									...register('password', {
										required: 'Password is required',
										minLength: {
											value: 6,
											message: 'This field must be 6 characters'
										}
									})
								}
								error={ !!errors.password }
								helperText={ errors.password?.message }
							/>
						</Grid>
						<Grid item xs={ 12 }>
							<Button
								color='secondary'
								className='circular-btn'
								size='large'
								fullWidth
								type='submit'
							>
								Login
							</Button>
						</Grid>
						<Grid item xs={ 12 } display='flex' justifyContent='end'>
							<NextLink 
								legacyBehavior 
								passHref 
								href={`/auth/register${ query.prevPage ? `?prevPage=${query.prevPage}` : '' }`}
							>
								<Link>
									<Typography variant='body2'>Not have an account</Typography>
								</Link>
							</NextLink>
						</Grid>
						<Grid item xs={ 12 } display='flex' justifyContent='end'>
							<Divider sx={{ width: '100%', mb: 2 }} />
						</Grid>
						<Grid item xs={ 12 } display='flex' flexDirection='column' justifyContent='end'>
							{
								Object.values( providers ).map((prov: any) => {
									if( prov.id === 'credentials' ) return (<div key='credentials'></div>)
									return (
										<Button
											key={ prov.id }
											variant='outlined'
											fullWidth
											color='primary'
											sx={{ mb: 1 }}
											onClick={() => signIn(prov.id)}
										>
											{ prov.name }
										</Button>
									)
								})
							}
						</Grid>
					</Grid>
				</Box>
			</form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

	const session = await getSession({ req });
	console.log("SESSION DE USUARIO", session);
	console.log("TIENE SESSION: ", session !== null);
	const { prevPage = '/' } = query;

	if( session ) {
		return {
			redirect: {
				destination: prevPage.toString(),
				permanent: false
			}
		}
	}

	return {
		props:{}
	}
}

export default LoginPage