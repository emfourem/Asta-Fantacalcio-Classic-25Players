from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Define the path for the log file
LOG_FILE_PATH = 'bid_log.txt'

def log_bid_to_file(bidder_name, player_name, player_role, player_id, amount):
    # Convert player_role to lowercase
    player_role = player_role.lower()
    log_entry = f"Squadra: {bidder_name}, Giocatore: {player_name}, Ruolo: {player_role}, Id: {player_id}, Crediti: {amount}\n"
    
    # Read the file and check for duplicates
    try:
        with open(LOG_FILE_PATH, 'r') as file:
            existing_entries = file.readlines()
            
        if log_entry not in existing_entries:
            with open(LOG_FILE_PATH, 'a') as file:
                file.write(log_entry)
    except FileNotFoundError:
        # If the file doesn't exist, create it and write the entry
        with open(LOG_FILE_PATH, 'w') as file:
            file.write(log_entry)


@app.route('/logBid', methods=['POST'])
def save_bid():
    data = request.json
    bidder_name = data.get('teamName')
    player_name = data.get('player')
    player_role = data.get('role')
    player_id = data.get('id')
    amount = data.get('amount')

    if not bidder_name or not player_name or not amount:
        return jsonify({'status': 'error', 'message': 'Missing data'}), 400

    log_bid_to_file(bidder_name, player_name, player_role, player_id, amount)
    return jsonify({'status': 'success'})

@app.route('/bid', methods=['POST'])
def bid():
    data = request.json
    bid_id = data.get('id')
    bidder_name = data.get('name')
    print(f"Received bid - ID: {bid_id}, Name: {bidder_name}")
    
    # Emit the data to WebSocket clients
    socketio.emit('new_bid', {'id': bid_id, 'name': bidder_name})
    
    return jsonify({'status': 'success', 'id': bid_id, 'name': bidder_name})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
