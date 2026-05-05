import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import MovieDetailPage from "./pages/MovieDetailPage";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import FoodPage from "./pages/FoodPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import AdminPage from "./pages/admin/AdminPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />
        {/* Thẻ div này sẽ chiếm hết khoảng trống còn lại */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/movies" element={<HomePage />} />
            <Route path="/foods" element={<FoodPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route
              path="/booking/:showtimeId"
              element={
                <PrivateRoute>
                  <BookingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <PrivateRoute>
                  <MyTicketsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AdminPage />
                </PrivateRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            {/* Sẽ thêm tiếp ở bước sau */}
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
