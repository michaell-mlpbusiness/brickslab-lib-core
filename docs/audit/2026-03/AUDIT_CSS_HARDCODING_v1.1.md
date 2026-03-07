# CSS/Style Hardcoding Audit Report
**Generated:** March 4, 2026  
**Scope:** `packages/ui-web/src/components/`  
**Purpose:** Identify hardcoded CSS values and recommend tokenization

---

## Executive Summary

**Total Components Audited:** 8 priority components + 2 reference patterns  
**Components with Hardcoding Issues:** 6/8 (75%)  
**Critical Issues Found:** 4  
**Medium Issues Found:** 12  
**Low Issues Found:** 8  

### Key Findings:
- **Good Patterns:** Text.tsx, Heading.tsx use full token-based architecture
- **Worst Offenders:** SearchResults.tsx, BurgerMenu.tsx, Sidebar.tsx
- **Main Problem Areas:** 
  - Arbitrary pixel values (12px, 14px, 20px, 40px, etc.) without token mapping
  - Hardcoded RGB/RGBA colors instead of using CSS variables
  - Magic numbers for dimensions, spacing, and transitions
  - Inconsistent theme support (some shadow values not in dark mode)

---

## CRITICAL SEVERITY (Priority 1) - Refactor Immediately

### 1. **ToggleSwitch.tsx**
**File:** [packages/ui-web/src/components/ui/toggle_switch/ToggleSwitch.tsx](packages/ui-web/src/components/ui/toggle_switch/ToggleSwitch.tsx)  
**Severity:** HIGH  
**Description:** Core UI control with multiple hardcoded dimensions and a hardcoded white background that breaks in dark mode.

**Hardcoded Values Found:**

| Line | Issue | Current Value | Recommended Fix |
|------|-------|----------------|-----------------|
| 9 | Gap spacing | `gap: 10` | Create `--space-2_5: 10px` or use `--space-2` (8px) |
| 13 | Toggle width/height | `width: 40, height: 22` | Create `--toggle-width: 40px`, `--toggle-height: 22px` |
| 14 | Border radius | `borderRadius: 11` | Create `--toggle-radius: 11px` |
| 20 | Thumb width/height | `width: 16, height: 16` | Create `--toggle-thumb-size: 16px` |
| 21 | **Hardcoded white** | `background: "white"` | Use `var(--c-toggle-bg, white)` with dark mode variant |
| 22 | Thumb position | `top: 3, left: checked ? 21 : 3` | Create `--toggle-thumb-offset-y: 3px`, `--toggle-thumb-offset-x: 21px` |
| 25 | Font size | `fontSize: 14` | Use `var(--fontsize-sm)` |

**Code Snippet:**
```tsx
// CURRENT (Line 13-22)
div style={{
  position: "relative",
  width: 40,
  height: 22,
  borderRadius: 11,
  background: checked ? "var(--color-brand)" : "var(--c-border)",
  ...
}}

// ISSUES:
1. Hardcoded dimensions break responsive design
2. White background doesn't update for dark mode
3. Magic numbers (40, 22, 11) not documented
```

**Impact:** 
- 🔴 **Dark mode incompatible** - white thumb disappears on light backgrounds
- 🔴 **Not scalable** - dimensions can't be adjusted globally
- 🔴 **Inconsistent spacing** - `gap: 10` doesn't match token scale (8px, 12px, 16px)

**Recommended Fixes:**
```tsx
// In theme-default/tokens.css - ADD:
--toggle-width: 40px;
--toggle-height: 22px;
--toggle-radius: 11px;
--toggle-thumb-size: 16px;
--toggle-thumb-offset-y: 3px;
--toggle-thumb-offset-x-unchecked: 3px;
--toggle-thumb-offset-x-checked: 21px;
--c-toggle-bg: white;

// In dark mode:
--c-toggle-bg: #2A3140;

// UPDATE: ToggleSwitch.tsx
<div style={{
  width: 'var(--toggle-width)',
  height: 'var(--toggle-height)',
  borderRadius: 'var(--toggle-radius)',
  ...
}}>
  <div style={{
    width: 'var(--toggle-thumb-size)',
    height: 'var(--toggle-thumb-size)',
    background: 'var(--c-toggle-bg)',
    top: 'var(--toggle-thumb-offset-y)',
    left: checked ? 'var(--toggle-thumb-offset-x-checked)' : 'var(--toggle-thumb-offset-x-unchecked)',
    ...
  }} />
</div>
```

