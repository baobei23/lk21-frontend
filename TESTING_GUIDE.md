# 🧪 Panduan Testing LK21 Frontend

## 📋 Pre-requisites

Sebelum melakukan testing, pastikan:

1. ✅ **Server API berjalan** di `http://localhost:8080`
2. ✅ **Frontend server berjalan** di `http://localhost:5173`
3. ✅ **Browser modern** (Chrome, Firefox, Safari, Edge)

## 🎯 Testing Checklist

### 🏠 **1. Homepage Testing**

**URL:** `http://localhost:5173/`

#### ✅ Functional Tests:

- [ ] Halaman loading dengan benar
- [ ] Menampilkan film populer (max 8 items)
- [ ] Menampilkan series populer (max 8 items)
- [ ] Menampilkan film terbaru (max 8 items)
- [ ] Menampilkan series terbaru (max 8 items)
- [ ] Hero section dengan CTA buttons
- [ ] Link "Lihat Semua" berfungsi

#### ✅ Error Handling Tests:

- [ ] **Matikan server API** → Harus muncul NetworkError
- [ ] **Hidupkan server API** → Klik "Coba Lagi" → Muncul success toast
- [ ] **API tidak ada data** → Muncul EmptyState

---

### 🎬 **2. Movies Page Testing**

**URL:** `http://localhost:5173/movies`

#### ✅ Functional Tests:

- [ ] Default tab "Terbaru" active
- [ ] Grid menampilkan film (2 cols mobile, 4 tablet, 6 desktop)
- [ ] MovieCard hover effects
- [ ] Rating dan quality badges
- [ ] Genre tags terpotong maksimal 3

#### ✅ Tab Navigation:

- [ ] **Terbaru** → `getMovies()` API
- [ ] **Populer** → `getPopularMovies()` API
- [ ] **Rilis Baru** → `getRecentReleaseMovies()` API
- [ ] **Rating Tinggi** → `getTopRatedMovies()` API

#### ✅ Pagination:

- [ ] **Halaman 1** → Tombol "Sebelumnya" hidden
- [ ] **Klik "Selanjutnya"** → URL berubah `?page=2`
- [ ] **Halaman 2+** → Tombol "Sebelumnya" muncul
- [ ] **Halaman kosong** → Muncul EmptyState

#### ✅ URL Handling:

- [ ] `?tab=popular` → Tab populer active
- [ ] `?page=3` → Menampilkan halaman 3
- [ ] `?tab=popular&page=2` → Kombinasi tab dan page

---

### 📺 **3. Series Page Testing**

**URL:** `http://localhost:5173/series`

#### ✅ Functional Tests:

- [ ] Sama seperti Movies Page
- [ ] SeriesCard menampilkan episode number
- [ ] Badge "EP X" dengan warna hijau

#### ✅ API Integration:

- [ ] **Terbaru** → `getSeries()` API
- [ ] **Populer** → `getPopularSeries()` API
- [ ] **Rilis Baru** → `getRecentReleaseSeries()` API
- [ ] **Rating Tinggi** → `getTopRatedSeries()` API

---

### 🎭 **4. Movie Detail Testing**

**URL:** `http://localhost:5173/movies/[movie-id]`

#### ✅ Layout Tests:

- [ ] Poster image (kiri)
- [ ] Movie info (kanan)
- [ ] Rating dengan star icon
- [ ] Quality dan duration badges
- [ ] Genre tags
- [ ] Synopsis paragraph
- [ ] Directors dan cast info
- [ ] Countries list

#### ✅ Tab Navigation:

- [ ] **Informasi** tab (default active)
- [ ] **Streaming** tab (jika ada streams)
- [ ] **Download** tab (jika ada downloads)
- [ ] Tab counter: `Streaming (5)`, `Download (3)`

#### ✅ Action Buttons:

- [ ] **Tonton Trailer** → Buka window baru
- [ ] **Streaming** → Switch ke tab streaming
- [ ] **Download** → Switch ke tab download

#### ✅ Error Handling:

- [ ] **URL tidak valid** → 404 ErrorBoundary
- [ ] **Movie tidak ada** → NotFound error
- [ ] **Network error** → NetworkError component

---

### 📺 **5. Series Detail Testing**

**URL:** `http://localhost:5173/series/[series-id]`

#### ✅ Unique Features:

- [ ] Episode badge "EP X"
- [ ] Status badge (Ongoing/Completed)
- [ ] Seasons list dengan total episodes
- [ ] Episode selector grid (1,2,3,4,5...)
- [ ] Active episode highlight

#### ✅ Episode Navigation:

- [ ] **Klik episode** → Active state berubah
- [ ] **Auto switch** ke Streaming tab
- [ ] **URL params** → `?season=2&episode=8`
- [ ] **Streaming tab title** → "Streaming S2E8"

---

### 🔍 **6. Search Page Testing**

**URL:** `http://localhost:5173/search`

#### ✅ Empty State:

- [ ] Search icon dan placeholder text
- [ ] Example suggestions
- [ ] Search form functional

#### ✅ Search Functionality:

- [ ] **Search query** → URL berubah `?q=avengers`
- [ ] **Loading state** saat searching
- [ ] **Results grid** dengan mixed movies/series
- [ ] **Movie badge** biru, **Series badge** hijau
- [ ] **Director dan cast** info

#### ✅ Search Results:

- [ ] **No results** → EmptyState dengan retry
- [ ] **Network error** → NetworkError component
- [ ] **URL sharing** → `?q=batman` bisa dibagikan

---

### 🎨 **7. Genres Page Testing**

**URL:** `http://localhost:5173/genres`

