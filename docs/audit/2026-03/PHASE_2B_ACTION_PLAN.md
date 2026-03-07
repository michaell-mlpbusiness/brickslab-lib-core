# Phase 2b Action Plan: Component Refactoring

**Created**: March 4, 2026  
**Based on**: TEST_DARK_MODE_v1.0.md findings  
**Priority Level**: Medium (all changes are non-breaking)  
**Estimated Duration**: 3-4 hours for all components  

---

## 📋 Overview

Based on dark mode testing (Phase 2a results), Phase 2b will refactor the remaining high-priority components to ensure consistent token usage and dark mode compatibility. All 3 critical components have already been fixed in Phase 2a.

**Scope**: 6 components (IntroCard, Sidebar, Topbar, and 3 others identified in audit)  
**Testing**: Manual light/dark mode testing after each batch  

---

## 🎯 Priority Order

### Batch 1: Hero/Card Components (1 component)
**Time Estimate**: 30 min

#### 1. IntroCard
**File**: [packages/ui-web/src/components/carte/intro_card/IntroCard.tsx](IntroCard.tsx)

**Issues Found**:
- ❌ `padding: "40px 32px"` → hardcoded spacing
- ❌ `background: linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%)` → gradient partially hardcoded
- ❌ `marginBottom: "24px"` → spacing hardcoded

**Changes Required**:

```tsx
// BEFORE
padding: "40px 32px",
marginBottom: "24px",
background: "linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%)",

// AFTER
padding: "var(--space-4) var(--space-4)",  // 16px 16px
marginBottom: "var(--space-4)",             // 16px
background: "var(--gradient-brand, linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%))",
```

**Token Addition Required**:
- Need to add `--gradient-brand` token to theme-default if using it

**Verification**:
- [ ] Light mode: gradient visible and readable
- [ ] Dark mode: gradient still visible (note: gradients don't change in dark mode, only colors)
- [ ] Padding consistent with other cards
- [ ] CTA button still visible

---

### Batch 2: Navigation Components (2 components)
**Time Estimate**: 45 min

#### 2. Sidebar
**File**: [packages/ui-web/src/components/layout/sidebar/Sidebar.tsx](Sidebar.tsx)

**Issues Found**:
- ❌ `margin: "6px 0"` → hardcoded spacing
- ❌ `margin: "28px 0 12px"` → hardcoded spacing

**Changes Required**:

```tsx
// BEFORE
{ margin: "6px 0" }
{ margin: "28px 0 12px" }

// AFTER
{ margin: "var(--space-1) 0" }        // 2px 0
{ margin: "var(--space-4) 0 var(--space-3)" }  // 16px 0 12px
```

**Verification**:
- [ ] Light mode: all sections properly spaced
- [ ] Dark mode: spacing visually consistent
- [ ] Hover states work (already using tokens)
- [ ] No overlapping text

---

#### 3. Topbar
**File**: [packages/ui-web/src/components/layout/topbar/Topbar.tsx](Topbar.tsx)

**Issues Found**:
- ⚠️ `height: "60px"` → should be tokenized
- ⚠️ `clamp(18px, 5vw, 48px)` → responsive value not consistent with token approach

**Changes Required**:

```tsx
// BEFORE
height: "60px",
fontSize: "clamp(18px, 5vw, 48px)",

// AFTER
height: "var(--height-topbar, 60px)",
fontSize: "var(--fontsize-xl)",  // or create --fontsize-responsive-lg
```

**Additional Token to Add**:
```css
/* In theme-default/src/tokens.css */
--height-topbar: 60px;
```

**Verification**:
- [ ] Light mode: topbar height and spacing correct
- [ ] Dark mode: background color matches surface token
- [ ] Responsive behavior still works (clamp fallback if needed)
- [ ] Logo and actions properly aligned

---

### Batch 3: Layout Components (Additional 3)
**Time Estimate**: 1 hour

#### 4-6. Other Components Identified in Audit

Run this command to identify remaining hardcoded values:

```bash
grep -r "background:\|padding:\|margin:\|color:\|fontSize:" packages/ui-web/src/components --include="*.tsx" | grep -v "var(" | wc -l
```

**Expected**: 10-15 additional hardcoded values to address

---

## ✅ Phase 2a Verification (Already Completed)

| Component | Issue | Status | Verified |
|-----------|-------|--------|----------|
| ToggleSwitch | White hardcoded | ✅ Fixed | ✅ Works |
| SearchResults | Padding, shadow, z-index | ✅ Fixed | ✅ Works |
| BurgerMenu | Z-index magic numbers | ✅ Fixed | ✅ Works |

---

## 🔄 Token Additions Needed

**For Phase 2b to proceed, add these tokens to theme-default**:

```css
/* OPTIONAL but recommended for consistency */
--gradient-brand: linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%);
--height-topbar: 60px;

/* Already exist in theme-default? */
✅ --space-1, --space-2, --space-3, --space-4
✅ --fontsize-* (all sizes)
✅ --color-brand, --color-fg, --color-bg
```

---

## 📊 Batch Testing Strategy

After completing each batch:

1. **Light Mode Test**:
   - Navigate to component page at `http://localhost:3000/components/[name]`
   - Verify all spacing is visible and readable
   - Verify no overlapping elements
   - Check image/content rendering

2. **Dark Mode Test**:
   - Click ThemeToggle on same page
   - Verify colors invert properly
   - Verify text remains readable
   - Verify spacing unchanged

3. **Document Issues**:
   - If visual problems found, note component and issue
   - If all good, mark as ✅ Complete

---

## 🛠️ Implementation Checklist

### Before Starting
- [ ] Verify dev server running (`npm run dev` in workspace root)
- [ ] Verify no build errors (`npm run build`)
- [ ] Have theme-default tokens open for reference

### Batch 1: IntroCard (30 min)
- [ ] Update padding to use `--space-4`
- [ ] Update marginBottom to use `--space-4`
- [ ] Add `--gradient-brand` token if not exists
- [ ] Update gradient to use token
- [ ] Test light mode: padding correct, gradient visible
- [ ] Test dark mode: no issues
- [ ] Commit changes

### Batch 2: Landing/Sidebar (45 min)
- [ ] Update Sidebar margin values to tokens
- [ ] Update Topbar height to use token
- [ ] Add `--height-topbar` token if not exists
- [ ] Update Topbar responsive font sizing
- [ ] Test light mode: both components
- [ ] Test dark mode: both components
- [ ] Commit changes

### Batch 3: Remaining Components (1+ hour)
- [ ] Identify all hardcoded values with grep
- [ ] Prioritize by frequency (colors > spacing > sizing)
- [ ] Refactor in small groups (3-4 components at a time)
- [ ] Test after each group
- [ ] Commit frequently

### Final Validation
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] No ESLint issues: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] All 44 components display in catalog
- [ ] Dark mode toggles without issues
- [ ] Create v1.1 of this phase document with final results

