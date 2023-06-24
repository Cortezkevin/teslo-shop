import { tesloApi } from '@/api';
import { AuthLayout } from '@/components/layout';
import { AuthContext } from '@/context';
import { validations } from '@/utils';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
	name: string;
	email: string;
	password: string;
};
  
const RegisterPage: NextPage = () => {

	const { replace, query } = useRouter();
	const { registerUser } = useContext( AuthContext );
	const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
		mode: 'all'
	});
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const onRegisterUser = async ( { name, email, password }: FormData ) => {
		setShowError(false);
		/* const { hasError, message } = await registerUser(name, email, password );

		if( hasError ){
			setShowError(true);
			setTimeout(() => setShowError(false), 2000);
			setErrorMessage( message! );
			return;
		}

		replace(query.prevPage as string || '/');
 */
		signIn('credentials', { 
			name, email, password,
			redirect: true, 
			callbackUrl: query.prevPage as string || '/' 
		});
	}

  return (
    <AuthLayout title='Register'>
			<form onSubmit={ handleSubmit(onRegisterUser) }>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={ 12 }>
							<Typography variant='h1' component='h1'>Create Account</Typography>
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
								label='Name'
								variant='outlined'
								fullWidth
								{ 
									...register('name', { 
										required: 'Name is required'
									}) 								
								}
								error={ !!errors.name }
								helperText={ errors.name?.message }
							/>
						</Grid>
						<Grid item xs={ 12 }>
							<TextField 
								type='email'
								label='email' 
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
											required: 'Password is required'
										}) 
									}
									error={ !!errors.password }
									helperText={ errors.password?.message }
							/>
						</Grid>
						<Grid item xs={ 12 }>
							<Button 
								type='submit'
								color='secondary'
								className='circular-btn'
								size='large'
								fullWidth
							>
								Register
							</Button>
						</Grid>
						<Grid item xs={ 12 } display='flex' justifyContent='end'>
							<NextLink 
								legacyBehavior 
								passHref 
								href={`/auth/login${ query.prevPage ? `?prevPage=${query.prevPage}` : '' }`}
							>
								<Link>
									<Typography variant='body2'>I have an account</Typography>
								</Link>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

	const session = await getSession({ req });
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

export default RegisterPage