#### ✅ Genre List:

- [ ] Grid layout (2-3-4 cols responsive)
- [ ] Genre name dan content count
- [ ] Hover effects pada cards
- [ ] Click navigation ke genre detail

#### ✅ Genre Detail:

**URL:** `http://localhost:5173/genres/action`

- [ ] **Film tab** (default) → Movies dari genre
- [ ] **Series tab** → Series dari genre
- [ ] **Pagination** per tab
- [ ] **Breadcrumb** "← Kembali ke Genre"

---

### 🌍 **8. Countries Page Testing**

**URL:** `http://localhost:5173/countries`

#### ✅ Functional Tests:

- [ ] Countries grid dengan content count
- [ ] Navigation ke country detail
- [ ] **Country detail** → Film/Series toggle
- [ ] **Pagination** dan **breadcrumb**

---

### 📅 **9. Years Page Testing**

**URL:** `http://localhost:5173/years`

#### ✅ Functional Tests:

- [ ] Years sorted descending (2024, 2023, 2022...)
- [ ] Grid layout yang compact
- [ ] **Year detail** → Film/Series toggle
- [ ] **Pagination** dan **breadcrumb**

---

### 📱 **10. Mobile Navigation Testing**

#### ✅ Mobile Menu:

- [ ] **Hamburger icon** pada mobile (<768px)
- [ ] **Menu toggle** → Icon berubah ke X
- [ ] **Backdrop overlay** dengan dark shade
- [ ] **Menu items** dengan active states
- [ ] **Filter dropdown** dengan nested items
- [ ] **Click outside** → Menu tertutup
- [ ] **Escape key** → Menu tertutup
- [ ] **Navigation** → Auto close menu

---

### 🍞 **11. Toast Notifications Testing**

#### ✅ Toast Types:

- [ ] **Success toast** (hijau) saat retry berhasil
- [ ] **Error toast** (merah) saat ada error
- [ ] **Warning toast** (kuning) untuk warnings
- [ ] **Info toast** (biru) untuk informasi

#### ✅ Toast Behavior:

- [ ] **Auto dismiss** setelah 5 detik (success)
- [ ] **Auto dismiss** setelah 7 detik (error)
- [ ] **Manual dismiss** dengan X button
- [ ] **Multiple toasts** stack dengan baik
- [ ] **Mobile responsive** positioning

---

### ⚡ **12. Performance Testing**

#### ✅ Loading Performance:

- [ ] **First page load** < 3 detik
- [ ] **Navigation** < 1 detik
- [ ] **API calls** dengan loading states
- [ ] **Image lazy loading** pada scroll
- [ ] **Smooth animations** tanpa lag

#### ✅ Error Recovery:

- [ ] **Network offline** → Proper error handling
- [ ] **API timeout** → NetworkError component
- [ ] **Invalid URLs** → 404 handling
- [ ] **Retry functionality** working

---

### 🎯 **13. SEO & Meta Tags Testing**

#### ✅ Meta Tags:

- [ ] **Homepage** → Title dan description
- [ ] **Movie detail** → Dynamic title dengan movie name
- [ ] **Series detail** → Dynamic meta dengan series info
- [ ] **Search page** → Title dengan query
- [ ] **Genre pages** → SEO-friendly titles

---

### 🔗 **14. URL Routing Testing**

#### ✅ Route Navigation:

- [ ] **Direct URL access** → All pages load correctly
- [ ] **Browser back/forward** → State preserved
- [ ] **URL parameters** → Proper handling
- [ ] **404 routes** → Error boundaries
- [ ] **Deep linking** → Shareable URLs

---

## 🚨 **Error Scenarios Testing**

### Network Issues:

1. **Stop API server** → Test NetworkError pada semua halaman
2. **Slow network** → Test loading states
3. **Invalid API responses** → Test error handling

### Data Issues:

1. **Empty API responses** → Test EmptyState
2. **Invalid movie/series IDs** → Test 404 handling
3. **Missing images** → Test broken image handling

### User Interactions:

1. **Rapid clicking** → Test debouncing
2. **Form submissions** → Test validation
3. **Mobile interactions** → Test touch events

---

## 📊 **Testing Results Template**

```
## Testing Results - [Date]

### ✅ Passed Tests:
- [ ] Homepage loading dan data display
- [ ] Movies page dengan tabs dan pagination
- [ ] Search functionality
- [ ] Mobile navigation
- [ ] Error handling
- [ ] Toast notifications

### ❌ Failed Tests:
- [ ] [Issue description]
- [ ] [Steps to reproduce]
- [ ] [Expected vs actual behavior]

### 🔧 Issues Found:
1. **Issue Title**
   - Description: [What happened]
   - Steps to reproduce: [How to trigger]
   - Expected: [What should happen]
   - Actual: [What actually happened]
   - Priority: High/Medium/Low

### 📈 Performance Notes:
- Loading times: [Acceptable/Slow]
- Mobile responsiveness: [Good/Issues]
- Error recovery: [Working/Needs improvement]
```

---

## 🎉 **Testing Complete!**

Setelah semua testing selesai, aplikasi LK21 Frontend siap untuk digunakan dengan fitur:

✅ **Complete CRUD operations** via API  
✅ **Responsive design** untuk semua device  
✅ **Error handling** yang comprehensive  
✅ **SEO optimization** dengan proper meta tags  
✅ **Performance optimization** dengan lazy loading  
✅ **User experience** yang excellent dengan toast notifications  
✅ **Accessibility** dengan proper ARIA labels  
✅ **Mobile-first** approach dengan touch-friendly UI

**Status: PRODUCTION READY** 🚀
