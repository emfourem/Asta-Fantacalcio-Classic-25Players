#!/bin/bash

# Ensure the script is run with two arguments (username and password)
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <Fantacalcio Username> <Fantacalcio Password>"
    exit 1
fi

USERNAME=$1
PASSWORD=$2

# Install required packages
sudo pacman -S --noconfirm nodejs npm

# Set up Python environment
python -m venv venv
source venv/bin/activate

# Install Python packages
pip install --upgrade pip
pip install pandas openpyxl Flask flask_cors flask-socketio requests

# Download and save player list
python lista.py "$USERNAME" "$PASSWORD"

# Run the Banditore app
cd banditore
npm ci
npm run dev &

# Function to wait for the app to be available
wait_for_port() {
    local PORT=$1
    while ! timeout 1 bash -c "echo > /dev/tcp/localhost/$PORT"; do
        sleep 1
    done
}

# Wait for the app to start on port 3000
wait_for_port 3000

# Open the default web browser to http://localhost:3000
xdg-open http://localhost:3000/ &

# Open a new terminal and run the server in it
cd ..
gnome-terminal -- bash -c "source venv/bin/activate && python server.py; exec bash"

# Keep the original script running
wait
