import axios, { all } from "axios";
import { NextResponse } from "next/server";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const API_KEY = process.env.MOVIES_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
// https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const SORT = searchParams.get("sort") ?? "DESC";
  const index = Number(searchParams.get("page") ?? 0);
  console.log(index);
  const SORT_ORDER = SORT === "DESC" ? "desc" : "asc";
  try {
    const results = await axios.get(
      `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&without_genres=99,10755&vote_count.gte=200&api_key=${API_KEY}&page=${index}&sort_by=vote_average.${SORT_ORDER}`
    );
    const Movies: Movie[] = results.data.results;
    const RESPONSE = NextResponse.json(Movies)
    RESPONSE.headers.set("Cache-Control", "public, max-age=3600");
    return RESPONSE
  } catch (error: any) {
    console.error("Error fetching movies:", error.message);
    return NextResponse.json("error", { status: 400 });
  }
}

