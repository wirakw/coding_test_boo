# A Node.js Express server 

## Features

- 👤 **User** - Create, read, update, and delete users
- 📝 **Profile** - Manage profiles with personality traits (MBTI, Enneagram, Zodiac, Socionics, etc.)
- 💬 **Comments** - Add comments with personality voting
- ❤️ **Like/Unlike** - Like and unlike comments
- 🎨 **profile render views** - EJS templates for profile display with data from mongodb

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (optional for development - uses in-memory MongoDB for testing)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd coding_test_boo
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies:

**Production Dependencies:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `ejs` - Template engine
- `mongodb-memory-server` - In-memory MongoDB for testing

**Development Dependencies:**
- `jest` - Testing framework
- `supertest` - HTTP assertions
- `@types/jest` - TypeScript definitions

## Running the Application

### Development Mode

```bash
node app.js
```

The server will start on `http://localhost:3000`

### Environment Variables

You can configure the following environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (`development`, `test`, `production`)

## Running Tests

### Run All Tests with Coverage

```bash
npm test
```


## API Endpoints

### Users

- `POST /api/user` - Create a new user
- `GET /api/user` - Get all users
- `GET /api/user/:id` - Get user by ID
- `PUT /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user

### Profiles

- `POST /api/profile` - Create a new profile
- `GET /api/profile` - Get all profiles
- `GET /api/profile/:id` - Get profile by ID
- `PUT /api/profile/:id` - Update profile
- `DELETE /api/profile/:id` - Delete profile

### Comments

- `POST /api/comment` - Create a new comment
- `GET /api/comment` - Get all comments (supports filtering by personality type)
- `POST /api/comment/like` - Like/unlike a comment

### UI Routes

- `GET /` - Profile page (query param: `?profileid=<id>`)

## API Documentation & Testing

### Postman Collection

For complete API documentation and testing, you can import the Postman collection:

1. Open Postman
2. Click **Import** button
3. Select the Postman collection file from this repository
4. All API endpoints will be available with pre-configured examples
