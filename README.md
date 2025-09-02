# API Gateway

A Node.js-based API Gateway that acts as a reverse proxy, routing incoming client requests to the appropriate microservices. Handles authentication, logging, and load balancing for a microservice architecture.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture](#architecture)  
- [API Routes](#api-routes)  
- [Getting Started](#getting-started)  
- [Configuration](#configuration)  
- [Usage](#usage)  

---

## Features

- **Reverse Proxy:** Routes requests to appropriate backend services based on URL patterns.  
- **Authentication:** Validates JWT tokens before forwarding requests to services.  
- **Centralized Logging:** Logs all incoming requests and responses.  
- **Error Handling:** Returns standardized error responses for failed service requests.  
- **Service Discovery Ready:** Easily integrates with service registry for dynamic routing.  

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Proxy:** http-proxy-middleware  
- **Authentication:** JSON Web Tokens (JWT)  
- **Logging:** Winston / Morgan  

---

## Architecture

Client
│
▼
API Gateway (Node.js + Express)
│
├──> User Service (e.g., /api/users/)
├──> Product Service (e.g., /api/products/)
└──> Order Service (e.g., /api/orders/*)

The Gateway receives all client requests, applies middleware like authentication and logging, and forwards requests to the appropriate backend services.

---

## API Routes

The API Gateway exposes routes that correspond to the underlying services. Example routing configuration:

| Gateway Route            | Method | Forwarded To Service       |
|---------------------------|--------|---------------------------|
| `/api/users/*`            | ALL    | User Service              |
| `/api/products/*`         | ALL    | Product Service           |
| `/api/orders/*`           | ALL    | Order Service             |

> The gateway does not implement business logic; it only forwards requests and handles cross-cutting concerns like auth, logging, and rate-limiting.

---

## Getting Started

### Prerequisites

- Node.js v18+  
- Git  
- Access to backend microservices (e.g., User Service, Product Service)  

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/api-gateway.git
cd api-gateway

# Install dependencies
npm install

Running the Gateway
# Start in development mode
npm run dev
```
