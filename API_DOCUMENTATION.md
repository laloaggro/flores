# API Documentation

## Overview

This document provides information about the Flores e-commerce application's API endpoints and data structures.

## Base URL

All API endpoints are relative to the base URL: `https://api.flores.example.com/v1`

## Authentication

Some endpoints require authentication via JWT tokens. These are obtained by logging in through the `/auth/login` endpoint.

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST `/auth/login`
Login to the application.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

### Products

#### GET `/products`
Get a list of all products.

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Limit the number of results
- `offset` (optional): Offset for pagination

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "price": "number",
    "image": "string",
    "category": "string"
  }
]
```

#### GET `/products/:id`
Get details of a specific product.

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "price": "number",
  "image": "string",
  "category": "string",
  "stock": "number"
}
```

### Cart

#### GET `/cart`
Get the current user's cart.

**Response:**
```json
{
  "items": [
    {
      "productId": "number",
      "quantity": "number",
      "product": {
        "id": "number",
        "name": "string",
        "price": "number",
        "image": "string"
      }
    }
  ],
  "total": "number"
}
```

#### POST `/cart/items`
Add an item to the cart.

**Request Body:**
```json
{
  "productId": "number",
  "quantity": "number"
}
```

**Response:**
```json
{
  "message": "Item added to cart"
}
```

#### PUT `/cart/items/:productId`
Update the quantity of an item in the cart.

**Request Body:**
```json
{
  "quantity": "number"
}
```

**Response:**
```json
{
  "message": "Cart updated"
}
```

#### DELETE `/cart/items/:productId`
Remove an item from the cart.

**Response:**
```json
{
  "message": "Item removed from cart"
}
```

### Orders

#### GET `/orders`
Get the current user's order history.

**Response:**
```json
[
  {
    "id": "number",
    "date": "string",
    "total": "number",
    "status": "string",
    "items": [
      {
        "productId": "number",
        "quantity": "number",
        "price": "number"
      }
    ]
  }
]
```

#### POST `/orders`
Create a new order from the current cart.

**Response:**
```json
{
  "id": "number",
  "date": "string",
  "total": "number",
  "status": "string"
}
```

### Admin

#### GET `/admin/orders`
Get all orders (admin only).

**Response:**
```json
[
  {
    "id": "number",
    "userId": "number",
    "date": "string",
    "total": "number",
    "status": "string"
  }
]
```

#### PUT `/admin/orders/:id`
Update an order status (admin only).

**Request Body:**
```json
{
  "status": "string"
}
```

**Response:**
```json
{
  "message": "Order status updated"
}
```

#### POST `/admin/products`
Create a new product (admin only).

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "image": "string",
  "category": "string",
  "stock": "number"
}
```

**Response:**
```json
{
  "id": "number",
  "message": "Product created"
}
```

#### PUT `/admin/products/:id`
Update a product (admin only).

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "image": "string",
  "category": "string",
  "stock": "number"
}
```

**Response:**
```json
{
  "message": "Product updated"
}
```

#### DELETE `/admin/products/:id`
Delete a product (admin only).

**Response:**
```json
{
  "message": "Product deleted"
}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "error": "Bad Request",
  "message": "string"
}
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "message": "string"
}
```

**403 Forbidden**
```json
{
  "error": "Forbidden",
  "message": "string"
}
```

**404 Not Found**
```json
{
  "error": "Not Found",
  "message": "string"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "string"
}
```