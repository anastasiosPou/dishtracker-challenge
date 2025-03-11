'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function DashboardLayout({children}) {
  const searchParams = useSearchParams();
  const cameraGroup = searchParams.get('cameraGroup');

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
        <button className="">Create product</button>
        <button className="">Create category</button>
      </footer>
    </div>
  );
}