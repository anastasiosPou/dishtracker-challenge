'use client';

import Link from "next/link";
import { useGateway } from "../GatewayProvider";

export default function Page() {
  const { isLoading } = useGateway();

  return (
    <>
      <h1>Welcome to Dishtracker</h1>
      {!isLoading && <Link href="/login">Log in</Link>}
    </>
  );
}
