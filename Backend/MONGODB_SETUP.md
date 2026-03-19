# MongoDB Setup

This backend supports both MongoDB Community Edition and MongoDB Atlas.

## 1) Community Edition (local)

Use this in `Backend/.env`:

MONGO_URI=mongodb://127.0.0.1:27017/lms

Then run:

npm start --prefix Backend

## 2) MongoDB Atlas (cloud)

1. Open MongoDB Atlas and create/get your cluster.
2. Create a database user (username/password).
3. In Network Access, allow your IP (or 0.0.0.0/0 for testing).
4. Copy the connection string.
5. Put it in `Backend/.env`:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lms?retryWrites=true&w=majority

Then run:

npm start --prefix Backend

## Default Admin bootstrap

On backend startup, system ensures this admin exists (from `.env`):

DEFAULT_ADMIN_NAME=farhan
DEFAULT_ADMIN_EMAIL=a.chfrn@gmail.com
DEFAULT_ADMIN_PASSWORD=11111111

If user exists but role is not Admin, role is promoted to Admin.
