import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import { FC, useContext } from 'react';
import { ItemCounter } from '../ui';
import { CartContext } from '@/context';
import { ICartProduct, IOrderItem } from '@/interfaces';

interface Props {
	editable?: boolean;
	products?: IOrderItem[]
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

	const { cart = [], updateCartQuantity, removeProduct } = useContext( CartContext );

	const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
		product.quantity = newQuantityValue;
		updateCartQuantity( product );
	}

	const productsToShow = products ? products : cart;

  return (
    <>
			{
				productsToShow.map( product => 
					<Grid container spacing={2} key={ product.slug + '-' + product.size } sx={{ mb:1 }}>
						<Grid item xs={3}>
							<NextLink legacyBehavior href={`/product/${product.slug}`} passHref>
								<Link>
									<CardActionArea>
										<CardMedia 
											image={ product.image }
											component={'img'}
											sx={{ borderRadius: '5px' }}
										/>
									</CardActionArea>
								</Link>
							</NextLink>
						</Grid>
						<Grid item xs={7}>
							<Box display='flex' flexDirection='column' >
								<Typography variant='body1'>{ product.title }</Typography>
								<Typography variant='body2'>Size: <strong>{ product.size }</strong></Typography>
								{
									editable 
									? <ItemCounter 
											maxValue={ 10 }
											currentValue={ product.quantity }
											updateValue={ ( newValue ) => onNewCartQuantityValue(product as ICartProduct, newValue) }
										/>
									: <Typography fontWeight={400} sx={{ mt: 1 }}>Quantity: <strong>{ product.quantity }</strong></Typography>
								}
							</Box>
						</Grid>
						<Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
							<Typography variant='subtitle1'>${ product.price }</Typography>
							{
								editable && <Button onClick={() => removeProduct(product as ICartProduct)}  variant='text' color='warning'>Remove</Button>
							}
						</Grid>
					</Grid>
				)
			}
		</>
  )
}