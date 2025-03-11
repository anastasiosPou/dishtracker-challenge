'use client';

import { useRef, useState } from "react";
/*
 The Products component is responsible for rendering 
 the products on the dashboard. It receives one prop(products)
 products could be either all the products or the products on the cameraGroup 
 the user created.
*/

import { ProductStatus } from "../../api/gateway";
import { gatewayApi } from "../../store";
import { useSearchParams } from "next/navigation";

const {useEnableProductMutation, useDisableProductMutation, useGetCameraGroupProductsQuery} = gatewayApi;

function ProductExcerpt({product}: {product: ProductStatus}) {
  //These mutations are used when we enable/disable a product
  const [enableProduct, {isLoading: enableLoading}] = useEnableProductMutation();
  const [disableProduct, {isLoading: disableLoading}] = useDisableProductMutation();
  let isProductEnabled = false;

  /*
    We need the cameraGroup in order to make the reuests.
    For some reason, when I use a selector to retreive the cameraGroup from the store,
    on reload is empty. I need to investigate.
  */
  const searchParams = useSearchParams();
  const cameraGroup = searchParams.get('cameraGroup');

  /*
    We're taking the product(if any) that are available in the cameraGroup.
  */
  const {data: cameraGroupProducts, isLoading: cameraGroupProductsLoading} = useGetCameraGroupProductsQuery({cameraGroup});

  if (!cameraGroupProductsLoading) {
    /* TODO
      I need to normalize the data in the cache in order to do lookups like chache[label].
      find could be expensive if we have lots of products.

      If a product from all the products is in the cameraGroupProducts it means that it's enabled.
     */
    isProductEnabled = cameraGroupProducts.data.find(cameraGroupProduct => cameraGroupProduct.label == product.label) != undefined;
  }
  
  const handleEnableDisableClick = async () => {
    try {
      if (!isProductEnabled) {
        await enableProduct({cameraGroup, label: product.label}).unwrap();
      }
      else {
        await disableProduct({cameraGroup, label: product.label}).unwrap();
      }
    }
    catch (err) {
      alert('An error occured trying to enable/disable the product: ' + err);
    }
  }

  return (
    <article className="product-excerpt">
      <h3><span className="category-pill">{product.category}</span>.{product.name}</h3>
      <p className="product-excerpt-name">{product.name}</p>
      <p className="product-excerpt-plu">{product.plu}</p>
      <section className="product-excerpt-actions">
        <button 
          onClick={handleEnableDisableClick} 
          disabled={enableLoading || disableLoading} 
          className="product-excerpt-enable-disable-button">{isProductEnabled ? 'Disable' : 'Enable'}
        </button>
        <button className="product-excerpt-edit-button">Edit Product</button>
      </section>
    </article>
  );
}

export default function Products({products}: {products: ProductStatus[]}) {
  return (
    <section className="products">
      {products.map(product => <ProductExcerpt key={product.label} product={product} />)}
    </section>
  );
}