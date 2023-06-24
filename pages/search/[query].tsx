import { ShopLayout } from "@/components/layout";
import { ProductList } from "@/components/products";
import { dbProducts } from "@/database";
import { IProduct } from "@/interfaces";
import { Box, Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";

interface Props {
	products: IProduct[];
	term: string;
	isEmpty: boolean;
}

const SearchPage: NextPage<Props> = ({ products, term, isEmpty }) =>  {
  return (
    <ShopLayout title={"TesloShop - Search"} pageDescription={"Search Page"}>
      <Typography variant='h1' component='h1'>Search Products</Typography>
      {
				isEmpty
					? (
						<Box display='flex'>
							<Typography variant='h2' sx={{ mb: 1 }}>Not found Products:</Typography>
							<Typography variant='h2' color='secondary' sx={{ mb: 1, ml: 1 }}>{ term }</Typography>
						</Box>
					)
					: <Typography variant='h2' sx={{ mb: 1 }}>Term: { term }</Typography>
			}

      <ProductList products={ products } />
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { query = '' } = params as { query: string } ;
		
		if( query.length === 0 ){
			return {
				redirect: {
					destination: '/',
					permanent: true
				}
			}
		}

		let products = await dbProducts.getProductsByTerm( query );
		const isEmpty = products.length === 0;

		if( isEmpty ){
			products = await dbProducts.getAllProducts();
		}

    return {
			props:{
				products,
				term: query,
				isEmpty
			}
    }
}

export default SearchPage;