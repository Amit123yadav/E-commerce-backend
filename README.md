This is the backend API for an E-Commerce web application built using Node.js, Express, MongoDB, and other modern tools. 
It handles authentication, product management, orders, payments, and media uploads.

🚀 Features

User authentication (JWT based)

Product & category management

Order & cart management

Stripe payment integration

Cloudinary image uploads

Secure environment configuration

RESTful APIs

🛠️ Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT (Authentication)

Cloudinary (Image Storage)

Stripe (Payments)

dotenv

📦 Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/nodejs-ecommerce-backend.git
cd nodejs-ecommerce-backend

2️⃣ Install dependencies
npm install

3️⃣ Create .env file

Create a .env file in the root directory and add the following:

PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=ecommerce
NODE_DEV=development

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_API_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
