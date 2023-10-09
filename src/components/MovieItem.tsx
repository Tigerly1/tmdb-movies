import { useEffect, useRef } from "react";

interface MovieItemProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  };
  isStarred: boolean;
  isRowStarred: boolean; // new prop to determine if any movie in the row is starred
  toggleStar: (id: number) => void;
}

const animations : string = "animate-slideFromTopRight animate-slideFromTopLeft animate-slideFromBottomRight animate-slideFromBottomLeft"

const MovieItem: React.FC<MovieItemProps> = ({
  movie,
  isStarred,
  isRowStarred,
  toggleStar,
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const animations = [
      "slideFromTopLeft",
      "slideFromTopRight",
      "slideFromBottomLeft",
      "slideFromBottomRight",
    ];
    const randomAnimation =
      animations[Math.floor(Math.random() * animations.length)];

    const cardElement: any = cardRef.current;
    
    cardElement.style.animationName = randomAnimation;
    cardElement.style.animationDuration = Math.random() + 's'
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative ${animations} flex flex-col p-4 mb-4 rounded shadow-lg hover:shadow-xl transition-shadow ${
        isStarred
          ? "bg-yellow-300"
          : isRowStarred
          ? "bg-yellow-100"
          : "bg-white"
      } transition-transform transform ${isStarred ? "scale-105" : ""}`}
    >
      {/* Star Button Positioned to the Top Right */}
      <button
        className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-transparent text-yellow-500 border border-yellow-500 rounded-full hover:bg-yellow-500 hover:text-white transition-colors ${
          isStarred ? "bg-yellow-500 text-white" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          toggleStar(movie.id);
        }}
      >
        ⭐
      </button>

      {/* Rest of the card content */}
      <img
        className="w-28 h-40 mb-4 mx-auto rounded shadow"
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
      />
      <h2 className="text-lg h-14 md:text-xl font-semibold mb-2 text-center max-h-20 overflow-hidden">
        {movie.title}
      </h2>
      <p className="mt-1 text-center"> Rating: {movie.vote_average} 🌟</p>
      <p className="text-center mb-4">
        Year: {new Date(movie.release_date).getFullYear()} 📅
      </p>
    </div>
  );
};

export default MovieItem;
