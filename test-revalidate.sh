#!/bin/bash

# Test the revalidation API
echo "Testing revalidation API..."

curl -X POST http://localhost:3002/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret": "43a1d86448f2d2c4eb77b72fc5a32b9329d97a53f444e71a35c6d71a3138a694", "type": "all"}'

echo ""
echo "Test completed."