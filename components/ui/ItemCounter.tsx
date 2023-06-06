import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { FC } from "react";

interface Props {
	initialValue?: number;
}

export const ItemCounter: FC<Props> = ({ initialValue = 1 }) => {
  return (  
    <Box display='flex' alignItems='center'>
			<IconButton>
				<RemoveCircleOutline />
			</IconButton>
			<Typography sx={{ width: 40, textAlign: 'center' }}>{ initialValue }</Typography>
			<IconButton>
				<AddCircleOutline />
			</IconButton>
    </Box>
  )
}
