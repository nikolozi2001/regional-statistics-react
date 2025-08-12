#!/bin/bash

# Backend API Test Script
BASE_URL="http://localhost:8080"

echo "🧪 Testing Backend Security & Structure Improvements"
echo "=================================================="

# Test health endpoint
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | jq '.' 2>/dev/null || curl -s "$BASE_URL/health"
echo -e "\n"

# Test API health endpoint
echo "2. Testing API Health Check..."
curl -s "$BASE_URL/api/health" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/health"
echo -e "\n"

# Test API test endpoint
echo "3. Testing API Test Endpoint..."
curl -s "$BASE_URL/api/test" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/test"
echo -e "\n"

# Test regions endpoint
echo "4. Testing Regions Endpoint..."
curl -s "$BASE_URL/api/regions" | jq '.success, .count' 2>/dev/null || curl -s "$BASE_URL/api/regions" | head -5
echo -e "\n"

# Test specific region endpoint
echo "5. Testing Specific Region Endpoint..."
curl -s "$BASE_URL/api/regions/1" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/regions/1"
echo -e "\n"

# Test main info endpoint
echo "6. Testing Main Info Endpoint..."
curl -s "$BASE_URL/api/mainInfo?lang=en" | jq '.success, .language, .count' 2>/dev/null || curl -s "$BASE_URL/api/mainInfo?lang=en" | head -5
echo -e "\n"

# Test 404 handling
echo "7. Testing 404 Error Handling..."
curl -s "$BASE_URL/api/nonexistent" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/nonexistent"
echo -e "\n"

# Test rate limiting (multiple rapid requests)
echo "8. Testing Rate Limiting..."
for i in {1..3}; do
  curl -s "$BASE_URL/api/test" > /dev/null && echo "Request $i: Success" || echo "Request $i: Failed"
done
echo -e "\n"

echo "✅ Backend testing completed!"
