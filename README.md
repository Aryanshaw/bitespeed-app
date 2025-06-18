# 🔗 Bitespeed Backend Task – Identity Reconciliation

## 🚀 Overview

This project implements the **Bitespeed Identity Reconciliation** system that identifies and consolidates customer contact information across multiple orders. The system intelligently links contact records based on email addresses and phone numbers, ensuring a unified customer identity even when users provide different contact details across transactions.

## 🛠️ Tech Stack

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Sequelize ORM** for database operations
- **PostgreSQL** database (hosted on [Neon.tech](https://neon.tech))
- **Deployed on Render**

---

## 🌐 Live Deployment

The application is deployed and accessible at:

**Primary API Endpoint:** `POST https://aryan-bitespeed.onrender.com/api/identify`

**Alternative Frontend:** `https://biterspeed-identifier.netlify.app/identify`

---

## 📋 API Documentation

### Endpoint: `/identify`

**Method:** `POST`  
**Content-Type:** `application/json` *(JSON Body required, not form-data)*

### Request Format

```json
{
  "email": "user@example.com",
  "phoneNumber": "1234567890"
}
```

**Note:** Either `email` or `phoneNumber` (or both) must be provided.

### Response Format

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["user@example.com", "alternate@example.com"],
    "phoneNumbers": ["1234567890", "0987654321"],
    "secondaryContactIds": [23, 45]
  }
}
```

---

## 🔄 Identity Reconciliation Logic

The system follows these rules for contact consolidation:

1. **New Contact**: If no existing contact matches the provided email/phone → creates a new primary contact
2. **Partial Match**: If email OR phone matches an existing contact → links the new information as a secondary contact
3. **Multiple Matches**: If email and phone match different existing contacts → consolidates them under the older contact (by `createdAt`), converting others to secondary
4. **Deduplication**: Ensures no duplicate emails or phone numbers in the response

This approach maintains data integrity while providing a unified view of customer interactions.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bitspeed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with your database configuration:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   PORT=3000
   ```

4. **Start the development server**
   ```bash
   npm run start
   ```

The server uses **nodemon** for automatic reloading during development.

---

## 📁 Project Structure

```
bitspeed/
├── app/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── helpers/        # Utility functions
│   └── loaders/        # Database & logger setup
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧪 Testing the API

You can test the live API using curl:

```bash
curl -X POST https://aryan-bitespeed.onrender.com/api/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phoneNumber": "1234567890"
  }'
```

---

*This project was built as part of the Bitespeed backend engineering assessment.*
