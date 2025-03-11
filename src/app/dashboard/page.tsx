'use client'
/*
  The Dashboard component shows the toolbar and all
  the products that exist on /app/v1/product (regardless of cameraGroup)
*/

import { useAppSelector, selectCameraGroup } from "../../store"

export default function Dashboard() {
  const cameraGroup = useAppSelector(selectCameraGroup);
  console.log('Camera group: ', cameraGroup)
  return <h1>Welcome!!!!!! {cameraGroup}</h1>
}