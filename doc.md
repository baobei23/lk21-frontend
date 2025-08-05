# Dokumentasi API LK21 untuk Frontend Development

Dokumen ini menyediakan semua informasi yang dibutuhkan untuk mengembangkan aplikasi frontend menggunakan LK21-API. API ini berfungsi sebagai scraper untuk situs streaming film dan series, menyediakan data terstruktur melalui serangkaian endpoint REST.

## 1. Setup Lokal

Untuk menjalankan server API ini di lingkungan lokal Anda, ikuti langkah-langkah berikut. Ini penting agar frontend dapat dikembangkan dan diuji dengan instance API yang berjalan.

```bash
# 1. Install dependencies
npm install

# 2. Build proyek (kompilasi dari TypeScript ke JavaScript)
npm run build

# 3. (Opsional) Siapkan file .env jika ada konfigurasi khusus
# Salin dari .env.example dan sesuaikan jika perlu
cp .env.example .env

# 4. Jalankan server
npm start

# Server akan berjalan di http://localhost:8080 (default)
```

## 2. Struktur Data (Types)

Berikut adalah definisi tipe data (TypeScript) yang digunakan di seluruh respons API.

<details>
<summary><b>Umum</b></summary>

```typescript
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
  type: "movie" | "series";
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
```

</details>

<details>
<summary><b>Movie</b></summary>

```typescript
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
```

</details>

<details>
<summary><b>Series</b></summary>

```typescript
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
```

</details>

<details>
<summary><b>Genre, Country, Year</b></summary>

```typescript
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
```

</details>

---

## 3. Endpoints API

Semua endpoint menggunakan metode `GET` dan mengembalikan data dalam format JSON.

### 3.1. Movies

| Endpoint                         | Deskripsi                                 | Respons            | Pagination |
| -------------------------------- | ----------------------------------------- | ------------------ | :--------: |
| `GET /movies`                    | Mendapatkan daftar film terbaru.          | `IMovies[]`        |     ✅     |
| `GET /popular/movies`            | Mendapatkan daftar film populer.          | `IMovies[]`        |     ✅     |
| `GET /recent-release/movies`     | Mendapatkan daftar film rilisan terbaru.  | `IMovies[]`        |     ✅     |
| `GET /top-rated/movies`          | Mendapatkan daftar film rating tertinggi. | `IMovies[]`        |     ✅     |
| `GET /movies/{movieId}`          | Mendapatkan detail lengkap sebuah film.   | `IMovieDetails`    |     -      |
| `GET /movies/{movieId}/streams`  | Mendapatkan link streaming untuk film.    | `IStreamSources[]` |     -      |
| `GET /movies/{movieId}/download` | Mendapatkan link download untuk film.     | `IDownloads[]`     |     -      |

- **Parameter Path:** `{movieId}` adalah `_id` dari objek `IMovies`.

### 3.2. Series

| Endpoint                                            | Deskripsi                                                   | Respons            | Pagination |
| --------------------------------------------------- | ----------------------------------------------------------- | ------------------ | :--------: |
| `GET /series`                                       | Mendapatkan daftar series terbaru.                          | `ISeries[]`        |     ✅     |
| `GET /popular/series`                               | Mendapatkan daftar series populer.                          | `ISeries[]`        |     ✅     |
| `GET /recent-release/series`                        | Mendapatkan daftar series rilisan terbaru.                  | `ISeries[]`        |     ✅     |
| `GET /top-rated/series`                             | Mendapatkan daftar series rating tertinggi.                 | `ISeries[]`        |     ✅     |
| `GET /series/{seriesId}`                            | Mendapatkan detail lengkap sebuah series.                   | `ISeriesDetails`   |     -      |
| `GET /series/{seriesId}/streams`                    | Mendapatkan link streaming episode (default S1E1).          | `IStreamSources[]` |     -      |
| `GET /series/{seriesId}/streams?season=2&episode=8` | Mendapatkan link streaming untuk season & episode spesifik. | `IStreamSources[]` |     -      |
| `GET /series/{seriesId}/downloads`                  | Mendapatkan link download (default S1E1).                   | `IDownloads[]`     |     -      |

- **Parameter Path:** `{seriesId}` adalah `_id` dari objek `ISeries`.
- **Parameter Query:** `season` (angka), `episode` (angka).

### 3.3. Filter & Search

| Endpoint                          | Deskripsi                                   | Respons                     | Pagination |
| --------------------------------- | ------------------------------------------- | --------------------------- | :--------: |
| `GET /genres`                     | Mendapatkan daftar semua genre.             | `ISetOfGenres[]`            |     -      |
| `GET /genres/{genre}`             | Mendapatkan film berdasarkan genre.         | `IMovies[]`                 |     ✅     |
| `GET /genres/{genre}?series`      | Mendapatkan series berdasarkan genre.       | `ISeries[]`                 |     ✅     |
| `GET /countries`                  | Mendapatkan daftar semua negara.            | `ISetOfCountries[]`         |     -      |
| `GET /countries/{country}`        | Mendapatkan film berdasarkan negara.        | `IMovies[]`                 |     ✅     |
| `GET /countries/{country}?series` | Mendapatkan series berdasarkan negara.      | `ISeries[]`                 |     ✅     |
| `GET /years`                      | Mendapatkan daftar semua tahun rilis.       | `ISetOfYears[]`             |     -      |
| `GET /years/{year}`               | Mendapatkan film berdasarkan tahun.         | `IMovies[]`                 |     ✅     |
| `GET /years/{year}?series`        | Mendapatkan series berdasarkan tahun.       | `ISeries[]`                 |     ✅     |
| `GET /search/{title}`             | Mencari film atau series berdasarkan judul. | `ISearchedMoviesOrSeries[]` |     -      |

- **Parameter Path:** `{genre}`, `{country}`, `{year}` menggunakan `parameter` dari `ISetOf...`
- **Parameter Query:** `?series` (tanpa value) untuk beralih dari film (default) ke series.

---

## 4. Pagination

Endpoint yang ditandai dengan ✅ mendukung pagination. Untuk mengakses halaman berikutnya, gunakan parameter query `page`.

- **Contoh:** `GET /movies?page=2` akan mengembalikan hasil dari halaman kedua.
- **Perilaku:** Jika parameter `page` tidak diberikan, API akan mengembalikan halaman pertama. Jika `page` yang diminta melebihi jumlah halaman yang ada, API akan mengembalikan array kosong `[]`.

## 5. Penanganan Error

- Jika terjadi kesalahan pada server atau request tidak valid (misalnya, `movieId` tidak ditemukan), API akan merespons dengan:
  - **Status Code:** `400` (Bad Request) atau `404` (Not Found).
  - **Body Respons:** `null`.
- Frontend harus memeriksa status respons HTTP dan menangani body `null` dengan menampilkan pesan error yang sesuai kepada pengguna (contoh: "Konten tidak ditemukan" atau "Terjadi kesalahan").

## 6. Ketentuan Frontend

- Mengutamakan kecepatan dan keringanan
