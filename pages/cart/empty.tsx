import NextLink from 'next/link';
import { ShopLayout } from "@/components/layout"
import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Link, Typography } from '@mui/material';
import { NextPage } from 'next';

const EmptyPage: NextPage = () => {
  return (
    <ShopLayout title="Empty Cart" pageDescription="">
    	<Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
				<RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display='flex' flexDirection='column' alignItems='center'>
					<Typography>Your cart is empty</Typography>
					<NextLink href='/' passHref legacyBehavior>
						<Link typography='h4' color='secondary'>
							Go Back
						</Link>
					</NextLink>
				</Box>
      </Box>
    </ShopLayout>
  )
}

export default EmptyPage