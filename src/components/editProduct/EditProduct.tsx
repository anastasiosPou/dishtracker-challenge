'use client';

import { useState } from "react";
import { ProductStatus } from "../../api/gateway";
import { gatewayApi } from "../../store";
import { useRouter } from "next/navigation";
import Link from "next/link";
const {useUpdateProductMutation} = gatewayApi

/*
 The LoginFormFields and LoginFormElements are used to
 provide types to the submit handler.
*/

interface EditProductFormFields extends HTMLFormControlsCollection {
  productName: HTMLInputElement
  productPLU: HTMLInputElement
}

interface EditProductFormElements extends HTMLFormElement {
  readonly elements: EditProductFormFields
}

function validateInput(input: string) {
  const regExp = /^[a-zA-Z0-9\-_]+$/g;
  return regExp.test(input);
}

/*
  EditProduct takes a product and we can edit the PLU and the name of the product
*/
export default function EditProduct({product, cameraGroup}) {
  const [updateProduct, {isLoading}] = useUpdateProductMutation();
  const [inputErrors, setInputErrors] = useState({});
  const router = useRouter();
  const productNameError = {type: 'NameError', message: "Product name isn't valid"}
  const productPLUError = {type: 'PLUError', message: "PLU isn't valid"}

  const handleSubmit = async (e: React.FormEvent<EditProductFormElements>) => {
    e.preventDefault();

    //TODO This needs rewriting. Validation isn't up to standards.
    let errors = {};
    const {elements} = e.currentTarget;
    const productName = elements.productName.value.trim();
    const productPLU = elements.productPLU.value.trim();

    const isNameValid = validateInput(productName);
    if (!isNameValid) {
      errors[productNameError.type] = productNameError.message;
    }

    const isPLUValid = validateInput(productPLU);
    if (!isPLUValid) {
      errors[productPLUError.type] = productPLUError.message;
    }

    if (Object.hasOwn(errors, 'NameError') || Object.hasOwn(errors, 'PLUError')) {
      setInputErrors(errors);
      return;
    }

    try {
      await updateProduct({label: product.label, name: productName, plu: productPLU, category: product.category}).unwrap();
      alert('Product Created');
      setTimeout(() => router.push(`/dashboard/allProducts?cameraGroup=${cameraGroup}`), 2000);
    }
    catch (err) {
      console.log('Error when updating product: ', err);
      errors[err.status] = err.msg;
      setInputErrors(errors);
    }

  }

  return (
    <section className="edit-product">
      <h3><span className="category-pill">{product.category}</span>.{product.name}</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="productName">Name</label>
        <span className="input-error-message">{inputErrors['NameError']}</span>
        <input type="text" id="productName" placeholder={product.name} required />
        <label htmlFor="productPLU">PLU</label>
        <span className="input-error-message">{inputErrors['PLUError']}</span>
        <input type="number" id="productPLU" placeholder={product.plu} required />
        <button disabled={isLoading} type="submit">Save</button>
        <Link href={`/dashboard/allProducts?cameraGroup=${cameraGroup}`}>Cancel</Link>
      </form>
    </section>
  );
}