import pytest
from flask import Flask, jsonify
from flask.testing import FlaskClient
from app.routes import sales_routes, expense_routes, profit_routes, auth_routes
from unittest.mock import patch
from models import validate_price, validate_integer
import json


# Test configuration
@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(sales_routes)
    app.register_blueprint(expense_routes)
    app.register_blueprint(profit_routes)
    app.register_blueprint(auth_routes)
    app.config['TESTING'] = True
    app.secret_key = 'test_secret'
    return app

@pytest.fixture
def client(app):
    return app.test_client()

# Mock DynamoDB for tests
@pytest.fixture
def mock_dynamodb():
    with patch('config.get_dynamodb_connection') as mock_dynamodb_conn:
        yield mock_dynamodb_conn

# ---------- Test User Registration Route ---------- #

def test_register_user(client, mock_dynamodb):
    # Test valid registration
    mock_dynamodb.return_value.Table.return_value.put_item.return_value = {}
    response = client.post('/register', json={'username': 'testuser', 'password': 'password123'})
    assert response.status_code == 201
    assert json.loads(response.data)['message'] == "User registered successfully"

    # Test missing username or password
    response = client.post('/register', json={'username': '', 'password': 'password123'})
    assert response.status_code == 400
    assert json.loads(response.data)['error'] == "Username and password are required"

# ---------- Test User Login Route ---------- #

def test_login_user(client, mock_dynamodb):
    # Test valid login
    mock_dynamodb.return_value.Table.return_value.get_item.return_value = {
        'Item': {'username': 'testuser', 'password': 'hashed_password'}
    }
    response = client.post('/login', json={'username': 'testuser', 'password': 'password123'})
    assert response.status_code == 200
    assert json.loads(response.data)['message'] == "Login successful"

    # Test invalid credentials
    response = client.post('/login', json={'username': 'testuser', 'password': 'wrongpassword'})
    assert response.status_code == 401
    assert json.loads(response.data)['error'] == "Invalid username or password"

# ---------- Test User Logout Route ---------- #

def test_logout_user(client):
    # Mocking session
    with client.session_transaction() as sess:
        sess['user'] = 'testuser'

    response = client.post('/logout')
    assert response.status_code == 200
    assert json.loads(response.data)['message'] == "Logout successful"

# ---------- Test Sales Routes ---------- #

def test_create_sales_record(client, mock_dynamodb):
   
    mock_dynamodb.return_value.Table.return_value.put_item.return_value = {}
    response = client.post('/sales', json={
        'product_name': 'test_product',
        'buying_price': 10,  
        'selling_price': 20,  
        'units_sold': 50,
        'returns': 5
    })

    
    print(response.data)  
    assert response.status_code == 201


def test_get_sales_records(client, mock_dynamodb):
    
    mock_dynamodb.return_value.Table.return_value.scan.return_value = {
        'Items': [{'product_name': 'test_product'}]
    }
    response = client.get('/sales')
    assert response.status_code == 200



def test_create_expense_record(client, mock_dynamodb):
    #
    mock_dynamodb.return_value.Table.return_value.put_item.return_value = {}
    response = client.post('/expenses', json={
        'id': 'exp123',
        'utilities': '500.0',
        'repairs': '200.0',
        'maintenance': '150.0'
    })
    assert response.status_code == 201
    assert json.loads(response.data)['message'] == "Expense record created"

def test_get_expense_records(client, mock_dynamodb):
    
    mock_dynamodb.return_value.Table.return_value.scan.return_value = {
        'Items': [{'id': 'exp123'}]
    }
    response = client.get('/expenses')
    assert response.status_code == 200
    
def test_update_sales_record_success(client, mock_dynamodb):
    
    existing_item = {
        'Item': {
            'product_name': 'test_product',
            'buying_price': 10,  # Use integer values
            'selling_price': 20,
            'units_sold': 50,
            'returns': 5,
            'total_sales': 1000,
            'profit_or_loss': 500
        }
    }
    
    
    mock_dynamodb.return_value.Table.return_value.get_item.return_value = existing_item
    mock_dynamodb.return_value.Table.return_value.update_item.return_value = {}

    
    response = client.put('/sales/test_product', json={
        'buying_price': 12,  # Use integer values
        'selling_price': 25,
        'units_sold': 60,
        'returns': 3
    })

    
    assert response.status_code == 200
    assert b"Sales record updated" in response.data
    
from unittest.mock import MagicMock
import pytest


def test_delete_sales_record_success(client, mock_dynamodb):
    
    existing_item = {
        'Item': {
            'product_name': 'test_product',
            'buying_price': 10,
            'selling_price': 20,
            'units_sold': 50,
            'returns': 5,
            'total_sales': 1000,
            'profit_or_loss': 500
        }
    }

    
    mock_dynamodb.return_value.Table.return_value.get_item.return_value = existing_item
    
    mock_dynamodb.return_value.Table.return_value.delete_item.return_value = {}

    
    response = client.delete('/sales/test_product')

    
    assert response.status_code == 200
    assert b"Sales record deleted" in response.data


def test_delete_sales_record_not_found(client, mock_dynamodb):
   
    mock_dynamodb.return_value.Table.return_value.get_item.return_value = {}

    
    response = client.delete('/sales/nonexistent_product')

   
    assert response.status_code == 404
    assert b"Sales record not found" in response.data

 

    
    



