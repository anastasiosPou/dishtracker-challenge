import { useSearchParams } from "next/navigation";

/*
  the cameraGroup we've created in the login page gets used 
  a lot on the requests we made. This component helps retrieve 
  the cameraGroup from the URL
*/
export function useCameraGroup() {
  const searchParams = useSearchParams();
  return searchParams.get('cameraGroup') ?? 'default';
}