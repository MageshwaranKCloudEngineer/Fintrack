import boto3

print("Loading config.py...")

def get_dynamodb_connection():
    print("Creating DynamoDB connection to local DynamoDB...")
    # Connect to local DynamoDB (on default port 8000)
    dynamodb = boto3.resource('dynamodb', 
                               region_name='us-west-2',  # or any region
                               endpoint_url='http://localhost:8000')  # Local DynamoDB endpoint
    return dynamodb
