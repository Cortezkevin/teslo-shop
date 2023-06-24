import { GetServerSideProps, NextPage } from "next";
import { ShopLayout } from "@/components/layout";
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { CartList, OrderSummary } from "@/components/cart";
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { dbOrders } from "@/database";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { IOrder } from "@/interfaces";
import { getToken } from "next-auth/jwt";
import { tesloApi } from "@/api";
import { useRouter } from "next/router";
import { useState } from "react";

type OrderResponseBody = {
	id: string;
	status: 
		| "CREATED"
		| "SAVED"
		| "APPROVED"
		| "VOIDED"
		| "COMPLETED"
		| "PAYER_ACTION_REQUIRED";
}

interface Props {
	order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
	
	const router = useRouter();
	const [isPaying, setIsPaying] = useState(false);
	const { shippingAddress, orderItems, numberOfItems, total, subTotal, tax } = order;

	const onOrderCompleted = async ( details: OrderResponseBody ) => {
		if( details.status !== 'COMPLETED' ){
			return alert('Not paid in paypal');
		}

		setIsPaying( true );

		try {
			const { data } = await tesloApi.post(`/orders/pay`, {
				transactionId: details.id,
				orderId: order._id
			});

			alert(data.message);
			router.reload();
		} catch (error) {
			setIsPaying( false );
			console.log(error);
		}
	}

  return (
    <ShopLayout title="Order Summary" pageDescription='Order Summary'>
			<Typography variant='h1' component='h1'>Order: { order._id }</Typography>
			{
				order.isPaid
				? (
					<Chip
						sx={{ my: 2 }}
						label='Order Paied'
						variant="outlined"
						color='success'
						icon={ <CreditScoreOutlined /> }
					/>
				)
				: (
					<Chip
						sx={{ my: 2 }}
						label='Pending payment'
						variant="outlined"
						color='error'
						icon={ <CreditCardOffOutlined /> }
					/>
				)
			}
			<Grid container spacing={ 2 } sx={{ mt: 2 }} className="fadeIn">
				<Grid item xs={ 12 } md={ 7 } sm={ 12 }>
					<CartList products={ orderItems } />
				</Grid>
				<Grid item xs={ 12 } md={ 5 } sm={ 12 }>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">Summary</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent='space-between' alignItems='center'>
								<Typography variant='subtitle1'>Delivery address</Typography>
							</Box>
							
							<Typography>{ shippingAddress.name } { shippingAddress.lastName }</Typography>
							<Typography>{ shippingAddress.address } { shippingAddress.address_2 ? `, ${shippingAddress.address_2}`: ''}</Typography>
							<Typography>{ shippingAddress.city }, { shippingAddress.postalCode }</Typography>
							<Typography>{ shippingAddress.country }</Typography>

							<Divider sx={{ my:1 }} />

							<Box display='flex' justifyContent='space-between' alignItems='center'>
								<Typography variant='subtitle1'>Order Total</Typography>
							</Box>

							<OrderSummary orderSummary={{
								numberOfItems, subTotal, tax, total
							}}  />
							<Box
								display='flex'
								justifyContent='center'
								className='fadeIn'
								sx={{ mt: 3, display: isPaying ? 'flex' : 'none' }}
							>
								<CircularProgress />
							</Box>
							<Box sx={{ mt: 3, display: isPaying ? 'none' : 'flex', flex: 1, flexDirection: 'column' }}>
                {
									order.isPaid
									? (
										<Chip
											sx={{ my: 2 }}
											label='Order Paied'
											variant="outlined"
											color='success'
											icon={ <CreditScoreOutlined /> }
										/>
									)
									: (
										<PayPalButtons
											createOrder={(data, actions) => {
												return actions.order.create({
													purchase_units: [
														{
															amount: {
																value: `${order.total}`,
															},
														},
													],
												});
										}}
										onApprove={(data, actions) => {
											return actions.order!.capture().then((details) => {
												onOrderCompleted( details );
											});
										}}
										/>
									)
								}
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const { id = '' } = query;
	const session: any = await getToken({ req });

	if( !session ){
		return {
			redirect: {
				destination: `/auth/login?prevPage=/orders/${id}`,
				permanent: false
			}
		}
	}

	const order = await dbOrders.getOrderById( id.toString() );

	if( !order ){
		return {
			redirect: {
				destination: `/orders/history`,
				permanent: false
			}
		}
	}

	if( order.user !== session.user.id ){
		return {
			redirect: {
				destination: `/orders/history`,
				permanent: false
			}
		}
	}

	return {
		props:{
			order
		}
	}
}

export default OrderPage