import { createSlice, createSelector } from "@reduxjs/toolkit";
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

//Variables and constants
const DIS_938_PROXY = "https://checkout-cloud-proxy-xwjw6zpyiq-ew.a.run.app";

//Types and Interfaces
export type GatewayConfig = {
  bearerToken: string;
  locationId: string;
  configName: string | null;
  baseUrl: string
}

export type ProductStatus = {
  enabled: boolean;
  label: string;
  name: string;
  plu: string;
  category: string;
}

export type ProductSync<T> = {
  meta: any[];
  links: any;
  data: T
}

export type NewProduct = Pick<ProductStatus, 'label' | 'name' | 'plu' | 'category'>;

export type UpdatedProduct = NewProduct;

export type EnabledProduct = {
  cameraGroup: string;
  label: string;
}

export type DisabledProduct = EnabledProduct;

export interface Category {
  label: string;
  parent_category: Category;
  products: ProductStatus[];
  name: string;
  child_categories: Category[];
}

export type NewCategory = {
  label: string;
  parent_category_label: string | null;
  name: string;
}

export type CategoryResponse = {
  links: {
    url: string;
  }
}


function transformErrorResponse(error: any): FetchBaseQueryError {
  return error.data?.detail ? { ...error, data: error.data.detail } : error;
}

/*
  The createGatewayApi creates the gatewayApi(aka RTK Query) and a slice that 
  manages the configuration that enables the communication with the endpoints.
*/
export function createGatewayApi() {
  const proxiedBaseQuery: BaseQueryFn<any, any, any> = async (args, api, extraOptions) => {
    const state = api.getState() as any;
    const config = state.gatewayApiConfig as GatewayConfig;

    const baseUrl = DIS_938_PROXY;

    const dynQuery = fetchBaseQuery({
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
    tagTypes: ["WhoAmI", "CameraGroupProducts", 'Product', 'Category'],
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
      getAllProducts: builder.query<ProductSync<ProductStatus[]>, void>({
        query: () => 'api/v1/product?offset=0&limit=100',
        //TODO I need to create specific tags for each product
        providesTags: ['CameraGroupProducts']
      }),
      getCameraGroupProducts: builder.query<ProductSync<ProductStatus[]>, { cameraGroup: string; enabled?: boolean | null }>({
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
          result ? ["CameraGroupProducts",{ type: "CameraGroupProducts", id: `${cameraGroup}-enabled` }] : [],
      }),
      getDisabledCameraGroupProducts: builder.query<ProductSync<ProductStatus[]>, { cameraGroup: string }>({
        query: ({ cameraGroup }) => `/api/v1/camera-group/${cameraGroup}/product?enabled=false`,
        providesTags: (result, error, { cameraGroup }) =>
          result ? [{ type: "CameraGroupProducts", id: `${cameraGroup}-disabled` }] : [],
      }),
      getProduct: builder.query<ProductStatus, {label: string}>({
        query: ({label}) => `api/v1/product/${label}`
      }),
      createCameraGroup: builder.mutation<undefined, string>({
        query: (cameraGroup) => ({
          url: '/api/v1/camera-group',
          method: 'POST',
          body: {name: cameraGroup}
        }),
        transformErrorResponse
      }),
      createProduct: builder.mutation<ProductSync<ProductStatus>, NewProduct>({
        query: (newProduct) => ({
          url: '/api/v1/product',
          method: 'POST',
          body: newProduct
        }),
        invalidatesTags: ['Product']
      }),
      createCategory: builder.mutation<CategoryResponse, NewCategory>({
        query: (newCategory) => ({
          url: '/api/v1/category',
          method: 'POST',
          body: newCategory
        }),
        invalidatesTags: ['Category']
      }),
      enableProduct: builder.mutation<void, EnabledProduct>({
        query: (enabledProduct) => ({
          url: `/api/v1/camera-group/${enabledProduct.cameraGroup}/product/${enabledProduct.label}`,
          method: 'PUT',
          body: {enabled: true}
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'CameraGroupProducts', id: `${arg.cameraGroup}-enabled` }]
      }),
      disableProduct: builder.mutation<void, DisabledProduct>({
        query: ({cameraGroup, label}) => ({
          url: `/api/v1/camera-group/${cameraGroup}/product/${label}`,
          method: 'DELETE'
        }),
        //TODO: I need to invalidate only the specific product, not all the products.
        invalidatesTags: (result, error, arg) => [{type: 'CameraGroupProducts', id: `${arg.cameraGroup}-enabled`}]
      }),
      removeProduct: builder.mutation<void, string>({
        query: (productLabel) => ({
          url: `/api/v1/product/${productLabel}`,
          method: 'DELETE'
        }),
        //TODO: I need to invalidate only the specific product, not all the products.
        invalidatesTags: ['CameraGroupProducts']
      }),
      updateProduct: builder.mutation<null, UpdatedProduct>({
        query: (updatedProduct) => ({
          url: `/api/v1/product/${updatedProduct.label}`,
          method: 'PUT',
          body: updatedProduct
        }),
        //TODO: I need to invalidate only the specific product, not all the products.
        invalidatesTags: ['CameraGroupProducts']
      })
    }),
  });

  const gatewaySlice = createSlice({
    name: 'gatewayApiConfig',
    initialState: {
      bearerToken: "",
      locationId: "",
      configName: null,
      baseUrl: "https://recognition.dishtracker.io",
      cameraGroup: ""
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
      setCameraGroup: (state, action: {payload: string}) => {
        state.cameraGroup = action.payload;
      }
    }
  });

  // const selectCameraGroup = (state: RootState) => state.gatewayApiConfig.cameraGroup;
  const selectCameraGroup = createSelector(
    (state) => state.gatewayApiConfig,
    ({cameraGroup}) => cameraGroup
  );

  return {
    gatewayApi,
    gatewayActions: gatewaySlice.actions,
    selectCameraGroup,
    gatewayReducer: {
      [gatewayApi.reducerPath]: gatewayApi.reducer,
      [gatewaySlice.name]: gatewaySlice.reducer,
    },
    gatewayMiddleware: gatewayApi.middleware,
  };
}
