'use client';

/*
 The CreateProduct component is responsible for creating a product.
*/

//Imports
import { gatewayApi } from "../../store";
import { useGateway } from "../../GatewayProvider";
import Link from "next/link";
import { useState } from "react";

//Variables, constants
const {useGetCategoriesQuery, useCreateProductMutation} = gatewayApi;

//Interfaces
interface CreateFormInputFields extends HTMLFormControlsCollection {
  productLabel: HTMLInputElement
  productName: HTMLInputElement;
  productPLU: HTMLInputElement;
  productCategory: HTMLSelectElement;
}

interface CreateFormInputElements extends HTMLFormElement {
  readonly elements: CreateFormInputFields
}

export default function CreateProduct() {
  const {isLoading: skip} = useGateway();
  const [category, setCategory ] = useState("");
  const [name, setName] = useState("");
  const {
    data: categories, 
    isLoading: categoriesLoading, 
    isFetching: categoriesFetching, 
    isError: categoriesError, error,
    isSuccess: categoriesSuccess} = useGetCategoriesQuery(undefined, {skip});

  let productCategories = null;

  if (categoriesSuccess) {
    productCategories = categories.data.map(category => <option key={category.label} value={category.label}>{category.label}</option>);
  }

  const handleSubmit = (e: React.FormEvent<CreateFormInputElements>) => {}
  
  return (
    <>
      <h2>Create a new product</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="productLabel">Label</label>
        <input disabled type="text" id="productLabel" value={`${category == '' ? `{category}` : category}.${name == '' ? `{productName}` : name}`} />
        <label htmlFor="productName">Name</label>
        <input type="text" id="productName" value={name} onChange={(e) => setName(e.target.value)} required />
        <label htmlFor="productPLU">PLU</label>
        <input type="text" id="productPLU" required />
        <label htmlFor="productCategory">Category</label>
        <select id="productCategory" disabled={categoriesLoading || categoriesFetching} onChange={(e) => setCategory(e.target.value)}>
          {productCategories}
        </select>
        <button type="submit">Create product</button>
      </form>
    </>
  );
}