import axios from "axios";
import type {
  IMovies,
  IMovieDetails,
  ISeries,
  ISeriesDetails,
  IStreamSources,
  IDownloads,
  ISearchedMoviesOrSeries,
  ISetOfGenres,
  ISetOfCountries,
  ISetOfYears,
} from "./types";

// Base URL untuk API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION_MS = 30 * 60 * 1000;

async function getWithCache<T>(url: string): Promise<T> {
  const now = Date.now();
  const cachedItem = cache.get(url);

  if (cachedItem && now - cachedItem.timestamp < CACHE_DURATION_MS) {
    return Promise.resolve(cachedItem.data as T);
  }

  const response = await api.get(url);
  const data = response.data;

  cache.set(url, { data, timestamp: now });

  return data as T;
}

// Movies Endpoints
export const moviesApi = {
  // Mendapatkan daftar film terbaru
  getMovies: (page?: number): Promise<IMovies[]> =>
    getWithCache(`/movies${page ? `?page=${page}` : ""}`),

  // Mendapatkan daftar film populer
  getPopularMovies: (page?: number): Promise<IMovies[]> =>
    getWithCache(`/popular/movies${page ? `?page=${page}` : ""}`),

  // Mendapatkan daftar film rilisan terbaru
  getRecentReleaseMovies: (page?: number): Promise<IMovies[]> =>
    getWithCache(`/recent-release/movies${page ? `?page=${page}` : ""}`),

  // Mendapatkan daftar film rating tertinggi
  getTopRatedMovies: (page?: number): Promise<IMovies[]> =>
    getWithCache(`/top-rated/movies${page ? `?page=${page}` : ""}`),

  // Mendapatkan detail lengkap sebuah film (tidak di-cache)
  getMovieDetails: (movieId: string): Promise<IMovieDetails> =>
    api.get(`/movies/${movieId}`).then((res) => res.data),

  // Mendapatkan link streaming untuk film (tidak di-cache)
  getMovieStreams: (movieId: string): Promise<IStreamSources[]> =>
    api.get(`/movies/${movieId}/streams`).then((res) => res.data),

  // Mendapatkan link download untuk film (tidak di-cache)
  getMovieDownloads: (movieId: string): Promise<IDownloads[]> =>
    api.get(`/movies/${movieId}/download`).then((res) => res.data),
};

// Series Endpoints
export const seriesApi = {
  // Mendapatkan daftar series terbaru
  getSeries: (page?: number): Promise<ISeries[]> =>
    getWithCache(`/series${page ? `?page=${page}` : ""}`),

  // Mendapatkan daftar series populer
  getPopularSeries: (page?: number): Promise<ISeries[]> =>
    getWithCache(`/popular/series${page ? `?page=${page}` : ""}`),

  // Mendapatkan daftar series rilisan terbaru
  getRecentReleaseSeries: (page?: number): Promise<ISeries[]> =>
    getWithCache(`/recent-release/series${page ? `?page=${page}` : ""}`),

  // Mendapatkan daftar series rating tertinggi
  getTopRatedSeries: (page?: number): Promise<ISeries[]> =>
    getWithCache(`/top-rated/series${page ? `?page=${page}` : ""}`),

  // Mendapatkan detail lengkap sebuah series (tidak di-cache)
  getSeriesDetails: (seriesId: string): Promise<ISeriesDetails> =>
    api.get(`/series/${seriesId}`).then((res) => res.data),

  // Mendapatkan link streaming episode (tidak di-cache)
  getSeriesStreams: (
    seriesId: string,
    season?: number,
    episode?: number
  ): Promise<IStreamSources[]> => {
    let url = `/series/${seriesId}/streams`;
    if (season && episode) {
      url += `?season=${season}&episode=${episode}`;
    }
    return api.get(url).then((res) => res.data);
  },

  // Mendapatkan link download (tidak di-cache)
  getSeriesDownloads: (seriesId: string): Promise<IDownloads[]> =>
    api.get(`/series/${seriesId}/downloads`).then((res) => res.data),
};

// Filter & Search Endpoints
export const filterApi = {
  // Mendapatkan daftar semua genre
  getGenres: (): Promise<ISetOfGenres[]> => getWithCache("/genres"),

  // Mendapatkan film/series berdasarkan genre
  getByGenre: (
    genre: string,
    isSeries = false,
    page?: number
  ): Promise<IMovies[] | ISeries[]> => {
    let url = `/genres/${genre}`;
    const params = new URLSearchParams();
    if (isSeries) params.append("series", "");
    if (page) params.append("page", page.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return getWithCache(url);
  },

  // Mendapatkan daftar semua negara
  getCountries: (): Promise<ISetOfCountries[]> => getWithCache("/countries"),

  // Mendapatkan film/series berdasarkan negara
  getByCountry: (
    country: string,
    isSeries = false,
    page?: number
  ): Promise<IMovies[] | ISeries[]> => {
    let url = `/countries/${country}`;
    const params = new URLSearchParams();
    if (isSeries) params.append("series", "");
    if (page) params.append("page", page.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return getWithCache(url);
  },

  // Mendapatkan daftar semua tahun rilis
  getYears: (): Promise<ISetOfYears[]> => getWithCache("/years"),

  // Mendapatkan film/series berdasarkan tahun
  getByYear: (
    year: string,
    isSeries = false,
    page?: number
  ): Promise<IMovies[] | ISeries[]> => {
    let url = `/years/${year}`;
    const params = new URLSearchParams();
    if (isSeries) params.append("series", "");
    if (page) params.append("page", page.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return getWithCache(url);
  },

  // Mencari film atau series berdasarkan judul (tidak di-cache)
  search: (title: string): Promise<ISearchedMoviesOrSeries[]> =>
    api.get(`/search/${title}`).then((res) => res.data),
};
