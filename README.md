# 🔗 Bitespeed Backend Task – Identity Reconciliation

## 🚀 Overview

This project is built to solve the **Bitespeed Identity Reconciliation** problem. It identifies and links multiple contact records for a user based on their phone number or email, ensuring a unified customer identity across orders — even when users use different contact info each time.

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **Sequelize ORM**
- **PostgreSQL** (Hosted on [Neon.tech](https://neon.tech))
- **Typescript**
- **Deployed on Render**

---

## 📬 API Endpoint

### `POST {base_url}/api/identify`

Identifies or creates a user contact based on incoming `email` and/or `phoneNumber`.

### ✅ Request Body (JSON)
```json
{
  "email": "doc@flux.com",
  "phoneNumber": "1234567890"
}
```
### Sample Response
```
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["doc@flux.com", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [23]
  }
}
```

### 🔎 Contact Linking Logic
1. If no contact exists → create a new primary contact.
2. If either phone/email matches existing contact → link new info as secondary.
3. If both match different contacts → unify them under the older contact (by createdAt), make others secondary.
4. Ensures de-duplication and consistent primary record.

The first time, you will need to run

```
npm install
```

Then just start the server with

```
npm start
```
It uses nodemon for livereloading