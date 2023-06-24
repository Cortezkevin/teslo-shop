import { ShopLayout } from '@/components/layout';
import { ProductSlideShow, SizeSelector } from '@/components/products';
import { ItemCounter } from '@/components/ui';
import { CartContext } from '@/context';
import { dbProducts } from '@/database';
import { ICartProduct, IProduct, ISize } from '@/interfaces';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

interface Props {
  product: IProduct
}

const SlugPage: NextPage<Props> = ({ product }) => {

  const { push } = useRouter();

  const { addProduct } = useContext( CartContext );

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    inStock: product.inStock,
    quantity: 1
  });

  const onSelectedSize = ( size: ISize ) => {
    setTempCartProduct(current => ({
      ...current,
      size
    }));
  }

  const onUpdateValue = ( newValue: number ) => {
    setTempCartProduct({ ...tempCartProduct, quantity: newValue })
  }

  const onAddProductToCart = () => {
    if( !tempCartProduct.size ) return;

    addProduct( tempCartProduct );
    push('/cart');
  }

  return (
    <ShopLayout title={ product.title } pageDescription={ product.description }>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={ product.images } />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>

            <Typography sx={{ userSelect: 'none' }} variant='h1' component='h1'>{ product.title }</Typography>
            <Typography sx={{ userSelect: 'none' }} variant='subtitle1' component='h2'>${ product.price }</Typography>

            <Box sx={{ my: 2 }}>
              <Typography sx={{ userSelect: 'none' }} variant='subtitle2'>Quantity</Typography>
              <ItemCounter                 
                currentValue={ tempCartProduct.quantity } 
                updateValue={ onUpdateValue }
                maxValue={ product.inStock }
              />
              <Typography sx={{ userSelect: 'none' }} variant='subtitle2'>Size</Typography>
              <SizeSelector 
                selectedSize={ tempCartProduct.size }
                sizes={ product.sizes }
                onSelectedSize={ onSelectedSize }
              />
            </Box>

            {
              product.inStock > 0 
              ? (
                <Button 
                  color={ tempCartProduct.size ? 'secondary' : 'primary' } 
                  className='circular-btn'
                  onClick={ onAddProductToCart }
                >
                  {
                    tempCartProduct.size 
                      ? 'Add To Cart'
                      : 'Select a size'
                  }
                </Button>
              )
              : (
                <Chip label='Not available' color='error' variant='outlined' />
              )
            }        

            <Box sx={{ mt: 3 }}>
              <Typography sx={{ userSelect: 'none' }} variant='subtitle2'>Description</Typography>
              <Typography sx={{ userSelect: 'none' }} variant='body2'>{ product.description }</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  const validSlugs = await dbProducts.getAllProductSlugs();

  return {
    paths: validSlugs.map(({slug}) => ({
      params: { slug }
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  
  const { slug } = ctx.params as { slug: string };

  const product = await dbProducts.getProductBySlug( slug );

  if( !product ){
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props:{
      product
    },
    revalidate: 86400
  }
}

export default SlugPage