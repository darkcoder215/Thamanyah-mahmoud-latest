# Tailwind JSX Workflow - Paste Figma Code Directly

## ✅ YES, PDF Generation Works Perfectly!

**Question:** Will Tailwind JSX work with PDF generation?

**Answer:** **Absolutely YES!** Here's why:

1. ✅ **Same print mechanism** - We use browser's built-in print function (Ctrl+P / Cmd+P)
2. ✅ **Tailwind fully compatible** - Tailwind CSS compiles to regular CSS that prints fine
3. ✅ **Print CSS preserved** - Our `@media print` rules still apply
4. ✅ **Edit mode hidden** - Orange borders automatically hidden when printing
5. ✅ **Page dimensions correct** - `.page-v2` class handles A4 sizing (595×842px @ 72dpi)

**Technical Details:**
- Tailwind uses arbitrary values like `w-[595px]` which compile to inline widths
- These work identically in print as on screen
- Our print CSS in `globals.css` applies regardless of Tailwind vs inline styles
- The browser's print engine doesn't care about the CSS source

---

## 🚀 Complete Workflow

### Step 1: Export from Figma

1. Open your Figma design
2. Select the frame/component
3. Open **Dev Mode** (Shift+D)
4. Change **Code** dropdown to **Tailwind CSS**
5. Copy the JSX code

Example output from Figma:
```jsx
<div className="w-[595px] h-[842px] relative bg-stone-200 overflow-hidden">
  <div className="w-8 h-9 left-[40px] top-[766px] absolute bg-black" />
  <div className="w-[499px] left-[48px] top-[138px] absolute text-right text-black text-sm font-normal font-['Thmanyah_sans_1.2']">
    نتمنى أن تكون معنا...
  </div>
</div>
```

### Step 2: Create Component File

Create a new file in `/src/components/JobOffer/Preview/`:

```tsx
"use client"

import React from "react"
import TailwindPage from "./TailwindPage"
import { type JobOfferFormData } from "../../Form/JobOfferFormTypes"

interface MyNewPageProps {
  formData: JobOfferFormData
  editMode?: boolean
}

export default function MyNewPage({ formData, editMode = false }: MyNewPageProps) {
  return (
    <TailwindPage editMode={editMode}>
      {/* PASTE FIGMA JSX HERE */}

    </TailwindPage>
  )
}
```

### Step 3: Paste Figma Code

Just paste it directly inside `<TailwindPage>`:

```tsx
export default function MyNewPage({ formData, editMode = false }: MyNewPageProps) {
  return (
    <TailwindPage editMode={editMode}>
      <div className="w-[595px] h-[842px] relative bg-stone-200">
        <div className="left-[249px] top-[216px] absolute text-black font-['Thmanyah_sans_1.2']">
          المسمّى الوظيفي
        </div>
      </div>
    </TailwindPage>
  )
}
```

### Step 4: Replace Hardcoded Text with Props

Replace static text with dynamic form data:

```tsx
// Before (from Figma):
<div className="text-black font-['Thmanyah_sans_1.2']">
  مدير محتوى
</div>

// After (dynamic):
<div className="text-black font-['Thmanyah_sans_1.2']">
  {formData.jobTitle}
</div>
```

### Step 5: Done! 🎉

**That's it!** The `<TailwindPage>` component automatically:

- ✅ Converts `font-['Thmanyah_sans_1.2']` → `font-8-sans`
- ✅ Converts `font-['Thmanyah_serif_display_1.2']` → `font-8-display`
- ✅ Converts `font-['Thmanyah_serif_1.2']` → `font-8-serif`
- ✅ Wraps content in `.page-v2` class for PDF compatibility
- ✅ Works with browser print (Ctrl+P)

---

## 📖 Complete Example

See `BasicInfoPageV2Tailwind.tsx` for a full working example:

