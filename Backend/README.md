# Nation Sound Festival - Backend 🎵

## Description

The **NationSound Festival project** is a dynamic web application for managing artists (dates, stages, schedules, music genres, and descriptions), security information, news, points of interest, and festival newsletters. This project is built using **Node.js**, **Payload CMS**, and **MongoDB**, and is deployed on **Render** for the backend and **Vercel** for the frontend.

## Table of Contents

+ [Prerequisites](#prerequisites)
+ [Installation](#installation)
+ [Deployment](#deployment)
+ [Key Features](#key-features)
+ [Project Architecture](#project-architecture)
+ [API Endpoints](#api-endpoints)
+ [Security](#security)
+ [Production Launch](#production-launch) 
  
## Prerequisites

- **Node.js** (version 14.x or higher)
- **MongoDB** (Atlas or local instance)
- **NPM** (Node Package Manager)
- **SendGrid** (for sending newsletters)
- **Payload CMS** (for content management)
- **Git** (for cloning the repository)
- **http-server** (for serving frontend files)

## Installation

### 1. Clone the project from GitHub

`git clone https://github.com/Charlotte-Hzb/Nation-Sound-Festival-Project.git`
`cd Nation-Sound-Festival-Project`

### 2. Install Dependencies

After cloning, install the required dependencies via NPM :

`npm install`

### 3. Configure Environment Variables

Create a .env file at the project root and configure it with your own values :

`MONGODB_URI=my_mongodb_uri`
`PAYLOAD_SECRET=my_payload_secret`
`SENDGRID_API_KEY=my_sendgrid_api_key`
`PORT=8300`

### 4. Start the Server in Development Mode

Once configuration is complete, start the application in development mode :

`npm run dev`

The application will be accessible at http://localhost:8300/admin.

## Deployment

### 1. Déploiement local

To deploy locally, follow these steps :

Make sure MongoDB and SendGrid are configured, and that environment variables are properly set.

Start a local server to serve frontend files using http-server in the folder where frontend files are located :

`http-server frontend -p 8080`

The application will then be accessible at http://localhost:8080.

<!-- Advantages of using separate ports for frontend and backend : 

+ Clear separation between frontend and backend : Each part of the application (UI and API) is managed separately on different ports.
+ Simplified development : Easily modify the backend or frontend code without interference. The frontend can make AJAX requests to port 8300 to fetch backend data. -->

### 2. Production Deployment

Configure the backend on Render and the frontend on Vercel. Ensure that environment variables are set on the Render platform for the backend, and add necessary CORS rules to allow communication between domains.

## Key Features

- Artist and Concert Management : Add, edit, and delete artists via the Payload CMS admin interface.
- Points of Interest Management : Display and manage points of interest (stages, food stalls, etc.) on an interactive map using Leaflet.js.
- Newsletter Subscription : Users can subscribe to the newsletter for festival updates.
- Newsletter Delivery : SendGrid is used to send newsletters to subscribers.
- News Display : Latest news is displayed in real-time with an automatic pagination system.

## Project Architecture

The backend architecture is as follows :

Backend/
├── src/
  ├── collections/           # Payload CMS Collections (Concerts, BreakingNews, etc.)
  ├── views/
  │   └── artist_template.ejs # EJS template for artist pages
  ├── payload.config.ts       # Payload CMS configuration
  └── server.ts               # Express server with endpoints
├── media/                      # Folder for media assets
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation

The **payload.config.ts** file configures collections, plugins, and Payload CMS settings, while **server.ts** manages routes and API interactions.

## API Endpoints

### 1. /api/newsletter (POST)

- Description : Registers a user for the newsletter.
- HTTP Method : POST
- URL : /api/newsletter

### 2. /api/send-newsletter (POST)

- Description : Sends the latest newsletter to all registered subscribers.
- HTTP Method : POST
- URL : /api/send-newsletter

### 3. /api/concerts (GET)

- Description : Retrieves artists and concerts, sorted by date, with optional filtering by music genre.
- HTTP Method : GET
- URL : /api/concerts 

### 4. /concerts/:slug.html (GET)

- Description : Fetches and displays details for a specific concert based on its slug.
- HTTP Method : GET
- URL : /concerts/:slug

### 5. /api/points-d-interet (GET)

- Description : Retrieves points of interest (food stalls, stages, restrooms, etc.) for display on a map.
- HTTP Method : GET
- URL : /api/points-d-interet

### 6. /api/breaking-news (GET)

- Description : Fetches important news updates with pagination support.
- HTTP Method : GET
- URL : /api/breaking-news

## Security

- XSS Protection : EJS templates are used with security practices to prevent script injection.
- CORS : Configured CORS headers restrict requests to specific domains.
- Rate Limiting : express-rate-limit limits API requests to 100 per IP every 15 minutes.
- Content Security Policy (CSP) : Added CSP rules strengthen security for embedded content.
- Payload CMS Security : Authentication operations are secured with a secret key.
  
## Production Launch

`npm run build` # Compiles TypeScript code
`npm run serve` # Starts the application in production mode