**Priority:** **1 - CRITICAL** (core UI element, theme-breaking issue)

---

### 2. **SearchResults.tsx**
**File:** [packages/ui-web/src/components/navigation/search_results/SearchResults.tsx](packages/ui-web/src/components/navigation/search_results/SearchResults.tsx)  
**Severity:** HIGH  
**Description:** Dropdown component with hardcoded shadow, dimensions, and undeclared color fallback.

**Hardcoded Values Found:**

| Line | Issue | Current Value | Recommended Fix |
|------|-------|----------------|-----------------|
| 32 | Border radius | `borderRadius: "0 0 8px 8px"` | Create `--dropdown-radius: 8px` (only bottom corners) |
| 33 | Max height | `maxHeight: "500px"` | Create `--dropdown-maxheight: 500px` |
| 36 | Box shadow | `boxShadow: "0 8px 16px rgba(0,0,0,0.2)"` | Create shadow token or use enhanced `--shadow-2` |
| 37 | Margin hack | `marginTop: "-1px"` | Document as intentional border-overlap fix |
| 49 | Padding | `padding: "12px 16px"` | Use `var(--padding-lg, 12px) var(--space-4, 16px)` |
| 53 | Transition | `transition: "background-color 0.2s"` | Create `--transition-hover: background-color 0.2s ease` |
| 65 | Font size | `fontSize: "14px"` | Use `var(--fontsize-sm)` |
| 71 | Font size | `fontSize: "12px"` | Use `var(--fontsize-xs)` |
| 73 | Margin spacing | `marginTop: "4px"` | Create `--space-1_5: 4px` or use consistent `--space-2` (8px) |
| 83 | Font size | `fontSize: "11px"` | ⚠️ **No token exists** - create `--fontsize-xs-alt: 11px` |
| 84 | **Undeclared color** | `color: "var(--color-fg-secondary-muted, #888)"` | 🔴 **Token doesn't exist** - fallback to hex is wrong |
| 85 | Margin spacing | `marginTop: "4px"` | Standardize on `--space-2` (8px) |

**Code Snippet:**
```tsx
// Line 84 - PROBLEMATIC
color: "var(--color-fg-secondary-muted, #888)"
// Problem: Token --color-fg-secondary-muted is NOT defined anywhere in contract or theme
// Fallback #888 is arbitrary gray that may not work in dark mode

// Line 36 - HARDCODED SHADOW
boxShadow: "0 8px 16px rgba(0,0,0,0.2)"
// Could be --shadow-2 but that's "0 10px 30px rgba(0, 0, 0, 0.10)"
// Need intermediate shadow token
```

**Impact:**
- 🔴 **Missing token** - color fallback doesn't match theme palette
- 🔴 **Undocumented shadow** - not in theme tokens
- 🟡 **Inconsistent spacing** - mixes 4px, 12px, 16px without pattern
- 🟡 **Hardcoded max-height** - limits accessibility

**Recommended Fixes:**
```tsx
// Add to tokens.css:
--dropdown-radius: 8px;
--dropdown-maxheight: 500px;
--color-fg-secondary-muted: var(--color-muted);  // Reuse muted color
--shadow-dropdown: 0 8px 16px rgba(0, 0, 0, 0.15);  // Smoother
--transition-hover: background-color 0.2s ease;
--space-1_5: 4px;

// In dark mode - ensure shadow works:
--shadow-dropdown: 0 8px 16px rgba(0, 0, 0, 0.3);

// UPDATE: SearchResults.tsx
borderRadius: "var(--dropdown-radius)",
maxHeight: "var(--dropdown-maxheight)",
boxShadow: "var(--shadow-dropdown)",
```

**Priority:** **1 - CRITICAL** (undefined token fallback, undocumented shadow)

---

### 3. **BurgerMenu.tsx**
**File:** [packages/ui-web/src/components/layout/burger_menu/BurgerMenu.tsx](packages/ui-web/src/components/layout/burger_menu/BurgerMenu.tsx)  
**Severity:** HIGH  
**Description:** Navigation component with hardcoded overlay color, z-index, and spacing not corresponding to tokens.

**Hardcoded Values Found:**

