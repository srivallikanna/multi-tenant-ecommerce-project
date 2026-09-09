**Testing Documentation**

Project



**Multi-Tenant E-Commerce Platform**



**Testing Objective**



The objective of testing was to verify that the e-commerce application, its frontend, backend APIs, authentication, database connectivity, admin functionality, vendor functionality, and deployment environment work correctly.



**Testing Environment**

* Frontend: React.js
* Backend: Node.js, Express.js
* Database: MongoDB Atlas
* API Testing: Manual Testing
* Authentication: JWT
* Frontend Deployment: Vercel
* Backend Deployment: Render
* Source Control: GitHub



**Deployment URLs**

* **Live Application:** https://multi-tenant-ecommerce-live.vercel.app
* **Backend API:** https://multi-tenant-ecommerce-project-2.onrender.com
* **GitHub Repository:** https://github.com/srivallikanna/multi-tenant-ecommerce-project



**API Endpoints**



**Method	      Endpoint	                Description**

POST	      /api/auth/register	Register a new user

POST	      /api/auth/login	        Authenticate user and generate JWT

GET	      /api/products		Get products

GET	      /api/products/:id		Get product details

POST	      /api/cart			Add product to cart

GET	      /api/cart			Get cart details

PUT	      /api/cart/:id		Update cart item

DELETE	      /api/cart/:id		Remove cart item

POST	      /api/orders		Create an order

GET	      /api/orders		Get user orders

GET	      /api/admin/stats		Get admin platform statistics

GET	      /api/admin/revenue	Get revenue analytics



**Functional Testing**

**Test ID			Test Scenario				Expected Result						Status**

TC001			Open application			Application loads successfully				PASS

TC002			User registration with valid details	New user account created																PASS

TC003			User login with valid credentials	User successfully logged in				PASS

TC004			Login with invalid credentials		Appropriate authentication error displayed 		PASS

TC005			Access protected page without login	User is prevented from accessing protected resource	PASS

TC006			Display products			Products are displayed successfully			PASS

TC007			View product details			Selected product details are displayed			PASS

TC008			Add product to cart			Product is added to cart				PASS

TC009			Update cart quantity			Cart quantity is updated				PASS

TC010			Remove product from cart		Product is removed from cart				PASS

TC011			Place order				Order is created successfully				PASS

TC012			View orders				User can view order history				PASS

TC013			Admin login				Admin dashboard is accessible				PASS

TC014			Admin statistics			Platform statistics are displayed			PASS

TC015			Admin revenue analytics			Revenue data is displayed				PASS

TC016			Vendor functionality			Vendor can manage assigned products			PASS

TC017			Unauthorized admin API access		Access is denied	PASS

TC018			Invalid API request			Appropriate error response is returned			PASS





**Authentication Testing**



Authentication was tested to verify secure user access and role-based functionality.



**Test ID			Test Scenario						Expected Result						Status**

AUTH001			Register new user					User account created					PASS

AUTH002			Login with valid credentials				JWT token generated					PASS

AUTH003			Login with incorrect password				Login rejected						PASS

AUTH004			Access protected API with valid token			Request accepted					PASS

AUTH005			Access protected API without token			Request rejected					PASS

AUTH006			Admin-only endpoint accessed by normal user		Access denied						PASS

Product 		Testing

Test ID			Test Scenario						Expected Result	Status

PROD001			View product list					Products displayed					PASS

PROD002			View product details					Correct product details displayed			PASS

PROD003			Search/filter products					Matching products displayed				PASS

PROD004			Add product to cart					Product added successfully				PASS

PROD005			Invalid product ID					Appropriate error returned				PASS



**Cart Testing**

**Test ID			Test Scenario						Expected Result						Status**

CART001			Add product						Product added to cart					PASS

CART002			Increase quantity					Quantity updated					PASS

CART003			Decrease quantity					Quantity updated					PASS

CART004			Remove product						Product removed	PASS

CART005			View cart						Current cart displayed					PASS

Order 			Testing

Test ID	Test Scenario	Expected Result	Status

ORD001			Create order with valid cart				Order created successfully				PASS

ORD002			View order history					Previous orders displayed				PASS

