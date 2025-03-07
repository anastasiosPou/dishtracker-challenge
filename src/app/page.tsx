'use client';

import { useEffect } from "react";
import { useGateway } from "../GatewayProvider";
import { gatewayApi } from "../store";

export default function Page() {
  const { isLoading } = useGateway();
  const skip = isLoading;
  const { useGetWhoAmIQuery,
    useGetEnabledCameraGroupProductsQuery,
    useGetDisabledCameraGroupProductsQuery } = gatewayApi;

  const cameraGroup = process.env.NEXT_PUBLIC_CAMERA_GROUP || "";
  const { data: whoAmI, isLoading: loadingWhoAmI } = useGetWhoAmIQuery(undefined, { skip });
  const { data: enabledProducts, isLoading: loadingEnabled } = useGetEnabledCameraGroupProductsQuery({ cameraGroup }, { skip });
  const { data: disabledProducts, isLoading: loadingDisabled } = useGetDisabledCameraGroupProductsQuery({ cameraGroup }, { skip });

  useEffect(() => {
    if (loadingEnabled === false) {
    const numProducts = enabledProducts?.data.length;
      console.log(`${numProducts} products enabled`);
    }
  }, [loadingEnabled]);


  return (
    <>
      <div>
        <h3>User: {loadingWhoAmI ? "..." : JSON.stringify(whoAmI)}</h3>
        <h4>Enabled Products:{loadingEnabled ? "..." : ""}</h4>
        <ul>{enabledProducts?.data.map((p) => <li key={p.label}>{JSON.stringify(p)}</li>) || <p>None</p>}</ul>
        <h4>Disabled Products:{loadingDisabled ? "..." : ""}</h4>
        <ul>{disabledProducts?.data.map((p) => <li key={p.label}>{JSON.stringify(p)}</li>) || <p>None</p>}</ul>
      </div>
    </>
  );
}
