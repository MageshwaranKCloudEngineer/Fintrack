import pytest
from flask import Flask, session
from flask.testing import FlaskClient
from config import get_dynamodb_connection
import boto3
import unittest
from routes import sales_routes, expense_routes, profit_routes, auth_routes
from unittest.mock import patch
from models import validate_price, validate_integer
import bcrypt

class FinTrackTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = app.test_client()
        cls.dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')
         app.secret_key = secrets.token_hex(16) 
         
        # Create SalesRecords table
        cls.sales_table = cls.dynamodb.create_table(
            TableName='SalesRecords',
            KeySchema=[
                {'AttributeName': 'product_name', 'KeyType': 'HASH'},
            ],
            AttributeDefinitions=[
                {'AttributeName': 'product_name', 'AttributeType': 'S'},
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )

        # Create ExpenseRecords table
        cls.expense_table = cls.dynamodb.create_table(
            TableName='ExpenseRecords',
            KeySchema=[
                {'AttributeName': 'expense_name', 'KeyType': 'HASH'},
            ],
            AttributeDefinitions=[
                {'AttributeName': 'expense_name', 'AttributeType': 'S'},
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )

        # Wait for tables to be created
        cls.sales_table.meta.client.get_waiter('table_exists').wait(TableName='SalesRecords')
        cls.expense_table.meta.client.get_waiter('table_exists').wait(TableName='ExpenseRecords')

    @classmethod
    def tearDownClass(cls):
        cls.sales_table.delete()
        cls.expense_table.delete()

    def setUp(self):
        self.client = app.test_client()

    def tearDown(self):
        # Clean up any records if needed
        self.sales_table.delete_item(Key={'product_name': 'TestProduct'})
        self.expense_table.delete_item(Key={'expense_name': 'TestExpense'})



def test_register_user(client: FlaskClient):
    response = client.post('/register', json={
        'username': 'testuser',
        'password': 'password123'
    })
    assert response.status_code == 201
    assert response.json['message'] == 'User registered successfully'



def test_login_user(client: FlaskClient):
    
    client.post('/register', json={
        'username': 'testuser',
        'password': 'password123'
    })

    
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    assert response.status_code == 200
    assert response.json['message'] == 'Login successful'



def test_create_sales_record(client: FlaskClient):
    
    client.post('/register', json={
        'username': 'testuser',
        'password': 'password123'
    })
    client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })

    
    response = client.post('/sales', json={
        'product_name': 'Product A',
        'buying_price': 10.0,
        'selling_price': 20.0,
        'units_sold': 5,
        'returns': 0
    })
    assert response.status_code == 201
    assert response.json['message'] == 'Sales record created'



def test_update_sales_record(client: FlaskClient):
   
    client.post('/register', json={
        'username': 'testuser',
        'password': 'password123'
    })
    client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })

   
    client.post('/sales', json={
        'product_name': 'Product A',
        'buying_price': 10.0,
        'selling_price': 20.0,
        'units_sold': 5,
        'returns': 0
    })

  
    response = client.put('/sales/Product A', json={
        'selling_price': 25.0
    })
    assert response.status_code == 200
    assert response.json['message'] == 'Sales record updated'



def test_get_sales_record(client: FlaskClient):
    
    client.post('/register', json={
        'username': 'testuser',
        'password': 'password123'
    })
    client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })

    
    client.post('/sales', json={
        'product_name': 'Product A',
        'buying_price': 10.0,
        'selling_price': 20.0,
        'units_sold': 5,
        'returns': 0
    })

    
    response = client.get('/sales/Product A')
    assert response.status_code == 200
    assert response.json['product_name'] == 'Product A'



def test_delete_sales_record(client: FlaskClient):
    
    client.post('/register', json={
        'username': 'testuser',
        'password': 'password123'
    })
    client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })

    
    client.post('/sales', json={
        'product_name': 'Product A',
        'buying_price': 10.0,
        'selling_price': 20.0,
        'units_sold': 5,
        'returns': 0
    })


    response = client.delete('/sales/Product A')
    assert response.status_code == 200
    assert response.json['message'] == 'Sales record deleted'



def test_create_expense_record(client: FlaskClient):
    # Login first
    client.post('/register', json={
        'username': 'testuser',
        'password': 'password123'
    })
    client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })

    
    response = client.post('/expenses', json={
        'id': '1',
        'utilities': 100.0,
        'repairs': 50.0,
        'maintenance': 30.0
    })
    assert response.status_code == 201
    assert response.json['message'] == 'Expense record created'



def test_update_expense_record(client: FlaskClient):
   
    client.post('/register', json={
        'username': 'testuser',
        'password': 'password123'
    })
    client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })

    
    client.post('/expenses', json={
        'id': '1',
        'utilities': 100.0,
        'repairs': 50.0,
        'maintenance': 30.0
    })

    
    response = client.put('/expenses/1', json={
        'utilities': 120.0,
        'repairs': 60.0,
        'maintenance': 40.0
    })
    assert response.status_code == 200
    assert response.json['message'] == 'Expense record updated'



def test_get_expense_record(client: FlaskClient):
   
    client.post('/register', json={
        'username': 'testuser',
        'password': 'password123'
    })
    client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })

   
    client.post('/expenses', json={
        'id': '1',
        'utilities': 100.0,
        'repairs': 50.0,
        'maintenance': 30.0
    })

    
    response = client.get('/expenses/1')
    assert response.status_code == 200
    assert response.json['id'] == '1'



def test_delete_expense_record(client: FlaskClient):
    
    client.post('/register', json={
        'username': 'testuser',
        'password': 'password123'
    })
    client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })

    
    client.post('/expenses', json={
        'id': '1',
        'utilities': 100.0,
        'repairs': 50.0,
        'maintenance': 30.0
    })

    
    response = client.delete('/expenses/1')
    assert response.status_code == 200
    assert response.json['message'] == 'Expense record deleted'


def test_calculate_profit(client: FlaskClient):
    
    client.post('/register', json={
        'username': 'testuser',
        'password': 'password123'
    })
    client.post('/login', json={
        'username': 'testuser',
        'password': 'password123'
    })

    
    client.post('/sales', json={
        'product_name': 'Product A',
        'buying_price': 10.0,
        'selling_price': 20.0,
        'units_sold': 5,
        'returns': 0
    })
    client.post('/expenses', json={
        'id': '1',
        'utilities': 100.0,
        'repairs': 50.0,
        'maintenance': 30.0
    })

    
    response = client.get('/profit')
    assert response.status_code == 200
    assert 'profit' in response.json
