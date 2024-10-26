Molla - eCommerce Application
Molla is a server-side rendering eCommerce application focused on providing a seamless shopping experience for dresses. With robust authentication, OTP-based security, pincode validation, and an advanced offers system, Molla enhances the shopping experience through personalized promotions and discounts. Built with Express and Node.js and rendered with EJS, Molla ensures a fast, secure, and SEO-friendly experience.

Table of Contents
Features
Technologies Used
Installation
Configuration
Usage
Folder Structure
Screenshots
Contributing
License
Features
Strict Authentication Validation: Secure user registration and login with robust validation.
OTP Verification: OTP-based authentication with Nodemailer.
Pincode Validation: Validates pincode via an external API to ensure service availability.
Offer System:
Category Offers: Special discounts on specific product categories.
Product Offers: Exclusive deals on selected products.
Referral Offers: Rewards for users who refer friends to Molla.
Coupons: Apply promotional coupons at checkout for additional discounts.
Server-Side Rendering: Powered by EJS for a fast, SEO-friendly experience.
Product Listing and Details: Browse a variety of dresses with detailed product information.
Cart and Checkout: Smooth shopping experience with a functional cart and secure checkout system.
Technologies Used
Backend: Node.js, Express
View Engine: EJS (Embedded JavaScript)
Email Service: Nodemailer for OTP validation
Pincode Validation: External API for pincode verification
Database: [Specify Database Here, e.g., MongoDB]
Offers and Coupons: Dynamically generated offers and coupon functionality for a customized shopping experience
Installation
Clone the repository:
bash
Copy code
git clone https://github.com/yourusername/molla.git
Navigate to the project directory:
bash
Copy code
cd molla
Install dependencies:
bash
Copy code
npm install
Set up environment variables (see the Configuration section).
Start the server:
bash
Copy code
npm start
Configuration
Create a .env file in the root directory and add the following variables:

plaintext
Copy code
PORT=5000
DB_CONNECTION=<your_database_connection_string>
EMAIL_HOST=<your_email_host>
EMAIL_PORT=<your_email_port>
EMAIL_USER=<your_email_user>
EMAIL_PASSWORD=<your_email_password>
PINCODE_API_URL=<your_pincode_api_url>
JWT_SECRET=<your_jwt_secret>
OFFER_API_URL=<your_offer_api_url>  # Optional: If using an API for offer management
Usage
After setting up the environment variables and starting the server, open your browser and go to:

plaintext
Copy code
http://localhost:5000
Available Endpoints
/register: Register a new user with strict validation, OTP verification, and pincode validation.
/login: User login with OTP verification.
/products: View all available products (dresses).
/product/
: View specific product details.
/cart: View and manage items in the shopping cart.
/checkout: Secure checkout with authenticated user session, including coupon application.
/offers: View applicable category and product offers.
/apply-coupon: Apply a discount coupon to the cart.
Folder Structure
bash
Copy code
molla/
├── config/              # Configuration files (e.g., database, nodemailer)
├── controllers/         # Route logic and main controllers
├── models/              # Database schemas and models
├── public/              # Static assets (CSS, JS, images)
├── routes/              # Express route definitions
├── views/               # EJS templates for rendering
├── .env                 # Environment variables
├── app.js               # Main application file
└── package.json         # Dependencies and scripts
Screenshots
[Include relevant screenshots here, like homepage, product page, cart, checkout, and offers page.]

Contributing
Fork the repository.
Create a new feature branch (git checkout -b feature-name).
Commit your changes (git commit -m 'Add feature name').
Push to the branch (git push origin feature-name).
Open a pull request.
