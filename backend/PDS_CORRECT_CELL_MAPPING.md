# PDS Template - Correct Cell Mapping

Based on analysis of `pds-template.xlsx` (CS Form 212, Revised 2025)

## I. PERSONAL INFORMATION

| Field                       | Cell/Range | Notes                       |
| --------------------------- | ---------- | --------------------------- |
| **1. SURNAME**              | D10:N10    | Merged cell                 |
| **2. FIRST NAME**           | D11:K11    | Merged cell                 |
| **NAME EXTENSION**          | L11:N11    | (JR., SR)                   |
| **MIDDLE NAME**             | D12:N12    | Merged cell                 |
| **3. DATE OF BIRTH**        | D13:F13    | Format: dd/mm/yyyy          |
| **4. PLACE OF BIRTH**       | D15:F15    | Merged cell                 |
| **5. SEX AT BIRTH**         | D16:F16    | Checkbox field              |
| **6. CIVIL STATUS**         | D17:F18    | Merged cell, Checkbox field |
| **7. HEIGHT**               | D22:F23    | Merged cell, add "m"        |
| **8. WEIGHT**               | D24:F24    | Add "kg"                    |
| **9. BLOOD TYPE**           | D25:F26    | Merged cell                 |
| **10. UMID ID NO.**         | D27:F28    | Merged cell                 |
| **11. PAG-IBIG ID NO.**     | D29:F30    | Merged cell                 |
| **12. PHILHEALTH NO.**      | D31:F31    |                             |
| **13. PhilSys Number**      | D32:F32    |                             |
| **14. TIN NO.**             | D33:F33    |                             |
| **15. AGENCY EMPLOYEE NO.** | D34:F34    |                             |

## 16. CITIZENSHIP (Row 13-16)

| Field                          | Cell/Range | Type     | Notes                                 |
| ------------------------------ | ---------- | -------- | ------------------------------------- |
| **Label**                      | G13        | Text     | "16. CITIZENSHIP"                     |
| **Filipino checkbox**          | D16        | Checkbox | Mark with "X" if Filipino             |
| **Dual Citizenship checkbox**  | G16        | Checkbox | Mark with "X" if Dual                 |
| **If dual citizenship label**  | G15:I15    | Text     | "If holder of dual citizenship,"      |
| **"please indicate details"**  | G16:I16    | Text     | Merged cell                           |
| **by birth checkbox**          | D17        | Checkbox | If dual citizenship by birth          |
| **by naturalization checkbox** | G17        | Checkbox | If dual citizenship by naturalization |
| **Country field**              | L15:N15    | Text     | "Pls. indicate country:"              |
| **Country value**              | L16:N16    | Input    | Write country name here               |

## 17. RESIDENTIAL ADDRESS (Row 17-24)

| Field                   | Cell/Range | Notes                     |
| ----------------------- | ---------- | ------------------------- |
| **Label**               | G17        | "17. RESIDENTIAL ADDRESS" |
| **House/Block/Lot No.** | I18:K18    |                           |
| **Street**              | L18:N18    |                           |
| **Subdivision/Village** | I19:K20    | Merged cell               |
| **Barangay**            | L19:N20    | Merged cell               |
| **City/Municipality**   | I22:K22    |                           |
| **Province**            | L22:N22    |                           |
| **ZIP CODE**            | I24:N24    |                           |

## 18. PERMANENT ADDRESS (Row 25-31)

| Field                   | Cell/Range | Notes                   |
| ----------------------- | ---------- | ----------------------- |
| **Label**               | G25        | "18. PERMANENT ADDRESS" |
| **House/Block/Lot No.** | I26:K26    |                         |
| **Street**              | L26:N26    |                         |
| **Subdivision/Village** | I27:K27    |                         |
| **Barangay**            | L27:N27    |                         |
| **City/Municipality**   | I28:K28    |                         |
| **Province**            | L28:N28    |                         |
| **ZIP CODE**            | G31:H31    |                         |

## 19-21. CONTACT INFORMATION

| Field                  | Cell/Range | Notes |
| ---------------------- | ---------- | ----- |
| **19. TELEPHONE NO.**  | I32:N32    |       |
| **20. MOBILE NO.**     | I33:N33    |       |
| **21. E-MAIL ADDRESS** | I34:N34    |       |

## II. FAMILY BACKGROUND

### 22. SPOUSE INFORMATION (Row 36-42)

