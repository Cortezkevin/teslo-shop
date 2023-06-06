import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ShopLayout } from "@/components/layout";

import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";
import { FullScreenLoading } from "@/components/ui";
import { ProductList } from "@/components/products";

interface Props {
	title: string;
	pageDescription: string;
}

const GenderPage: NextPage<Props> = ({ title, pageDescription }) => {

  const { query } =  useRouter();
	const { products, isError, isLoading } = useProducts(`/products?gender=${query.gender}`);

  return (
    <ShopLayout title={title} pageDescription={pageDescription}>
			<Typography variant='h1' component='h1'>{title}</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>{pageDescription}</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products } />
      }
    </ShopLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const validGenders = ['kid','men','women'];

  return {
    paths: validGenders.map( gender => ({
      params: { gender }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {    
  
  const { gender } = params as { gender: string };
  const data = gender === 'kid'
							? { title: 'Kids', pageDescription: 'Products for Kids' }
							: gender === 'men'
								? { title: 'Men', pageDescription: 'Products for Men' }
								: { title: 'Women', pageDescription: 'Products for she' }

  return {
    props: {
			...data
    }
  }
}

export default GenderPage