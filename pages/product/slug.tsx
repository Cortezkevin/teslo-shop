import { ShopLayout } from '@/components/layout';
import { ProductSlideShow, SizeSelector } from '@/components/products';
import { ItemCounter } from '@/components/ui';
import { initialData } from '@/database/products';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { NextPage } from 'next';

const product = initialData.products[0];

const SlugPage: NextPage = () => {
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
              <ItemCounter initialValue={4} />
              <Typography sx={{ userSelect: 'none' }} variant='subtitle2'>Size</Typography>
              <SizeSelector sizes={ product.sizes }/>
            </Box>

            <Button color='secondary' className='circular-btn'>
              Add To Cart
            </Button>

            {/* <Chip label='Not available' color='error' variant='outlined' /> */}

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

export default SlugPage