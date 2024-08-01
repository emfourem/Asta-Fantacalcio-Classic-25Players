#!/bin/bash

# Ensure the script is run with two arguments (username and password)
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <Fantacalcio Username> <Fantacalcio Password>"
    exit 1
fi

USERNAME=$1
PASSWORD=$2

# Set up Python environment
python -m venv venv
source venv/bin/activate

# Install Python packages
sudo pacman -S --noconfirm python-pip
pip install pandas openpyxl Flask flask_cors flask-socketio requests

# Download and save player list
python lista.py "$USERNAME" "$PASSWORD"

# Start the server
python server.py &

# Install Node.js and npm if not installed
sudo pacman -S --noconfirm nodejs npm

# Run the Banditore app
cd banditore
npm ci
npm run dev
