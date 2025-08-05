// Objek dasar untuk Movie dan Series
export interface IMovies {
  _id: string; // ID unik untuk navigasi (e.g., /movies/{_id})
  title: string;
  type: "movie" | "series";
  posterImg: string;
  rating: string; // Biasanya dalam format "8.5/10"
  url: string; // URL sumber
  qualityResolution: string; // e.g., "HD", "BLURAY"
  genres: string[];
}

// Untuk hasil pencarian
export interface ISearchedMoviesOrSeries {
  _id: string;
  title: string;
  type: "movies" | "series";
  posterImg: string;
  url: string;
  genres: string[];
  directors: string[];
  casts: string[];
}

// Sumber streaming
export interface IStreamSources {
  provider: string; // Nama penyedia (e.g., "Server F")
  url: string;
  resolutions: string[]; // e.g., ["1080p", "720p"]
}

// Link download
export interface IDownloads {
  server: string;
  link: string;
  quality: string;
}

// Detail lengkap sebuah film
export interface IMovieDetails
  extends Omit<IMovies, "url" | "qualityResolution"> {
  quality: string;
  releaseDate: string;
  synopsis: string;
  duration: string;
  trailerUrl: string; // URL ke trailer YouTube/Vimeo
  directors: string[];
  countries: string[];
  casts: string[];
}

// Objek dasar untuk Series dalam daftar
export interface ISeries extends Omit<IMovies, "qualityResolution"> {
  episode: number;
}

// Daftar musim dalam detail series
export interface ISeasonsList {
  season: number;
  totalEpisodes: number;
}

// Detail lengkap sebuah series
export interface ISeriesDetails extends Omit<ISeries, "url"> {
  status: string; // e.g., "Ongoing", "Completed"
  releaseDate: string;
  synopsis: string;
  duration: string;
  trailerUrl: string;
  directors: string[];
  countries: string[];
  casts: string[];
  seasons: ISeasonsList[];
}

// Untuk daftar Genre
export interface ISetOfGenres {
  parameter: string; // Digunakan untuk URL (e.g., "action")
  name: string; // Nama yang ditampilkan (e.g., "Action")
  numberOfContents: number;
  url: string;
}

// Untuk daftar Negara
export interface ISetOfCountries {
  parameter: string;
  name: string;
  numberOfContents: number;
  url: string;
}

// Untuk daftar Tahun
export interface ISetOfYears {
  parameter: string;
  numberOfContents: number;
  url: string;
}
