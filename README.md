## react-product-entry-demo

This is the dashboard for the dishtracker frontend

### Running the program


First, create a `.env.local` file in the root foolder:

```
NEXT_PUBLIC_RECOGNITION_LOCATION_ID=f01dab1e-5295-4e64-b3a7-4f1bf76070ce
NEXT_PUBLIC_RECOGNITION_TOKEN=<yourBearerToken>
NEXT_PUBLIC_CAMERA_GROUP=<yourCameraGroup>
```

Then we need to install the dependences, run:

```
yarn

```

To run the project run: 
```
yarn dev

```

When you're at the login page, make sure the token is the same as the one
in the .env.local file. The cameraGroup has to be a new cameraGroup.

