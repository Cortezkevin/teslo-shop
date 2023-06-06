import { ShopLayout } from '@/components/layout';
import { Box, Typography } from '@mui/material';

import { NextPage } from 'next';

interface Props {
}

const NotFoundPage: NextPage<Props> = () => {
  return (
    <ShopLayout title='Page Not Found' pageDescription='Not Content'>        
      <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
        <Typography variant='h1' component='h1' fontSize={70} fontWeight={150}>404 | </Typography>
        <Typography variant='h5' component='h5' marginLeft={2}>Page not found</Typography>
      </Box>
    </ShopLayout>
  )
}

export default NotFoundPage;