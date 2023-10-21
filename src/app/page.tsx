"use client";

import { useEffect, useState, FC } from "react";
import MovieList from "../components/movie/MovieList";
import "../app/globals.css";
import useWindowWidth from "@/helpers/highlights/MoviesInRow";
import axios from "axios";
import fetcher from "@/helpers/network/fetcher";
import useSWR, { mutate } from "swr";
import useSWRInfinite from "swr/infinite";
import LoadingComponent from "@/components/loading/Loading";


const BREAKPOINTS = {
  SM: 640,
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

const HomePage: FC = () => {
  // const [movies, setMovies] = useState<Movie[]>([]);
  const [starredMovies, setStarredMovies] = useState<StarredMovies>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<keyof typeof SORT_ORDER>("DESC");

  const [loadMoreRef, setLoadMoreRef] = useState<null | HTMLElement>(null);


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

  const MOVIES = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");

  const sortMovies = (order: keyof typeof SORT_ORDER) => {
    setSortOrder(order);
  };

  useEffect(() => {
    const savedStarredMovies = localStorage.getItem("starredMovies");
    if (savedStarredMovies) {
      setStarredMovies(JSON.parse(savedStarredMovies));
    }
    setLoading(false);
  }, [data]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    mutate();
  }, [sortOrder, mutate]);

  const getMoviesPerRow = (): number => {
    if (windowWidth >= BREAKPOINTS.XL) return 6;
    if (windowWidth >= BREAKPOINTS.LG) return 5;
    if (windowWidth >= BREAKPOINTS.MD) return 4;
    if (windowWidth >= BREAKPOINTS.SM) return 3
    return 2;
  };

  useEffect(() => {
    if (loadMoreRef && !isLoadingMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setSize((prevSize) => prevSize + 1);
          }
        },
        {
          rootMargin: "0px 0px 15px 0px",
        }
      );
  
      observer.observe(loadMoreRef);
  
      return () => {
        observer.unobserve(loadMoreRef);
      };
    }
  }, [loadMoreRef, setSize, isLoadingMore]);
  
  const toggleStar = (id: number) => {
    const newStarred = { ...starredMovies, [id]: !starredMovies[id] };
    setStarredMovies(newStarred);
    localStorage.setItem("starredMovies", JSON.stringify(newStarred));
  };

  return (

    <div
      className="bg-cover h-screen w-screen bg-no-repeat"
      style={{ backgroundImage: "url('images/backgroundImg.png')" }}
    >
      <div className="mx-auto  max-h-screen flex flex-col p-4">
        <div className="flex justify-between mb-4">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors m-8"
            onClick={() => sortMovies(SORT_ORDER.ASC)}
          >
            Sort ASC
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center text-white mt-8">
            Top 500 TMDB Movies
          </h1>
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors m-8"
            onClick={() => sortMovies(SORT_ORDER.DESC)}
          >
            Sort DESC
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingComponent/>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto ">
              <MovieList
                movies={MOVIES}
                starredMovies={starredMovies}
                toggleStar={toggleStar}
                moviesPerRow={getMoviesPerRow()}
                setLoadMoreRef = {setLoadMoreRef}
              />
            </div>
          </>
        )}
      </div>
    </div>

  );
};

export default HomePage;
