import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '@/components/layout';

import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';

import { FullScreenLoading } from '../../components/ui';

const WomenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=women');

  return (
    <ShopLayout title={'Teslo-Shop - Women'} pageDescription={'Encuentra los mejores productos de Teslo para ellas'}>
        <Typography variant='h1' component='h1'>Women</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Products for she</Typography>
        {
          isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products } />
        }
    </ShopLayout>
  )
}

export default WomenPage