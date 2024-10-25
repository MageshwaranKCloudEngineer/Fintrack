import unittest
import json
from app import app  # Import the Flask app
from threading import Thread

class FinTrackTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

        # Clear any existing data in your DynamoDB tables if necessary

    # ---------- Test Sales Routes ---------- #




    def test_create_sales_record_invalid_data_types(self):
        response = self.app.post('/sales', json={
            'product_name': 'Test Product',
            'buying_price': 50,
            'selling_price': 'seventy-five',  # Invalid type
            'units_sold': 100,
            'returns': 10
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'Invalid input data', response.data)

    def test_get_sales_records(self):
        response = self.app.get('/sales')
        self.assertEqual(response.status_code, 200)

    def test_update_sales_record(self):
        # First, create a record to update
        self.app.post('/sales', json={
            'product_name': 'Test Product',
            'buying_price': 50,
            'selling_price': 75,
            'units_sold': 100,
            'returns': 10
        })
        
        response = self.app.put('/sales/Test Product', json={
            'selling_price': 80,
            'units_sold': 120
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Sales record updated', response.data)

    def test_update_non_existent_sales_record(self):
        response = self.app.put('/sales/NonExistentProduct', json={
            'selling_price': 80
        })
        self.assertEqual(response.status_code, 404)
        self.assertIn(b'Sales record not found', response.data)

    def test_delete_sales_record(self):
        # First, create a record to delete
        self.app.post('/sales', json={
            'product_name': 'Test Product',
            'buying_price': 50,
            'selling_price': 75,
            'units_sold': 100,
            'returns': 10
        })
        
        response = self.app.delete('/sales/Test Product')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Sales record deleted', response.data)

    def test_delete_non_existent_sales_record(self):
        response = self.app.delete('/sales/NonExistentProduct')
        self.assertEqual(response.status_code, 404)
        self.assertIn(b'Sales record not found', response.data)

    def test_concurrent_requests(self):
        def create_sales():
            self.app.post('/sales', json={
                'product_name': 'Concurrent Product',
                'buying_price': 50,
                'selling_price': 75,
                'units_sold': 100,
                'returns': 10
            })

        threads = [Thread(target=create_sales) for _ in range(10)]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()

        # Check if records were created
        response = self.app.get('/sales')
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.json), 0)  # Ensure at least one record is created

    # ---------- Test Expense Routes ---------- #

    def test_create_expense_record(self):
        response = self.app.post('/expenses', json={
            'id': '1',
            'utilities': 200,
            'repairs': 150,
            'maintenance': 100
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn(b'Expense record created', response.data)


    def test_get_expense_records(self):
        response = self.app.get('/expenses')
        self.assertEqual(response.status_code, 200)

    def test_delete_expense_record(self):
        # First, create a record to delete
        self.app.post('/expenses', json={
            'id': '1',
            'utilities': 200,
            'repairs': 150,
            'maintenance': 100
        })

        response = self.app.delete('/expenses/1')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Expense record deleted', response.data)

    def test_delete_non_existent_expense_record(self):
        response = self.app.delete('/expenses/999')  # Assuming 999 doesn't exist
        self.assertEqual(response.status_code, 404)
        self.assertIn(b'Expense record not found', response.data)

if __name__ == '__main__':
    unittest.main()
