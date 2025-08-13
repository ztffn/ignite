#!/bin/bash

# Domain checker script for .com and .app domains
# Updates CSV with availability status and last checked date

CSV_FILE="/Users/steffen/Sites/hopla_ignite/HoplaDocs/domains/domains.csv"
TEMP_FILE="/tmp/domains_temp.csv"
CURRENT_DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Check if domain-check tool is available
if ! command -v domain-check &> /dev/null; then
    echo "Error: domain-check tool not found in PATH"
    exit 1
fi

# Check if CSV file exists
if [ ! -f "$CSV_FILE" ]; then
    echo "Error: CSV file not found at $CSV_FILE"
    exit 1
fi

# Function to check .com domain availability using domain-check tool
check_com_domain() {
    local domain=$1
    local full_domain="${domain}.com"
    
    echo "Checking $full_domain..." >&2
    
    # Run domain-check and capture output
    local result=$(domain-check "$full_domain" 2>&1)
    
    # Parse the result - domain-check outputs: "domain.com STATUS"
    if echo "$result" | grep -q "AVAILABLE"; then
        echo "Available"
    elif echo "$result" | grep -q "TAKEN"; then
        echo "Taken"  
    elif echo "$result" | grep -q "UNKNOWN"; then
        echo "Unknown"
    elif echo "$result" | grep -q "ERROR"; then
        echo "Error"
    else
        echo "Unknown"
    fi
}

# Function to check .app domain availability using RDAP
check_app_domain() {
    local domain=$1
    local full_domain="${domain}.app"
    
    echo "Checking $full_domain..." >&2
    
    # Query Google's RDAP service for .app domains
    local response=$(curl -s "https://pubapi.registry.google/rdap/domain/$full_domain")
    local curl_exit_code=$?
    
    # Check if curl failed
    if [ $curl_exit_code -ne 0 ]; then
        echo "Error"
        return
    fi
    
    # Parse JSON response
    if echo "$response" | grep -q '"errorCode":404'; then
        echo "Available"
    elif echo "$response" | grep -q '"objectClassName":"domain"'; then
        echo "Taken"
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
        # Check .com availability using domain-check tool
        com_status=$(check_com_domain "$domain")
        
        # Check .app availability using RDAP
        app_status=$(check_app_domain "$domain")
        
        # Write to temp file
        echo "${domain},${com_status},${app_status},${CURRENT_DATE}" >> "$TEMP_FILE"
        
        # Add small delay to be respectful to services
        sleep 1
    fi
done

# Replace original file with updated one
mv "$TEMP_FILE" "$CSV_FILE"

echo "Domain checking complete! Results saved to $CSV_FILE"