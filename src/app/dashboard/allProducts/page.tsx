'use client';
/*
  The AllProducts component renders all the products(regardless of cameraGroup)
*/

import { gatewayApi } from "../../../store";
import { useGateway } from "../../../GatewayProvider";
import Products from "../../../components/products/Products";
import { useCameraGroup } from "../../../customHooks/useCameraGroup";
const {useGetAllProductsQuery} = gatewayApi;

export default function AllProducts() {
  const {isLoading: skip} = useGateway();
  const {data: allProducts, isLoading, isSuccess, isError, error} = useGetAllProductsQuery(undefined, {skip});
  const cameraGroup = useCameraGroup()
  let content: React.ReactNode = null;

  if (isLoading) {
    content = <p>Loading products...</p>
  }
  else if (isError) {
    const errorMessage = error.message
    content = <p>An error occured while fetching the products: {errorMessage}</p>
  }
  else if (isSuccess) {
    content = <Products products={allProducts.data} />
  }

  return <>{content}</>
}