import { ShopLayout } from "@/components/layout"
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";
import { Chip, Grid, Link, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import NextLink from 'next/link';

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 100 },	
	{ field: 'fullname', headerName: 'Full Name', width: 300 },
	{ 
		field: 'paid', 
		headerName: 'Paid',
		description: 'Show info if paid or not',
		width: 200,
		renderCell: ( params: GridRenderCellParams ) => {
			return (
				params.row.paid
					? <Chip color="success" label='Paid' variant="outlined" />
					: <Chip color="error" label="No Paid" variant="outlined" />
			)
		}  
	},
	{ 
		field: 'order_id', 
		headerName: 'Show Order',
		width: 200,
		renderCell: ( params: GridRenderCellParams ) => {
			return (
				<NextLink legacyBehavior passHref href={`/orders/${params.row.order_id}`}>
					<Link underline="hover">
						<Typography color='secondary' >{ params.row.order_id }</Typography>
					</Link>
				</NextLink>
			)
		} 
	}
];

interface Props {
	orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

	const rows = orders.map((o, i) => ({ 
		id: i + 1, 
		order_id: o._id,
		paid: o.isPaid,
		fullname: o.shippingAddress.name + " " + o.shippingAddress.lastName
	}));

  return (
    <ShopLayout title="History Order Page" pageDescription="Order History">
			<Typography variant='h1' component='h1'>Order History</Typography>
			<Grid sx={{ mt: 2 }} container className="fadeIn">
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid 
						rows={ rows }
						columns={ columns }
						pageSizeOptions={[10]}
						
					/>
				</Grid>
			</Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session: any = await getSession({ req });

	if(!session){
		return {
			redirect: {
				destination: '/auth/login?prevPage=/orders/history',
				permanent: false
			}
		}
	}

	const orders = await dbOrders.getOrdersByUser( session.user.id );
	
	return {
		props:{
			orders
		}
	}
}

export default HistoryPage  