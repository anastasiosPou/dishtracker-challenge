import { createSlice } from "@reduxjs/toolkit";
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

export type GatewayConfig = {
  bearerToken: string;
  locationId: string;
  configName: string | null;
}

const DIS_938_PROXY = "https://checkout-cloud-proxy-xwjw6zpyiq-ew.a.run.app";

function transformErrorResponse(error: any): FetchBaseQueryError {
  return error.data?.detail ? { ...error, data: error.data.detail } : error;
}


export type ProductStatus = {
  enabled: boolean;
  label: string;
  name: string;
  plu: string;
}

export type ProductSync<T> = {
  meta: any[];
  links: any;
  data: T
}

// Create 'gateway' reducer for api requests and 'gatewayApiConfig' slice to
// set GatewayConfig.
export function createGatewayApi(baseQuery = fetchBaseQuery) {
  const proxiedBaseQuery: BaseQueryFn<any, any, any> = async (args, api, extraOptions) => {
    const state = api.getState() as any;
    const config = state.gatewayApiConfig as GatewayConfig;

    const baseUrl = DIS_938_PROXY;

    const dynQuery = baseQuery({
      baseUrl,
      prepareHeaders: (headers) => {
        headers.set('content-type', 'application/json');
        if (config.bearerToken) {
          headers.set("Authorization", `Bearer ${config.bearerToken}`);
        }
        if (config.locationId) {
          headers.set("X-Location-Id", config.locationId);
        }
        if (config.configName) {
          headers.set("X-Config-Name", config.configName);
        }
        return headers;
      },
    });
    return dynQuery(args, api, extraOptions);
  };

  const gatewayApi = createApi({
    reducerPath: 'gateway',
    baseQuery: proxiedBaseQuery,
    tagTypes: ["WhoAmI", "CameraGroupProducts"],
    endpoints: (builder) => ({
      getWhoAmI: builder.query<{ user_id: number, email: string, team_id: number }, void>({
        query: () => "/api/v1/whoami",
        providesTags: ["WhoAmI"],
        transformErrorResponse
      }),
      testLocation: builder.query<{ data: any }, void>({
        // @ts-ignore: todo: I can't make it return with any acceptable error values.
        queryFn: async (_args, api, extraOptions) => {
          const args: FetchArgs = {
            url: "/api/v1/image-detection",
            method: "POST",
          };
          try {
            const { data, error } = await proxiedBaseQuery(args, api, extraOptions);
            /// this is response happens due to missing image, not missing config
            if (error && error.status === 422) {
              return { data: "Location Setup OK" }
            }
            return { data, error: transformErrorResponse(error) };
          }
          catch (error) {
            console.error("testLocation", error);
            // the missing object wrapping is weird, but working
            return { error: { message: transformErrorResponse(error) } };
          }
        },
        providesTags: ["WhoAmI"],
        // transformErrorResponse is not applied in queryFn, lol
      }),
      getCameraGroupProducts: builder.query<
        ProductSync<ProductStatus[]>,
        { cameraGroup: string; enabled?: boolean | null }
      >({
        query: ({ cameraGroup, enabled }) => {
          // Construct query string dynamically
          const params = new URLSearchParams();
          if (enabled !== null && enabled !== undefined) {
            params.append("enabled", String(enabled));
          }
          return `/api/v1/camera-group/${cameraGroup}/product?limit=10000${params.toString() ? "?" + params.toString() : ""}`;
        },
        providesTags: (result, error, { cameraGroup }) =>
          result ? [{ type: "CameraGroupProducts", id: cameraGroup }] : [],
      }),
      getEnabledCameraGroupProducts: builder.query<ProductSync<ProductStatus[]>, { cameraGroup: string }>({
        query: ({ cameraGroup }) => `/api/v1/camera-group/${cameraGroup}/product?enabled=true`,
        providesTags: (result, error, { cameraGroup }) =>
          result ? [{ type: "CameraGroupProducts", id: `${cameraGroup}-enabled` }] : [],
      }),

      getDisabledCameraGroupProducts: builder.query<ProductSync<ProductStatus[]>, { cameraGroup: string }>({
        query: ({ cameraGroup }) => `/api/v1/camera-group/${cameraGroup}/product?enabled=false`,
        providesTags: (result, error, { cameraGroup }) =>
          result ? [{ type: "CameraGroupProducts", id: `${cameraGroup}-disabled` }] : [],
      }),

    }),
  });

  const gatewaySlice = createSlice({
    name: 'gatewayApiConfig',
    initialState: {
      bearerToken: "",
      locationId: "",
      configName: null,
      baseUrl: "https://recognition.dishtracker.io"
    },
    reducers: {
      setGatewayToken: (state, action: { payload: string }) => {
        state.bearerToken = action.payload;
      },
      setGatewayLocation: (state, action: { payload: string }) => {
        state.locationId = action.payload;
      },
      setGatewayConfigName: (state, action: { payload: string | null }) => {
        state.configName = action.payload || null;
      },
      setGatewayBaseUrl: (state, action: { payload: string }) => {
        state.baseUrl = action.payload;
      },
    }
  });

  return {
    gatewayApi,
    gatewayActions: gatewaySlice.actions,
    gatewayReducer: {
      [gatewayApi.reducerPath]: gatewayApi.reducer,
      [gatewaySlice.name]: gatewaySlice.reducer,
    },
    gatewayMiddleware: gatewayApi.middleware,
  };
}
