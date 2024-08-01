from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow cross-origin WebSocket connections

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
