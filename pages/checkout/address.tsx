import { ShopLayout } from "@/components/layout";
import { CartContext } from "@/context";
import { jwt } from "@/utils";
import { countries } from "@/utils/countries";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  lastName: string;
  address: string;
  address_2: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = (): FormData => {
  if (Cookies.get("address") !== undefined) {
    const shippingAddress = JSON.parse(Cookies.get("address")!) as FormData;
    return shippingAddress;
  }
  return {
    name: "",
    lastName: "",
    address: "",
    address_2: "",
    postalCode: "",
    city: "",
    country: "",
    phone: "",
  };
};

const AddressPage: NextPage = () => {
  const router = useRouter();
  const { updateAddress, shippingAddress } = useContext(CartContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: "all",
    defaultValues: getAddressFromCookies(),
  });

  useEffect(() => {
    reset(getAddressFromCookies());
  }, [reset]);

  const onSaveAddress = (values: FormData) => {
    updateAddress(values);
    router.push("/checkout/summary");
  };

  return (
    <ShopLayout title="Address" pageDescription="Confirm user address">
      <Typography
        sx={{ textAlign: { xs: "center", sm: "left" } }}
        variant="h1"
        component="h1"
      >
        Address
      </Typography>
      <form onSubmit={handleSubmit(onSaveAddress)}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              {...register("name", {
                required: "Name is required",
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="LastName"
              variant="outlined"
              fullWidth
              {...register("lastName", {
                required: "Last Name is required",
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              {...register("address", {
                required: "Address is required",
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address 2 (optional)"
              variant="outlined"
              fullWidth
              {...register("address_2")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Postal Code"
              variant="outlined"
              fullWidth
              {...register("postalCode", {
                required: "Postal Code is required",
              })}
              error={!!errors.postalCode}
              helperText={errors.postalCode?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              {...register("city", {
                required: "City is required",
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              variant="outlined"
              label="Country"
              defaultValue={countries[0].code}
              {...register("country", {
                required: "Country is required",
              })}
              error={!!errors.country}
              helperText={errors.country?.message}
            >
              {countries.map((c) => (
                <MenuItem key={c.code} value={c.code}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              {...register("phone", {
                required: "Phone is required",
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
          <Button
            color="secondary"
            className="circular-btn"
            size="large"
            type="submit"
          >
            Check Order
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

export default AddressPage;