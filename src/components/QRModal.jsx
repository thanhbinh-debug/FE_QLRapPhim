import React from "react";

const QRModal = ({ method, amount, onClose, onConfirm }) => {
  // Thông tin ngân hàng của bạn để demo VietQR
  const MY_BANK = {
    ID: "MB",
    ACCOUNT: "0352644312",
    NAME: "MAI QUOC KHANH",
  };

  // Logic lấy link ảnh: Nếu là momo thì lấy ảnh demo, nếu là bank thì lấy VietQR động
  const qrUrl =
    method === "momo"
      ? "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MoMo_Demo_Payment"
      : `https://img.vietqr.io/image/${MY_BANK.ID}-${MY_BANK.ACCOUNT}-compact2.png?amount=${amount}&addInfo=Thanh toan ve&accountName=${MY_BANK.NAME}`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 20,
          textAlign: "center",
          width: 350,
        }}
      >
        <h3 style={{ color: "#1a1a2e", marginBottom: 15 }}>
          Quét mã {method === "momo" ? "MoMo" : "Ngân hàng"}
        </h3>

        <img
          src={qrUrl}
          alt="QR Code"
          style={{
            width: 220,
            height: 220,
            marginBottom: 15,
            borderRadius: 10,
            border: "1px solid #eee",
          }}
        />

        <div
          style={{
            background: "#f8f9fa",
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
            textAlign: "left",
            fontSize: "14px",
          }}
        >
          <p style={{ margin: "5px 0" }}>
            💰 Số tiền: <b>{amount.toLocaleString()}đ</b>
          </p>
          <p style={{ margin: "5px 0" }}>
            📝 Nội dung: <b>Thanh toan ve xem phim</b>
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ddd",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 2,
              padding: 12,
              borderRadius: 10,
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tôi đã thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