| Field                      | Cell/Range | Notes |
| -------------------------- | ---------- | ----- |
| **SURNAME**                | D36:H36    |       |
| **FIRST NAME**             | D37:F37    |       |
| **NAME EXTENSION**         | G37:H37    |       |
| **MIDDLE NAME**            | D38:H38    |       |
| **OCCUPATION**             | D39:H39    |       |
| **EMPLOYER/BUSINESS NAME** | D40:H40    |       |
| **BUSINESS ADDRESS**       | D41:H41    |       |
| **TELEPHONE NO.**          | D42:H42    |       |

### 23. CHILDREN (Starting Row 36)

| Field                | Column  | Starting Row | Notes             |
| -------------------- | ------- | ------------ | ----------------- |
| **NAME of CHILDREN** | I36:L36 | 37           | Full name         |
| **DATE OF BIRTH**    | M36:N36 | 37           | dd/mm/yyyy format |

**Note:** Each child starts from row 37 onwards. Use rows 37-48 for children entries.

### 24. FATHER'S NAME (Row 43-45)

| Field              | Cell/Range | Notes |
| ------------------ | ---------- | ----- |
| **SURNAME**        | D43:H43    |       |
| **FIRST NAME**     | D44:F44    |       |
| **NAME EXTENSION** | G44:H44    |       |
| **MIDDLE NAME**    | D45:H45    |       |

### 25. MOTHER'S MAIDEN NAME (Row 46-49)

| Field           | Cell/Range | Notes |
| --------------- | ---------- | ----- |
| **SURNAME**     | D47:H47    |       |
| **FIRST NAME**  | D48:H48    |       |
| **MIDDLE NAME** | D49:H49    |       |

## III. EDUCATIONAL BACKGROUND (Row 50-58)

| Level                | Row   | Columns                                                                                                          | Fields                                                                                                                          |
| -------------------- | ----- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Headers**          | 51-53 | B-N                                                                                                              | LEVEL, NAME OF SCHOOL, BASIC EDUCATION/DEGREE/COURSE, PERIOD (From/To), HIGHEST LEVEL/UNITS, YEAR GRADUATED, SCHOLARSHIP/HONORS |
| **ELEMENTARY**       | 54    | B54:F54 (Level), D54:F54 (School), G54:I54 (Course), J54 (From), K54 (To), L54 (Units), M54 (Year), N54 (Honors) |
| **SECONDARY**        | 55    | B55:F55, D55:F55, G55:I55, J55, K55, L55, M55, N55                                                               |
| **VOCATIONAL**       | 56    | B56:F56, D56:F56, G56:I56, J56, K56, L56, M56, N56                                                               |
| **COLLEGE**          | 57    | B57:F57, D57:F57, G57:I57, J57, K57, L57, M57, N57                                                               |
| **GRADUATE STUDIES** | 58    | B58:F58, D58:F58, G58:I58, J58, K58, L58, M58, N58                                                               |

## SIGNATURE SECTION (Row 60)

| Field         | Cell/Range | Notes                                           |
| ------------- | ---------- | ----------------------------------------------- |
| **SIGNATURE** | D60:I60    | (wet signature/e-signature/digital certificate) |
| **DATE**      | J60:K60    | Current date                                    |

## CHECKBOX FIELDS - EXACT POSITIONS

### SEX AT BIRTH (Row 16)

- **Male checkbox**: Approximately E16
- **Female checkbox**: Approximately F16

### CIVIL STATUS (Row 17-18)

- **Single checkbox**: Approximately D17 or E17
- **Married checkbox**: P11 (based on analysis)
- **Widowed checkbox**: P12
- **Separated checkbox**: P13
- **Solo Parent checkbox**: P15
- **Others checkbox**: P16

### CITIZENSHIP (Row 13-17)

- **Filipino checkbox**: D16 (in merged cell D16:F16)
- **Dual Citizenship checkbox**: G16 (in merged cell G16:I16)
- **by birth checkbox**: D17 (if dual citizenship)
- **by naturalization checkbox**: G17 (if dual citizenship)

## NOTES

1. **Merged Cells**: When writing to merged cells, write to the top-left cell of the merge range
2. **Checkboxes**: Mark with "X" for checked, leave blank for unchecked
3. **Date Format**: Use MM/DD/YYYY format
4. **Boolean Values**: Convert to "YES" or "NO"
5. **Height/Weight**: Add units ("m" for height, "kg" for weight)
6. **Empty Values**: Write empty string "" for null/undefined values

## CIVIL STATUS CHECKBOXES (Column P, Rows 11-16)

Based on the analysis, civil status checkboxes are in column P:

- P11: Married
- P12: Widow/er
- P13: Separated
- P15: Solo Parent
- P16: Others

**Note:** Single checkbox is likely in the same column P, around row 10 or in the D-F range of row 17-18.
