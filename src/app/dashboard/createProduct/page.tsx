'use client';

import CreateProduct from "../../../components/createProduct/CreateProduct";
import { useCameraGroup } from "../../../customHooks/useCameraGroup";
/*
  The CreateProductPage component will render the CreateProduct component.
*/
export default function CreateProductPage() {
  return <section className="createProductPage"><CreateProduct /></section>
}