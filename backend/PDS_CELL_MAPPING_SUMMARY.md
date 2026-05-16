# PDS Excel Export - Updated Cell Mapping Summary

## Changes Applied

This document summarizes the corrected cell mappings for the PDS Excel export feature.

---

## ✅ CORRECTED MAPPINGS

### 1. Personal Information (Page 1)

```
┌─────────────────────────────────────────────────────────────┐
│ SURNAME                    │ D10:N10                        │
│ FIRST NAME                 │ D11:K11                        │
│ NAME EXTENSION             │ L11:M11  ← ADDED               │
│ MIDDLE NAME                │ D12:N12                        │
│ DATE OF BIRTH              │ D13:F13                        │
│ PLACE OF BIRTH             │ H13:N13                        │
│ HEIGHT (m)                 │ D22:F23 (merged)               │
│ WEIGHT (kg)                │ D24:F24                        │
│ BLOOD TYPE                 │ D25:F26 (merged)               │
│ GSIS/UMID ID NO.           │ D27:F28 (merged)               │
│ PAG-IBIG ID NO.            │ D29:F30 (merged)               │
│ PHILHEALTH NO.             │ D31:F31                        │
│ SSS/PHILSYS NUMBER         │ D32:F32                        │
│ TIN NO.                    │ D33:F33                        │
│ AGENCY EMPLOYEE NO.        │ D34:F34                        │
└─────────────────────────────────────────────────────────────┘
```

### 2. Contact Information

```
┌─────────────────────────────────────────────────────────────┐
│ TELEPHONE NO.              │ I32:N32                        │
│ MOBILE NO.                 │ I33:N33                        │
│ EMAIL ADDRESS              │ I34:N34                        │
└─────────────────────────────────────────────────────────────┘
```

### 3. Residential Address

```
┌─────────────────────────────────────────────────────────────┐
│ HOUSE/BLOCK/LOT NO.        │ I17:K17                        │
│ STREET                     │ L17:N17                        │
│ SUBDIVISION/VILLAGE        │ I19:K20 (merged) ← UPDATED     │
│ BARANGAY                   │ L19:N20 (merged) ← UPDATED     │
│ CITY/MUNICIPALITY          │ I22:K22                        │
│ PROVINCE                   │ L22:N22                        │
│ ZIP CODE                   │ I24:N24                        │
└─────────────────────────────────────────────────────────────┘
```

### 4. Permanent Address

```
┌─────────────────────────────────────────────────────────────┐
│ HOUSE/BLOCK/LOT NO.        │ I25:K25                        │
│ STREET                     │ L25:N25                        │
│ SUBDIVISION/VILLAGE        │ I27:K27                        │
│ BARANGAY                   │ L27:N27                        │
│ CITY/MUNICIPALITY          │ J29                            │
│ PROVINCE                   │ M27                            │
│ ZIP CODE                   │ I31:K31                        │
└─────────────────────────────────────────────────────────────┘
```

### 5. Family Background

```
┌─────────────────────────────────────────────────────────────┐
│ SPOUSE'S SURNAME           │ D36:H36                        │
│ SPOUSE'S FIRST NAME        │ D37:F37                        │
│ SPOUSE'S NAME EXTENSION    │ G37:H37  ← ADDED               │
│ SPOUSE'S MIDDLE NAME       │ D38:H38                        │
│ OCCUPATION                 │ D39:H39                        │
│ EMPLOYER/BUSINESS NAME     │ D40:H40                        │
│ BUSINESS ADDRESS           │ D41:H41                        │
│ TELEPHONE NO.              │ D42:H42                        │
├─────────────────────────────────────────────────────────────┤
│ FATHER'S SURNAME           │ D43:H43                        │
│ FATHER'S FIRST NAME        │ D44:F44                        │
│ FATHER'S NAME EXTENSION    │ G44:H44  ← ADDED               │
│ FATHER'S MIDDLE NAME       │ D45:H45                        │
├─────────────────────────────────────────────────────────────┤
│ MOTHER'S MAIDEN NAME       │                                │
│   SURNAME                  │ D47:H47                        │
│   FIRST NAME               │ D48:H48                        │
│   MIDDLE NAME              │ D49:H49                        │
└─────────────────────────────────────────────────────────────┘
```

