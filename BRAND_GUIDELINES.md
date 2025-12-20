# Spotlight Circles Brand Guidelines

## Logo

The Spotlight Circles logo consists of a circular design representing connection and community:
- **Center Circle**: Gold/yellow (#F5C563) - Represents the core value and opportunity
- **Outer Circles**: Teal (#4A90A4) - Represent professionals in the network
- **Connecting Segments**: Teal arcs showing the interconnected relationships

Logo files:
- SVG: `/public/images/logo.svg`
- Use on white backgrounds with minimum 20px padding

## Color Palette

### Primary Colors

**Brand Teal** (Primary)
- Teal 50: `#f0f7f9`
- Teal 100: `#d9edf2`
- Teal 200: `#b7dce6`
- Teal 300: `#88c4d4`
- **Teal 400: `#4a90a4`** ← Main brand color
- Teal 500: `#3a7d91`
- Teal 600: `#316679`
- Teal 700: `#2d5464`
- Teal 800: `#2b4754`
- Teal 900: `#273d48`

**Brand Gold** (Accent)
- Gold 50: `#fef9ec`
- Gold 100: `#fbeec9`
- Gold 200: `#f7dd8f`
- **Gold 300: `#f5c563`** ← Main accent color
- Gold 400: `#f2a63b`
- Gold 500: `#ec8620`
- Gold 600: `#d16516`
- Gold 700: `#ad4715`
- Gold 800: `#8d3719`
- Gold 900: `#742f18`

### Usage Guidelines

**Buttons & CTAs**
```
Primary: bg-brand-teal-500 hover:bg-brand-teal-600
Gradient: bg-gradient-to-r from-brand-teal-500 to-brand-gold-400
```

**Text**
```
Headings: text-brand-teal-600
Links: text-brand-teal-500 hover:text-brand-teal-600
```

**Backgrounds**
```
Light: bg-brand-teal-50
Medium: bg-brand-teal-100
Dark: bg-brand-teal-600
```

**Borders & Accents**
```
Border: border-brand-teal-400
Ring: ring-brand-teal-500
```

## Typography

- **Headings**: Bold, brand-teal-600 or gray-900
- **Body**: Regular, gray-600 or gray-700
- **Links**: Medium, brand-teal-500

## Component Patterns

### Navigation
- Logo with text in brand-teal-500
- Active states use brand-teal-100 background with brand-teal-600 text
- CTA buttons use teal-to-gold gradient

### Cards
- White background with brand-teal-200 borders on hover
- Icons in brand-teal-600
- Accents in brand-gold-400

### Badges & Pills
- Status badges: brand-teal-100 background, brand-teal-800 text
- Important: brand-gold-100 background, brand-gold-800 text
- Success: Keep green variations
- Error: Keep red variations

## Image Assets

All brand images should be stored in:
```
/public/images/
```

Current assets:
- `logo.svg` - Primary logo

## Don'ts

❌ Don't use old purple (#7C3AED) color scheme
❌ Don't stretch or distort the logo
❌ Don't use logo on busy backgrounds without white container
❌ Don't use colors outside the brand palette for primary actions
❌ Don't use generic icon placeholders when logo is available

## Implementation

### Tailwind Classes
All brand colors are available via Tailwind:
```jsx
className="bg-brand-teal-500 text-brand-gold-400"
```

### CSS Variables
Primary colors are mapped to CSS variables in globals.css:
```css
--primary: 195 45% 46%    /* Teal */
--accent: 38 85% 67%       /* Gold */
```

## Examples

### Hero Section
- Background: Gradient from brand-teal-50 to brand-gold-50
- Heading: brand-teal-600
- CTA: Gradient from brand-teal-500 to brand-gold-400

### Dashboard
- Logo in header
- Active nav items: brand-teal-100 background
- Badges: brand-teal-500

### Forms
- Focus states: brand-teal-500
- Submit buttons: brand-teal-500 hover:brand-teal-600

Last updated: December 17, 2025
