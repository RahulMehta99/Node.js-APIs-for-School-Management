# School Management API Documentation

## 🌐 Live API Endpoints

**Base URL**: `https://school-management-api-latest.onrender.com` *(Replace with your actual Render URL)*

---

## 📋 API Endpoints

### 1. Add School API

**Endpoint**: `POST /addSchool`

**Description**: Adds a new school to the database with validation.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "School Name",
  "address": "Complete Address",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

**Validation Rules**:
- `name`: Required, non-empty string
- `address`: Required, non-empty string  
- `latitude`: Required, float between -90 and 90
- `longitude`: Required, float between -180 and 180

**Success Response** (201 Created):
```json
{
  "message": "School added successfully!",
  "school": {
    "id": 1,
    "name": "School Name",
    "address": "Complete Address",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "created_at": "2025-08-10T12:00:00.000Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "School name is required.",
      "path": "name",
      "location": "body"
    }
  ]
}
```

---

### 2. List Schools API

**Endpoint**: `GET /listSchools`

**Description**: Retrieves all schools sorted by proximity to user's location.

**Query Parameters**:
- `userLat` (required): User's latitude (-90 to 90)
- `userLon` (required): User's longitude (-180 to 180)

**Example Request**:
```
GET /listSchools?userLat=18.5204&userLon=73.8567
```

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Nearby School",
    "address": "123 Close Street",
    "latitude": 18.5300,
    "longitude": 73.8600,
    "distance_km": 2.45,
    "created_at": "2025-08-10T12:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Distant School", 
    "address": "456 Far Avenue",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "distance_km": 118.23,
    "created_at": "2025-08-10T12:30:00.000Z"
  }
]
```

**Error Response** (400 Bad Request):
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "A valid user latitude (userLat) is required.",
      "path": "userLat",
      "location": "query"
    }
  ]
}
```

---

## 🔄 Distance Calculation

The API uses the **Haversine formula** to calculate the great-circle distance between two points on Earth:

```javascript
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}
```

---

## 🏗️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: Supabase (PostgreSQL)
- **Validation**: express-validator
- **Hosting**: Render
- **Version Control**: Git + GitHub

---

## 🧪 Testing Examples

### Example 1: Add a School in Bangalore
```bash
curl -X POST https://your-app-url.onrender.com/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Global Tech Academy",
    "address": "123 Tech Park, Bangalore, Karnataka",
    "latitude": 12.9716,
    "longitude": 77.5946
  }'
```

### Example 2: Find Schools Near Pune
```bash
curl "https://your-app-url.onrender.com/listSchools?userLat=18.5204&userLon=73.8567"
```

---

## ⚡ Performance Notes

- **Cold Start**: ~30 seconds on Render free tier after inactivity
- **Response Time**: <500ms for typical requests
- **Database**: Supabase provides sub-100ms query times
- **Sorting**: In-memory sorting of results by distance

---

## 🔐 Security Features

- Input validation on all endpoints
- SQL injection protection via Supabase client
- Environment variable protection
- CORS enabled for web clients
- Request body size limits
