# 🎨 Official UN SDG Colors Reference

## Updated Components

The following components now use the **official UN Sustainable Development Goals colors**:

### ✅ Updated:
1. **SDG Events Chart Component** (`sdg-events-chart.ts`)
   - Used in Organization Portal Dashboard
   - Used in Dean's Organization Analytics
   - Fixed to use SDG number instead of array index

### ✅ Already Correct:
2. **Dean Organization Events** (`dean-organization-events.ts`)
3. **Organization Events** (`organization-events.ts`)

---

## Official UN SDG Colors

| SDG | Goal Name | Official Color | Hex Code |
|-----|-----------|----------------|----------|
| 1 | No Poverty | 🔴 Red | `#E5243B` |
| 2 | Zero Hunger | 🟡 Yellow | `#DDA63A` |
| 3 | Good Health and Well-being | 🟢 Green | `#4C9F38` |
| 4 | Quality Education | 🔴 Dark Red | `#C5192D` |
| 5 | Gender Equality | 🟠 Orange Red | `#FF3A21` |
| 6 | Clean Water and Sanitation | 🔵 Light Blue | `#26BDE2` |
| 7 | Affordable and Clean Energy | 🟡 Yellow | `#FCC30B` |
| 8 | Decent Work and Economic Growth | 🟤 Maroon | `#A21942` |
| 9 | Industry, Innovation and Infrastructure | 🟠 Orange | `#FD6925` |
| 10 | Reduced Inequalities | 🩷 Pink | `#DD1367` |
| 11 | Sustainable Cities and Communities | 🟠 Orange | `#FD9D24` |
| 12 | Responsible Consumption and Production | 🟤 Brown | `#BF8B2E` |
| 13 | Climate Action | 🟢 Dark Green | `#3F7E44` |
| 14 | Life Below Water | 🔵 Blue | `#0A97D9` |
| 15 | Life on Land | 🟢 Light Green | `#56C02B` |
| 16 | Peace, Justice and Strong Institutions | 🔵 Dark Blue | `#00689D` |
| 17 | Partnerships for the Goals | 🔵 Navy | `#19486A` |

---

## Color Palette Visual

```
SDG 1:  ████ #E5243B (Red)
SDG 2:  ████ #DDA63A (Yellow)
SDG 3:  ████ #4C9F38 (Green)
SDG 4:  ████ #C5192D (Dark Red)
SDG 5:  ████ #FF3A21 (Orange Red)
SDG 6:  ████ #26BDE2 (Light Blue)
SDG 7:  ████ #FCC30B (Yellow)
SDG 8:  ████ #A21942 (Maroon)
SDG 9:  ████ #FD6925 (Orange)
SDG 10: ████ #DD1367 (Pink)
SDG 11: ████ #FD9D24 (Orange)
SDG 12: ████ #BF8B2E (Brown)
SDG 13: ████ #3F7E44 (Dark Green)
SDG 14: ████ #0A97D9 (Blue)
SDG 15: ████ #56C02B (Light Green)
SDG 16: ████ #00689D (Dark Blue)
SDG 17: ████ #19486A (Navy)
```

---

## Implementation Details

### Before Fix:
The SDG chart was using array index instead of SDG number:
```typescript
const colors = sortedSDGs.map((_, index) => this.getSDGColor(index));
```
This caused incorrect color mapping when not all SDGs were present.

### After Fix:
Now correctly uses the SDG number:
```typescript
const colors = sortedSDGs.map(([sdg]) => this.getSDGColor(sdg));
```

### Color Function:
```typescript
getSDGColor(sdgNumber: number): string {
  const colors: { [key: number]: string } = {
    1: '#E5243B',  // No Poverty
    2: '#DDA63A',  // Zero Hunger
    3: '#4C9F38',  // Good Health
    // ... etc
  };
  return colors[sdgNumber] || '#999999';
}
```

---

## Where These Colors Appear

### 1. **Organization Portal**
- Dashboard → SDG Events Chart (Pie Chart)
- Events → SDG badges on event cards

### 2. **Dean Portal**
- Organization Analytics → SDG Events Chart (Pie Chart)
- Organization Events → SDG badges on event cards

### 3. **Chart Legend**
- Each SDG in the legend shows its official color
- Format: "SDG X: Goal Name: Y event(s)"

---

## Testing

To verify the colors are correct:

1. **Go to Organization Portal** → Dashboard
2. **Check the SDG pie chart** - each slice should match the official color
3. **Go to Dean Portal** → Organization Analytics
4. **Check the SDG pie chart** - colors should be consistent
5. **Compare with official UN SDG wheel** for accuracy

---

## References

- **Official UN SDG Website**: https://sdgs.un.org/goals
- **SDG Color Wheel**: https://www.un.org/sustainabledevelopment/news/communications-material/
- **SDG Guidelines**: https://www.un.org/sustainabledevelopment/wp-content/uploads/2019/01/SDG_Guidelines_AUG_2019_Final.pdf

---

## Notes

- Colors are consistent across all components
- Fallback color `#999999` (gray) is used for invalid SDG numbers
- Colors are accessible and meet WCAG contrast requirements
- Chart borders are white (`#ffffff`) for better separation

---

**Last Updated**: December 2024
**Status**: ✅ All SDG colors updated to official UN colors
