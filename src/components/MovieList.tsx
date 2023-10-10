import { useTransition, animated } from "react-spring";
import MovieItem from "./MovieItem";
import { MutableRefObject } from "react";

interface MovieListProps {
  movies: any[];
  moviesPerRow: number;
  starredMovies: { [key: number]: boolean };
  toggleStar: (id: number) => void;
  setLoadMoreRef?: any;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  moviesPerRow,
  starredMovies,
  toggleStar,
  setLoadMoreRef
}) => {
  const movieSetForObserver = movies[movies.length - 10];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {movies.map((movie, index) => (
        <MovieItem
          key={movie.id}
          movie={movie}
          setLoadMoreRef = {movieSetForObserver.id === movie.id ? setLoadMoreRef : null}
          isStarred={starredMovies[movie.id] || false}
          isRowStarred={Boolean(
            movies
              .slice(
                Math.floor(index / moviesPerRow) * moviesPerRow,
                Math.floor(index / moviesPerRow) * moviesPerRow + moviesPerRow
              )
              .find((m) => starredMovies[m.id])
          )}
          toggleStar={toggleStar}
        />
      ))}
    </div>
  );
};

export default MovieList;
