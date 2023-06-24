import { GetServerSideProps, NextPage } from "next";
import { AdminLayout } from "@/components/layout";
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material";
import { CartList, OrderSummary } from "@/components/cart";
import { ConfirmationNumberOutlined, CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";
import { useRouter } from "next/router";

interface Props {
	order: IOrder
}

const OrderDetailPage: NextPage<Props> = ({ order }) => {

	const { shippingAddress, orderItems, numberOfItems, total, subTotal, tax } = order;

  return (
    <AdminLayout 
      title="Order Summary" 
      subTitle={`OrderId: ${order._id}`}
      icon={ <ConfirmationNumberOutlined /> }
    >
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
								  numberOfItems,
                  subTotal, tax, total
							  }}
              />
              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
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
              </Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	const { id = '' } = query;
	const order = await dbOrders.getOrderById( id.toString() );

	if( !order ){
		return {
			redirect: {
				destination: `/admin/orders`,
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

export default OrderDetailPage