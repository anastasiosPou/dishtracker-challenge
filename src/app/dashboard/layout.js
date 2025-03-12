'use client';

import Link from 'next/link';
import {useCameraGroup} from '../../customHooks/useCameraGroup';

export default function DashboardLayout({children}) {
  const cameraGroup = useCameraGroup();
  return (
    <div className="dashboard">
      <header>
        <section className="logo"></section>
        <Link href={`/dashboard/cameraGroupProducts?cameraGroup=${cameraGroup}`}>CameraGroup: {cameraGroup}</Link>
      </header>
      <main className="product-list">
        {children}
      </main>
      <footer className="toolbar">
        <Link className="create-product-link" href={`/dashboard/createProduct?cameraGroup=${cameraGroup}`}>Create Product</Link>
        <Link className="create-category-link" href={`/dashboard/createCategory?cameraGroup=${cameraGroup}`}>Create Category</Link>
        <Link className="allProducts-link" href={`/dashboard/allProducts?cameraGroup=${cameraGroup}`}>All Products</Link>
        <Link className="cameraGroupProducts-link" href={`/dashboard/cameraGroupProducts?cameraGroup=${cameraGroup}`}>CameraGroup Products</Link>
      </footer>
    </div>
  );
}