### 6. Educational Background (Page 2)

```
┌──────────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ LEVEL        │ SCHOOL   │ DEGREE/  │ FROM     │ TO       │ UNITS    │ YEAR     │ HONORS   │
│              │ NAME     │ COURSE   │          │          │ EARNED   │ GRAD     │          │
├──────────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ ELEMENTARY   │ D54:F54  │ G54:I54  │ J54      │ K54      │ L54      │ M54      │ N54      │
│ SECONDARY    │ D55:F55  │ G55:I55  │ J55      │ K55      │ L55      │ M55      │ N55      │
│ VOCATIONAL   │ D56:F56  │ G56:I56  │ J56      │ K56      │ L56      │ M56      │ N56      │
│ COLLEGE      │ D57:F57  │ G57:I57  │ J57      │ K57      │ L57      │ M57      │ N57      │
│ GRAD STUDIES │ D58:F58  │ G58:I58  │ J58      │ K58      │ L58      │ M58      │ N58      │
└──────────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘

← ROWS UPDATED: 54, 55, 56, 57, 58 (previously 51, 52, 53, 54, 56)
```

### 7. Signature Section

```
┌─────────────────────────────────────────────────────────────┐
│ SIGNATURE                  │ D60:I60  ← ADDED               │
│ DATE                       │ L60:M60  ← ADDED               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Key Changes Summary

### Added Fields:
1. **Name Extension** (L11:M11) - For personal name extension (Jr., Sr., III, etc.)
2. **Spouse Name Extension** (G37:H37) - For spouse's name extension
3. **Father Name Extension** (G44:H44) - For father's name extension
4. **Signature Field** (D60:I60) - Space for signature
5. **Date Field** (L60:M60) - Current date

### Updated Merged Cells:
1. **Subdivision/Village (Residential)** - Now I19:K20 (includes row 20)
2. **Barangay (Residential)** - Now L19:N20 (includes row 20)

### Updated Row Numbers:
Educational Background rows changed from:
- ELEMENTARY: 51 → **54**
- SECONDARY: 52 → **55**
- VOCATIONAL: 53 → **56**
- COLLEGE: 54 → **57**
- GRADUATE STUDIES: 56 → **58**

---

## 🔧 Implementation Status

✅ **Controller Updated**: `backend/controllers/pds-excel-export.controller.js`
✅ **Routes Added**: 
   - Faculty: `GET /api/pds/export/excel`
   - Dean: `GET /api/dean-pds/export/excel`
✅ **Documentation Updated**: `backend/PDS_EXCEL_EXPORT_MAPPING.md`

---

## 📝 Notes

1. All merged cells are properly handled in the implementation
2. Date fields are formatted as MM/DD/YYYY
3. The signature field (D60:I60) is left blank for manual signing
4. The date field (L60:M60) is automatically populated with the current date
5. Name extension fields support values like "Jr.", "Sr.", "III", "IV", etc.

---

## 🧪 Testing Checklist

- [ ] Test Faculty PDS export with complete data
- [ ] Test Dean PDS export with complete data
- [ ] Verify all name extension fields appear correctly
- [ ] Verify educational background rows (54-58)
- [ ] Verify merged cells for residential address (I19:K20, L19:N20)
- [ ] Verify signature and date fields (D60:I60, L60:M60)
- [ ] Test with partial/incomplete data
- [ ] Verify file download with correct filename format

---

## 📞 API Usage

### Faculty Export
```bash
curl -X GET "http://localhost:3000/api/pds/export/excel" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output pds_export.xlsx
```

### Dean Export
```bash
curl -X GET "http://localhost:3000/api/dean-pds/export/excel" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output pds_export.xlsx
```

---

**Last Updated**: $(date)
**Version**: 2.0 (Corrected Mappings)
