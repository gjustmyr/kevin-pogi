# Dean Analytics Charts Implementation Guide

## Overview

This guide shows how to implement the 3D-style pie charts for the dean dashboard using Chart.js, matching the design from your screenshots.

## Files Created

1. **`client/dean-analytics-charts.html`** - Standalone HTML page with all 3 charts
2. **`client/dean-analytics-component-example.ts`** - Angular component TypeScript
3. **`client/dean-analytics-component-example.html`** - Angular component template
4. **`client/dean-analytics-component-example.css`** - Angular component styles

## Quick Start (Standalone HTML)

### 1. Open the HTML File

```bash
# Simply open in browser
open client/dean-analytics-charts.html
```

### 2. Make Sure Backend is Running

```bash
cd backend
npm start
```

### 3. Login First

- The charts require authentication
- Login to get a JWT token
- Token is stored in localStorage

## Chart Features

### ✅ Implemented Features:

- 3 Pie charts (Research, Extension, Seminars)
- Faculty names with percentages in legend
- Color-coded by faculty member
- Responsive design
- Hover effects
- Loading states
- Error handling
- Professional styling matching your screenshots

### 📊 Charts Included:

1. **Research-related Seminars/Workshops/Trainings/Conferences**
   - Endpoint: `/api/dean/faculty-analytics/research-involvement`
   - Shows faculty participation in research activities

2. **Extension Services**
   - Endpoint: `/api/dean/faculty-analytics/extension-involvement`
   - Shows faculty involvement in community extension

3. **Seminars/Workshops/Trainings/Conferences**
   - Endpoint: `/api/dean/faculty-analytics/seminars-involvement`
   - Shows faculty participation in professional development

## Color Scheme

The charts use consistent colors for each faculty member:

```javascript
const COLORS = {
  Austria: "#E67E22", // Orange
  Cabael: "#3498DB", // Blue
  Geneta: "#27AE60", // Green
  Folienta: "#8B4513", // Brown
  Hernandez: "#16697A", // Dark Teal
  Lacbay: "#2C5F2D", // Dark Green
};
```

## Angular Integration

### Step 1: Install Chart.js

```bash
npm install chart.js
```

### Step 2: Import in Module

```typescript
// app.module.ts or your feature module
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    // ... other imports
  ]
})
```

### Step 3: Copy Component Files

1. Copy `dean-analytics-component-example.ts` to your components folder
2. Copy `dean-analytics-component-example.html` as the template
3. Copy `dean-analytics-component-example.css` as the styles

### Step 4: Add to Routing

```typescript
{
  path: 'dean/analytics',
  component: DeanAnalyticsComponent,
  canActivate: [AuthGuard]
}
```

## API Integration

### Authentication

All endpoints require JWT token:

```javascript
const TOKEN = localStorage.getItem("token");

fetch(url, {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});
```

### API Response Format

```json
{
  "title": "Faculty Involvement in Research-related...",
  "subtitle": "(Permanent and Temporary)",
  "data": [
    {
      "faculty_id": 1,
      "faculty_name": "Geneta",
      "count": 15,
      "percentage": "35"
    },
    {
      "faculty_id": 2,
      "faculty_name": "Austria",
      "count": 12,
      "percentage": "27"
    }
  ],
  "total": 43
}
```

## Customization

### Change Colors

Edit the `COLORS` object:

```javascript
const COLORS = {
  YourFacultyName: "#HexColor",
  // ...
};
```

### Change Chart Size

Adjust the height in CSS:

```css
.chart-wrapper {
  height: 400px; /* Change this value */
}
```

### Change Legend Position

Modify Chart.js options:

```javascript
plugins: {
    legend: {
        position: 'right', // or 'top', 'bottom', 'left'
    }
}
```

### Add More Charts

1. Add new canvas element in HTML
2. Call `createChart()` with new endpoint
3. Add corresponding backend endpoint

## Responsive Design

The charts are fully responsive:

- **Desktop (>1200px)**: 3 columns
- **Tablet (768px-1200px)**: 2 columns
- **Mobile (<768px)**: 1 column

