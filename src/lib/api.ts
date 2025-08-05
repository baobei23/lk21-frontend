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
const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Cache-Control": "max-age=3600",
  },
});

// Movies Endpoints
export const moviesApi = {
  // Mendapatkan daftar film terbaru
  getMovies: (page?: number): Promise<IMovies[]> =>
    api.get(`/movies${page ? `?page=${page}` : ""}`).then((res) => res.data),

  // Mendapatkan daftar film populer
  getPopularMovies: (page?: number): Promise<IMovies[]> =>
    api
      .get(`/popular/movies${page ? `?page=${page}` : ""}`)
      .then((res) => res.data),

  // Mendapatkan daftar film rilisan terbaru
  getRecentReleaseMovies: (page?: number): Promise<IMovies[]> =>
    api
      .get(`/recent-release/movies${page ? `?page=${page}` : ""}`)
      .then((res) => res.data),

  // Mendapatkan daftar film rating tertinggi
  getTopRatedMovies: (page?: number): Promise<IMovies[]> =>
    api
      .get(`/top-rated/movies${page ? `?page=${page}` : ""}`)
      .then((res) => res.data),

  // Mendapatkan detail lengkap sebuah film
  getMovieDetails: (movieId: string): Promise<IMovieDetails> =>
    api.get(`/movies/${movieId}`).then((res) => res.data),

  // Mendapatkan link streaming untuk film
  getMovieStreams: (movieId: string): Promise<IStreamSources[]> =>
    api.get(`/movies/${movieId}/streams`).then((res) => res.data),

  // Mendapatkan link download untuk film
  getMovieDownloads: (movieId: string): Promise<IDownloads[]> =>
    api.get(`/movies/${movieId}/download`).then((res) => res.data),
};

// Series Endpoints
export const seriesApi = {
  // Mendapatkan daftar series terbaru
  getSeries: (page?: number): Promise<ISeries[]> =>
    api.get(`/series${page ? `?page=${page}` : ""}`).then((res) => res.data),

  // Mendapatkan daftar series populer
  getPopularSeries: (page?: number): Promise<ISeries[]> =>
    api
      .get(`/popular/series${page ? `?page=${page}` : ""}`)
      .then((res) => res.data),

  // Mendapatkan daftar series rilisan terbaru
  getRecentReleaseSeries: (page?: number): Promise<ISeries[]> =>
    api
      .get(`/recent-release/series${page ? `?page=${page}` : ""}`)
      .then((res) => res.data),

  // Mendapatkan daftar series rating tertinggi
  getTopRatedSeries: (page?: number): Promise<ISeries[]> =>
    api
      .get(`/top-rated/series${page ? `?page=${page}` : ""}`)
      .then((res) => res.data),

  // Mendapatkan detail lengkap sebuah series
  getSeriesDetails: (seriesId: string): Promise<ISeriesDetails> =>
    api.get(`/series/${seriesId}`).then((res) => res.data),

  // Mendapatkan link streaming episode
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

  // Mendapatkan link download
  getSeriesDownloads: (seriesId: string): Promise<IDownloads[]> =>
    api.get(`/series/${seriesId}/downloads`).then((res) => res.data),
};

// Filter & Search Endpoints
export const filterApi = {
  // Mendapatkan daftar semua genre
  getGenres: (): Promise<ISetOfGenres[]> =>
    api.get("/genres").then((res) => res.data),

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
    return api.get(url).then((res) => res.data);
  },

  // Mendapatkan daftar semua negara
  getCountries: (): Promise<ISetOfCountries[]> =>
    api.get("/countries").then((res) => res.data),

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
    return api.get(url).then((res) => res.data);
  },

  // Mendapatkan daftar semua tahun rilis
  getYears: (): Promise<ISetOfYears[]> =>
    api.get("/years").then((res) => res.data),

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
    return api.get(url).then((res) => res.data);
  },

  // Mencari film atau series berdasarkan judul
  search: (title: string): Promise<ISearchedMoviesOrSeries[]> =>
    api.get(`/search/${title}`).then((res) => res.data),
};
