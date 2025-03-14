'use client';

import Link from 'next/link';
import {useCameraGroup} from '../../customHooks/useCameraGroup';
import dashboardStyles from './dashboard.module.scss';

export default function DashboardLayout({children}) {
  const cameraGroup = useCameraGroup();
  return (
    <div className={dashboardStyles.dashboard}>
      <header>
        <section className="logo"></section>
        <Link className={dashboardStyles.cameraGroupLink} href={`/dashboard/cameraGroupProducts?cameraGroup=${cameraGroup}`}>CameraGroup: {cameraGroup}</Link>
      </header>
      {children}
      <footer className={dashboardStyles.toolbar}>
        <Link className={dashboardStyles.createCategoryLink} href={`/dashboard/createCategory?cameraGroup=${cameraGroup}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 31 30" fill="none">
            <path d="M6.75 26.25C6.0625 26.25 5.46875 26.0104 4.96875 25.5313C4.48958 25.0313 4.25 24.4375 4.25 23.75V6.25C4.25 5.5625 4.48958 4.97917 4.96875 4.5C5.46875 4 6.0625 3.75 6.75 3.75H24.25C24.9375 3.75 25.5208 4 26 4.5C26.5 4.97917 26.75 5.5625 26.75 6.25V23.75C26.75 24.4375 26.5 25.0313 26 25.5313C25.5208 26.0104 24.9375 26.25 24.25 26.25H6.75ZM15.5 20C16.2917 20 17.0104 19.7708 17.6562 19.3125C18.3021 18.8542 18.75 18.25 19 17.5H24.25V6.25H6.75V17.5H12C12.25 18.25 12.6979 18.8542 13.3438 19.3125C13.9896 19.7708 14.7083 20 15.5 20Z" fill="#E6E0E9"/>
          </svg>
          <span>Create Category</span>
        </Link>
        <Link className={dashboardStyles.createProductLink} href={`/dashboard/createProduct?cameraGroup=${cameraGroup}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 31 30" fill="none">
            <path d="M14.25 21.25H16.75V16.25H21.75V13.75H16.75V8.75H14.25V13.75H9.25V16.25H14.25V21.25ZM15.5 27.5C13.7708 27.5 12.1458 27.1771 10.625 26.5312C9.10417 25.8646 7.78125 24.9687 6.65625 23.8437C5.53125 22.7187 4.63542 21.3958 3.96875 19.875C3.32292 18.3542 3 16.7292 3 15C3 13.2708 3.32292 11.6458 3.96875 10.125C4.63542 8.60417 5.53125 7.28125 6.65625 6.15625C7.78125 5.03125 9.10417 4.14583 10.625 3.5C12.1458 2.83333 13.7708 2.5 15.5 2.5C17.2292 2.5 18.8542 2.83333 20.375 3.5C21.8958 4.14583 23.2188 5.03125 24.3438 6.15625C25.4688 7.28125 26.3542 8.60417 27 10.125C27.6667 11.6458 28 13.2708 28 15C28 16.7292 27.6667 18.3542 27 19.875C26.3542 21.3958 25.4688 22.7187 24.3438 23.8437C23.2188 24.9687 21.8958 25.8646 20.375 26.5312C18.8542 27.1771 17.2292 27.5 15.5 27.5ZM15.5 25C18.2917 25 20.6563 24.0312 22.5938 22.0938C24.5313 20.1562 25.5 17.7917 25.5 15C25.5 12.2083 24.5313 9.84375 22.5938 7.90625C20.6563 5.96875 18.2917 5 15.5 5C12.7083 5 10.3438 5.96875 8.40625 7.90625C6.46875 9.84375 5.5 12.2083 5.5 15C5.5 17.7917 6.46875 20.1562 8.40625 22.0938C10.3438 24.0312 12.7083 25 15.5 25Z" fill="#E6E0E9"/>
          </svg>
          <span>Create Product</span>
        </Link>
        <Link className={dashboardStyles.allProductsLink} href={`/dashboard/allProducts?cameraGroup=${cameraGroup}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 31 30" fill="none">
            <path d="M5.5 25C4.8125 25 4.22396 24.7552 3.73438 24.2656C3.24479 23.776 3 23.1875 3 22.5V7.5C3 6.8125 3.24479 6.22396 3.73438 5.73438C4.22396 5.24479 4.8125 5 5.5 5H13L15.5 7.5H25.5C26.1875 7.5 26.776 7.74479 27.2656 8.23438C27.7552 8.72396 28 9.3125 28 10V22.5C28 23.1875 27.7552 23.776 27.2656 24.2656C26.776 24.7552 26.1875 25 25.5 25H5.5ZM5.5 22.5H25.5V10H14.4688L11.9688 7.5H5.5V22.5Z" fill="#E6E0E9"/>
          </svg>
          <span>All Products</span>
        </Link>
        <Link className={dashboardStyles.cameraGroupProductsLink} href={`/dashboard/cameraGroupProducts?cameraGroup=${cameraGroup}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 31 30" fill="none">
            <path d="M15.5 26.25L13.6875 24.625C11.5833 22.7292 9.84375 21.0938 8.46875 19.7188C7.09375 18.3438 6 17.1146 5.1875 16.0313C4.375 14.9271 3.80208 13.9167 3.46875 13C3.15625 12.0833 3 11.1458 3 10.1875C3 8.22917 3.65625 6.59375 4.96875 5.28125C6.28125 3.96875 7.91667 3.3125 9.875 3.3125C10.9583 3.3125 11.9896 3.54167 12.9688 4C13.9479 4.45833 14.7917 5.10417 15.5 5.9375C16.2083 5.10417 17.0521 4.45833 18.0313 4C19.0104 3.54167 20.0417 3.3125 21.125 3.3125C23.0833 3.3125 24.7188 3.96875 26.0313 5.28125C27.3438 6.59375 28 8.22917 28 10.1875C28 11.1458 27.8333 12.0833 27.5 13C27.1875 13.9167 26.625 14.9271 25.8125 16.0313C25 17.1146 23.9063 18.3438 22.5313 19.7188C21.1563 21.0938 19.4167 22.7292 17.3125 24.625L15.5 26.25ZM15.5 22.875C17.5 21.0833 19.1458 19.5521 20.4375 18.2812C21.7292 16.9896 22.75 15.875 23.5 14.9375C24.25 13.9792 24.7708 13.1354 25.0625 12.4063C25.3542 11.6563 25.5 10.9167 25.5 10.1875C25.5 8.9375 25.0833 7.89583 24.25 7.0625C23.4167 6.22917 22.375 5.8125 21.125 5.8125C20.1458 5.8125 19.2396 6.09375 18.4063 6.65625C17.5729 7.19792 17 7.89583 16.6875 8.75H14.3125C14 7.89583 13.4271 7.19792 12.5938 6.65625C11.7604 6.09375 10.8542 5.8125 9.875 5.8125C8.625 5.8125 7.58333 6.22917 6.75 7.0625C5.91667 7.89583 5.5 8.9375 5.5 10.1875C5.5 10.9167 5.64583 11.6563 5.9375 12.4063C6.22917 13.1354 6.75 13.9792 7.5 14.9375C8.25 15.875 9.27083 16.9896 10.5625 18.2812C11.8542 19.5521 13.5 21.0833 15.5 22.875Z" fill="#E6E0E9"/>
          </svg>
          <span>CameraGroup Products</span>
        </Link>
      </footer>
    </div>
  );
}