import { ShopLayout } from "@/components/layout"
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { NextPage } from "next"

const AddressPage: NextPage = () => {
  return (
    <ShopLayout title="Address" pageDescription="Confirm user address">
			<Typography sx={{ textAlign: { xs: 'center', sm: 'left' } }} variant='h1' component='h1'>Address</Typography>
			<Grid container spacing={ 2 } sx={{ mt: 2 }}>
				<Grid item xs={ 12 } sm={ 6 }>
					<TextField label='Name' variant="outlined" fullWidth/>
				</Grid>
				<Grid item xs={ 12 } sm={ 6 }>
					<TextField label='LastName' variant="outlined" fullWidth/>
				</Grid>
				<Grid item xs={ 12 } sm={ 6 }>
					<TextField label='Address' variant="outlined" fullWidth/>
				</Grid>
				<Grid item xs={ 12 } sm={ 6 }>
					<TextField label='Address 2 (optional)' variant="outlined" fullWidth/>
				</Grid>
				<Grid item xs={ 12 } sm={ 6 }>
					<TextField label='Postal Code' variant="outlined" fullWidth/>
				</Grid>
				<Grid item xs={ 12 } sm={ 6 }>
					<TextField label='City' variant="outlined" fullWidth/>
				</Grid>
				<Grid item xs={ 12 } sm={ 6 }>
					<FormControl fullWidth>
						<InputLabel>Country</InputLabel>
						<Select
							variant='outlined'
							label='Country'
							value={1}
						>
							<MenuItem value={1}>Costa Rica</MenuItem>
							<MenuItem value={2}>Honduras</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={ 12 } sm={ 6 }>
					<TextField label='Phone' variant="outlined" fullWidth/>
				</Grid>
			</Grid>
			<Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
				<Button color='secondary' className="circular-btn" size="large">
					Check Order
				</Button>
			</Box>
    </ShopLayout>
  )
}

export default AddressPage