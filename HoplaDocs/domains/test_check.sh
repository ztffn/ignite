#!/bin/bash

# Test script for domain checking with just a few domains

CSV_FILE="/tmp/test_domains.csv"
TEMP_FILE="/tmp/test_domains_temp.csv"
CURRENT_DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Function to check domain availability
check_domain() {
    local domain=$1
    local extension=$2
    local full_domain="${domain}.${extension}"
    
    echo "Checking $full_domain..."
    
    # Run domain-check and capture output
    local result=$(domain-check "$full_domain" 2>&1)
    local exit_code=$?
    
    # Parse the result
    if echo "$result" | grep -q "is available"; then
        echo "Available"
    elif echo "$result" | grep -q "is NOT available\|is registered\|is taken"; then
        echo "Taken"
    elif echo "$result" | grep -q "Error\|Invalid\|not found"; then
        echo "Error"
    else
        echo "Unknown"
    fi
}

# Create header for new CSV
echo "Domain,COM Status,APP Status,Last Checked" > "$TEMP_FILE"

# Read CSV file (skip header) and process each domain
tail -n +2 "$CSV_FILE" | while IFS=',' read -r domain rest; do
    # Skip empty lines
    if [ -z "$domain" ]; then
        continue
    fi
    
    # Clean domain name (remove any whitespace)
    domain=$(echo "$domain" | tr -d ' \t\r\n')
    
    if [ -n "$domain" ]; then
        # Check .com availability
        com_status=$(check_domain "$domain" "com")
        
        # Check .app availability  
        app_status=$(check_domain "$domain" "app")
        
        # Write to temp file
        echo "${domain},${com_status},${app_status},${CURRENT_DATE}" >> "$TEMP_FILE"
        
        # Add small delay to be respectful to domain check service
        sleep 1
    fi
done

# Show results
echo "Test results:"
cat "$TEMP_FILE"