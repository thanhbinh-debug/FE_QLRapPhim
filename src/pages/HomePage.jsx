import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import movieService from "../services/movieService";

const MovieSection = ({ title, movies }) => {
  const safeMovies = Array.isArray(movies) ? movies : [];

  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 20,
          borderLeft: "4px solid #e74c3c",
          paddingLeft: 12,
        }}
      >
        {title}
      </h2>
      {safeMovies.length === 0 ? (
        <p style={{ color: "#888" }}>Chưa có phim nào.</p>
      ) : (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {safeMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
};

const HomePage = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Load phim khi vào trang
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [nowRes, comingRes] = await Promise.all([
          movieService.getAll("now_showing"),
          movieService.getAll("coming_soon"),
        ]);
        setNowShowing(nowRes.data);
        setComingSoon(comingRes.data);
      } catch (err) {
        console.error("Lỗi tải phim:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Tìm kiếm phim
  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (!q.trim()) {
      setSearchResult([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const res = await movieService.search(q);
      setSearchResult(res.data);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {/* Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e, #e74c3c)",
          borderRadius: 16,
          padding: "40px 32px",
          marginBottom: 40,
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          🎬 Chào mừng đến CinemaApp
        </h1>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>
          Đặt vé xem phim nhanh chóng, dễ dàng
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Tìm kiếm phim..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: "100%",
            maxWidth: 500,
            padding: "12px 20px",
            borderRadius: 30,
            border: "none",
            fontSize: 15,
            outline: "none",
          }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#888" }}>Đang tải phim...</p>
      ) : searching ? (
        // Kết quả tìm kiếm
        <MovieSection
          title={`Kết quả tìm kiếm "${searchQuery}" (${searchResult.length})`}
          movies={searchResult}
        />
      ) : (
        // Danh sách phim bình thường
        <>
          <MovieSection title="🎥 Đang chiếu" movies={nowShowing} />
          <MovieSection title="🔜 Sắp chiếu" movies={comingSoon} />
        </>
      )}
    </div>
  );
};

export default HomePage;
