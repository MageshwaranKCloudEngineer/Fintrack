Fintrack
This Project was Created for analysis the Financial Sales and expenses for the Sales shop Users. Once the Data is entered it will show the profit of the entire month. I have used Python has a backend for this project and React has a Frontend

npm start Runs the app in the development mode. Open http://localhost:3000 to view it in your browser.

Use the below Command t0 Clone from the github :-

git clone -b master https://github.com/MageshwaranKCloudEngineer/Fintrack.git

Once the Application is started please follow the below steps

!!!! Please use Nodejs 16.20.2 version for this project !!!!

To start the Frontend Application :-

Move to the directory:- cd Fintrack/frontend/frontend
sudo apt install npm
npm install
npm install axios
npm start

Once the application is started it will run in http://localhost:3000

To start the Backend Application follow the below commands

cd Fintrack
sudo apt update
sudo apt install python3.12-venv

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd backend/app
python3 app.py

If you are not installed local dynamoDB follow this below commands

sudo apt install openjdk-11-jdk wget https://s3.us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz
tar -xvzf dynamodb_local_latest.tar.gz

sudo snap install aws-cli --classic

export AWS_ACCESS_KEY_ID="dummy" 
export AWS_SECRET_ACCESS_KEY="dummy"
export AWS_DEFAULT_REGION="us-west-2"
