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
  const transitions = useTransition(movies, {
    keys: (movie) => movie.id,
    from: { opacity: 0, transform: "translate3d(0,-40px,0)" },
    enter: { opacity: 1, transform: "translate3d(0,20px,0)" },
    leave: { opacity: 0, transform: "translate3d(0,-40px,0)" },
    update: { opacity: 1, transform: "translate3d(0,0px,0)" },
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {transitions((styles, movie, _, index) => (
        <animated.div style={styles}>
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
        </animated.div>
      ))}
    </div>
  );
};

export default MovieList;
