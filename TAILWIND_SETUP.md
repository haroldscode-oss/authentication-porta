# Tailwind CSS Setup Guide

## Current Version
**Tailwind CSS v4.1.11** (latest v4 beta)

## Installation Status
✅ **Already Installed** - Your project is already configured with Tailwind CSS v4.

## Current Setup Details

### Dependencies
```json
{
  "tailwindcss": "^4.1.11",
  "@tailwindcss/vite": "^4.1.11",
  "@tailwindcss/postcss": "^4.1.8",
  "@tailwindcss/container-queries": "^0.1.1"
}
```

### Configuration Files

**`tailwind.config.js`** - Main configuration file
- Content paths: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- Custom theme variables loaded from `theme.json`
- Extended colors, spacing, and border radius values

**`src/index.css`** - CSS imports
```css
@import 'tailwindcss';
@import "tw-animate-css";
```

### Theme System
- Using CSS custom properties (`--color-*`, `--size-*`)
- Light theme with OKLCH color values
- Custom focus ring styling with soft glow effects
- Google Fonts integration (Inter)

## Key Features in Your Project

### v4 Specific Features
- **New CSS imports**: `@import 'tailwindcss'` instead of separate imports
- **CSS Variables Integration**: Direct `--color-*` variable mapping
- **Vite Plugin**: `@tailwindcss/vite` for faster builds
- **Container Queries**: Built-in support via plugin

### Custom Utilities
- Focus ring with soft glow effects
- Custom text selection styling
- Background animations (`@keyframes`)
- Smooth entrance animations

## If You Need to Install Tailwind v4 in a New Project

```bash
# Install Tailwind CSS v4
npm install tailwindcss@next @tailwindcss/vite@next

# Add to vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [tailwindcss()]
}

# Create tailwind.config.js
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}']
}

# Add to CSS file
@import 'tailwindcss';
```

## Documentation
- [Tailwind v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [Migration Guide](https://tailwindcss.com/docs/upgrade-guide#migrating-to-v4)

## Notes
- v4 is currently in beta but stable for production use
- Major improvements in build speed and CSS output size
- Native CSS cascade layers support
- Enhanced TypeScript integration