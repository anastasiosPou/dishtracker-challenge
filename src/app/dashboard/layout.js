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
        <Link href={`/dashboard/createProduct?cameraGroup=${cameraGroup}`}>Create Product</Link>
        <button className="">Create category</button>
      </footer>
    </div>
  );
}