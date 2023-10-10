import { useTransition, animated } from "react-spring";
import MovieItem from "./MovieItem";

interface MovieListProps {
  movies: any[];
  moviesPerRow: number;
  starredMovies: { [key: number]: boolean };
  toggleStar: (id: number) => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  moviesPerRow,
  starredMovies,
  toggleStar,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {movies.map((movie, index) => (
        <MovieItem
          key={movie.id}
          movie={movie}
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
