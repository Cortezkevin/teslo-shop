import { NextPage } from "next";
import NextLink from 'next/link';
import { ShopLayout } from "@/components/layout";
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from "@mui/material";
import { CartList, OrderSummary } from "@/components/cart";

const SummaryPage: NextPage = () => {
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
							
							<Typography>Kevin Cortez</Typography>
							<Typography>231 asd</Typography>
							<Typography>South Park</Typography>
							<Typography>EE.UU</Typography>

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
							<Box sx={{ mt: 3 }}>
								<Button color='secondary' className="circular-btn" fullWidth>
									Confirm Order
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
    </ShopLayout>
  )
}

export default SummaryPage