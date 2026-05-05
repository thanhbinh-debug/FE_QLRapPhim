import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Đang xác thực...");
  const navigate = useNavigate();

  // Lấy token từ thanh địa chỉ (URL)
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      try {
        // Gửi token lên Backend (hãy kiểm tra port 5000 hay port nào của bạn)
        const response = await axios.get(
          `http://localhost:5000/auth/verify-email?token=${token}`,
        );
        setStatus("Xác thực thành công! Đang chuyển hướng...");

        // Chờ 2 giây rồi cho về trang đăng nhập
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setStatus(
          error.response?.data?.message ||
            "Xác thực thất bại hoặc mã đã hết hạn.",
        );
      }
    };

    if (token) {
      verify();
    }
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>{status}</h2>
    </div>
  );
};

export default VerifyEmail;
