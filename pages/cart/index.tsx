import { CartList, OrderSummary } from "@/components/cart"
import { ShopLayout } from "@/components/layout"
import { CartContext } from "@/context"
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"

const CartPage: NextPage = () => {

	const { isLoaded, cart } = useContext( CartContext );
	const router = useRouter();

	useEffect(() => {
		if(isLoaded && cart.length === 0){
			router.replace('/cart/empty');
		}
	},[ isLoaded, cart, router ]);

	if( !isLoaded || cart.length === 0){
		return <></>
	}

  return (
    <ShopLayout title="Cart" pageDescription='Shopping Cart'>
			<Typography variant='h1' component='h1'>Cart</Typography>
			<Grid container spacing={ 2 } sx={{ mt: 2 }}>
				<Grid item xs={ 12 } md={ 7 } sm={ 12 }>
					<CartList editable />
				</Grid>
				<Grid item xs={ 12 } md={ 5 } sm={ 12 }>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">Order</Typography>
							<Divider sx={{ my: 1 }} />
							<OrderSummary />
							<Box sx={{ mt: 3 }}>
								<Button 
									color='secondary' 
									className="circular-btn" 
									fullWidth 
									href='/checkout/address'
								>
									Checkout
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
    </ShopLayout>
  )
}

export default CartPage