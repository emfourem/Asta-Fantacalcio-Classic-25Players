# Fantacalcio Auction Management Tool

## This project is created to facilitate the management of the Fantacalcio Auction. Some errors may be present, as it was developed in just 2 days. Please let me know if you have any ideas or improvements.

## How to Use the Tool

1. **Create Teams**:
    - On the main page of the App, click on the "Crea Squadre" (Create Teams) button.
    - Insert the number of teams and confirm.
    - Set the name of each team. 
    - **Note**: The team name must be the same as the one inserted on the `participant.html` page by all participants. Additionally, the IP requested in `participant.html` must be configured correctly on each page and must correctly reflect the server's IP.

2. **Start the Auction**:
    - After creating the teams, you can start the auction.
    - Select a player and click the "Asta" (Auction) button.

3. **Conduct the Auction**:
    - When the page for the auction of a specific player is opened, each participant can send their bid and wait for the result. Sending a bid means increasing the current bid by 1.

4. **Automatic Player Assignment**:
    - When the auction ends, the player is automatically saved into the winning team. This process is fully automated, so you don't need to manually assign players.

5. **Generate Rosters**:
    - Once all the teams are complete, you can generate the rosters by clicking on "Genera Squadre" (Generate Teams).
    - The `rosters.csv` file will be automatically downloaded.



## Explanation

This is a tool for managing the Fantacalcio Auction. The tool allows you to manage Auctions for Classic Fantacalcio mode where 25 players are needed (3 goalkeepers, 8 defenders, 8 midfielders, 6 forwards). At the end of the Auction, in the section "Squadre," you can click the "Genera Squadre" button which allows you to generate the `rosters.csv` file that can be later used for importing squads on the Fantacalcio App.

### Auction Management

1. **Auction Interface**: 
   - The tool provides an interface where you can conduct the auction. This involves nominating players, placing bids, and keeping track of which players are bought by which participants.

2. **Player Categorization**:
   - Players are categorized by their positions (goalkeepers, defenders, midfielders, forwards). The tool ensures that you adhere to the required distribution of players when building your squad.

### Team Management

1. **Squad Composition**:
   - You need to build a squad of 25 players with the specified composition (3 goalkeepers, 8 defenders, 8 midfielders, 6 forwards). The tool helps you monitor and manage this requirement throughout the auction.

2. **Squad Tracking**:
   - The tool keeps track of the players you have successfully bid for and adds them to your squad. It also tracks the remaining budget and ensures you stay within your financial limits.

### Generating Rosters

1. **Squad Generation**:
   - At the end of the auction, you can navigate to the "Squadre" (Teams) section in the tool.

2. **Generate Rosters**:
   - By clicking the "Genera Squadre" (Generate Squads) button, the tool generates a `rosters.csv` file. This file contains the details of all the teams and their players, formatted for import into the Fantacalcio App.

3. **CSV File for Import**:
   - The `rosters.csv` file is structured to be compatible with the Fantacalcio App, allowing for easy import of the auction results. This means you can seamlessly transition from the auction to managing your team within the app.

### Summary of Key Steps

1. **Conduct Auction**:
   - Use the tool to bid on players and build your team.
   - Ensure you acquire the required number of players for each position.
   
2. **Manage Team**:
   - Track your squad composition and budget.
   
3. **Generate Rosters File**:
   - Navigate to the "Squadre" section.
   - Click "Genera Squadre" to produce the `rosters.csv` file.
   
4. **Import to App**:
   - Use the generated `rosters.csv` file to import your squad into the Fantacalcio App.

### Benefits

- **Efficiency**: The tool simplifies the complex auction process, making it easier to manage bids and team composition.
- **Accuracy**: Automated tracking ensures you comply with the squad composition rules.
- **Convenience**: The ability to generate a `rosters.csv` file for direct import into the app saves time and reduces the risk of manual errors.

In essence, the Fantacalcio Auction Management Tool is designed to facilitate the auction process, manage team compositions, and streamline the transition to the Fantacalcio App, providing a comprehensive solution for fantasy football enthusiasts.

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

1. **Open `participant.html` on each device**. Each participant needs their own device.

2. **Ensure all devices are on the same network** (Wi-Fi or Ethernet).

3. **Enter the following details** on each device:
    - **Server IP Address**: Use the IP address noted from the server in step 3.
    - **Squad ID**: Enter the ID of your squad.
    - **Squad Name**: Enter the exact name of your squad, paying attention to capitalization and spaces.

4. **Verify IP and Squad Name**: Ensure the IP address and squad name entered match those displayed in the React app’s team table. If there’s a mismatch, the tool won’t function correctly.

5. **Open the page on a web browser and not directly from WhatsApp or Telegram**.

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

3. **Open `participant.html` on each device**. Each participant needs their own device.

4. **Ensure all devices are on the same network** (Wi-Fi or Ethernet).

5. **Enter the following details** on each device:
    - **Server IP Address**: Use the IP address noted from the server in step 3.
    - **Squad ID**: Enter the ID of your squad.
    - **Squad Name**: Enter the exact name of your squad, paying attention to capitalization and spaces.

6. **Verify IP and Squad Name**: Ensure the IP address and squad name entered match those displayed in the React app’s team table. If there’s a mismatch, the tool won’t function correctly.
  
7. **Open the page on a web browser and not directly from WhatsApp or Telegram**.
