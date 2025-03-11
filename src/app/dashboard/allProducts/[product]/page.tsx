'use client';

/*
  The Product component creates a product listing.
*/

//Imports 
import { gatewayApi } from "../../../../store";


export default function Product({label}) {
  const {useGetProductQuery} = gatewayApi;
  const {data: product, isLoading, isFetching, isError, isSuccess, error} = useGetProductQuery(label);


}