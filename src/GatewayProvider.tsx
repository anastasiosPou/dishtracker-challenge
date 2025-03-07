import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { GatewayConfig } from "./api/gateway";
import { gatewayActions, gatewayApi, useAppDispatch } from "./store";


// Load dev config from environment variables or fallback to defaults
const loadDevConfig = (): GatewayConfig => ({
  bearerToken: process.env.NEXT_PUBLIC_RECOGNITION_TOKEN || "",
  locationId: process.env.NEXT_PUBLIC_RECOGNITION_LOCATION_ID || "",
  configName: process.env.NEXT_PUBLIC_RECOGNITION_CONFIG_NAME || null,
  baseUrl: process.env.NEXT_PUBLIC_RECOGNITION_API_BASE || "https://recognition.dishtracker.io"
});

const GatewayContext = createContext<
  | {
    isLoading: boolean,
    loadConfig: () => Promise<void>;
    backendConfig: GatewayConfig,
    setBackendConfig: (config: GatewayConfig) => void;
  }
  | undefined
>(undefined);

export const GatewayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [backendConfig, setBackendConfig] = useState<GatewayConfig | null>(null);

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const devConfig = loadDevConfig();
      console.log("devConfig", devConfig);
      dispatch(gatewayActions.setGatewayToken(devConfig.bearerToken));
      dispatch(gatewayApi.util.invalidateTags(["WhoAmI"]));
      dispatch(gatewayActions.setGatewayLocation(devConfig.locationId));
      dispatch(gatewayActions.setGatewayConfigName(devConfig.configName));
      dispatch(gatewayActions.setGatewayBaseUrl(devConfig.baseUrl));
    } catch (error) {
      console.error("loadDevConvig failed", error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);
  // Run `loadConfig` on mount
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);


  return (
    <GatewayContext.Provider value={{ isLoading, loadConfig, backendConfig, setBackendConfig }}>
      {children}
    </GatewayContext.Provider>
  );
};

export const useGateway = () => {
  const context = useContext(GatewayContext);
  if (!context) throw new Error("useGateway must be used within a GatewayProvider");
  return context;
};
