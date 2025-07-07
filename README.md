<h1 align="center">NEXEVENT</h1>

<p align="center"><em>Transforming Connections Into Limitless Experiences</em></p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/anandpskerala/nexevent" />
  <img src="https://img.shields.io/badge/typescript-99.3%25-blue" />
  <img src="https://img.shields.io/badge/languages-5-informational" />
</p>

<p align="center"><em> Built with the tools and technologies:</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/node.js-000000?style=for-the-badge&logo=Node.js" />
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socketdotio" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Vite-20232A?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/Razorpay-0F0F0F?style=for-the-badge&logo=razorpay" />
  <img src="https://img.shields.io/badge/YAML-000000?style=for-the-badge&logo=yaml" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary" />
</p>

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)


## Overview

**NexEvent** is an all-in-one platform designed to simplify the development of event management systems with a focus on scalability, real-time communication, and modular architecture. It combines robust backend microservices, real-time messaging, and a modern frontend setup to deliver a seamless developer experience.

---

### Why NexEvent?

This project helps developers build, manage, and scale event-driven applications efficiently.  
The core features include:

- 🛡️ **Role-based Route Protection**: Secure access control tailored for users, organizers, and admins.
- 🌐 **Real-Time Notifications & Chat**: Instant updates and messaging powered by Kafka, Redis, and socket.io.
- 🎥 **Video Conferencing**: Secure, live video sessions integrated into the platform.
- 🚀 **Modular Microservices Architecture**: Containerized services for user, event, message, and admin management.
- 📊 **Analytics & Admin Dashboards**: Data-driven insights for platform performance.
- 💄 **Modern Frontend**: React, TypeScript, Vite, Tailwind CSS for a responsive, maintainable UI.

## Getting Started

### 📋 Prerequisites

This project requires the following dependencies:

- **Programming Language**: TypeScript  
- **Package Manager**: Pnpm  
- **Container Runtime**: Docker  

---

### Installation

Build NexEvent from the source and install dependencies:

1. **Clone the repository:**

```bash
git clone https://github.com/anandpskerala/NexEvent
```

2. **Navigate to the folder:**
```bash
cd NexEvent
```

3. **Install dependencies:**
```bash
docker-compose build --no-cache
```


### Usage

Run the project with docker:

```bash
docker-compose up -d
```

### 🧪 Environment Variables 

Each service have different env variables

### 📁 Folder Structure

```bash
NexEvent/
├── backend/
│   ├── api-gateway/
│   ├── user-service/
│   ├── admin-service/
│   ├── event-service/
│   ├── message-service/
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── ...
├── k8s/
├── docker-compose.yml
└── README.md
```

### ✨ Features

- 🎫 Event Booking System
- 💬 Real-Time Messaging with Socket.IO
- 🔔 Notifications via Redis Pub/Sub
- 🎥 LiveKit Integration for Video Calling
- 🔐 JWT Authentication & Authorization
- 💳 Razorpay & Stripe Payment Integration
- 📡 Kafka-based Event Communication
- 📊 Admin Dashboard with Charts

### 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, DaisyUI  
- **Backend**: Node.js, Express, REST API, KafkaJS  
- **Messaging**: Kafka, Redis Pub/Sub, Socket.IO  
- **Database**: MongoDB, Mongoose  
- **DevOps**: Docker, Kubernetes

### **Contributing Guide**

```md
## 🤝 Contributing

We welcome contributions! Here's how to get started:

# Fork the repository
# Clone your fork
# Create a new branch
# Make changes and commit
# Push and create a PR
```

## 🙏 Acknowledgements

- [KafkaJS](https://kafka.js.org/)
- [LiveKit](https://livekit.io/)
