'use client';
/*
  The CameraGroupProducts component renders the products that 
  we've enabled for the cameraGroup
*/

import { gatewayApi } from "../../../store";
import { useGateway } from "../../../GatewayProvider";
import Products from "../../../components/products/Products";
import { useCameraGroup } from "../../../customHooks/useCameraGroup";

const {useGetCameraGroupProductsQuery} = gatewayApi;

export default function CameraGroupProducts() {
  const {isLoading: skip} = useGateway();
  const cameraGroup = useCameraGroup()

  const {data: cameraGroupProducts, isLoading, isSuccess, isError, error} = useGetCameraGroupProductsQuery({cameraGroup}, {skip});

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <p>Loading products...</p>
  }
  else if (isError) {
    const errorMessage = error.message;
    content = <p>An error occured while fetching the products: {errorMessage}</p>
  }
  else if (isSuccess) {
    content = <Products products={cameraGroupProducts.data} />
  }

  return <>{content}</>
}