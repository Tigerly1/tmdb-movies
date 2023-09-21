import { useEffect, useState } from "react";
import MovieList from "../components/MovieList";
import "../app/globals.css";
import useWindowWidth from "@/helpers/highlights/MoviesInRow";
import { env } from "process";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const BREAKPOINTS = {
  MD: 768,
  LG: 1024,
  XL: 1280,
};
const SORT_ORDER = {
  ASC: "ASC",
  DESC: "DESC",
} as const;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface StarredMovies {
  [key: number]: boolean;
}

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [starredMovies, setStarredMovies] = useState<StarredMovies>({});
  const [loading, setLoading] = useState<boolean>(true);

  const windowWidth = useWindowWidth();

  // Determine the number of movies displayed per row based on screen width
  const getMoviesPerRow = (): number => {
    if (windowWidth >= BREAKPOINTS.XL) return 5;
    if (windowWidth >= BREAKPOINTS.LG) return 4;
    if (windowWidth >= BREAKPOINTS.MD) return 3;
    return 2;
  };

  useEffect(() => {
    setLoading(true); // Start loading

    const fetchMovies = async () => {
      const allMovies: Movie[] = [];

      try {
        const promises = Array.from({ length: 25 }).map((_, index) =>
          fetch(
            `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${
              index + 1
            }`
          ).then((response) => response.json())
        );

        const results = await Promise.all(promises);
        results.forEach((data) => allMovies.push(...data.results));
        setMovies(allMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }

      setLoading(false); // End loading after data is fetched

      const savedStarredMovies = localStorage.getItem("starredMovies");
      if (savedStarredMovies) {
        setStarredMovies(JSON.parse(savedStarredMovies));
      }
    };

    fetchMovies();
  }, []);

  const toggleStar = (id: number) => {
    const newStarred = { ...starredMovies, [id]: !starredMovies[id] };
    setStarredMovies(newStarred);
    localStorage.setItem("starredMovies", JSON.stringify(newStarred));
  };

  const sortMovies = (order: keyof typeof SORT_ORDER) => {
    const sorted = [...movies].sort((a, b) => {
      return order === SORT_ORDER.ASC
        ? a.vote_average - b.vote_average
        : b.vote_average - a.vote_average;
    });
    setMovies(sorted);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">
        Top 500 TMDB Movies
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-xl text-gray-500">Loading movies...</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => sortMovies(SORT_ORDER.ASC)}
            >
              Sort ASC
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => sortMovies(SORT_ORDER.DESC)}
            >
              Sort DESC
            </button>
          </div>
          <MovieList
            movies={movies}
            starredMovies={starredMovies}
            toggleStar={toggleStar}
            moviesPerRow={getMoviesPerRow()}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;