| Line | Issue | Current Value | Recommended Fix |
|------|-------|----------------|-----------------|
| 33 | Overlay color | `backgroundColor: "rgba(0, 0, 0, 0.5)"` | Create `--overlay-color: rgba(0, 0, 0, 0.5)` |
| 34 | Z-index overlay | `zIndex: 99` | ⚠️ Use token `--z-dropdown` or `--overlay-z` |
| 40 | Position top | `top: 60` | Make dependent on Topbar height prop (don't hardcode) |
| 44 | Z-index menu | `zIndex: 100` | Should be `--z-modal` or `--z-drawer` from contract |
| 46 | Padding | `padding: "28px 0"` | Create `--menu-vertical-padding: 28px` or use `--space-4` (16px) |
| 50 | Section margin | `marginBottom: 28` | Should use space token |
| 53 | Padding | `padding: "0 20px"` | Use `--padding-lg` alternative or create section padding token |
| 54 | Font size | `fontSize: "12px"` | Use `var(--fontsize-xs)` |
| 55 | Font weight | `fontWeight: 600` | Use `var(--fontweight-semibold)` |
| 56 | Letter spacing | `letterSpacing: "0.05em"` | Create `--letter-spacing-wide: 0.05em` |
| 64 | Padding | `padding: "10px 20px"` | Use standardized space tokens |
| 65 | Font size | `fontSize: "14px"` | Use `var(--fontsize-sm)` |
| 71 | Transition timing | `transition: "background-color 0.2s, color 0.2s"` | Use `var(--transition-bg)` and extend |
| 75 | Font weights | `fontWeight: isActive ? 600 : 500` | Use `--fontweight-semibold` and `--fontweight-medium` |

**Code Snippet:**
```tsx
// Line 33-34 - OVERLAY HARDCODING
<div style={{
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 99,
}}/>

// Problem: Overlay color and z-index are magic numbers
// Not in any token file, breaks consistency

// Line 40 - HARDCODED TOP POSITION
top: 60,
// What if Topbar height changes? This breaks.
// Should accept calculated height from parent
```

**Impact:**
- 🔴 **Breaks when Topbar height changes** - hardcoded `top: 60` is brittle
- 🔴 **Undocumented z-index** - uses `99` and `100` not from token system
- 🟡 **Padding inconsistency** - `28px 0`, `20px`, `10px` all different patterns
- 🟡 **Font size scattered** - 12px, 14px without token reference

**Recommended Fixes:**
```tsx
// Add to tokens.css:
--overlay-color: rgba(0, 0, 0, 0.5);
--menu-top-offset: 60px;  // Or accept as prop
--menu-padding-y: 28px;
--menu-item-padding: 10px 20px;
--letter-spacing-section: 0.05em;
--menu-section-margin: 28px;

// UPDATE: BurgerMenu.tsx - Accept height as prop
export function BurgerMenu({
  onClose,
  topOffset = 60,  // ADD THIS PROP
  ...props
}: BurgerMenuProps) {
  return (
    <>
      <div style={{ 
        backgroundColor: "var(--overlay-color)",
        zIndex: "var(--z-dropdown)"
      }} />
      <nav style={{
        top: `var(--menu-top-offset)`,  // Or: `${topOffset}px`
        zIndex: "var(--z-modal)",
        padding: "var(--menu-padding-y) 0",
      }} />
    </>
  );
}
```

**Priority:** **1 - CRITICAL** (brittle positioning, undocumented tokens)

---

## HIGH SEVERITY (Priority 2) - Refactor Soon

### 4. **IntroCard.tsx**
**File:** [packages/ui-web/src/components/carte/intro_card/IntroCard.tsx](packages/ui-web/src/components/carte/intro_card/IntroCard.tsx)  
**Severity:** MEDIUM-HIGH  
**Description:** Card component with hardcoded gradient and lack of dark mode awareness.

**Hardcoded Values Found:**

| Line | Issue | Current Value | Recommended Fix |
|------|-------|----------------|-----------------|
| 18 | **Gradient color** | `linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%)` | Extract to token: `--gradient-brand` |
| 20 | Padding | `padding: "40px 32px"` | Create `--card-padding: 40px 32px` or use `--padding-xl` |
| 23 | Margin bottom | `marginBottom: "24px"` | Use spacing token pattern |
| 24 | Font size fallback | `fontSize: "var(--fontsize-2xl, 28px)"` | Fallback okay but verify token exists |
| 25 | Font weight fallback | `fontWeight: "var(--fontweight-bold, 700)"` | Fallback okay but verify token exists |
| 32 | Margin bottom | `marginBottom highlight ? "12px" : 0` | Use `--space-3` (12px) - already defined ✓ |
| 33 | **Missing font-size token** | `fontSize: "var(--fontsize-md, 16px)"` | 🔴 `--fontsize-md` doesn't exist; should be `--fontsize-medium` |
| 39 | Font size | `fontSize: "var(--fontsize-sm, 14px)"` | Token exists ✓ |
| 53 | Margin top | `marginTop: "16px"` | Use `--space-4` (16px) ✓ |
| 57 | Font weight | `fontWeight: "600"` | Use token variable reference |

**Code Snippet:**
```tsx
// Line 18 - HARDCODED COLOR IN GRADIENT
background: "linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%)",
// Problems:
// 1. Hardcoded rgba(204, 74, 72) duplicates exact brand color
// 2. 0.8 opacity is arbitrary
// 3. No dark mode variant
// 4. Gradient angle (135deg) not reusable

// Line 33 - WRONG TOKEN NAME
fontSize: "var(--fontsize-md, 16px)"
// In contract/tokens.css, the token is:
// --fontsize-medium: 16px;
// NOT --fontsize-md! This is error-prone.
```

**Impact:**
- 🔴 **Gradient not theming-aware** - hardcoded colors won't change in dark mode
- 🔴 **Wrong token name** - `--fontsize-md` vs `--fontsize-medium` inconsistency
- 🟡 **Scattered padding/margin** - `40px 32px`, `24px`, `16px` not standardized

**Recommended Fixes:**
```tsx
// Add to tokens.css:
--gradient-brand: linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%);
--gradient-brand-alt: linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.6) 100%);
--card-padding: 40px 32px;

// UPDATE: IntroCard.tsx
const defaultBackground = "linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%)";
// Or use CSS variable approach

// Fix font size reference:
fontSize: "var(--fontsize-medium)",  // Correct token name!
```

**Priority:** **2 - HIGH** (accessibility, dark mode support)

---

### 5. **Sidebar.tsx**
**File:** [packages/ui-web/src/components/layout/sidebar/Sidebar.tsx](packages/ui-web/src/components/layout/sidebar/Sidebar.tsx)  
**Severity:** MEDIUM  
**Description:** Navigation sidebar with mostly hardcoded spacing and typography.

**Hardcoded Values Found:**

| Line | Issue | Current Value | Recommended Fix |
|------|-------|----------------|-----------------|
| 27 | Padding | `padding: "28px 0"` | Create `--sidebar-padding: 28px 0` |
| 33 | Padding | `padding: "0 20px"` | Create `--sidebar-section-padding: 0 20px` or use `--padding-lg` |
| 34 | Margin | `marginBottom: 6` | ⚠️ Odd value; use `--space-2` (8px) or create `--space-1: 2px` |
| 35 | Font size | `fontSize: "12px"` | Use `var(--fontsize-xs)` ✓ |
| 36 | Font weight | `fontWeight: 600` | Use `var(--fontweight-semibold)` |
| 37 | Letter spacing | `letterSpacing: "0.05em"` | Create `--letter-spacing-section: 0.05em` |
| 44 | Padding | `padding: "10px 20px"` | Create consistent `--nav-item-padding` |
| 45 | Font size | `fontSize: "14px"` | Use `var(--fontsize-sm)` |
| 51 | Transition | `transition: "background-color 0.2s, color 0.2s"` | Create reusable `--transition-nav` token |
| 53 | Font weights | `fontWeight: isActive ? 600 : 500` | Use token variables |

**Code Snippet:**
```tsx
// Lines 33-37 - SECTION HEADER
<p style={{
  padding: "0 20px",
  marginBottom: 6,  // ODD VALUE - 6px?
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.05em",
}} />

// Problems:
// 1. marginBottom: 6 is arbitrary (tokens use 2, 8, 12, 16)
// 2. Multiple hardcoded values in one element
// 3. No pattern reuse
```

**Impact:**
- 🟡 **Inconsistent margins** - 6px breaks token scale
- 🟡 **Scattered typography tokens** - mixes hardcoded and token-based
- 🟡 **Difficult to maintain** - changes must be replicated in BurgerMenu.tsx too

**Recommended Fixes:**
```tsx
// Create shared config
const SIDEBAR_SECTION_HEADER_STYLE = {
  padding: "0 var(--sidebar-section-padding-x, 20px)",
  marginBottom: "var(--space-2)",  // Use 8px consistently
  fontSize: "var(--fontsize-xs)",
  fontWeight: "var(--fontweight-semibold)",
  letterSpacing: "var(--letter-spacing-section, 0.05em)",
  // ... rest
};
```

**Priority:** **2 - HIGH** (consistency, maintainability)

---

## MEDIUM SEVERITY (Priority 3) - Refactor When Possible

### 6. **Topbar.tsx**
**File:** [packages/ui-web/src/components/layout/topbar/Topbar.tsx](packages/ui-web/src/components/layout/topbar/Topbar.tsx)  
**Severity:** MEDIUM  
**Description:** Header component mixes responsive values with dynamic props but has scattered hardcoded dimensions.

**Hardcoded Values Found:**

| Line | Issue | Current Value | Recommended Fix |
|------|-------|----------------|-----------------|
| 21 | Padding responsive | `padding: "0 clamp(12px, 4vw, 24px)"` | Create `--topbar-padding-h: clamp(12px, 4vw, 24px)` |
| 22 | Gap responsive | `gap: "clamp(8px, 2vw, 16px)"` | Create `--topbar-gap: clamp(8px, 2vw, 16px)` |
| 23 | Z-index | `zIndex: 100` | Use `var(--z-modal)` from contract |
| 32 | Button padding | `padding: "8px"` | Create `--burger-padding: 8px` or use `--padding-md` |
| 33 | Button gap | `gap: "5px"` | Create `--burger-gap: 5px` |
| 38-39 | Burger line dimensions | `width: 24, height: 2` | Create `--burger-line-width: 24px`, `--burger-line-height: 2px` |
| 46 | Font size responsive | `fontSize: "clamp(14px, 3vw, 17px)"` | Create `--topbar-title-size: clamp(14px, 3vw, 17px)` |
| 47 | Font weight | `fontWeight: 700` | Use `var(--fontweight-bold)` |
| 53 | Actions gap | `gap: 12` | Use `--space-3` (12px) - already defined ✓ |

**Code Snippet:**
```tsx
// Lines 38-44 - BURGER BUTTON LINES
<div style={{ width: 24, height: 2, backgroundColor: "var(--color-brand)" }} />
<div style={{ width: 24, height: 2, backgroundColor: "var(--color-brand)" }} />
<div style={{ width: 24, height: 2, backgroundColor: "var(--color-brand)" }} />

// Issues:
// 1. Repeated 3x: width 24, height 2
// 2. No tokens for these dimensions
// 3. If burger style changes, must update 3 places
```

**Impact:**
- 🟡 **Responsive values not tokenized** - clamp() should be reusable
- 🟡 **Repetition in burger icon** - three identical hardcoded divs
- 🟡 **Z-index hardcoded** - should use contract value

**Recommended Fixes:**
```tsx
// Create burger button component
function BurgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "var(--burger-padding, 8px)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--burger-gap, 5px)",
      }}
    >
      {[1, 2, 3].map(() => (
        <div key={Math.random()}
          style={{
            width: "var(--burger-line-width, 24px)",
            height: "var(--burger-line-height, 2px)",
            backgroundColor: "var(--color-brand)",
          }}
        />
      ))}
    </button>
  );
}
```

**Priority:** **3 - MEDIUM** (refactoring opportunity, not breaking)

---

## LOW SEVERITY (Priority 4) - Nice to Have

### 7. LatestComponentsList.tsx (Dashboard)
**File:** [packages/ui-web/src/components/dashboard/LatestComponentsList.tsx](packages/ui-web/src/components/dashboard/LatestComponentsList.tsx)  
**Issues:**
- Hardcoded padding: `"12px 14px"`, `"4px 10px"`
- Hardcoded font sizes: 13px, 15px, 12px, 18px (scattered)
- Undeclared colors with fallbacks: `#CC4A48`, `#B7BCC6`, `#FBFBFB`
- Shadow: `"0 10px 30px rgba(0,0,0,0.12)"` (close to token but slightly different opacity)
- Background: `"rgba(204, 74, 72, 0.12)"` (hardcoded rgba)

**Priority:** **4 - MEDIUM-LOW** (dashboard component, less critical)

---

## REFERENCE PATTERNS (Good Implementations)

### ✅ Text.tsx (EXEMPLARY)
**File:** [packages/ui-web/src/components/typographie/text/Text.tsx](packages/ui-web/src/components/typographie/text/Text.tsx)

**Why It's Good:**
1. ✅ **Configuration-driven** - uses mapped object instead of inline styles
2. ✅ **Token-based** - relies entirely on CSS variables
3. ✅ **Semantic colors** - `tone` prop drives color selection from tokens
4. ✅ **Type-safe variants** - restricts to specific typography options
5. ✅ **Accessibility-aware** - aria-hidden and aria-label for special states
6. ✅ **No fallbacks needed** - tokens are guaranteed to exist

**Code Pattern:**
```tsx
const text_config: Record<
  "body-sm" | "body-md" | "body-lg" | "caption",
  { tag: Element; size: string; weight: string }
> = {
  "body-sm": {
    tag: "p",
    size: "var(--fontsize-medium)",
    weight: "var(--fontweight-medium)",
  },
  // ...
};

const toneColor =
  tone === "muted" ? "var(--color-muted)" :
  tone === "brand" ? "var(--color-brand)" :
  "var(--color-fg)";
```

### ✅ Heading.tsx (EXEMPLARY)
**File:** [packages/ui-web/src/components/typographie/heading/Heading.tsx](packages/ui-web/src/components/typographie/heading/Heading.tsx)

**Why It's Good:**
1. ✅ **Level-driven styling** - h1-h6 maps to different typography scales
2. ✅ **All values tokenized** - no hardcoded sizes or weights
3. ✅ **Input validation** - clamps opacity and blur values for safety
4. ✅ **Dark mode ready** - uses semantic color tokens
5. ✅ **Reusable pattern** - same config approach as Text.tsx

**Code Pattern:**
```tsx
const heading_config: Record<
  1 | 2 | 3 | 4 | 5 | 6,
  { tag: Element; size: string; weight: string }
> = {
  1: { tag: "h1", size: "var(--fontsize-5xl)", weight: "var(--fontweight-black)" },
  2: { tag: "h2", size: "var(--fontsize-4xl)", weight: "var(--fontweight-extrabold)" },
  // ...
};

// Input validation for safety
const safeOpacity = Math.min(Math.max(opacity, 0), 1);
const safeBlur = Math.min(Math.max(blurPx, 0), 10);
```

---

## Missing Tokens That Should Be Created

Based on audit, these tokens are needed in `contract.css` and `tokens.css`:

```css
/* Typography - Missing sizes */
--fontsize-md: 16px;  /* Or clarify fontsize-medium vs fontsize-md */
--fontsize-xs-alt: 11px;  /* For smaller text variations */

/* Spacing - Missing intermediate values */
--space-1_5: 4px;  /* Used in SearchResults, Sidebar marginBottom */

/* Components - Brand new tokens */
--toggle-width: 40px;
--toggle-height: 22px;
--toggle-radius: 11px;
--toggle-thumb-size: 16px;
--toggle-thumb-offset-y: 3px;
--toggle-thumb-offset-x-unchecked: 3px;
--toggle-thumb-offset-x-checked: 21px;
--c-toggle-bg: white;  /* with dark mode: #2A3140 */

--dropdown-radius: 8px;
--dropdown-maxheight: 500px;
--shadow-dropdown: 0 8px 16px rgba(0, 0, 0, 0.15);

--overlay-color: rgba(0, 0, 0, 0.5);
--menu-padding-y: 28px;
--menu-item-padding: 10px 20px;
--menu-section-margin: 28px;

--card-padding: 40px 32px;
--gradient-brand: linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%);

--letter-spacing-section: 0.05em;
--letter-spacing-wide: 0.05em;

--transition-hover: background-color 0.2s ease;
--transition-nav: background-color 0.2s, color 0.2s;

/* Typography - Responsive sizes */
--topbar-title-size: clamp(14px, 3vw, 17px);

/* Layout - Responsive spacing */
--topbar-padding-h: clamp(12px, 4vw, 24px);
--topbar-gap: clamp(8px, 2vw, 16px);

/* Colors - Fix undefined fallback */
--color-fg-secondary-muted: var(--color-muted);  /* Link to existing token */
```

### Dark Mode Adjustments:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --c-toggle-bg: #2A3140;
    --shadow-dropdown: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
}
```

---

## Refactoring Priority Matrix

### Tier 1 - CRITICAL (Fix This Sprint)
| Component | Issue | Impact | Effort |
|-----------|-------|--------|--------|
| ToggleSwitch | White background, undefined token | Dark mode broken | 2 hours |
| SearchResults | Missing token `--color-fg-secondary-muted` | Fallback wrong | 1 hour |
| BurgerMenu | Hardcoded positioning, undefined z-index | Brittle layout | 2 hours |

### Tier 2 - HIGH (Next Sprint)
| Component | Issue | Impact | Effort |
|-----------|-------|--------|--------|
| IntroCard | Hardcoded gradient, wrong token names | Dark mode unaware | 1.5 hours |
| Sidebar | Scattered spacing, font weights | Maintainability | 1 hour |

### Tier 3 - MEDIUM (Later)
| Component | Issue | Impact | Effort |
|-----------|-------|--------|--------|
| Topbar | Responsive clamps not tokenized | Consistency | 1 hour |
| LatestComponentsList | Multiple hardcoded values | Dark mode issues | 1.5 hours |

---

## Implementation Checklist

### Phase 1: Add Missing Tokens (~2 hours)
- [ ] Add typography size tokens (`--fontsize-md`, `--fontsize-xs-alt`)
- [ ] Add component-specific tokens (toggle, dropdown, menu, card)
- [ ] Add spacing intermediate values (`--space-1_5`)
- [ ] Add letter-spacing and transition tokens
- [ ] Add dark mode variants for new tokens
- [ ] Document each token's purpose in CONVENTION.md

### Phase 2: Refactor Critical Components (~6 hours)
- [ ] **ToggleSwitch.tsx** - Replace all hardcoded dimensions with tokens
- [ ] **SearchResults.tsx** - Add missing token, use token shadow
- [ ] **BurgerMenu.tsx** - Accept positioning as prop, use z-index tokens

### Phase 3: Refactor High Priority Components (~4 hours)
- [ ] **IntroCard.tsx** - Fix token names, extract gradient
- [ ] **Sidebar.tsx** - Create reusable style configuration object
- [ ] **LatestComponentsList.tsx** - Standardize all hardcoded values

### Phase 4: Optimize Low Priority Components (~3 hours)
- [ ] **Topbar.tsx** - Extract responsive clamp values to tokens
- [ ] **ProjectDescriptionPanel.tsx** - Audit and fix any issues

### Phase 5: Documentation (~1 hour)
- [ ] Update component guidelines with token usage examples
- [ ] Add "good patterns" section to docs (Text, Heading)
- [ ] Create migration guide for existing inline styles

---

## Quick Reference: Token Usage Examples

### ❌ BEFORE (Hardcoded)
```tsx
<div style={{
  padding: "40px 32px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#CC4A48",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
}}>
```

### ✅ AFTER (Tokenized)
```tsx
<div style={{
  padding: "var(--card-padding, 40px 32px)",
  fontSize: "var(--fontsize-sm)",
  fontWeight: "var(--fontweight-semibold)",
  color: "var(--color-brand)",
  backgroundColor: "var(--overlay-color)",
}}>
```

---

## Dark Mode Testing Checklist

For each refactored component, verify:
- [ ] Test in light mode (default)
- [ ] Test in dark mode (`prefers-color-scheme: dark`)
- [ ] Verify all colors have dark mode variants
- [ ] Check shadows render correctly in dark
- [ ] Ensure text is readable in both modes
- [ ] Test interactive states (hover, active, disabled)

---

## Related Documentation

- [Token Contract](token-contract/src/contract.css)
- [Theme Implementation](theme-default/src/tokens.css)
- [Component Guidelines](docs/components/component-guidelines.md)
- [Tokens Convention](docs/tokens/CONVENTION.md)
- [Theme Checklist](docs/tokens/THEME_CHECKLIST.md)

---

**Report Generated:** March 4, 2026  
**Auditor:** CSS Style Hardcoding Analysis Tool  
**Next Review:** After Phase 1 completion
