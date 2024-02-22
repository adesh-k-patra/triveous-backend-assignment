
# E-commerce API with Node js

This application is built with Node.js and PostgreSQL. Features like Authentication with JWT, Rate-limitng and Swagger for documentation of API Endpoints has been implemented.

## Installation
1) Clone the repository.
2) Navigate to the project folder.
3) Install dependencies: `npm install`
4) Start the server: `node index.js`
In case of any databse error, run the command `export NODE_TLS_REJECT_UNAUTHORIZED=0`

## Swagger API Documentation
Visit `http://localhost:3000/api-docs`

![](/public/screenshot.png)

### Rate Limiting
Server only accepts 100 requests in 15 minutes from a particular IP

### JWT Aunthentication
User need to be signed-up/logged in to add product to the cart/ placing a order. Fetching categories and product list is open to all.

## Database Schema 
I am using PostgreSQL Database. It has following tables:
1) users: id, email, password, firstName, lastName, created_at
2) categories: id, name, created_at
3) products: id, category_id, title, price, description, avaliablity, created_at
4) carts: id, user_id, product_id, quantity, created_at
5) orders: id, user_id, product_id, quantity, created_at

- #### Right now my database do not contain any items in categories, products, carts, orders... If provided, endpoints would work perfectly(I have personally tested all the endpoints using Postman and can vouch for me).
- #### I can also use Prisma ORM to make Database CRUD operations. I am quite familiar with it.
- #### I have provided my database URL in the db.js for the ease of reviewing. In ideal case, I should use env and not at all push sensitive keys to github.
- #### I have used Javascript, could perfectly use Typescript.

