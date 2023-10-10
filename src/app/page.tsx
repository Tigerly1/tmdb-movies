"use client";

import { useEffect, useState, FC } from "react";
import MovieList from "../components/MovieList";
import "../app/globals.css";
import useWindowWidth from "@/helpers/highlights/MoviesInRow";
import axios from "axios";
import fetcher from "@/helpers/network/fetcher";
import useSWR, { mutate } from "swr";
import useSWRInfinite from "swr/infinite";

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

interface MovieListProps {
  movies: Movie[];
  starredMovies: StarredMovies;
  toggleStar: (id: number) => void;
  moviesPerRow: number;
}

const HomePage: FC = () => {
  // const [movies, setMovies] = useState<Movie[]>([]);
  const [starredMovies, setStarredMovies] = useState<StarredMovies>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<keyof typeof SORT_ORDER>("DESC");

  const windowWidth = useWindowWidth();

  const getKey = (pageIndex: number, previousPageData: Movie[]) => {
    // reached the end
    if (previousPageData && previousPageData.length === 0) return null;

    // first page, no previousPageData
    if (pageIndex === 0) return `/api/movies?page=1&sort=${sortOrder}`;
    // add the next page
    return `/api/movies?page=${pageIndex + 1}&sort=${sortOrder}`;
  };

  const { data, error, size, setSize, mutate } = useSWRInfinite(
    getKey,
    fetcher
  );

  const movies = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");

  const sortMovies = (order: keyof typeof SORT_ORDER) => {
    setSortOrder(order);
  };

  useEffect(() => {
    setLoading(false)
  }, [data])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    mutate();
  }, [sortOrder, mutate]);

  const getMoviesPerRow = (): number => {
    if (windowWidth >= BREAKPOINTS.XL) return 5;
    if (windowWidth >= BREAKPOINTS.LG) return 4;
    if (windowWidth >= BREAKPOINTS.MD) return 3;
    return 2;
  };

  const toggleStar = (id: number) => {
    const newStarred = { ...starredMovies, [id]: !starredMovies[id] };
    setStarredMovies(newStarred);
    localStorage.setItem("starredMovies", JSON.stringify(newStarred));
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
          {isLoadingMore? null:  <button
            disabled={isLoadingMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => setSize(size + 1)}
          >
            {isLoadingMore ? "Loading..." : "Show More"}
          </button>}
         
        </>
      )}
    </div>
  );
};

export default HomePage;
