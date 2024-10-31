from flask import Blueprint, request, jsonify, session
from models import validate_price, validate_integer, create_sales_table, create_expense_table
from config import get_dynamodb_connection
from functools import wraps
from decimal import Decimal
import logging
import bcrypt  


logging.basicConfig(level=logging.INFO)


sales_routes = Blueprint('sales_routes', __name__)
expense_routes = Blueprint('expense_routes', __name__)
profit_routes = Blueprint('profit_routes', __name__)
auth_routes = Blueprint('auth_routes', __name__)


dynamodb = get_dynamodb_connection()
sales_table = dynamodb.Table('SalesRecords')
expenses_table = dynamodb.Table('ExpenseRecords')
users_table = dynamodb.Table('UsersRecords')  

# ---------- User Registration Route ---------- #

@auth_routes.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

   
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    
    try:
       
        users_table.creation_date_time  
        users_table.put_item(
            Item={
                'username': username,
                'password': hashed_password.decode('utf-8')  
            }
        )
        return jsonify({"message": "User registered successfully"}), 201
    except dynamodb.meta.client.exceptions.ResourceNotFoundException:
        logging.error("Error registering user: Users table does not exist")
        return jsonify({"error": "Users table does not exist"}), 500
    except Exception as e:
        logging.error(f"Error registering user: {e}")
        return jsonify({"error": "Could not register user"}), 500
 

# ---------- User Login Route ---------- #

@auth_routes.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        response = users_table.get_item(Key={'username': username})
        user = response.get('Item')

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            session['user'] = username  # Setting session
            print(f"Login successful, session set: {session}")  # Debug statement
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        logging.error(f"Error logging in user: {e}")
        return jsonify({"error": "Could not login user"}), 500

        
# ---------- User Login Route ---------- #
 
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
         logging.debug(f"Unauthorized access attempt, session: {session}")
         return jsonify({"error": "Login required"}), 401
        return f(*args, **kwargs)
    return decorated_function



@auth_routes.route('/logout', methods=['POST'])
@login_required
def logout_user():
    session.pop('user', None)  
    return jsonify({"message": "Logout successful"}), 200

@sales_routes.route('/sales', methods=['POST'])
def create_sales_record():
    data = request.json 
    required_fields = ['product_name', 'buying_price', 'selling_price', 'units_sold', 'returns']

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    
    buying_price = validate_price(data['buying_price'])
    selling_price = validate_price(data['selling_price'])
    units_sold = validate_integer(data['units_sold'])
    returns = validate_integer(data['returns'])

    if buying_price is None or selling_price is None or units_sold is None or returns is None:
        return jsonify({"error": "Invalid input data"}), 400

    existing_item = sales_table.get_item(Key={'product_name': data['product_name']})
    if 'Item' in existing_item:
        return jsonify({"error": "This sales record already exists"}), 400

    total_sales = (selling_price * units_sold) - (selling_price * returns)
    profit_or_loss = total_sales - (buying_price * units_sold)

    try:
        sales_table.put_item(
            Item={
                'product_name': data['product_name'],
                'buying_price': Decimal(buying_price),  
                'selling_price': Decimal(selling_price),  
                'units_sold': Decimal(units_sold),  
                'returns': Decimal(returns),  
                'total_sales': Decimal(total_sales),  
                'profit_or_loss': Decimal(profit_or_loss)  
            }
        )
        logging.info("Sales record created successfully.")
        return jsonify({"message": "Sales record created"}), 201
    except Exception as e:
        logging.error(f"Error creating sales record: {e}")
        return jsonify({"error": "Could not create sales record"}), 500

@sales_routes.route('/sales/<product_name>', methods=['PUT'])
def update_sales_record(product_name):
    data = request.json
    # Fetch the existing item to check if it exists
    existing_item = sales_table.get_item(Key={'product_name': product_name})
    if 'Item' not in existing_item:
        return jsonify({"error": "Sales record not found"}), 404

    
    updated_values = {}
    if 'buying_price' in data:
        buying_price = validate_price(data['buying_price'])
        if buying_price is None:
            return jsonify({"error": "Invalid buying price"}), 400
        updated_values['buying_price'] = Decimal(buying_price)  
    
    if 'selling_price' in data:
        selling_price = validate_price(data['selling_price'])
        if selling_price is None:
            return jsonify({"error": "Invalid selling price"}), 400
        updated_values['selling_price'] = Decimal(selling_price)  

    if 'units_sold' in data:
        units_sold = validate_integer(data['units_sold'])
        if units_sold is None:
            return jsonify({"error": "Invalid units sold"}), 400
        updated_values['units_sold'] = Decimal(units_sold)  

    if 'returns' in data:
        returns = validate_integer(data['returns'])
        if returns is None:
            return jsonify({"error": "Invalid returns"}), 400
        updated_values['returns'] = Decimal(returns)  

    # Calculate total sales and profit/loss based on updated values
    updated_values['total_sales'] = (updated_values.get('selling_price', existing_item['Item']['selling_price']) *  
                                     updated_values.get('units_sold', existing_item['Item']['units_sold'])) - (updated_values.get('selling_price', existing_item['Item']['selling_price']) * 
                                       updated_values.get('returns', existing_item['Item']['returns']))
    
    updated_values['profit_or_loss'] = updated_values['total_sales'] - (updated_values.get('buying_price', existing_item['Item']['buying_price']) * 
                                                                          updated_values.get('units_sold', existing_item['Item']['units_sold']))

    try:
        sales_table.update_item(
            Key={'product_name': product_name},
            AttributeUpdates={key: {'Value': value, 'Action': 'PUT'} for key, value in updated_values.items()}
        )
        logging.info(f"Sales record for {product_name} updated successfully.")
        return jsonify({"message": "Sales record updated"}), 200
    except Exception as e:
        logging.error(f"Error updating sales record for {product_name}: {e}")
        return jsonify({"error": "Could not update sales record"}), 500
        
