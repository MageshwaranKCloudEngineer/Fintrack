import boto3
import logging
from decimal import Decimal, InvalidOperation
from botocore.exceptions import ClientError
from config import get_dynamodb_connection


logging.basicConfig(level=logging.INFO)



def create_table_if_not_exists(table_name, key_schema, attribute_definitions):
    
    dynamodb = get_dynamodb_connection()

    try:
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        table.wait_until_exists()
        logging.info(f"{table_name} table created successfully.")
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            logging.info(f"{table_name} already exists.")
        else:
            logging.error(f"Unable to create {table_name}: {e.response['Error']['Message']}")
    except Exception as e:
        logging.error(f"Error creating {table_name}: {e}")

def create_sales_table():
    
    key_schema = [
        {'AttributeName': 'product_name', 'KeyType': 'HASH'}
    ]
    attribute_definitions = [
        {'AttributeName': 'product_name', 'AttributeType': 'S'}
    ]
    create_table_if_not_exists('SalesRecords', key_schema, attribute_definitions)

def create_expense_table():

    dynamodb = get_dynamodb_connection()
    try:
        table = dynamodb.create_table(
            TableName='ExpenseRecords',
            KeySchema=[
                {'AttributeName': 'id', 'KeyType': 'HASH'}, 
            ],
            AttributeDefinitions=[
                {'AttributeName': 'id', 'AttributeType': 'S'},
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        table.wait_until_exists()
        logging.info("ExpenseRecords table created successfully.")
    except dynamodb.meta.client.exceptions.ResourceInUseException:
        logging.info("ExpenseRecords table already exists.")

def create_user_table():
   
    key_schema = [
        {'AttributeName': 'username', 'KeyType': 'HASH'}
    ]
    attribute_definitions = [
        {'AttributeName': 'username', 'AttributeType': 'S'}
    ]
    create_table_if_not_exists('UsersRecords', key_schema, attribute_definitions)



def validate_price(value):
    
    try:
        price = Decimal(value)
        if price < 0:
            raise ValueError
        return price
    except (ValueError, TypeError, InvalidOperation):
        return None

def validate_integer(value):
    
    try:
        integer_value = int(value)
        if integer_value < 0:
            raise ValueError
        return integer_value
    except (ValueError, TypeError):
        return None
