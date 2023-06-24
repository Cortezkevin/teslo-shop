import { AdminLayout } from '@/components/layout';
import { IOrder, IUser } from '@/interfaces';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { NextPage } from 'next';
import useSWR from 'swr';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID', width: 250 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'name', headerName: 'Full Name', width: 200 },
  { field: 'total', headerName: 'Total Amount', align: 'center', width: 100 },
  {
    field: 'isPaid',
    headerName: 'Paid',
    align: 'center',
    renderCell({ row }: GridRenderCellParams) {
      return row.isPaid
            ? <Chip variant='outlined' label='Paid' color='success' />
            : <Chip variant='outlined' label='Pending' color='error' />
    }
  },
  { field: 'noProducts', headerName: 'No. Products', align: 'center' },
  {
    field: 'check',
    headerName: 'View Order',
    renderCell({ row }: GridRenderCellParams) {
      return (
        <a href={`/admin/orders/${row.id}`} target='_blank'>View Order</a>
      )
    }
  },
  { field: 'createdAt', headerName: 'Created At', align: 'center', width: 250 },
]

const OrdersPage: NextPage = () => {

  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if( !data && !error ) return <></>

  const rows = data!.map( orders => ({
    id: orders._id,
    email: (orders.user as IUser).email,
    name: (orders.user as IUser).name,
    total: orders.total,
    isPaid: orders.isPaid,
    noProducts: orders.numberOfItems,
    createdAt: orders.createdAt
  }));

  return (
    <AdminLayout
      title='Orders'
      subTitle='Maintenance of Orders'
      icon={ <ConfirmationNumberOutlined /> }
    >
      <Grid sx={{ mt: 2 }} container className="fadeIn">
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid 
						rows={ rows }
						columns={ columns }
						pageSizeOptions={[10]}
					/>
				</Grid>
			</Grid>
    </AdminLayout>
  )
}

export default OrdersPage;