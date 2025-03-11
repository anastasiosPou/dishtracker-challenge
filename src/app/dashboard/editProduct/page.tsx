'use client';
/*
  The EditProductPage renders the EditProduct component
  We can edit the name and PLU of a component
*/

//Imports
import EditProduct from "../../../components/editProduct/EditProduct";
import { gatewayApi } from "../../../store";
import { useSearchParams } from "next/navigation";
import { useGateway } from "../../../GatewayProvider";
//Contants
const {useGetProductQuery} = gatewayApi;


export default function EditProductPage() {
  const {isLoading: skip} = useGateway();
  const searchParams = useSearchParams();
  const cameraGroup = searchParams.get('cameraGroup');
  const productLabel = searchParams.get('label');

  const {data: product, isLoading, isFetching, isError, error, isSuccess} = useGetProductQuery({label: productLabel}, {skip});

  if (isLoading) {
    return <p>Loading...</p>
  }
  else if (isError) {
    console.log('Error while fetching the product: ', error);
  }
  else if (isSuccess) {
    return <EditProduct product={product} cameraGroup={cameraGroup} />
  }
}