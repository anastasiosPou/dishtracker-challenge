'use client';

/*
 The CreateProduct component is responsible for creating a product.
*/

//Imports
import { gatewayApi } from "../../store";
import { useGateway } from "../../GatewayProvider";
import Link from "next/link";
import { useState } from "react";
import { NewProduct } from "../../api/gateway";
import { useRouter } from "next/navigation";
import { useCameraGroup } from "../../customHooks/useCameraGroup";
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

//TODO I need to write a better validation function.
//Helper functions
function validateInput(input: string): boolean {
  const regExp = /^[a-zA-Z0-9\-_]+$/;
  return regExp.test(input);
}

export default function CreateProduct() {
  const {isLoading: skip} = useGateway();
  const [inputErrors, setInputErrors] = useState({});
  const [category, setCategory ] = useState("");
  const [productName, setProductName] = useState("");
  const [createProduct, {isLoading: isLoadingCreateProduct}] = useCreateProductMutation();
  const router = useRouter();
  const cameraGroup = useCameraGroup();
  const {
    data: categories, 
    isLoading: categoriesLoading, 
    isFetching: categoriesFetching, 
    isError: categoriesError, error,
    isSuccess: categoriesSuccess} = useGetCategoriesQuery(undefined, {skip});
  

  //We extract the categories and make options for the select input.
  let productCategories = null;
  if (categoriesSuccess) {
    productCategories = categories.data.map(category => 
      <option key={category.label} value={category.label}>{category.label}</option>
    );
  }

  const handleSubmit = async (e: React.FormEvent<CreateFormInputElements>) => {
    e.preventDefault();
    setInputErrors({});
    let errors = {};

    const {elements} = e.currentTarget;
    const productName = elements.productName.value.trim();
    const productPLU = elements.productPLU.value.trim();
    const productCategory = elements.productCategory.value;

    console.log(`The user entered: name: ${productName}\nPLU: ${productPLU}\nCategory: ${productCategory}`)

    const isProductNameValid = validateInput(productName);
    const isProductPLUValid = validateInput(productPLU);
    const hasSelectedCategories = categories.data.find(category => category.label == productCategory) != undefined;

    if (!isProductNameValid) {
      errors['ProductNameError'] = "*Product name is invalid(The name can't have spaces or funny characters!)";
    }
    if (!isProductPLUValid) {
      errors['ProductPLUError'] = "*PLU is invalid(The PLU has to contain only numbers and/or letters)"
    }
    if (!hasSelectedCategories) {
      errors['ProductCategoryError'] = '*You need to select a product';
    }

    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      return;
    }

    try {
      const newProduct: NewProduct = {
        name: productName, 
        label: `${productCategory.toLowerCase()}.${productName.toLocaleLowerCase()}`, 
        plu: productPLU, 
        category: productCategory
      }
      await createProduct(newProduct).unwrap();
      //TODO create a better UI experience we have a successfull product creation.
      alert('Product created!');
      router.push(`/dashboard/allProducts?cameraGroup=${cameraGroup}`)
    }
    catch (err) {
      alert('Error while creating the product: ' + err);
      errors['CreateProductError'] = err.detail[0].msg;
    }
    console.log(inputErrors);
  }
  
  return (
    <>
      <h2>Create a new product</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="productLabel">Label</label>
        <input disabled type="text" id="productLabel" value={`${category == '' ? `{category}` : category}.${productName == '' ? `{productName}` : productName.toLocaleLowerCase()}`} />
        <label htmlFor="productName">Name</label>
        <span className="inputError">{inputErrors['ProductNameError']}</span>
        <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required />
        <label htmlFor="productPLU">PLU</label>
        <span className="inputError">{inputErrors['ProductPLUError']}</span>
        <input type="text" id="productPLU" required />
        <label htmlFor="productCategory">Category</label>
        <span className="inputError">{inputErrors['ProductCategoryError']}</span>
        <select id="productCategory" disabled={categoriesLoading || categoriesFetching} onChange={(e) => setCategory(e.target.value)} required>
          <option>Select category</option>
          {productCategories}
        </select>
        <button type="submit">Create product</button>
        <Link className="cancel-link-button" href={`/dashboard/allProducts?cameraGroup=${cameraGroup}`}>Cancel</Link>
        <span className="inputError">{inputErrors['CreateProductError']}</span>
      </form>
    </>
  );
}