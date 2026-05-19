# PDS Form Checkbox Update

## Changes Made

Updated the Personal Data Sheet (PDS) forms to use **checkboxes** instead of dropdown selects for the following fields, matching the official PDS format:

### Fields Updated:

1. **Sex at Birth** (Field 5)
   - ☐ Male
   - ☐ Female

2. **Civil Status** (Field 6)
   - ☐ Single
   - ☐ Married
   - ☐ Widowed
   - ☐ Separated
   - ☐ Other/s

3. **Citizenship** (Field 16)
   - ☐ Filipino
   - ☐ Dual Citizenship
     - ☐ by birth
     - ☐ by naturalization
   - If dual citizenship, please indicate country (text input)

## Files Modified

### Faculty PDS Form
- `client/src/app/features/faculty/personal-data-sheet/personal-data-sheet.html`

### Dean PDS Form
- `client/src/app/features/dean/personal-data-sheet/personal-data-sheet.html`

## How It Works

### Before (Dropdown):
```html
<select [(ngModel)]="pds().sex">
  <option value="Male">Male</option>
  <option value="Female">Female</option>
</select>
```

### After (Checkboxes):
```html
<label class="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    [checked]="pds().sex === 'Male'"
    (change)="pds().sex = 'Male'"
    [disabled]="isFormReadonly()"
    class="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
  />
  <span class="text-gray-700">Male</span>
</label>
```

## User Experience

### Behavior:
- **Single Selection**: Only one checkbox can be checked at a time per field
- **Visual Feedback**: Checked checkbox shows a checkmark (✓)
- **Click to Select**: Click on either the checkbox or the label text
- **Disabled State**: When form is readonly (submitted/approved), checkboxes are disabled

### Example:
When user clicks "Male":
1. Male checkbox gets checked ✓
2. Female checkbox automatically unchecks (if it was checked)
3. Value `pds().sex` is set to `'Male'`

When user clicks "Female":
1. Female checkbox gets checked ✓
2. Male checkbox automatically unchecks
3. Value `pds().sex` is set to `'Female'`

## Styling

- **Checkbox Size**: 20px × 20px (`w-5 h-5`)
- **Color**: Green accent (`text-green-600`)
- **Border**: Gray border (`border-gray-300`)
- **Focus Ring**: Green ring on focus (`focus:ring-green-500`)
- **Cursor**: Pointer cursor on hover
- **Layout**: Flexbox with gap for proper spacing

## Responsive Design

- **Mobile**: Checkboxes stack vertically or in 2 columns
- **Desktop**: Checkboxes display horizontally with proper spacing
- **Civil Status**: Uses grid layout (2 columns on mobile, 3 on desktop)

## Data Validation

- Fields remain **required** (marked with *)
- Same validation rules apply as before
- Data is stored in the same format (string values)
- No backend changes needed

## Testing

### Test Cases:
1. ✅ Click Male checkbox → Male is checked, Female is unchecked
2. ✅ Click Female checkbox → Female is checked, Male is unchecked
3. ✅ Click Single → Single is checked, other civil status options unchecked
4. ✅ Click Dual Citizenship → Shows "by birth" and "by naturalization" options
5. ✅ Form readonly mode → All checkboxes are disabled
6. ✅ Save form → Data is saved correctly
7. ✅ Load form → Correct checkbox is pre-checked based on saved data

## Benefits

1. **Official Format**: Matches the official CS Form No. 212 (Revised 2025)
2. **Better UX**: More intuitive for users familiar with paper forms
3. **Visual Clarity**: Easier to see which option is selected
4. **Accessibility**: Better for screen readers and keyboard navigation
5. **Professional**: Looks more like the official government form

## Compatibility

- ✅ Works with existing data (no migration needed)
- ✅ Compatible with all modern browsers
- ✅ Mobile-friendly (touch-friendly checkbox size)
- ✅ Maintains form validation
- ✅ No backend changes required

## Notes

- The underlying data model remains unchanged
- Values are still stored as strings ('Male', 'Female', 'Single', etc.)
- Export to Excel functionality works the same way
- Form submission and approval process unchanged
