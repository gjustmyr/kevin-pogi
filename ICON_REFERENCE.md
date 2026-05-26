# Academic Year Actions - Icon Reference

## Icon Guide

### Academic Year Section (Non-Archived)

| Icon | Color | Action | Description |
|------|-------|--------|-------------|
| 🖊️ (Pencil) | Blue | Edit | Modify academic year details |
| 📦 (Archive Box) | Orange | Archive | Move to archived years (soft delete) |

### Archived Years Section

| Icon | Color | Action | Description |
|------|-------|--------|-------------|
| ♻️ (Circular Arrows) | Green | Restore | Move back to active years |
| 🗑️ (Trash Can) | Red | Permanently Delete | Delete forever (cannot undo) |

## Visual Layout

### Academic Year Table
```
┌────┬───────────────┬─────────┬──────────┐
│ ID │ Academic Year │ Status  │ Actions  │
├────┼───────────────┼─────────┼──────────┤
│ 1  │ 2023-2024     │ Active  │ 🖊️  📦   │
│ 2  │ 2024-2025     │ Inactive│ 🖊️  📦   │
└────┴───────────────┴─────────┴──────────┘
```

### Archived Years Table
```
┌────┬───────────────┬──────────┬──────────┐
│ ID │ Academic Year │ Status   │ Actions  │
├────┼───────────────┼──────────┼──────────┤
│ 3  │ 2022-2023     │ Archived │ ♻️  🗑️   │
└────┴───────────────┴──────────┴──────────┘
```

## Hover Tooltips

When you hover over each icon, you'll see:
- 🖊️ → "Edit"
- 📦 → "Archive"
- ♻️ → "Restore"
- 🗑️ → "Permanently Delete"

## Color Scheme

- **Blue** (`#2563eb`) - Edit actions (safe, informational)
- **Orange** (`#ea580c`) - Archive actions (warning, reversible)
- **Green** (`#16a34a`) - Restore actions (positive, recovery)
- **Red** (`#dc2626`) - Delete actions (danger, irreversible)

## Accessibility

All icon buttons include:
- ✅ `title` attribute for tooltips
- ✅ Hover state color changes
- ✅ Proper sizing (w-5 h-5 = 20px × 20px)
- ✅ Adequate spacing between icons (mr-3)

## Quick Reference

**Need to edit?** → Click blue pencil 🖊️  
**Need to archive?** → Click orange box 📦  
**Need to restore?** → Click green arrows ♻️  
**Need to delete forever?** → Click red trash 🗑️
