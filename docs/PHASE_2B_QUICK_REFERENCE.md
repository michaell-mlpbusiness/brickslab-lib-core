# Phase 2b Execution Guide - Quick Reference

**Focus**: Apply token-based styling to 6 components  
**Time**: 3-4 hours total  
**Risk**: Low (all changes are non-breaking, no UI changes)

---

## 🚀 Quick Start

1. **Have these open**:
   - [PHASE_2B_ACTION_PLAN.md](docs/audit/2026-03/PHASE_2B_ACTION_PLAN.md) - Detailed requirements
   - [guide-for-developers.md](docs/tokens/guide-for-developers.md) - Usage patterns
   - [packages/theme-default/src/tokens.css](packages/theme-default/src/tokens.css) - Token reference

2. **Dev server running?** 
   ```bash
   npm run dev  # should show "compiled successfully"
   ```

3. **Start with Batch 1** (IntroCard)

---

## 🎯 Files to Edit

### Batch 1 (30 min)
**File**: `packages/ui-web/src/components/carte/intro_card/IntroCard.tsx`

#### Line 16: Replace gradient
```tsx
// BEFORE
background = "linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%)",

// AFTER
background = "var(--gradient-brand, linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%))",
```

#### Lines 21-24: Replace padding and margin
```tsx
// BEFORE
padding: "40px 32px",
color: "white",
marginBottom: "24px",

// AFTER
padding: "var(--space-4) var(--space-4)",
color: "white",
marginBottom: "var(--space-4)",
```

✅ **Test**: http://localhost:3000/components/introcard (light + dark mode)

---

### Batch 2 (45 min)

#### 2a. Sidebar
**File**: `packages/ui-web/src/components/layout/sidebar/Sidebar.tsx`

Find and replace:
- `margin: "6px 0"` → `margin: "var(--space-1) 0"`
- `margin: "28px 0 12px"` → `margin: "var(--space-4) 0 var(--space-3)"`

✅ **Test**: http://localhost:3000/components/sidebar (light + dark)

#### 2b. Topbar
**File**: `packages/ui-web/src/components/layout/topbar/Topbar.tsx`

Find and replace:
- `height: "60px"` → `height: "var(--height-topbar)"`
- `fontSize: "clamp(18px, 5vw, 48px)"` → `fontSize: "var(--fontsize-xl)"`

✅ **Test**: http://localhost:3000/components/topbar (light + dark)

---

### Batch 3 (1+ hour)

**Identify remaining issues**:
```bash
grep -r "padding:\|margin:\|color:\|background:\|fontSize:" \
  packages/ui-web/src/components --include="*.tsx" | \
  grep -v "var(" | \
  head -20
```

**Apply patterns**:
1. Group by component (3-4 at a time)
2. Replace hardcoded with tokens
3. Test light/dark after each group
4. Commit when batch is green

**Common replacements**:
- Colors: Use `--color-*` or `--c-*` tokens
- Spacing: Use `--space-*` tokens
- Sizes: Use `--fontsize-*` or `--height-*`
- Shadows: Use `--shadow-*` tokens
- Z-index: Use `--z-*` tokens

---

## ✅ Testing Pattern

After each file edit, do this **verification loop**:

1. **Visual light mode**:
   ```
   http://localhost:3000/components/[component-name]
   ```
   - Check layout looks correct
   - Spacing is visible
   - No overlapping text

2. **Visual dark mode**:
   - Click the ThemeToggle button on the page
   - Verify colors change appropriately
   - Verify spacing is unchanged
   - Verify text is readable

3. **TypeScript check**:
   ```bash
   npm run typecheck
   ```
   - Should show 0 errors

4. **Commit**:
   ```bash
   git add . && git commit -m "Phase 2b: Tokenize [component-name] styling"
   ```

---

## 🎨 Token Reference

**Common tokens you'll use**:

