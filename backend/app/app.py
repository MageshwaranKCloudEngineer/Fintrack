from flask import Flask, session
from flask_cors import CORS
from routes import sales_routes, expense_routes, profit_routes, auth_routes  
from config import get_dynamodb_connection
from models import create_sales_table, create_expense_table, create_user_table  
import secrets

app = Flask(__name__)
CORS(app, supports_credentials=True)  


app.secret_key = secrets.token_hex(16)  
app.config['SESSION_TYPE'] = 'filesystem'  
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True  
app.config['SESSION_COOKIE_SECURE'] = False   
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  



# Register blueprints for routes
app.register_blueprint(sales_routes)
app.register_blueprint(expense_routes)
app.register_blueprint(profit_routes)
app.register_blueprint(auth_routes)


dynamodb = get_dynamodb_connection()


create_user_table()  
print("User_table up!!!") 
create_sales_table()  
print("Sales_table up!!!") 
create_expense_table()
print("Expense_table up!!!")
  


print("All necessary tables are set up!")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  #
