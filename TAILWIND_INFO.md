# Tailwind CSS Information

## Version
This project uses **Tailwind CSS v3.4.x** (latest stable version)

## Installation Method
Tailwind is already configured and installed in this project. It's set up through:

- **Package**: `tailwindcss` (installed via npm)
- **PostCSS**: Integrated with Vite build system
- **Configuration**: `tailwind.config.js` in root directory

## How to Install Tailwind (if starting fresh)

If you're setting up a new project with the same configuration:

### 1. Install Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
```

### 2. Initialize Tailwind
```bash
npx tailwindcss init -p
```

### 3. Configure Template Paths
Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Add Tailwind Directives
Add to your main CSS file (`src/index.css`):
```css
@import 'tailwindcss';
```

## Current Configuration

### Theme Extension
The project uses a custom theme with CSS custom properties mapped to Tailwind colors:

```css
:root {
  --background: #ffffff;
  --foreground: oklch(0.2 0 0);
  --card: oklch(1 0 0);
  /* ... more color variables */
}

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... mappings to Tailwind */
}
```

### Custom Colors Available
- `bg-background` / `text-foreground`
- `bg-card` / `text-card-foreground`
- `bg-primary` / `text-primary-foreground`
- `bg-secondary` / `text-secondary-foreground`
- `bg-muted` / `text-muted-foreground`
- `bg-accent` / `text-accent-foreground`
- `bg-destructive` / `text-destructive-foreground`
- `border-border`
- `bg-discord` (custom Discord blue)
- `bg-button-blue` / `bg-button-blue-hover`

### Utilities Used in Project
- **Layout**: `flex`, `grid`, `space-y-*`, `gap-*`
- **Sizing**: `w-*`, `h-*`, `max-w-*`, `min-h-*`
- **Spacing**: `p-*`, `m-*`, `px-*`, `py-*`
- **Typography**: `text-*`, `font-*`, `leading-*`
- **Colors**: Custom color system with CSS variables
- **Borders**: `rounded-*`, `border-*`
- **Effects**: `shadow-*`, `backdrop-blur-*`
- **Animations**: `transition-*`, `duration-*`, `ease-*`

### Responsive Design
Uses Tailwind's responsive prefixes:
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `xl:` - Extra large screens (1280px+)

### Example Usage in Project
```tsx
<div className="min-h-screen flex items-center justify-center p-4">
  <div className="w-full max-w-md mx-auto">
    <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
      <h2 className="text-2xl font-bold text-card-foreground mb-2">
        Title
      </h2>
      <button className="w-full h-12 bg-button-blue hover:bg-button-blue-hover 
                         text-white rounded-xl font-medium transition-all 
                         duration-200 shadow-lg">
        Button
      </button>
    </div>
  </div>
</div>
```

## Development Workflow

### 1. Write HTML with Tailwind Classes
```tsx
<div className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-lg font-semibold mb-4">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

### 2. Hot Reload
- Tailwind watches for class changes automatically
- No need to restart dev server for new classes
- Purges unused classes in production build

### 3. Custom Styles (when needed)
Add to `src/index.css`:
```css
.custom-component {
  @apply bg-white rounded-lg shadow-md p-6;
}
```

## Intellisense Support

### VS Code Extension
Install "Tailwind CSS IntelliSense" for:
- Autocomplete for class names
- CSS preview on hover
- Syntax highlighting
- Error detection

### Settings for VS Code
Add to `settings.json`:
```json
{
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Build Output

### Development
- All Tailwind classes available
- Larger file size for development ease

### Production (`npm run build`)
- Automatically purges unused classes
- Optimized CSS output
- Typically reduces CSS size by 90%+

## Adding New Utilities

### Extend Theme
In `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'custom-blue': '#1e40af',
    },
    spacing: {
      '72': '18rem',
    }
  }
}
```

### Custom Components
```css
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
}
```

## Performance Tips

1. **Use Tailwind classes instead of custom CSS** when possible
2. **Purge unused styles** is automatic with Vite
3. **Group related classes** for better readability
4. **Use component abstraction** for repeated patterns

## Resources

- **Official Docs**: https://tailwindcss.com/docs
- **Cheat Sheet**: https://tailwindcomponents.com/cheatsheet/
- **Playground**: https://play.tailwindcss.com/
- **Component Library**: https://tailwindui.com/