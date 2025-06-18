#!/usr/bin/env python3
import urllib.request
import urllib.error

try:
    response = urllib.request.urlopen('http://localhost:3001/api/test-airtable')
    print(response.read().decode())
except urllib.error.URLError as e:
    print(f"Connection failed: {e}")
except Exception as e:
    print(f"Error: {e}")