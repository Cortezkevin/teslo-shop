import { SummaryTile } from '@/components/admin';
import { AdminLayout } from '@/components/layout';
import { DashboardSummaryResponse } from '@/interfaces';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const DashboardPage: NextPage = () => {

  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard',{
    refreshInterval: 40 * 1000
  });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 );
    }, 1000);
    return () => {
      clearInterval( interval )
    }
  }, []);

  if( !error && !data ){
    return <></>;
  }

  if( error ){
    console.log(error);
    return <Typography>Error al cargar la data</Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInvetory
  } = data!;

  return (
    <AdminLayout
      title='Dashboard'
      subTitle='General Statistics'
      icon={ <DashboardOutlined /> }
    >
      <Grid container spacing={ 2 }>
        <SummaryTile
          title={ numberOfOrders }
          subTitle='Total Orders'
          icon={ <CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTile
          title={ paidOrders }
          subTitle='Paid Orders'
          icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} /> }
        />
        <SummaryTile
          title={ notPaidOrders }
          subTitle='Pending Orders'
          icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }}/> }
        />
        <SummaryTile
          title={ numberOfClients }
          subTitle='Clients'
          icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }}/> }
        />
        <SummaryTile
          title={ numberOfProducts }
          subTitle='Products'
          icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }}/> }
        />
        <SummaryTile
          title={ productsWithNoInventory }
          subTitle='Out of Stock'
          icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }}/> }
        />
        <SummaryTile
          title={ lowInvetory }
          subTitle='Low inventory'
          icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }}/> }
        />
        <SummaryTile
          title={ refreshIn }
          subTitle='Updated in...'
          icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }}/> }
        />
      </Grid>
    </AdminLayout>
  )
}

export default DashboardPage