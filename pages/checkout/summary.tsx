import { NextPage } from "next";
import NextLink from 'next/link';
import { ShopLayout } from "@/components/layout";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import { CartList, OrderSummary } from "@/components/cart";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/context";
import { countries } from "@/utils/countries";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const SummaryPage: NextPage = () => {

	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState('');
	const [isPosting, setIsPosting] = useState(false);
	const { shippingAddress, createOrder  } = useContext( CartContext );

	useEffect(() => {
		if( !Cookies.get('address') ){
			router.push('/checkout/address');
		}
	}, [ router ]);

	if( !shippingAddress ){
		return <></>
	}

	const onCreateOrder = async () => {
		setIsPosting(true);
		const { hasError, message } = await	createOrder();
		if( hasError ){
			setIsPosting( false );
			setErrorMessage( message );
			return;
		}

		router.replace(`/orders/${message}`);
	}

  return (
    <ShopLayout title="Order Summary" pageDescription='Order Summary'>
			<Typography variant='h1' component='h1'>Summary</Typography>
			<Grid container spacing={ 2 } sx={{ mt: 2 }}>
				<Grid item xs={ 12 } md={ 7 } sm={ 12 }>
					<CartList />
				</Grid>
				<Grid item xs={ 12 } md={ 5 } sm={ 12 }>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">Summary</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent='space-between' alignItems='center'>
								<Typography variant='subtitle1'>Delivery address</Typography>
								<NextLink legacyBehavior href='/checkout/address' passHref>
									<Link underline="always">
										Edit Address
									</Link>
								</NextLink>
							</Box>
							
							<Typography>{`${shippingAddress?.name + ' ' + shippingAddress?.lastName}`}</Typography>
							<Typography>{ shippingAddress?.postalCode }</Typography>
							<Typography>{ shippingAddress?.city }</Typography>
							<Typography>{ countries.find(c => c.code === shippingAddress?.country)?.name }</Typography>

							<Divider sx={{ my:1 }} />

							<Box display='flex' justifyContent='space-between' alignItems='center'>
								<Typography variant='subtitle1'>Order Total</Typography>
								<NextLink legacyBehavior href='/cart' passHref>
									<Link underline="always">
										Edit Cart
									</Link>
								</NextLink>
							</Box>

							<OrderSummary />
							<Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
								<Button 
									color='secondary' 
									className="circular-btn" 
									fullWidth
									onClick={ onCreateOrder }
									disabled={ isPosting }
								>
									Confirm Order
								</Button>
								<Chip
									color='error'
									label={ errorMessage }
									sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
    </ShopLayout>
  )
}

export default SummaryPage