```tsx
"use client"

import React from "react"
import TailwindPage from "./TailwindPage"
import { type JobOfferFormData } from "../../Form/JobOfferFormTypes"

export default function BasicInfoPageV2Tailwind({ formData, editMode = false }) {
  const firstName = formData.name.split(" ")[0]

  return (
    <TailwindPage editMode={editMode}>
      <div className="w-[595px] h-[842px] relative bg-stone-200">
        {/* Greeting with emoji */}
        <div className="left-[374.50px] top-[83px] absolute inline-flex gap-2.5">
          <div className="text-3xl font-bold font-['Thmanyah_sans_1.2']">
            👋🏻
          </div>
          <div className="text-3xl font-black font-['Thmanyah_serif_display_1.2']">
            أهـلاً {firstName}
          </div>
        </div>

        {/* Job title */}
        <div className="left-[261px] top-[238px] absolute font-bold font-['Thmanyah_sans_1.2']">
          {formData.jobTitle}
        </div>
      </div>
    </TailwindPage>
  )
}
```

---

## 🖨️ How PDF Generation Works

### Browser Print Method
1. User clicks print button or presses Ctrl+P
2. Browser applies `@media print` CSS rules
3. Edit mode UI gets hidden (`.editable-wrapper-container { display: none }`)
4. Page scales from 595×842px to 210mm×297mm (A4)
5. Browser generates PDF

### Why Tailwind JSX Works
- Tailwind compiles `w-[595px]` to `width: 595px`
- This is identical to inline `style={{ width: 595 }}`
- Browser print engine handles both the same way
- No difference in PDF output

### Print CSS (Already Configured)
```css
@media print {
  .page-v2 {
    width: 210mm;
    height: 297mm;
    transform: scale(1.334); /* 595px → 210mm */
  }

  .editable-wrapper-container,
  .editable-wrapper-infobar {
    display: none !important; /* Hide edit UI */
  }
}
```

---

## 🆚 Comparison: Old vs New Workflow

### Old Workflow (Inline Styles)
1. Get Figma JSX with `font-['Thmanyah_sans_1.2']`
2. **Manually replace** all font classes with `font-8-sans`
3. **Manually convert** Tailwind to inline styles
4. **Manually wrap** elements in `EditableWrapper`
5. **Manually add** font info props

**Time:** ~30-60 minutes per page

### New Workflow (Tailwind JSX)
1. Copy Tailwind JSX from Figma
2. **Paste directly** into `<TailwindPage>`
3. Replace hardcoded text with `{formData.xxx}`
4. Done!

**Time:** ~5-10 minutes per page

---

## 🔮 Future Enhancements

Planned features for `<TailwindPage>`:

1. **Auto-wrap editability** - Automatically make elements draggable in edit mode
2. **Font info extraction** - Auto-detect and display font classes
3. **Alignment guides** - Built-in snap-to-grid for Tailwind elements
4. **JSON export** - Save adjusted positions back to code

---

## ❓ FAQ

**Q: Do I need to configure Tailwind?**
A: No! Tailwind is already configured in this project.

**Q: Will this work with dark mode?**
A: Yes, Tailwind's dark mode classes work fine.

**Q: Can I mix Tailwind and inline styles?**
A: Yes! Use Tailwind for layout, inline styles for exact positioning.

**Q: What about responsive design?**
A: Not needed - PDFs are fixed size (A4 = 595×842px @ 72dpi).

**Q: Can I use Tailwind plugins?**
A: Yes, any installed Tailwind plugins work.

**Q: Does this affect bundle size?**
A: Minimal impact - only used classes get compiled.

---

## 🎯 Best Practices

1. **Keep Figma dimensions exact** - Use 595×842px frames
2. **Use absolute positioning** - Tailwind's `absolute` + `left-[Xpx]`
3. **Don't change fonts manually** - Let `TailwindPage` auto-convert
4. **Test print early** - Ctrl+P to verify layout
5. **Use formData props** - Replace all static text

---

## 🐛 Troubleshooting

**Fonts not converting?**
- Check that Figma uses `font-['Thmanyah_sans_1.2']` syntax
- Verify component is wrapped in `<TailwindPage>`

**Layout broken in PDF?**
- Ensure Figma frame is exactly 595×842px
- Check for missing `position: absolute` classes

**Colors wrong in PDF?**
- Add `-webkit-print-color-adjust: exact` to elements
- Use `print:` Tailwind variants if needed

---

## 📞 Support

Questions? Check these files:
- `/src/components/JobOffer/Preview/TailwindPage.tsx` - Core component
- `/src/components/JobOffer/Preview/BasicInfoPageV2Tailwind.tsx` - Example
- `/src/app/globals.css` - Print CSS rules
