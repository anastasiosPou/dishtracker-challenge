'use client';

/*
 The Products component is responsible for rendering 
 the products on the dashboard. It receives one prop(products)
 products could be either all the products or the products on the cameraGroup 
 the user created.
*/

import { ProductStatus } from "../../api/gateway";

function ProductExcerpt({product}: {product: ProductStatus}) {
  return (
    <article className="product-excerpt">
      <h3><span className="category-pill">{product.category}</span>{product.name}</h3>
      <p className="product-excerpt-name">{product.name}</p>
      <p className="product-excerpt-plu">{product.plu}</p>
      <section className="product-excerpt-actions">
        <button className="product-excerpt-enable-disable-button">Enable/Disable</button>
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