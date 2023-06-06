import { ShopLayout } from "@/components/layout"
import { Chip, Grid, Link, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
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

const rows = [
	{ id: 1, paid: false, fullname: 'Kevin Cortez', order_id: '1asdas15qw4ea167awd' },
	{ id: 2, paid: true, fullname: 'Dulce Rosales', order_id: '1a23da44qw4ea167awd' },
	{ id: 3, paid: false, fullname: 'Victor Martinez', order_id: '1a4das142345167awd' },
]

const HistoryPage = () => {
  return (
    <ShopLayout title="History Order Page" pageDescription="Order History">
			<Typography variant='h1' component='h1'>Order History</Typography>
			<Grid sx={{ mt: 2 }} container>
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

export default HistoryPage  