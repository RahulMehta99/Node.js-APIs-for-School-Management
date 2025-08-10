# School Management API

A Node.js REST API for managing school data with proximity-based sorting using Supabase as the database.

## Features

- **Add School**: POST `/addSchool` - Add a new school with validation
- **List Schools**: GET `/listSchools` - Get schools sorted by proximity to user location

## Tech Stack

- Node.js
- Express.js
- Supabase (PostgreSQL)
- Express Validator

## API Endpoints

### POST /addSchool
Add a new school to the database.

**Request Body:**
```json
{
  "name": "School Name",
  "address": "School Address",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

**Response:**
```json
{
  "message": "School added successfully!",
  "school": {
    "id": 1,
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

### GET /listSchools?userLat=18.5204&userLon=73.8567
Get all schools sorted by proximity to user location.

**Query Parameters:**
- `userLat`: User's latitude (-90 to 90)
- `userLon`: User's longitude (-180 to 180)

**Response:**
```json
[
  {
    "id": 1,
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "distance_km": 2.5
  }
]
```

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Run the server: `npm start`

## Environment Variables

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
PORT=3000
```

## Deployment

This API is deployed on Render. The live endpoints are available at the deployed URL.
