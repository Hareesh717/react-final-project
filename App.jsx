
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  useParams,
  useSearchParams
} from "react-router-dom";

import "./styles.css";

const destinations = [
  {
    id: 1,
    name: "Bali",
    country: "Indonesia",
    price: 799,
    category: "Beach"
  },
  {
    id: 2,
    name: "Swiss Alps",
    country: "Switzerland",
    price: 1299,
    category: "Adventure"
  },
  {
    id: 3,
    name: "Kyoto",
    country: "Japan",
    price: 1099,
    category: "Culture"
  },
  {
    id: 4,
    name: "Santorini",
    country: "Greece",
    price: 999,
    category: "Beach"
  },
  {
    id: 5,
    name: "Jaipur",
    country: "India",
    price: 499,
    category: "Culture"
  }
];

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">TravelGo</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/destinations">Destinations</Link>
        <Link to="/services">Services</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
}

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <section className="hero">
      <p className="eyebrow">YOUR NEXT ADVENTURE</p>
      <h1>Explore the world with TravelGo</h1>
      <p>Discover amazing places and plan unforgettable journeys.</p>

      {isLoggedIn ? (
        <h3>Welcome back, Traveler!</h3>
      ) : (
        <h3>Please log in to your account.</h3>
      )}

      <button
        className="btn"
        onClick={() => setIsLoggedIn(!isLoggedIn)}
      >
        {isLoggedIn ? "Logout" : "Login"}
      </button>

      <Link className="btn secondary" to="/destinations">
        Explore Destinations
      </Link>
    </section>
  );
}

function DestinationCard({ place }) {
  return (
    <article className="card">
      <span className="category">{place.category}</span>
      <h3>{place.name}</h3>
      <p>{place.country}</p>
      <h4>${place.price} / person</h4>
      <Link to={`/destinations/${place.id}`}>
        View Details →
      </Link>
    </article>
  );
}

function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const filtered = destinations.filter((place) =>
    `${place.name} ${place.country}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="page">
      <h1>Explore Destinations</h1>

      <input
        className="search"
        placeholder="Search destinations..."
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearchParams(value ? { search: value } : {});
        }}
      />

      <div className="grid">
        {filtered.map((place) => (
          <DestinationCard key={place.id} place={place} />
        ))}
      </div>

      {filtered.length === 0 && <p>No destinations found.</p>}
    </section>
  );
}

function DestinationDetails() {
  const { id } = useParams();

  const place = destinations.find(
    (item) => item.id === Number(id)
  );

  if (!place) {
    return <h2>Destination not found</h2>;
  }

  return (
    <section className="page">
      <h1>{place.name}, {place.country}</h1>
      <p>Category: {place.category}</p>
      <h3>Price: ${place.price}</h3>
      <Link className="btn" to={`/bookings?destination=${place.name}`}>
        Book This Trip
      </Link>
    </section>
  );
}

function Services() {
  return (
    <section className="page">
      <h1>Our Services</h1>
      <div className="grid">
        <Link className="card" to="guided-tours">
          Guided Tours →
        </Link>
        <Link className="card" to="hotel-booking">
          Hotel Booking →
        </Link>
        <Link className="card" to="custom-trips">
          Custom Trips →
        </Link>
      </div>

      <Outlet />
    </section>
  );
}

function ServiceDetails() {
  const { serviceId } = useParams();

  return (
    <div className="card">
      <h2>{serviceId.replace("-", " ")}</h2>
      <p>Explore our travel services and plan your next trip.</p>
    </div>
  );
}

function Bookings() {
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [destination, setDestination] = useState(
    searchParams.get("destination") || ""
  );
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");

  function addBooking(e) {
    e.preventDefault();

    if (!destination || !date || !email) {
      alert("Please fill in all fields.");
      return;
    }

    setBookings([
      ...bookings,
      {
        id: Date.now(),
        destination,
        date,
        email
      }
    ]);

    setDestination("");
    setDate("");
    setEmail("");
  }

  function deleteBooking(id) {
    setBookings(bookings.filter((booking) => booking.id !== id));
  }

  return (
    <section className="page">
      <h1>Manage Bookings</h1>

      <form className="booking-form" onSubmit={addBooking}>
        <input
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="btn">Add Booking</button>
      </form>

      <div className="grid">
        {bookings.map((booking) => (
          <article className="card" key={booking.id}>
            <h3>{booking.destination}</h3>
            <p>{booking.date}</p>
            <p>{booking.email}</p>

            <button
              className="btn danger"
              onClick={() => deleteBooking(booking.id)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="page">
      <h1>About TravelGo</h1>
      <p>
        TravelGo helps travelers discover destinations,
        organize bookings, and create memorable journeys.
      </p>
    </section>
  );
}

function Contact() {
  return (
    <section className="page">
      <h1>Contact Us</h1>
      <p>Email: hello@travelgo.example</p>
      <p>Support: Monday to Saturday</p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 TravelGo. Explore more, worry less.</p>
    </footer>
  );
}

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="destinations" element={<Destinations />} />
          <Route
            path="destinations/:id"
            element={<DestinationDetails />}
          />

          <Route path="services" element={<Services />}>
            <Route
              index
              element={<p>Select a service above.</p>}
            />
            <Route
              path=":serviceId"
              element={<ServiceDetails />}
            />
          </Route>

          <Route path="bookings" element={<Bookings />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

          <Route
            path="*"
            element={<h1 className="page">404 - Page Not Found</h1>}
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
