# Flight Booking Website

A full-stack flight booking web application built with the MERN stack. This project allows users to search flights, book tickets, make payments, and manage their bookings.

---

## Features

### User Features

* User registration and login
* Secure authentication with JWT
* Search available flights
* View flight details
* Book tickets
* Razorpay payment integration
* View booking history
* Responsive UI

### Admin Features

* Add flights
* Update flight details
* Delete flights
* Manage bookings

---

## Tech Stack

### Frontend

* React.js
* React Router
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Payment

* Razorpay

---

## Project Structure

```bash
flight_booking_website/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
├── .gitignore
├── README.md
└── package.json
```

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/Ayushsingh9935/flight_booking_website.git
cd flight_booking_website
```

### 2. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

---

## Environment Variables

Create a `.env` file in backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

---

## Run Project

### Start Backend

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## Future Improvements

* Email notifications
* Seat selection
* Ticket PDF download
* Admin dashboard analytics
* Flight filters

---

## Learning Outcomes

* Full-stack MERN development
* Authentication and authorization
* Payment gateway integration
* REST API development
* MongoDB database handling

---

## Author

**Ayush Singh**

GitHub: [https://github.com/Ayushsingh9935](https://github.com/Ayushsingh9935)
