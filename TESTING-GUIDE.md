# 🧪 Testing Guide for School Management API

## Quick Start Testing

### Prerequisites
- Postman installed
- Internet connection
- API deployed on Render

### Import Postman Collection
1. Download: `school-management-api-live.postman_collection.json`
2. Open Postman → Import → Select file
3. Update the `{{baseUrl}}` variable with your live URL

---

## 🎯 Test Scenarios

### Scenario 1: Basic Functionality Test
1. **Add first school** (Bangalore)
2. **Add second school** (Mumbai) 
3. **List schools** from Pune coordinates
4. **Verify sorting** by distance

### Scenario 2: Validation Testing
1. **Test empty fields** (should return 400)
2. **Test invalid coordinates** (should return 400)
3. **Test boundary values** (latitude: ±90, longitude: ±180)

### Scenario 3: Distance Calculation Test
1. Add schools in different cities
2. Test from various user locations
3. Verify distance calculations are reasonable

---

## 📊 Expected Test Results

### Distance Verification (from Pune: 18.5204, 73.8567)

| City | Latitude | Longitude | Expected Distance (km) |
|------|----------|-----------|----------------------|
| Mumbai | 19.0760 | 72.8777 | ~118 km |
| Bangalore | 12.9716 | 77.5946 | ~457 km |
| Delhi | 28.6139 | 77.2090 | ~1,163 km |
| Chennai | 13.0827 | 80.2707 | ~673 km |

---

## 🔧 Manual Testing Commands

### Using cURL

**Add School:**
```bash
curl -X POST https://your-app-url.onrender.com/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",
    "address": "Test Address, Test City",
    "latitude": 18.5204,
    "longitude": 73.8567
  }'
```

**List Schools:**
```bash
curl "https://your-app-url.onrender.com/listSchools?userLat=18.5204&userLon=73.8567"
```

### Using PowerShell (Windows)

**Add School:**
```powershell
$body = @{
    name = "Test School"
    address = "Test Address"
    latitude = 18.5204
    longitude = 73.8567
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-app-url.onrender.com/addSchool" -Method POST -Body $body -ContentType "application/json"
```

**List Schools:**
```powershell
Invoke-RestMethod -Uri "https://your-app-url.onrender.com/listSchools?userLat=18.5204&userLon=73.8567"
```

---

## ✅ Test Checklist

### Functional Tests
- [ ] Add school with valid data
- [ ] Add multiple schools
- [ ] List schools with valid coordinates
- [ ] Verify distance calculation accuracy
- [ ] Verify sorting by proximity

### Validation Tests
- [ ] Empty school name (should fail)
- [ ] Empty address (should fail)
- [ ] Invalid latitude > 90 (should fail)
- [ ] Invalid latitude < -90 (should fail)
- [ ] Invalid longitude > 180 (should fail)
- [ ] Invalid longitude < -180 (should fail)
- [ ] Missing userLat parameter (should fail)
- [ ] Missing userLon parameter (should fail)

### Edge Cases
- [ ] Schools at same location
- [ ] User at exact school location (distance = 0)
- [ ] Schools across different hemispheres
- [ ] Boundary coordinates (poles, date line)

### Performance Tests
- [ ] Cold start response time
- [ ] Warm response time
- [ ] Multiple concurrent requests
- [ ] Large number of schools (100+)

---

## 🐛 Troubleshooting

### Common Issues

**1. 500 Internal Server Error**
- Check environment variables are set correctly
- Verify Supabase connection
- Check server logs on Render

**2. 400 Bad Request**
- Verify request format matches documentation
- Check all required fields are present
- Validate coordinate ranges

**3. Cold Start Delays**
- First request after inactivity takes ~30 seconds
- Subsequent requests are fast
- Normal for Render free tier

**4. CORS Issues**
- API allows all origins by default
- Check browser console for specific errors

---

## 📈 Performance Expectations

### Response Times
- **Add School**: <300ms (warm), <30s (cold start)
- **List Schools**: <500ms (warm), <30s (cold start)
- **Database Query**: <100ms (Supabase)

### Throughput
- **Concurrent Users**: 10-50 (free tier)
- **Requests/min**: 1000+ (typical usage)
- **Uptime**: 99%+ (Render SLA)
