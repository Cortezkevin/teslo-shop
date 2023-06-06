import { ShopLayout } from "@/components/layout";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";
export default function HomePage() {

  const { products, isError, isLoading } = useProducts('/products');

  return (
    <ShopLayout title={"TesloShop - Home"} pageDescription={"Principal Page"}>
      <Typography variant='h1' component='h1'>Shop</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>All products</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products } />
      }
      
    </ShopLayout>
  )
}
