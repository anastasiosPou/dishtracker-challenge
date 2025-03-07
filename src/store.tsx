import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query/react';
import { createGatewayApi } from "./api/gateway";


const {gatewayApi, gatewayActions, gatewayReducer, gatewayMiddleware} = createGatewayApi();

export const store = configureStore({
  reducer: gatewayReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gatewayMiddleware),
});

setupListeners(store.dispatch)

export { gatewayApi, gatewayActions };
export const gatewayEndpoints = gatewayApi.endpoints;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
