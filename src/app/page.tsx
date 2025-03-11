'use client';

import { useGateway } from "../GatewayProvider";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isLoading } = useGateway();
  const router = useRouter();

  if (isLoading) {
    return <h1>Welcome to Dishtracker</h1>
  }
  else {
    router.push('/login');
  }
}