---

## 📝 Success Criteria

| Criteria | Target | Status |
|----------|--------|--------|
| All identified hardcoding removed | 100% | ⏳ Pending |
| No hardcoded colors remaining | 95%+ | ⏳ Pending |
| Dark mode compatibility | 100% | ✅ Already verified |
| Build errors | 0 | ⏳ Will verify |
| TypeScript errors | 0 | ⏳ Will verify |
| Test coverage | All batches passed | ⏳ In progress |

---

## 🔗 Related Documents

- [AUDIT_CSS_HARDCODING_v1.0.md](AUDIT_CSS_HARDCODING_v1.0.md) - Full list of hardcoded issues
- [TEST_DARK_MODE_v1.0.md](TEST_DARK_MODE_v1.0.md) - Dark mode test results
- [PHASE_2_REFACTORING_CRITICAL_v1.0.md](PHASE_2_REFACTORING_CRITICAL_v1.0.md) - Phase 2a results
- [../../tokens/guide-for-developers.md](../../tokens/guide-for-developers.md) - Token usage patterns

---

## 📋 Time Breakdown

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Token Formalization | 2-3 hours | ✅ Complete |
| Phase 2a: Critical Fixes | 1.5 hours | ✅ Complete |
| Phase 2b: Component Refactoring | 3-4 hours | ⏳ Ready to start |
| Phase 2c: Final Validation | 2+ hours | 🔄 Planned |
| **Total**: | **~10 hours** | |

---

## 🚀 How to Execute Phase 2b

1. **For Batch 1** (Estimated 30 min):
   ```bash
   # Edit IntroCard.tsx - update padding and gradient
   # Test on http://localhost:3000/components/introcard
   # Switch theme and verify
   ```

2. **For Batch 2** (Estimated 45 min):
   ```bash
   # Edit Sidebar.tsx - update margins
   # Edit Topbar.tsx - update height and font sizing
   # Test both components
   ```

3. **For Batch 3** (Estimated 1+ hour):
   ```bash
   # Run audit grep to find all hardcoded
   # Refactor in groups of 3-4 components
   # Test each group
   ```

---

## 💡 Next Steps After Phase 2b

After this phase is complete:

1. **Phase 2c** (2+ hours): Final validation
   - Browser compatibility (Firefox, Safari)
   - Mobile responsive testing
   - Accessibility audit (WCAG AA contrast)
   - Performance check

2. **Phase 3** (Future): Enhancements
   - Add missing tokens (--gradient-secondary, etc.)
   - Create theme variations
   - Implement animation tokens
   - Documentation updates

---

## 📞 Sign-Off

**Ready to proceed with Phase 2b?** Yes ✅

**Prerequisites met**:
- ✅ Dark mode tested and working
- ✅ 3 critical components verified
- ✅ Remaining issues identified
- ✅ Token additions documented
- ✅ Implementation plan detailed

---

**Status**: Ready for implementation  
**Date**: March 4, 2026  
**Next Action**: Start Batch 1 (IntroCard)
