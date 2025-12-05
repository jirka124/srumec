# Shrumec Microservices — Orchestration

:exclamation: This repository is part of **Srumec** project, [See It First](https://github.com/jirka124/srumec)

Repository contains the **orchestration layer** for the Shrumec microservices architecture using Docker Compose.  
Its purpose is to run all related services in a unified environment for **development and production**.

---

## 🚀 Overview

The stack includes the following services:

- **Events Service** — Node.js backend processing event data
- **Chats Service** — Node.js backend processing chats data
- **Auth Service** — Python backend providing functions of AUTH and JWT generation/validation
- **Expire Service** — Node.js backend notifying about events expiration
- **API Gateway** — Nginx reverse proxy serving as API gateway into cluster
- **3x PostgreSQL + 1x PostGIS** — database for the Events and Chats Service
- **RabbitMQ** — message broker
- **pgAdmin 4** — web UI for managing the PostgreSQL databases

This repository contains **only orchestration**.  
Source code for services lives in their respective repositories:

```
../srumec-events-service
../srumec-rabbitmq-service
```

---

## 📁 Repository Structure

```
/
├─ docker-compose.yml          → Base stack
├─ docker-compose.dev.yml      → Development overrides
├─ docker-compose.prod.yml     → Production overrides
└─ README.md
```

---

## 🧩 Services Overview

### **1. Events Service**

- Node.js backend processing event data
- Port:
  - exposed: `4000 (dev only)`, `8000 (proxied)`
  - internal: `4000`

Event Service Docs (Redoc):
➡ http://localhost:8000/v1/events/docs

Event Service Docs (Swagger):
➡ http://localhost:8000/v1/events/docs-swagger

Event Service Docs (OpenAPI json):
➡ http://localhost:8000/v1/events/docs-raw

### **2. Chats Service**

- Node.js backend processing chat data
- Port:
  - exposed: `4001 (dev only)`, `8000 (proxied)`
  - internal: `4000`

Chat Service Docs (Redoc):
➡ http://localhost:8000/v1/chats/docs

Chat Service Docs (Swagger):
➡ http://localhost:8000/v1/chats/docs-swagger

Chat Service Docs (OpenAPI json):
➡ http://localhost:8000/v1/chats/docs-raw

### **3. Auth Service**

- Python backend providing auth

Auth Service Docs (Swagger):
➡ http://localhost:8000/auth/docs

### **4. Expire Service**

- Node.js backend notifying about events expiration

### **5. API Gateway**

- Nginx reverse proxy with JWT validation
- Port:
  - exposed: `8000`
  - internal: `80`

### **6. PostgreSQL + PostGIS**

- Database for the Events, Chats, Auth Service
- Port: `5672`

### **7. RabbitMQ**

- RabbitMQ Broker
- Ports:
  - `15672` — Management UI

RabbitMQ Management:
➡ http://localhost:15672

### **8. pgAdmin 4**

- Web UI for PostgreSQL
- Port: `5431`
- Default credentials:
  ```
  PGADMIN_DEFAULT_EMAIL=admin@admin.com
  PGADMIN_DEFAULT_PASSWORD=admin
  ```
  pgAdmin 4 UI:
  ➡ http://localhost:5431

RabbitMQ Management:
➡ http://localhost:15672

---

## ▶ Running the Stack

### **Development Mode**

Start:

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Stop:

```sh
docker compose down
```

---

### **Production Mode**

Start:

```sh
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

Stop:

```sh
docker compose down
```

---

## 🔧 Useful Commands

### Rebuild a single service

```sh
docker compose build events-service
```

### Restart a service

```sh
docker compose restart events-service
```

### Follow logs

```sh
docker compose logs -f events-service
docker compose logs -f events-postgres
docker compose logs -f chats-service
docker compose logs -f chats-postgres
docker compose logs -f expire-service
docker compose logs -f auth-service
docker compose logs -f auth-postgres
docker compose logs -f auth-gateway
docker compose logs -f rabbitmq-service
docker compose logs -f pgadmin
```

### Access shell console

```sh
docker compose exec -it events-service sh
```
