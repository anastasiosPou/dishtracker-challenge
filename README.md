## react-product-entry-demo

In this challenge, you will build an app that gets canteen operators started using Dishtracker!

### User story

A canteen operator has a bunch of products that they want to sell for today.
Products and their [PLUs](https://en.wikipedia.org/wiki/Price_look-up_code) are valid for colleagues in other restaurants too.
The operator is allowed to create/edit products for everyone, but eventually needs their products enabled
in a `CameraGroup` specific to the restaurant.


### Functionality

The operator enters the Bearer token and a `CameraGroup` to begin with.
Afterwards, they can do the following:

* Create new products and categories (`/api/v1/product`)
* Enable/Disable/Delete product statuses for the specific camera group (`/api/v1/camera-group/{camera group name}/product`)
* Update product details such as name and PLU (optional)


### Getting started

The endpoints are documented in the [ProductSync OpenAPI schema](./get_started/ProductSync_OpenAPI.json)
and live API: https://recognitionstaging.dishtracker.io/docs#/ProductSync

Note that `labels` which identify Dishtracker products and categories, need to follow
strict regexes and a product needs a category as prefix in the label.

:construction: -- not fully implemented yet
The project includes a read-only redux client. To run, create `.env.local`:

```
NEXT_PUBLIC_RECOGNITION_TOKEN=<yourBearerToken>
NEXT_PUBLIC_CAMERA_GROUP=<yourCameraGroup>
```

Then:

```
yarn dev
```


### Submission

Submit your solution via a GitHub repository or tarball.
You can use any React framework of your choice.
Include instructions for running the project.
Our Devs will discuss decisions and thoughts you had during implementation!
