# 📄 Faculty Profile PDF Export Feature

## Overview

The Dean Portal now includes a **Faculty Profile PDF Export** feature that allows deans to download a professional, formatted PDF profile for any faculty member.

## ✨ Features

### 📋 Profile Template
- **Paper Size**: Long Bond Paper (8.5" x 13")
- **Format**: Professional layout with colored header design
- **Sections Included**:
  - Personal Information
  - Education Background
  - Eligibilities/Certifications
  - Courses Handled
  - Contact Information

### 🎨 Design Elements
- **Header**: Gradient design (Orange → Blue → Navy)
- **Photo Placeholder**: Initials-based placeholder
- **Color-coded Sections**: Red section headers
- **Professional Typography**: Clean, readable fonts
- **Print-optimized**: Maintains layout when printed

## 📍 Location

**Dean Portal** → **Faculty Management** → **Actions Column**

## 🔘 How to Use

1. **Navigate** to Dean Portal → Faculty Management
2. **Find** the faculty member you want to export
3. **Click** the blue ID card icon (📇) in the Actions column
4. **Confirm** the download in the popup dialog
5. **Print/Save** the PDF using your browser's print dialog

## 🎯 Button Location

The Faculty Profile button is located in the Actions column:

| Icon | Function | Color |
|------|----------|-------|
| 🔑 | Reset Password | Green |
| 📥 | Download PDS | Purple |
| **📇** | **Download Faculty Profile** | **Blue** |
| 🗑️ | Delete | Red |
| 📄 PDF | Generate Activities PDF | Green |

## 📄 PDF Template Structure

### Header Section
```
┌─────────────────────────────────────────────────┐
│  [Photo]    FACULTY PROFILE                     │
│   [AA]      JOHN MIDDLE DOE                     │
│             Assistant Professor IV               │
│             College of Engineering Technology    │
│             Contact: 09123456789                 │
│             Email: john.doe@batstate-u.edu.ph   │
└─────────────────────────────────────────────────┘
```

### Personal Information
- First Name, Middle Name, Last Name
- Employee ID
- Academic Rank
- Employment Status

### Education
- Undergraduate Degree
- Master's Degree
- Doctorate Degree

### Eligibilities
- List of certifications and eligibilities

### Courses Handled
- List of courses taught by the faculty

### Footer
- University name
- College name
- Generation date

## 🖨️ Print Settings

When the print dialog opens:

### Recommended Settings:
- **Destination**: Save as PDF or Print
- **Paper Size**: Legal (8.5" x 13")
- **Margins**: Default (0.5 inches)
- **Scale**: 100%
- **Background Graphics**: Enabled (to show colors)

### Browser-Specific:
- **Chrome/Edge**: Enable "Background graphics"
- **Firefox**: Enable "Print backgrounds"
- **Safari**: Enable "Print backgrounds"

## 💻 Technical Implementation

### Frontend (TypeScript)
```typescript
downloadFacultyProfile(faculty: Faculty) {
  // Shows confirmation dialog
  // Generates HTML template
  // Opens print dialog
}

generateFacultyProfilePDF(faculty: Faculty) {
  // Creates HTML with inline CSS
  // Uses iframe for printing
  // Maintains layout integrity
}
```

### HTML Template Features:
- **Inline CSS**: All styles embedded for portability
- **Print-optimized**: `@page` rules for paper size
- **Color-accurate**: `print-color-adjust: exact`
- **Responsive**: Adapts to different screen sizes

## 🎨 Color Scheme

| Element | Color | Hex Code |
|---------|-------|----------|
| Header Gradient Start | Orange | `#FF6B35` |
| Header Gradient Middle | Blue | `#004E89` |
| Header Gradient End | Navy | `#1A659E` |
| Section Headers | Red | `#C5192D` |
| Accent Borders | Blue | `#004E89` |
| Secondary Borders | Orange | `#FF6B35` |

## 📊 Data Sources

The profile pulls data from:
- `faculty` table (personal info, contact)
- `position_level` (academic rank)
- Static placeholders for education (to be connected to actual data)

## 🔄 Future Enhancements

### Planned Features:
1. **Dynamic Education Data**: Pull from database
2. **Photo Upload**: Display actual faculty photo
3. **Courses from Database**: Real-time course list
4. **Eligibilities from Database**: Actual certifications
5. **QR Code**: For profile verification
6. **Multiple Templates**: Different design options
7. **Batch Export**: Export multiple profiles at once

### Potential Additions:
- Research publications list
- Awards and recognitions
- Professional memberships
- Training and seminars attended
- Performance ratings

## 🐛 Troubleshooting

### Issue: Colors not showing in PDF
**Solution**: Enable "Background graphics" in print settings

### Issue: Layout breaks on print
**Solution**: Ensure paper size is set to Legal (8.5" x 13")

### Issue: Print dialog doesn't open
**Solution**: Check browser popup blocker settings

### Issue: PDF cuts off content
**Solution**: Adjust margins to 0.5 inches or less

## 📱 Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Full Support | Recommended |
| Edge | ✅ Full Support | Recommended |
| Firefox | ✅ Full Support | Enable print backgrounds |
| Safari | ✅ Full Support | Enable print backgrounds |
| Mobile Browsers | ⚠️ Limited | Use desktop for best results |

## 🔐 Permissions

**Required Role**: Dean

Only users with Dean role can access this feature in the Faculty Management section.

## 📝 Notes

- The template is designed for **long bond paper (8.5" x 13")**
- All styling is **inline** to ensure consistency
- The PDF is generated **client-side** using browser print
- No server-side PDF generation required
- **Print-to-PDF** is handled by the browser

## 🎓 Example Use Cases

1. **Faculty Evaluation**: Print profiles for review meetings
2. **Accreditation**: Prepare faculty documentation
3. **New Faculty Orientation**: Welcome packets
4. **Department Records**: Physical file maintenance
5. **External Requests**: Provide faculty information

## 📞 Support

For issues or feature requests related to Faculty Profile PDF Export:
1. Check this documentation first
2. Verify browser compatibility
3. Test print settings
4. Contact system administrator

---

**Last Updated**: December 2024  
**Feature Status**: ✅ Active  
**Version**: 1.0
