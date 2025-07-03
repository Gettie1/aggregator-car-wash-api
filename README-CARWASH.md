# Car Wash API

A comprehensive NestJS-based REST API for managing car wash businesses with bookings, services, customers, vendors, and more.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Bookings Management**: Create, update, and manage car wash bookings
- **Services Management**: Define and manage available car wash services
- **Customer Management**: Handle customer profiles and information
- **Vendor Management**: Manage vendor relationships and services
- **Vehicle Management**: Track customer vehicles and their details
- **Reviews & Ratings**: Customer review system for services
- **Reports**: Generate business reports and analytics
- **Admin Panel**: Administrative functions and controls
- **Logging**: Comprehensive request and error logging
- **Data Validation**: Input validation using class-validator
- **Database Integration**: TypeORM with PostgreSQL

## Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator
- **Password Hashing**: bcrypt
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Project Structure

```
src/
├── admin/              # Admin management
├── auth/               # Authentication & authorization
├── bookings/           # Booking management
├── customer/           # Customer management
├── database/           # Database configuration
├── profile/            # User profiles
├── reports/            # Business reports
├── reviews/            # Review system
├── services/           # Service management
├── vehicles/           # Vehicle management
├── vendors/            # Vendor management
├── seed/               # Database seeding
├── app.logs/           # Logging service
├── main.ts             # Application entry point
└── app.module.ts       # Root module
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

### Bookings
- `GET /bookings` - List all bookings
- `GET /bookings/:id` - Get booking details
- `POST /bookings` - Create new booking
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Delete booking

### Services
- `GET /services` - List all services
- `GET /services/:id` - Get service details
- `POST /services` - Create new service
- `PUT /services/:id` - Update service
- `DELETE /services/:id` - Delete service

### Customers
- `GET /customers` - List all customers
- `GET /customers/:id` - Get customer details
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Vendors
- `GET /vendors` - List all vendors
- `GET /vendors/:id` - Get vendor details
- `POST /vendors` - Create new vendor
- `PUT /vendors/:id` - Update vendor
- `DELETE /vendors/:id` - Delete vendor

### Vehicles
- `GET /vehicles` - List all vehicles
- `GET /vehicles/:id` - Get vehicle details
- `POST /vehicles` - Create new vehicle
- `PUT /vehicles/:id` - Update vehicle
- `DELETE /vehicles/:id` - Delete vehicle

### Reviews
- `GET /reviews` - List all reviews
- `GET /reviews/:id` - Get review details
- `POST /reviews` - Create new review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Reports
- `GET /reports` - Generate business reports
- `GET /reports/:id` - Get specific report
- `POST /reports` - Create new report

### Admin
- `GET /admin/users` - List all users (Admin only)
- `GET /admin/dashboard` - Admin dashboard data
- `POST /admin/seed` - Seed database with test data

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd car-wash-api

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=carwash

# Application Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-jwt-secret-here
JWT_REFRESH_SECRET=your-jwt-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## Database Setup

1. Install PostgreSQL
2. Create a database named `carwash`
3. Update the `.env` file with your database credentials
4. Run the application - TypeORM will automatically create the tables

## Running the Application

```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

## Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## API Documentation

The API follows RESTful conventions. All endpoints return JSON responses and use standard HTTP status codes.

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Error Handling

All errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

## Development

### Code Style

- Use ESLint and Prettier for code formatting
- Follow NestJS conventions and best practices
- Write tests for all new features

### Database Migrations

TypeORM is configured to automatically synchronize the database schema in development. For production, use proper migrations.

## License

This project is licensed under the MIT License.
