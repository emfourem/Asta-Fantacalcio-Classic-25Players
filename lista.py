import requests
import pandas as pd
import os  # Import os module for file operations
import argparse  # Import argparse for command-line argument parsing

# Function to handle login and file processing
def main(username, password):
    # Start a session
    session = requests.Session()

    # Headers to mimic a real browser request
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Content-Type': 'application/json',  # or 'application/x-www-form-urlencoded' if required
    }

    # Login URL
    login_url = 'https://www.fantacalcio.it/api/v1/User/login'

    # Login data (ensure these match exactly what the server expects)
    login_data = {
        'username': username,
        'password': password
    }

    # Authenticate and save cookies
    response = session.post(login_url, json=login_data, headers=headers)

    # Check if login was successful
    if response.status_code == 200:
        print("Logged in successfully!")

        # URL to download the file
        download_url = 'https://www.fantacalcio.it/api/v1/Excel/prices/19/1'
        file_response = session.get(download_url, headers=headers)

        # Check if the file download was successful
        if file_response.status_code == 200:
            # Save the downloaded file
            xlsx_file = 'lista.xlsx'
            with open(xlsx_file, 'wb') as f:
                f.write(file_response.content)
            print("File downloaded successfully!")

            # Path to save the .csv file
            csv_file = 'banditore/public/lista.csv'

            # Read the .xlsx file
            # Adjust `skiprows` to the number of rows to skip
            # Set `header` to the row index where actual column headers are located (0-based index)
            df = pd.read_excel(xlsx_file, skiprows=1, header=0)

            # Save the DataFrame as .csv
            df.to_csv(csv_file, index=False)

            print("Conversion complete. The file has been saved as", csv_file)
            
            # Delete the .xlsx file after conversion
            os.remove(xlsx_file)
            print(f"File {xlsx_file} has been deleted.")
            
        else:
            print("Failed to download file:", file_response.status_code)
    else:
        print("Login failed:", response.status_code)

if __name__ == "__main__":
    # Create an argument parser
    parser = argparse.ArgumentParser(description="Login to the site and download and convert file.")
    parser.add_argument('username', type=str, help='Username for login')
    parser.add_argument('password', type=str, help='Password for login')

    # Parse the arguments
    args = parser.parse_args()

    # Call the main function with the parsed arguments
    main(args.username, args.password)
