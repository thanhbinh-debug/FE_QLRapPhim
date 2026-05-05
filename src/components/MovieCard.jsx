import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movies/${movie.id}`)}
      style={{
        width: 200,
        borderRadius: 10,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* Poster */}
      <img
        src={
          movie.poster || "https://via.placeholder.com/200x280?text=No+Image"
        }
        alt={movie.title}
        style={{ width: "100%", height: 280, objectFit: "cover" }}
      />

      {/* Thông tin */}
      <div style={{ padding: 12 }}>
        <h4
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 6,
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {movie.title}
        </h4>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
          {movie.genre} • {movie.duration} phút
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              background: "#fff3cd",
              color: "#856404",
              padding: "2px 8px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            ⭐ {movie.rating}
          </span>
          <span
            style={{
              background:
                movie.status === "now_showing" ? "#d4edda" : "#cce5ff",
              color: movie.status === "now_showing" ? "#155724" : "#004085",
              padding: "2px 8px",
              borderRadius: 10,
              fontSize: 11,
            }}
          >
            {movie.status === "now_showing" ? "Đang chiếu" : "Sắp chiếu"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
