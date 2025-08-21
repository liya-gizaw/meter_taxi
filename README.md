# User Management Service

## Setup

1. Create `.env` with database credentials

```
NODE_ENV=development
PORT=4000
JWT_SECRET=supersecret
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=user_service
DB_LOGGING=false
```

2. Install and run

```
npm install
npm run dev
```

## API

- POST /api/auth/register { email, password?, role?, language? }
- POST /api/auth/login { email, password }
- GET /api/profiles/me (Bearer token)
- PUT /api/profiles (Bearer token)