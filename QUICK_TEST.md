# ⚡ Quick Test LK21 Frontend

## 🚀 Development Server Status

**Frontend:** http://localhost:5173  
**Backend API:** http://localhost:8080

## ✅ Quick Verification Steps

### 1. **Basic Server Test**

```bash
# Test frontend server
curl -I http://localhost:5173/

# Test API server (pastikan ini berjalan)
curl -I http://localhost:8080/movies
```

### 2. **Core Pages Test**

- 🏠 Homepage: http://localhost:5173/
- 🎬 Movies: http://localhost:5173/movies
- 📺 Series: http://localhost:5173/series
- 🔍 Search: http://localhost:5173/search
- 🎭 Genres: http://localhost:5173/genres
- 🌍 Countries: http://localhost:5173/countries
- 📅 Years: http://localhost:5173/years

### 3. **Mobile Responsive Test**

- Open Chrome DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Test different screen sizes:
  - 📱 Mobile: 375px
  - 📲 Tablet: 768px
  - 💻 Desktop: 1024px+

### 4. **API Integration Test**

```javascript
// Test di browser console
fetch("http://localhost:8080/movies")
  .then((res) => res.json())
  .then((data) => console.log("Movies:", data.length));

fetch("http://localhost:8080/series")
  .then((res) => res.json())
  .then((data) => console.log("Series:", data.length));
```

### 5. **Error Handling Test**

1. **Stop API server**: `Ctrl+C` di terminal API
2. **Refresh homepage**: Harus muncul NetworkError
3. **Start API server**: Restart server
4. **Click "Coba Lagi"**: Harus muncul success toast

## 🧪 **5-Minute Test Checklist**

### Homepage (1 min)

- [ ] Loads without errors
- [ ] Shows featured content
- [ ] Navigation works
- [ ] Mobile menu works

### Movies Page (1 min)

- [ ] Grid displays movies
- [ ] Tabs switch correctly
- [ ] Pagination works
- [ ] Cards are clickable

### Search (1 min)

- [ ] Search form works
- [ ] Shows results
- [ ] Empty state displays
- [ ] Error handling works

### Mobile Navigation (1 min)

- [ ] Hamburger menu toggles
- [ ] All links work
- [ ] Overlay closes menu
- [ ] Active states show

### Error Handling (1 min)

- [ ] Network errors show properly
- [ ] Toast notifications appear
- [ ] Retry functionality works
- [ ] 404 pages handled

## 🎯 **Expected Results**

### ✅ Success Indicators:

- All pages load in < 3 seconds
- No console errors
- Mobile menu functional
- API data displays correctly
- Error states show proper messages
- Toast notifications work
- Responsive design adapts

### ❌ Failure Indicators:

- Console errors
- Broken layouts
- API connection failures
- Missing error handling
- Non-responsive design
- Toast notifications not showing

## 🔧 **Common Issues & Solutions**

### "Cannot connect to API"

- **Solution**: Start LK21-API server di http://localhost:8080

### "Page not loading"

- **Solution**: Restart frontend server `npm run dev`

### "Mobile menu not working"

- **Solution**: Check browser dev tools for JS errors

### "Toast not showing"

- **Solution**: Check ToastContainer is rendered in layout

### "Images not loading"

- **Solution**: Check API response format dan image URLs

## 📊 **Performance Benchmarks**

- **Homepage Load**: < 2 seconds
- **Navigation**: < 500ms
- **API Calls**: < 1 second
- **Image Loading**: Lazy loaded on scroll
- **Mobile Responsiveness**: 60fps animations

## 🎉 **Testing Complete!**

If all tests pass, aplikasi siap untuk:

- ✅ Production deployment
- ✅ User acceptance testing
- ✅ Performance optimization
- ✅ SEO implementation
- ✅ Analytics integration
