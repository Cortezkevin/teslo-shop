import { CartContext } from "@/context"
import { IOrderDetail } from "@/interfaces";
import { currency } from "@/utils";
import { Grid, Typography } from "@mui/material"
import { FC, useContext } from "react"

interface Props {
	orderSummary?: IOrderDetail
}

export const OrderSummary: FC<Props> = ({ orderSummary }) => {

	const { details } = useContext( CartContext );
	const { numberOfItems, subTotal, tax, total } = orderSummary ? orderSummary : details;

  return (
    <Grid container>
			<Grid item xs={ 6 }>
				<Typography>No. Products</Typography>
			</Grid>
			<Grid item xs={ 6 } display='flex' justifyContent='end'>
				<Typography>{ numberOfItems }</Typography>
			</Grid>
			<Grid item xs={ 6 }>
				<Typography>SubTotal</Typography>
			</Grid>
			<Grid item xs={ 6 } display='flex' justifyContent='end'>
				<Typography>{ currency.format( subTotal ) }</Typography>
			</Grid>
			<Grid item xs={ 6 }>
				<Typography>Impuestos (15%)</Typography>
			</Grid>
			<Grid item xs={ 6 } display='flex' justifyContent='end'>
				<Typography>{ currency.format( tax ) }</Typography>
			</Grid>
			<Grid item xs={ 6 } sx={{ mt: 2 }}>
				<Typography variant='subtitle1'>Total</Typography>
			</Grid>
			<Grid item xs={ 6 } sx={{ mt: 2 }} display='flex' justifyContent='end'>
				<Typography variant='subtitle1'>{ currency.format( total ) }</Typography>
			</Grid>
    </Grid>
  )
}