```css
/* Spacing */
--space-1: 2px
--space-2: 8px
--space-3: 12px
--space-4: 16px

/* Font Sizes */
--fontsize-xs: 12px
--fontsize-sm: 14px
--fontsize-medium: 16px
--fontsize-lg: clamp(18px, 5vw, 48px)
--fontsize-xl: clamp(20px, 5vw, 48px)
--fontsize-2xl: clamp(24px, 5vw, 48px)

/* Colors */
--color-bg: light: #ffffff | dark: #0F1116
--color-fg: light: #0b1220 | dark: #FBFBFB
--color-brand: #CC4A48 (both modes)
--c-surface: light: #ffffff | dark: #161A22
--c-border: light: #e0e0e0 | dark: #2A3140

/* Effects */
--shadow-1: subtle drop shadow
--shadow-2: stronger drop shadow
--radius-md: 12px

/* Layout */
--height-topbar: 60px

/* Z-Index */
--z-dropdown: 100
--z-modal: 1000

/* Gradients */
--gradient-brand: brand gradient (light/dark aware)
```

---

## 🚦 Know Before You Go

✅ **Safe to do**:
- Replace hardcoded values with tokens
- Add CSS variables to props
- Reorganize styles for clarity
- Add comments explaining token usage

❌ **Don't do**:
- Change component behavior
- Modify prop interfaces (unless documented)
- Add new props without testing
- Delete functionality

⚠️ **Be careful with**:
- Responsive values (clamp() works, but document why)
- Opacity adjustments (use rgba of color tokens)
- Computed values (prefer tokens over calc())

---

## 📋 Checklist Per Batch

- [ ] Files identified
- [ ] Changes mapped (before/after)
- [ ] Tokens verified in theme-default
- [ ] All files edited and saved
- [ ] TypeScript check passes
- [ ] Visual light mode test: ✅
- [ ] Visual dark mode test: ✅
- [ ] Git commit with clear message
- [ ] No build errors
- [ ] Ready for next batch

---

## 🎓 If Something Breaks

**TypeScript error after edit?**
- Check for syntax errors (missing quotes, brackets)
- Verify token names match theme-default exactly
- Run `npm run typecheck` to see full error

**Styling looks wrong?**
- Check token value in theme-default
- Verify light/dark mode overrides are present
- Test on fresh browser tab (clear cache)
- Check browser console for CSS warnings

**Dev server crashed?**
- Stop with Ctrl+C
- Run `npm run dev` again
- Check for any error messages

**Need to undo?**
- `git checkout [filename]` to revert single file
- `git status` to see what changed
- Back up to last known good state if needed

---

## 📊 Progress Dashboard

```
Batch 1 (IntroCard)       [ ] Not Started
Batch 2a (Sidebar)        [ ] Not Started
Batch 2b (Topbar)         [ ] Not Started
Batch 3 (Other)           [ ] Not Started
Final Verify              [ ] Not Started

Estimated: 3-4 hours
```

Update as you go:
```
Batch 1 (IntroCard)       [████████████░░░░░░░░] 60% Done
Batch 2a (Sidebar)        [░░░░░░░░░░░░░░░░░░░░] 0% Not Started
...
```

---

## 🏁 Sign-Off

When all batches are complete, you should have:

✅ 6 components with tokenized styling  
✅ 0 hardcoded color values in target components  
✅ Dark mode working flawlessly  
✅ All tests passing (light + dark)  
✅ Clean git history with clear commits  

Then proceed to **Phase 2c: Final Validation** (accessibility, browser compat, performance)

---

**Ready?** Open [PHASE_2B_ACTION_PLAN.md](docs/audit/2026-03/PHASE_2B_ACTION_PLAN.md) and start with Batch 1 (IntroCard).

**Dev server**: Running on http://localhost:3000  
**Components page**: http://localhost:3000/components/[name]  
**Tokens reference**: packages/theme-default/src/tokens.css