## Browser Compatibility

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)

## Troubleshooting

### Charts Not Showing

1. Check if backend is running
2. Verify JWT token exists in localStorage
3. Check browser console for errors
4. Verify API endpoints are accessible

### "Failed to fetch data" Error

- Check network tab in browser dev tools
- Verify token is valid
- Check CORS settings on backend
- Ensure dean is logged in

### Colors Not Matching

- Verify faculty names match exactly
- Check COLORS object has all faculty names
- Default color (#95A5A6) is used for unknown names

### Chart Too Small/Large

- Adjust `.chart-wrapper` height in CSS
- Modify `maintainAspectRatio` option
- Check parent container dimensions

## Performance Tips

1. **Lazy Loading**: Load charts only when visible
2. **Caching**: Cache API responses for 5 minutes
3. **Debouncing**: Debounce window resize events
4. **Destroy Charts**: Always destroy charts before recreating

## Example: Adding Academic Year Filter

### HTML:

```html
<select id="academicYearFilter" (change)="onYearChange($event)">
  <option value="">All Years</option>
  <option value="1">FY 2022-2023</option>
  <option value="2">FY 2023-2024</option>
  <option value="3">FY 2024-2025</option>
</select>
```

### TypeScript:

```typescript
onYearChange(event: any): void {
  const yearId = event.target.value;
  const endpoint = yearId
    ? `/research-involvement?academic_year_id=${yearId}`
    : '/research-involvement';

  this.loadChart('research', endpoint, this.researchChartRef);
}
```

## Printing

The charts are print-friendly:

- Use `window.print()` or Ctrl+P
- Charts maintain quality
- Page breaks avoid splitting charts

## Exporting Charts

### As Image:

```javascript
const canvas = document.getElementById("researchChart");
const image = canvas.toDataURL("image/png");
// Download or display image
```

### As PDF:

Use a library like jsPDF:

```javascript
import jsPDF from "jspdf";

const pdf = new jsPDF();
const canvas = document.getElementById("researchChart");
const imgData = canvas.toDataURL("image/png");
pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
pdf.save("analytics.pdf");
```

## Testing

### Manual Testing:

1. Login as dean
2. Navigate to analytics page
3. Verify all 3 charts load
4. Check percentages add up to 100%
5. Test hover tooltips
6. Test responsive design (resize browser)

### Automated Testing:

```typescript
describe("DeanAnalyticsComponent", () => {
  it("should create charts", () => {
    // Test chart creation
  });

  it("should handle API errors", () => {
    // Test error handling
  });

  it("should display loading state", () => {
    // Test loading state
  });
});
```

## Next Steps

1. ✅ Backend API is ready
2. ✅ Chart implementation is ready
3. 🔲 Integrate into your Angular app
4. 🔲 Add academic year filter
5. 🔲 Add export functionality
6. 🔲 Add print stylesheet
7. 🔲 Add more analytics charts

## Support

For issues or questions:

1. Check browser console for errors
2. Verify API responses in Network tab
3. Check backend logs
4. Review Chart.js documentation: https://www.chartjs.org/

## Resources

- **Chart.js Docs**: https://www.chartjs.org/docs/latest/
- **Chart.js Examples**: https://www.chartjs.org/docs/latest/samples/
- **Color Picker**: https://htmlcolorcodes.com/
- **Gradient Generator**: https://cssgradient.io/

---

## Quick Reference

### Start Backend:

```bash
cd backend
npm start
```

### View Charts:

```bash
open client/dean-analytics-charts.html
```

### API Endpoints:

- Research: `GET /api/dean/faculty-analytics/research-involvement`
- Extension: `GET /api/dean/faculty-analytics/extension-involvement`
- Seminars: `GET /api/dean/faculty-analytics/seminars-involvement`
- All: `GET /api/dean/faculty-analytics/dashboard`

### Required Headers:

```
Authorization: Bearer <JWT_TOKEN>
```

---

**The charts are ready to use! Just open the HTML file or integrate the Angular component into your app.** 🎉
