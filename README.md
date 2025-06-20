

```
# 💸 FinTrack - Smart Expense Management System

> A modern fintech application designed to help users track and manage their expenses efficiently, powered by a cloud-native backend and a sleek React frontend.

---

## 🧩 Overview

**FinTrack** offers an intuitive platform for users to record, update, and analyze their expenses. Built with scalability and modularity in mind, this system integrates cloud technologies and local development features, ensuring both robust functionality and seamless user experience.

---

## 🚀 Features

- 📊 **Dashboard**: Visual overview of monthly and category-wise expenses.
- ➕ **Add Expense**: Add new expenses with category, amount, and date.
- ✏️ **Update Expense**: Modify or delete existing expenses.
- 🔍 **Search & Filter**: Easily find expenses by category, date, or amount.
- 🧮 **Budget Tracker**: Set monthly budgets and track remaining funds.
- 🌐 **API-Driven**: RESTful backend with modular endpoints.
- 🗃️ **DynamoDB Integration**: Fast, NoSQL data storage.
- ⚙️ **CI/CD Support**: GitHub Actions for automated testing and deployment.
- 🎨 **Responsive UI**: Built with React, HTML5, CSS3, and Bootstrap.

---

## 🛠️ Tech Stack

| Layer     | Technologies                            |
|-----------|-----------------------------------------|
| Frontend  | React, JavaScript, HTML, CSS, Bootstrap |
| Backend   | Python (Flask / FastAPI), Boto3         |
| Database  | Amazon DynamoDB (local or cloud)        |
| DevOps    | GitHub Actions, AWS CLI                 |
| Hosting   | AWS EC2 / Elastic Beanstalk (optional)  |

---

## 📁 Project Structure

```

![image](https://github.com/user-attachments/assets/f937e078-1ac8-43fa-911f-5547e4278c39)


````

---

## ⚙️ Setup Instructions

### 🔧 Prerequisites

- Python 3.8+
- Node.js and npm
- AWS CLI (if using cloud DynamoDB)
- GitHub account

### 🔌 Backend Setup

```bash
cd backend/app
pip install -r ../../requirements.txt
python main.py
````

### 🌐 Frontend Setup

```bash
cd frontend
npm install
npm start
```

> Access the app at: `http://localhost:3000`

---

## 🔄 CI/CD Pipeline

GitHub Actions is used for:

* ✅ Linting and testing the backend and frontend
* 🚀 Deployment to cloud infrastructure (Elastic Beanstalk or EC2)

Example Workflow File (`.github/workflows/ci.yml`):

```yaml
name: FinTrack CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.8'
    - run: pip install -r backend/requirements.txt
    - run: python -m unittest discover backend/
```

---

## 📦 Deployment

* 💻 **Local**: Run frontend and backend locally for testing
* ☁️ **Cloud**: Use Zappa, Elastic Beanstalk, or Docker for deployment

---

## 📈 Future Enhancements

* 📱 Mobile App Integration (React Native)
* 🔐 User Authentication & Authorization
* 📉 Advanced Analytics Dashboard
* 📤 CSV/Excel Export for expenses
* 📬 Email alerts for budget limits

---

## 🧑‍💻 Author

**Mageshwaran Kumaresan**
📧 [x23216522@student.ncirl.ie](mailto:x23216522@student.ncirl.ie)
🎓 MSc in Cloud Computing, National College of Ireland

---

## 📝 License

This project is licensed under the MIT License.

---

## 🌐 References

* [AWS DynamoDB Docs](https://docs.aws.amazon.com/dynamodb/)
* [React Documentation](https://reactjs.org/)
* [Flask Documentation](https://flask.palletsprojects.com/)
* [GitHub Actions Docs](https://docs.github.com/en/actions)

```