# ---------- Get Entire Sales Record ---------- #
@sales_routes.route('/sales', methods=['GET'])
def get_sales_records():
    try:
        response = sales_table.scan()
        items = response['Items']
        return jsonify(items), 200
    except Exception as e:
        logging.error(f"Error retrieving sales records: {e}")
        return jsonify({"error": "Could not retrieve sales records"}), 500
        
# ---------- Get Specific Sales Record ---------- #
@sales_routes.route('/sales/<product_name>', methods=['GET'])
def get_sales_record(product_name):
    try:
        response = sales_table.get_item(Key={'product_name': product_name})
        item = response.get('Item')

        if not item:
            return jsonify({"error": "Sales record not found"}), 404

        return jsonify(item), 200
    except Exception as e:
        logging.error(f"Error retrieving sales record for {product_name}: {e}")
        return jsonify({"error": "Could not retrieve sales record"}), 500
        

# ---------- Delete Specific Sales Record ---------- #
@sales_routes.route('/sales/<product_name>', methods=['DELETE'])
def delete_sales_record(product_name):
    existing_item = sales_table.get_item(Key={'product_name': product_name})
    if 'Item' not in existing_item:
        return jsonify({"error": "Sales record not found"}), 404

    try:
        sales_table.delete_item(Key={'product_name': product_name})
        logging.info(f"Sales record for {product_name} deleted successfully.")
        return jsonify({"message": "Sales record deleted"}), 200
    except Exception as e:
        logging.error(f"Error deleting sales record for {product_name}: {e}")
        return jsonify({"error": "Could not delete sales record"}), 500


# ---------- Expense Routes ---------- #
@expense_routes.route('/expenses', methods=['POST'])
def create_expense_record():
    data = request.json

    required_fields = ['id', 'utilities', 'repairs', 'maintenance']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    # Validate inputs
    utilities = validate_price(data['utilities'])
    repairs = validate_price(data['repairs'])
    maintenance = validate_price(data['maintenance'])

    if utilities is None or repairs is None or maintenance is None:
        return jsonify({"error": "Invalid input data"}), 400

    expenses_table.put_item(
        Item={
            'id': data['id'],
            'utilities': utilities,
            'repairs': repairs,
            'maintenance': maintenance
        }
    )
    return jsonify({"message": "Expense record created"}), 201

# ---------- Updates the Expense ---------- #
@expense_routes.route('/expenses/<id>', methods=['PUT'])
def update_expense_record(id):
    data = request.json

    required_fields = ['utilities', 'repairs', 'maintenance']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    response = expenses_table.get_item(Key={'id': id})
    item = response.get('Item')

    if not item:
        return jsonify({"error": "Expense record not found"}), 404  

    # Validate inputs
    utilities = validate_price(data['utilities'])
    repairs = validate_price(data['repairs'])
    maintenance = validate_price(data['maintenance'])

    if utilities is None or repairs is None or maintenance is None:
        return jsonify({"error": "Invalid input data"}), 400

    expenses_table.update_item(
        Key={'id': id},
        UpdateExpression="SET utilities = :u, repairs = :r, maintenance = :m",
        ExpressionAttributeValues={
            ':u': utilities,
            ':r': repairs,
            ':m': maintenance,
        }
    )
    return jsonify({"message": "Expense record updated"}), 200

# ---------- Delete the Expense by ID ---------- #
@expense_routes.route('/expenses/<id>', methods=['DELETE'])
def delete_expense_record(id):
    response = expenses_table.get_item(Key={'id': id})
    item = response.get('Item')

    if not item:
        return jsonify({"error": "No item to delete"}), 404  

    expenses_table.delete_item(Key={'id': id})
    return jsonify({"message": "Expense record deleted"}), 200
    
# ---------- Get Specific Entire Record ---------- #
@expense_routes.route('/expenses/<id>', methods=['GET'])
def get_expense_record(id):
    try:
        response = expenses_table.get_item(Key={'id': id})
        item = response.get('Item')

        if not item:
            return jsonify({"error": "Expenses record not found"}), 404

        return jsonify(item), 200
    except Exception as e:
        logging.error(f"Error retrieving Expenses record for {ID}: {e}")
        return jsonify({"error": "Could not Expenses sales record"}), 500

# ---------- Get all the Expense ---------- #
@expense_routes.route('/expenses', methods=['GET'])
def get_expense_records():
    try:
        response = expenses_table.scan()
        items = response['Items']
        return jsonify(items), 200
    except Exception as e:
        logging.error(f"Error retrieving expense records: {e}")
        return jsonify({"error": "Could not retrieve expense records"}), 500

# ---------- calculate the profit loss ---------- #
@profit_routes.route('/profits', methods=['GET'])
def calculate_profit_or_loss():
    sales_records = sales_table.scan().get('Items', [])
    expense_records = expenses_table.scan().get('Items', [])

    total_sales = sum(item['profit_or_loss'] for item in sales_records)
    total_expenses = sum(item['utilities'] + item['repairs'] + item['maintenance'] for item in expense_records)

    profit_or_loss = total_sales - total_expenses
    
    if profit_or_loss > 0:
        return jsonify({"profit for this month": profit_or_loss}), 200
        
    else:
        return jsonify({"loss for this month": profit_or_loss}), 200