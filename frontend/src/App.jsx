import { BrowserRouter, Routes, Route } from "react-router-dom";
import Flights from "./pages/Flights";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Passenger from "./pages/Passenger";
import Payment from "./pages/Payment";
import FlightDetails from "./pages/FlightDetails";
import SearchForm from "./components/SearchForm";
import Confirm from "./pages/Confirm";
import Booking from "./pages/Booking";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/searchform" element={<SearchForm />} />
        <Route path="/flights/:id" element={<FlightDetails />} />

        {/* PROTECTED ROUTES */}

        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/passenger"
          element={
            <ProtectedRoute>
              <Passenger />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:id"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/confirm/:id"
          element={
            <ProtectedRoute>
              <Confirm />
            </ProtectedRoute>
          }
        />

        {/* other pages */}

        <Route path="/book" element={<h1>Book Page</h1>} />
        <Route path="/trips" element={<h1>Trips Page</h1>} />
        <Route path="/offers" element={<h1>Offers Page</h1>} />
        <Route path="/checkin" element={<h1>Check-in Page</h1>} />
        <Route path="/bluchip" element={<h1>BluChip Page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