ORD003			Check order details					Correct order information displayed			PASS

ORD004			Invalid order request					Error response returned					PASS



**Admin Testing**



The admin dashboard was tested to verify platform-level management and analytics functionality.



**Test ID			Test Scenario			Expected Result				Status**

ADM001			Admin login			Admin dashboard opens			PASS

ADM002			View platform statistics	Statistics displayed			PASS

ADM003			View revenue analytics		Revenue information displayed		PASS

ADM004			Select revenue timeframe	Corresponding analytics displayed	PASS

ADM005			Unauthorized access		Non-admin user denied access		PASS

Database 		Testing





**Database Testing**

MongoDB Atlas was configured as the production database.



**Test ID	Test Scenario				Expected Result			Status**

DB001	Connect backend to MongoDB Atlas	Database connection successful	PASS

DB002	Create user record			User stored in database		PASS

DB003	Retrieve products			Product data retrieved		PASS

DB004	Store order				Order stored successfully	PASS

DB005	Retrieve order history			Stored orders retrieved		PASS



**Database connection verification:**



MongoDB connected successfully



**Deployment Testing**

**Frontend Deployment**



The React frontend was deployed using Vercel.



Live URL:



https://multi-tenant-ecommerce-live.vercel.app



Expected Result:



The frontend should be accessible through the public URL.



Actual Result:



The deployed frontend is available through the Vercel URL.



Status: PASS



**Backend Deployment**



The Node.js/Express backend was deployed using Render.



Backend URL:



https://multi-tenant-ecommerce-project-2.onrender.com



Expected Result:



Backend service should start successfully and remain live.



Actual Result:



Render deployment completed successfully.



Status: **PASS**



MongoDB Atlas Deployment



MongoDB Atlas was configured as the production database.



Expected Result:



Backend should connect successfully to MongoDB Atlas.



Actual Result:



Render logs showed:



MongoDB connected successfully



Status: PASS



**Deployment Issue Testing**



During deployment, a filename case-sensitivity issue was identified.



**Issue**



Render reported:



Cannot find module:

backend/controllers/authController.js



**Cause**



The file was originally stored as:



authcontroller.js



while the application imported:



authController.js



Windows allowed the difference, but the Linux-based Render environment is case-sensitive.



**Solution**



The file was renamed:



authcontroller.js

&nbsp;       ↓

authController.js



The change was committed and pushed to GitHub.



Commit:



d0fec68 - Fix auth controller filename case



After redeployment, the Render service successfully started.



Status: **PASS**



**Testing Summary**



**Testing Category		Result**



Application Loading		PASS

User Registration		PASS

User Login			PASS

JWT Authentication		PASS

Product Testing			PASS

Cart Testing			PASS

Order Testing			PASS

Admin Testing			PASS

Vendor Testing			PASS

Database Connectivity		PASS

Frontend Deployment		PASS

Backend Deployment		PASS

MongoDB Atlas Connection	PASS

Deployment Issue Resolution	PASS



**Issues Identified and Resolved**

Issue 1 — Backend API Deployment



The backend initially returned 404 for admin analytics endpoints because the correct latest backend code was not deployed.



Resolution: Latest project code was pushed to the user-owned GitHub repository and connected to Render.



Issue 2 — Controller Filename Case



Render could not find authController.js because the GitHub repository contained authcontroller.js.



Resolution: Corrected the filename capitalization and redeployed successfully.



Issue 3 — MongoDB Connection



The production environment initially attempted to connect to:



mongodb://127.0.0.1:27017/...



Resolution: Configured MongoDB Atlas connection string in Render and added the required network access rule.



Final result:



MongoDB connected successfully



**Final Conclusion**



The Multi-Tenant E-Commerce Platform was developed using React.js, Node.js, Express.js, MongoDB, and JWT authentication.



The application includes user, vendor, and admin functionality along with product management, cart management, order processing, authentication, and admin analytics.



The frontend was successfully deployed on Vercel, the backend was successfully deployed on Render, and MongoDB Atlas was successfully connected as the production database.



The major deployment issues encountered during deployment were identified and resolved successfully.



**Final deployment status: SUCCESSFUL ✅**

