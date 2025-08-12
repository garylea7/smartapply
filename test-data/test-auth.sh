#!/bin/bash
# Test authentication flow for SmartApply ATS Resume Checker
# This script tests the magic link authentication flow

# Configuration
BASE_URL="http://localhost:3000"
TEST_EMAIL="test@example.com"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to make API calls
call_api() {
  local method=$1
  local endpoint=$2
  local data=$3
  local headers=$4
  
  if [ -z "$data" ]; then
    curl -s -X $method "$BASE_URL$endpoint" $headers
  else
    curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json" $headers -d "$data"
  fi
}

# Function to extract token from response
extract_token() {
  echo $1 | grep -o '"token":"[^"]*"' | sed 's/"token":"\([^"]*\)"/\1/'
}

echo -e "${YELLOW}SmartApply Authentication Test Script${NC}"
echo "=================================="
echo "Testing against: $BASE_URL"
echo "Test email: $TEST_EMAIL"
echo "=================================="

# Test 1: Request Magic Link
echo -e "\n${YELLOW}Test 1: Requesting Magic Link${NC}"
magic_link_response=$(call_api "POST" "/api/auth/magic-link" "{\"email\":\"$TEST_EMAIL\"}")
echo "Response: $magic_link_response"

if [[ $magic_link_response == *"success\":true"* ]]; then
  echo -e "${GREEN}✓ Magic link request successful${NC}"
else
  echo -e "${RED}✗ Magic link request failed${NC}"
  exit 1
fi

# Test 2: Simulate Magic Link Verification (this would normally be done via email)
echo -e "\n${YELLOW}Test 2: Simulating Magic Link Verification${NC}"
echo "Note: In a real scenario, the user would click a link in their email."
echo "For testing purposes, we'll need to manually create a token."

# For testing, we can create a token directly in the database or mock the verification
echo "Please check the server logs for the magic link token or create one manually."
read -p "Enter the token from the magic link (or press Enter to skip): " token

if [ -z "$token" ]; then
  echo -e "${YELLOW}⚠ Skipping verification test${NC}"
else
  verify_response=$(call_api "GET" "/api/auth/verify?token=$token" "")
  echo "Response: $verify_response"
  
  if [[ $verify_response == *"success\":true"* ]]; then
    echo -e "${GREEN}✓ Verification successful${NC}"
  else
    echo -e "${RED}✗ Verification failed${NC}"
  fi
fi

# Test 3: Access Protected Route
echo -e "\n${YELLOW}Test 3: Accessing Protected Route${NC}"
echo "Attempting to access a protected route without authentication..."

protected_response=$(call_api "GET" "/api/subscription" "")
echo "Response: $protected_response"

if [[ $protected_response == *"error"* ]]; then
  echo -e "${GREEN}✓ Protected route correctly denied access${NC}"
else
  echo -e "${RED}✗ Protected route did not deny access${NC}"
fi

# Test 4: Signout
echo -e "\n${YELLOW}Test 4: Testing Signout${NC}"
echo "Note: This test requires an authenticated session with a valid token."
read -p "Do you have a valid authenticated session? (y/n): " has_session

if [ "$has_session" = "y" ]; then
  signout_response=$(call_api "POST" "/api/auth/signout" "{}")
  echo "Response: $signout_response"
  
  if [[ $signout_response == *"success\":true"* ]]; then
    echo -e "${GREEN}✓ Signout successful${NC}"
  else
    echo -e "${RED}✗ Signout failed${NC}"
  fi
else
  echo -e "${YELLOW}⚠ Skipping signout test${NC}"
fi

# Test 5: Session Persistence
echo -e "\n${YELLOW}Test 5: Testing Session Persistence${NC}"
echo "Note: This test requires browser interaction to test cookies."
echo "Please use the browser to verify that:"
echo "1. After login, the session persists across page refreshes"
echo "2. After signout, protected routes redirect to login"

echo -e "\n${YELLOW}Authentication Testing Complete${NC}"
echo "=================================="
echo "Summary:"
echo "- Magic Link Request: Tested"
echo "- Verification: $([ -z "$token" ] && echo "Skipped" || echo "Tested")"
echo "- Protected Routes: Tested"
echo "- Signout: $([ "$has_session" = "y" ] && echo "Tested" || echo "Skipped")"
echo "- Session Persistence: Manual verification required"
echo "=================================="
