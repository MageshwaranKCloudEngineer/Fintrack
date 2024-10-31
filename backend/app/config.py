import boto3

print("Loading config.py...")

def get_dynamodb_connection():
    print("Creating DynamoDB connection...")
    dynamodb = boto3.resource('dynamodb', 
                               region_name='us-west-2')
    return dynamodb