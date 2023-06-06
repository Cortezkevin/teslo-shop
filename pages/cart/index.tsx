import { CartList, OrderSummary } from "@/components/cart"
import { ShopLayout } from "@/components/layout"
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material"
import { NextPage } from "next"

const CartPage: NextPage = () => {
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
								<Button color='secondary' className="circular-btn" fullWidth>
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