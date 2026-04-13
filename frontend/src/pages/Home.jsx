import Navbar from "../components/Navbar";
import SearchForm from "../components/SearchForm";
import Footer from "../components/Footer";
import "../App.css";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="hero">
        <h1>Book Flights Easily ✈️</h1>
  <p className="searchDeals">Search flights for best deals ✈️</p>
      </div>

      {/* Search */}
      <div style={{ marginTop: "-30px" }}>
        <SearchForm />
      </div>

    

      {/* Features */}
      <div className="features">
        <div>✈️ Easy Booking</div>
        <div>💳 Secure Payment</div>
        <div>⚡ Fast Search</div>
      </div>

      <Footer />
    </>
  );
}