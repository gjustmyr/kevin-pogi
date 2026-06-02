# Dark Mode Feature

## Overview
A dark mode toggle has been added to the College Management Portal, allowing users to switch between light and dark themes for better viewing comfort.

## Features

### 🌓 Theme Toggle
- **Location**: 
  - Login page: Top-right corner (floating button)
  - Dashboard/Portal: Sidebar menu (above profile/sign out section)
- **Persistence**: Theme preference is saved in localStorage and persists across sessions
- **Icons**: 
  - Moon icon for dark mode activation
  - Sun icon for light mode activation

### 🎨 Styling
- **Login Page**: Full dark mode support with:
  - Dark background gradient
  - Dark form container
  - Dark input fields with proper contrast
  - Floating toggle button with shadow

- **Dashboard/Portal**: Full dark mode support with:
  - Dark sidebar
  - Dark main content area
  - Dark cards and containers
  - Dark form inputs
  - Dark tables
  - Proper text contrast throughout

### 📁 Files Modified/Created

#### New Files:
1. `client/src/app/services/theme/theme.service.ts` - Theme management service
2. `client/src/styles/dark-mode.css` - Dark mode CSS styles
3. `DARK_MODE_FEATURE.md` - This documentation

#### Modified Files:
1. `client/src/app/features/auth/login/login.ts` - Added theme service
2. `client/src/app/features/auth/login/login.html` - Added toggle button and dark mode classes
3. `client/src/app/shared/components/layout.component.ts` - Added theme service and toggle button
4. `client/src/styles.css` - Imported dark mode styles

## How It Works

### Theme Service
The `ThemeService` uses Angular signals to manage the theme state:
- Reads initial theme from localStorage
- Applies/removes the `dark` class on the document root element
- Saves theme preference to localStorage on change

### CSS Implementation
- Uses Tailwind CSS's built-in dark mode support (class strategy)
- Dark mode classes are prefixed with `dark:`
- Example: `bg-white dark:bg-gray-800`

### Toggle Behavior
1. User clicks the toggle button
2. `ThemeService.toggleTheme()` is called
3. The `isDarkMode` signal is updated
4. Angular's effect automatically:
   - Adds/removes `dark` class from `<html>` element
   - Saves preference to localStorage
5. Tailwind CSS applies dark mode styles automatically

## Usage

### For Users
1. **On Login Page**: Click the moon/sun icon in the top-right corner
2. **In Dashboard**: Click "Dark Mode" / "Light Mode" in the sidebar menu
3. Your preference is automatically saved

### For Developers

#### Adding Dark Mode to New Components
Simply add dark mode classes to your elements:

```html
<!-- Light mode: white background, dark text -->
<!-- Dark mode: dark gray background, light text -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content here
</div>
```

#### Common Dark Mode Classes
- **Backgrounds**: `bg-white dark:bg-gray-800`
- **Text**: `text-gray-900 dark:text-white`
- **Borders**: `border-gray-200 dark:border-gray-700`
- **Inputs**: `bg-white dark:bg-gray-700 text-gray-900 dark:text-white`
- **Hover states**: `hover:bg-gray-100 dark:hover:bg-gray-700`

#### Using Theme Service in Components
```typescript
import { ThemeService } from '../../services/theme/theme.service';

export class MyComponent {
  constructor(public themeService: ThemeService) {}
  
  // Check current theme
  isDark = this.themeService.isDarkMode();
  
  // Toggle theme
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
```

## Browser Support
- Works in all modern browsers that support:
  - CSS custom properties
  - localStorage
  - ES6+ JavaScript

## Future Enhancements
- [ ] System preference detection (auto-detect OS theme)
- [ ] Multiple theme options (not just light/dark)
- [ ] Theme customization (custom colors)
- [ ] Smooth transition animations between themes

## Testing
1. ✅ Toggle works on login page
2. ✅ Toggle works in dashboard sidebar
3. ✅ Theme persists after page reload
4. ✅ Theme persists after logout/login
5. ✅ All text remains readable in both modes
6. ✅ Forms and inputs work properly in both modes
7. ✅ Icons change appropriately

## Notes
- The dark mode uses Tailwind CSS v4's built-in dark mode support
- Theme preference is stored in localStorage with key: `theme`
- The `dark` class is applied to the `<html>` element
- All existing components should work without modification due to global dark mode styles
