import { MutableRefObject, useEffect, useRef } from "react";
import Image from "next/image";

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
  setLoadMoreRef?: any
}

const animations: string =
  "animate-slideFromTopRight animate-slideFromTopLeft animate-slideFromBottomRight animate-slideFromBottomLeft";

const MovieItem: React.FC<MovieItemProps> = ({
  movie,
  isStarred,
  isRowStarred,
  toggleStar,
  setLoadMoreRef,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const animations = [
      "slideFromTopLeft",
      "slideFromTopRight",
      "slideFromBottomLeft",
      "slideFromBottomRight",
    ];
    const randomAnimation =
      animations[Math.floor(Math.random() * animations.length)];

    const cardElement: HTMLDivElement | null = cardRef.current;
    if (cardElement === null) return;
    cardElement.style.animationName = randomAnimation;
    cardElement.style.animationDuration = Math.random() * 4 + "s";
  }, []);

  return (
    <div
      ref={(el) => {
        cardRef.current = el;
        if(setLoadMoreRef != null){
          console.log(setLoadMoreRef)
          setLoadMoreRef(el)
        }
      }}
      className={`relative ${animations} flex flex-col  mb-4 rounded-full shadow-lg hover:shadow-2xl transition-shadow ${
        isStarred
          ? "bg-yellow-300 text-black"
          : isRowStarred
          ? "bg-gray-900 text-white"
          : "bg-gray-950 text-white"
      } transition-300 transform ${isStarred ? "scale-105" : ""}`}
    >
      {/* Star Button Positioned to the Top Right */}
      <button
        className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-transparent text-yellow-500 bg-yellow-100 border border-yellow-500 rounded-full hover:bg-yellow-300 hover:text-white transition-colors ${
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
      <Image
        className="w-full h-52 rounded shadow"
        width={"200"}
        height={"100"}
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
      />
      <h2 className="text-lg h-14 md:text-l font-semibold mb-2 text-center max-h-20 overflow-hidden">
        {movie.title}
      </h2>
      <p className="mt-1 text-center"> Rating: {movie.vote_average} 🌟</p>
      <p className="text-center mb-4">
        Year: {new Date(movie.release_date).getFullYear()}
      </p>
    </div>
  );
};

export default MovieItem;
