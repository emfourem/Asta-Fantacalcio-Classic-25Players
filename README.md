# Fantacalcio Auction Management Tool

## Setup Instructions

You can set up the Fantacalcio Auction Management Tool using one of the following methods:

### Option 1: Manual Setup

Follow these steps for a manual setup of the tool.

#### 1. Set Up the Python Environment

1. **Create a Python virtual environment** (if needed):
    ```bash
    python -m venv venv
    ```
   
2. **Activate the virtual environment**:
    ```bash
    source venv/bin/activate
    ```

3. **Install required Python packages**:
    ```bash
    sudo pacman -S python-pip
    pip install pandas openpyxl Flask flask_cors flask-socketio requests
    ```

#### 2. Download and Save the Player List

1. **Run the script to download the player list**:
    ```bash
    python lista.py "your_username_Fantacalcio.it" "your_password_Fantacalcio.it"
    ```

2. **Save the downloaded file** in the `banditore/public` directory.

#### 3. Start the Server

1. **Run the server to handle requests**:
    ```bash
    python server.py
    ```

2. **Note the address** where the server is listening. You will need this address later.

#### 4. Run the Banditore App

1. **Install Node.js and npm** (if not already installed):
    ```bash
    sudo pacman -S nodejs npm
    ```

2. **Navigate to the `banditore` directory**:
    ```bash
    cd banditore
    ```

3. **Install the necessary Node.js packages**:
    ```bash
    npm ci
    ```

4. **Start the Banditore app**:
    ```bash
    npm run dev
    ```

#### 5. Set Up Participant Devices

1. **Open `partecipant.html` on each device**. Each participant needs their own device.

2. **Ensure all devices are on the same network** (Wi-Fi or Ethernet).

3. **Enter the following details** on each device:
    - **Server IP Address**: Use the IP address noted from the server in step 3.
    - **Squad ID**: Enter the ID of your squad.
    - **Squad Name**: Enter the exact name of your squad, paying attention to capitalization and spaces.

4. **Verify IP and Squad Name**: Ensure the IP address and squad name entered match those displayed in the React app’s team table. If there’s a mismatch, the tool won’t function correctly.

---

### Option 2: Automated Setup Script

For a streamlined setup, you can use the provided script, which automates the above steps. The script requires the user's Fantacalcio username and password.

#### Usage Instructions

1. **Clone the Repository** (if not already done):
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Run the Automated Setup Script**:
    ```bash
    bash setup_fanta_asta.sh "your_username_Fantacalcio.it" "your_password_Fantacalcio.it"
    ```

3. **Open `partecipant.html` on each device**. Each participant needs their own device.

4. **Ensure all devices are on the same network** (Wi-Fi or Ethernet).

5. **Enter the following details** on each device:
    - **Server IP Address**: Use the IP address noted from the server in step 3.
    - **Squad ID**: Enter the ID of your squad.
    - **Squad Name**: Enter the exact name of your squad, paying attention to capitalization and spaces.

6. **Verify IP and Squad Name**: Ensure the IP address and squad name entered match those displayed in the React app’s team table. If there’s a mismatch, the tool won’t function correctly.
