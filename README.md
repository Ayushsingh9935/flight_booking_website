
# Flight Booking Website

A full-stack flight booking web application built with the MERN stack. This project allows users to browse flights, view details, and book tickets through a simple and user-friendly interface.

---

## Features

### User Features

* Browse available flights
* View flight details
* Book flight tickets
* Simple payment flow
* Responsive user interface

### Project Highlights

* Clean frontend UI
* REST API integration
* MongoDB data storage

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

* User authentication
* Booking history
* Flight filters
* Better payment confirmation flow
* Mobile UI improvements

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
