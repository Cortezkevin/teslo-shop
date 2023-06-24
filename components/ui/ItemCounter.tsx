import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { FC } from "react";

interface Props {
	currentValue?: number;
	updateValue: ( newValue: number ) => void;
	maxValue: number;
}

export const ItemCounter: FC<Props> = ({ currentValue = 1, updateValue, maxValue }) => {

	const onIncreaseValue = () => {
		const value = currentValue < maxValue ? currentValue + 1 : currentValue;
		updateValue( value );
	}

	const onDecreaseValue = () => {
		const value = currentValue === 1 ? currentValue : currentValue - 1;
		updateValue( value );
	}

  return (  
    <Box display='flex' alignItems='center'>
			<IconButton onClick={() => onDecreaseValue()}>
				<RemoveCircleOutline />
			</IconButton>
			<Typography sx={{ width: 40, textAlign: 'center' }}>{ currentValue }</Typography>
			<IconButton onClick={() => onIncreaseValue()}>
				<AddCircleOutline />
			</IconButton>
    </Box>
  )
}

