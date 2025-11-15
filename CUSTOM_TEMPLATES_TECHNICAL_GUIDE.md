# Custom Templates System - Technical Deep Dive

## Table of Contents
1. [System Overview](#system-overview)
2. [Complete Flow Diagram](#complete-flow-diagram)
3. [Step-by-Step Process](#step-by-step-process)
4. [Font Handling & Arabic Support](#font-handling--arabic-support)
5. [PDF Generation Process](#pdf-generation-process)
6. [Console Logging Guide](#console-logging-guide)
7. [Troubleshooting](#troubleshooting)

---

## System Overview

The Custom Templates System converts Figma designs into print-ready job offer PDFs with full Arabic and RTL support.

### Key Features
- ✅ **Figma JSX → React** conversion
- ✅ **Automatic font mapping** (Figma fonts → Thmanyah fonts)
- ✅ **RTL support** for Arabic text
- ✅ **Asset management** (images/icons)
- ✅ **Dynamic data binding** (formData integration)
- ✅ **Print-optimized** (A4, 297mm × 210mm)
- ✅ **Comprehensive logging** for debugging

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOM TEMPLATE CREATION                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 1: Enter Template Info & Figma Code                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ User Input:                                                       │
│  • Template name: "صفحة المزايا الوظيفية"                        │
│  • Description: "عرض المزايا والبدلات"                           │
│  • Figma JSX code (copied from Dev Mode)                         │
│                                                                   │
│ Console Output:                                                   │
│  📝 Template name entered                                         │
│  📝 Description entered                                           │
│  📄 Code length: X characters                                     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 2: Style Conversion (Figma → Tailwind/CSS)                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Process:                                                          │
│  1. Parse inline style objects                                   │
│  2. Convert to Tailwind classes                                  │
│  3. Map Figma fonts → Thmanyah fonts                             │
│  4. Add RTL support (dir="rtl")                                  │
│  5. Wrap in React component                                      │
│                                                                   │
│ Console Output:                                                   │
│  🚀 Starting Figma to React conversion...                         │
│  🔄 Processing style #1                                           │
│  🎨 Converting styles: {width: '100%', background: '#F2EEE4'...} │
│  📝 Detecting font family: thmanyah serif display 1.2            │
│  ✅ Mapped to: font-8-display (Thmanyah Serif Display)           │
│  ✅ Converted to Tailwind: w-full bg-background font-8-display...│
│  🖼️ Processing image #1: https://placehold.co/25x25              │
│  ✅ Processed 15 style objects                                    │
│  ✅ Processed 8 span style objects                                │
│  ✅ Processed 3 images                                            │
│  ✅ Conversion complete!                                          │
│  📄 Converted code length: Y characters                           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 3: Asset Upload (Images/Icons)                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Process:                                                          │
│  1. Detect placeholder images (placehold.co URLs)                │
│  2. Identify asset types (airplane, medical, etc.)               │
│  3. User uploads replacement images                              │
│  4. Convert to base64 for storage                                │
│                                                                   │
│ Console Output:                                                   │
│  🔍 Found 3 assets to upload                                      │
│  📤 Uploading asset #1: airplane-icon.png                         │
│  ✅ File validation passed                                        │
│  📦 File size: 12.5 KB                                            │
│  🎨 File type: image/png                                          │
│  ✅ Asset uploaded successfully: أيقونة الطيران                   │
│  📊 Base64 length: 16842 characters                               │
│  (Repeat for each asset)                                          │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 4: Data Mapping (Static → Dynamic)                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Process:                                                          │
│  1. Extract numbers & Arabic text from code                      │
│  2. Suggest formData field mappings                              │
│  3. User confirms or customizes mappings                         │
│  4. Create final mapping object                                  │
│                                                                   │
│ Detected Values:                                                  │
│  • "17,500" → Suggested: formData.monthlySalary                  │
│  • "8,203" → Suggested: formData.basicSalary                     │
│  • "عبدالله أحمد" → Suggested: formData.name                     │
│                                                                   │
│ Console Output:                                                   │
│  🔍 Extracting data fields from code...                           │
│  ✅ Found 8 data fields to map                                    │
│  🔗 Field mapping changed: field-0 → formData.monthlySalary      │
│  🔗 Field mapping changed: field-1 → formData.basicSalary        │
│  🔍 Validating field mappings...                                  │
│  ✅ All fields validated                                          │
│  📌 Field mapping: 17,500 → formData.monthlySalary               │
│  📌 Field mapping: 8,203 → formData.basicSalary                  │
│  ✅ Total mappings created: 8                                     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 5: Preview & Save                                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Features:                                                         │
│  • Live preview with sample data                                 │
│  • Zoom controls (50% - 150%)                                    │
│  • Guide lines (A4 boundaries)                                   │
│  • Dimension adjustments (padding, font size)                    │
│  • Save to localStorage                                          │
│                                                                   │
│ Saved Template Structure:                                        │
│  {                                                                │
│    id: "template-1234567890",                                    │
│    name: "صفحة المزايا الوظيفية",                                │
│    description: "عرض المزايا والبدلات",                          │
│    originalCode: "<div style={{...}}...",                        │
│    convertedCode: "<div className=\"...\">...",                  │
│    assets: {                                                      │
│      "https://placehold.co/25x25": "data:image/png;base64..."   │
│    },                                                             │
│    dataFields: {                                                  │
│      "17,500": "formData.monthlySalary",                         │
│      "8,203": "formData.basicSalary"                             │
│    },                                                             │
│    createdAt: "2024-11-15T..."                                   │
│  }                                                                │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USING TEMPLATE IN JOB OFFER                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Job Offer Form - Select Custom Template                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ User Actions:                                                     │
│  1. Navigate to /job-offer                                       │
│  2. Select theme: "قالب مخصص 🎨"                                 │
│  3. Choose template: "صفحة المزايا الوظيفية"                     │
│  4. Fill form with employee data:                                │
│     • Name: عبدالله أحمد                                         │
│     • Monthly Salary: 17,500 SAR                                 │
│     • Basic Salary: 8,203 SAR                                    │
│     • etc.                                                        │
│  5. Click "حفظ" to preview                                       │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Custom Template Rendering                                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Process:                                                          │
│  1. Load template from localStorage                              │
│  2. Replace asset placeholders with base64 images                │
│  3. Replace data placeholders with formData values               │
│  4. Format numbers (17500 → 17,500)                              │
│  5. Clean up React syntax for HTML rendering                     │
│  6. Inject into <div className="page" dir="rtl">                 │
│                                                                   │
│ Console Output:                                                   │
│  🔍 CustomTemplateRenderer mounted                                │
│  Template ID: template-1234567890                                │
│  Template name: صفحة المزايا الوظيفية                            │
│  🎨 Rendering custom template: صفحة المزايا الوظيفية             │
│  📊 Form data: {name: 'عبدالله أحمد', monthlySalary: 17500...}   │
│  🖼️ Replacing assets...                                           │
│  ✅ Replaced 3 occurrence(s) of https://placehold.co/25x25       │
│  ✅ Total assets replaced: 3                                      │
│  📝 Replacing data fields...                                      │
│  📌 Mapping: 17,500 → formData.monthlySalary = 17,500            │
│  ✅ Replaced 1 JSX expression(s)                                  │
│  ✅ Replaced 2 text content(s)                                    │
│  ✅ Total data fields replaced: 8                                 │
│  🧹 Cleaning up code for rendering...                             │
│  ✅ Template rendering complete!                                  │
│  📄 Final HTML length: 4523 characters                            │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ PDF Preview & Generation                                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Rendered Structure:                                               │
│  <div className="page font-8-sans" dir="rtl">                    │
│    <Cover />                         ← Page 1: Cover             │
│    <CustomTemplateRenderer />        ← Page 2: Your design       │
│    <Outro />                         ← Page 3: Closing           │
│  </div>                                                           │
│                                                                   │
│ Fonts Applied:                                                    │
│  • .font-8-display → Thmanyah Serif Display                      │
│  • .font-8-serif → Thmanyah Serif Text                           │
│  • .font-8-sans → Thmanyah Sans                                  │
│                                                                   │
│ User Actions:                                                     │
│  1. Click "حمّل العرض" (Download Offer)                          │
│  2. window.print() triggered                                     │
│  3. Browser opens print dialog                                   │
│  4. User saves as PDF                                            │
│  5. PDF generated with Arabic fonts preserved!                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Process

### How Figma Code Becomes a PDF

#### Input (Figma Dev Mode JSX):
```jsx
<div style={{width: '100%', height: '100%', background: '#F2EEE4'}}>
  <div style={{fontSize: 24, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '900'}}>
    المزايـا الوظيفيـة الإضافيـة
  </div>
  <div style={{fontSize: 16, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '700'}}>
    (17,500)
  </div>
  <img style={{width: 25, height: 25}} src="https://placehold.co/25x25" />
</div>
```

#### After Step 2 (Style Conversion):
```tsx
<div className="w-full h-full bg-background">
  <div className="text-[24px] font-8-display font-black">
    المزايـا الوظيفيـة الإضافيـة
  </div>
  <div className="text-[16px] font-8-display font-bold">
    (17,500)
  </div>
  <Image src="https://placehold.co/25x25" alt="" width={25} height={25} />
</div>
```

#### After Step 3 (Asset Upload):
```tsx
<div className="w-full h-full bg-background">
  <div className="text-[24px] font-8-display font-black">
    المزايـا الوظيفيـة الإضافيـة
  </div>
  <div className="text-[16px] font-8-display font-bold">
    (17,500)
  </div>
  <Image src="data:image/png;base64,iVBORw0KG..." alt="" width={25} height={25} />
</div>
```

#### After Step 4 (Data Mapping):
```tsx
<div className="w-full h-full bg-background">
  <div className="text-[24px] font-8-display font-black">
    المزايـا الوظيفيـة الإضافيـة
  </div>
  <div className="text-[16px] font-8-display font-bold">
    ({formData.monthlySalary})
  </div>
  <Image src="data:image/png;base64,iVBORw0KG..." alt="" width={25} height={25} />
</div>
```

#### Final Render (with actual data):
```html
<div class="w-full h-full bg-background">
  <div class="text-[24px] font-8-display font-black">
    المزايـا الوظيفيـة الإضافيـة
  </div>
  <div class="text-[16px] font-8-display font-bold">
    (17,500)
  </div>
  <img src="data:image/png;base64,iVBORw0KG..." width="25" height="25" style="object-fit: contain;" />
</div>
```

---

## Font Handling & Arabic Support

### Font Mapping System

The system automatically detects Figma font families and maps them to Thmanyah fonts:

```typescript
// Input: fontFamily: 'Thmanyah serif display 1.2'
// Detection logic:
if (fontFamily.includes("serif display") || fontFamily.includes("display")) {
  → font-8-display  // Thmanyah Serif Display
}

// Input: fontFamily: 'Thmanyah serif text 1.2'
if (fontFamily.includes("serif text") || fontFamily.includes("serif")) {
  → font-8-serif    // Thmanyah Serif Text
}

// Input: fontFamily: 'Thmanyah sans 1.2'
if (fontFamily.includes("sans")) {
  → font-8-sans     // Thmanyah Sans
}

// Fallback for unknown fonts:
else {
  → font-8-sans     // Default (Arabic-compatible)
}
```

### RTL Support

All custom templates automatically get RTL support:

```tsx
// Added by StyleConverter:
<div className="page font-8-sans text-[14pt] font-light" dir="rtl">
  {/* Your content */}
</div>

// Result: Arabic text flows right-to-left correctly
```

### Font Files Used

Located in `/public/fonts/thmanyah/`:

```
display/
  ├── Thmanyahserifdisplay12-Black.woff2
  ├── Thmanyahserifdisplay12-Bold.woff2
  ├── Thmanyahserifdisplay12-Medium.woff2
  ├── Thmanyahserifdisplay12-Light.woff2
  └── Thmanyahserifdisplay12-Reg.woff2

serif-text/
  ├── Thmanyahseriftext12-Black.woff2
  ├── Thmanyahseriftext12-Bold.woff2
  ├── Thmanyahseriftext12-Medium.woff2
  ├── Thmanyahseriftext12-Light.woff2
  └── Thmanyahseriftext12-Regular.woff2

sans/
  ├── Thmanyahsans12-Black.woff2
  ├── Thmanyahsans12-Bold.woff2
  ├── Thmanyahsans12-Medium.woff2
  ├── Thmanyahsans12-Light.woff2
  └── Thmanyahsans12-Regular.woff2
```

---

## PDF Generation Process

### How window.print() Works

1. **Page Setup:**
```css
.page {
  size: A4;                    /* CSS @page size */
  height: 297mm;               /* A4 height */
  width: 210mm;                /* A4 width */
  border-top: 18px solid #54b974;
  padding-top: 120px;
  padding-bottom: 120px;
  padding-inline: 42px;
}

@media print {
  .hide-print { display: none !important; }  /* Hide UI controls */
  .page {
    -webkit-print-color-adjust: exact;       /* Preserve colors */
    margin: 0;
  }
  @page {
    size: A4;
    margin: 0;
  }
}
```

2. **Font Preservation:**
```css
@font-face {
  font-family: 'Thmanyah Serif Display';
  src: url('/fonts/thmanyah/display/Thmanyahserifdisplay12-Reg.woff2') format('woff2');
  font-display: swap;
}

.font-8-display {
  font-family: 'Thmanyah Serif Display', serif;
}
```

Fonts are **embedded** in the PDF when using `window.print()` because:
- Font files are loaded via `@font-face`
- Browser includes fonts in print output
- `-webkit-print-color-adjust: exact` preserves styling

3. **Print Flow:**
```
User clicks "حمّل العرض"
  → window.print() called
  → Browser reads .page styles
  → Applies @media print rules
  → Embeds fonts from @font-face
  → Generates print preview
  → User saves as PDF
  → ✅ PDF includes all fonts, colors, and Arabic text!
```

---

## Console Logging Guide

### Understanding the Console Output

When you open browser DevTools (F12) → Console tab, you'll see:

#### During Template Creation:

```
🚀 Starting Figma to React conversion...
📄 Original code length: 3456 characters
🔄 Processing style #1
🎨 Converting styles: {width: '100%', background: '#F2EEE4', fontFamily: 'Thmanyah serif display 1.2'}
📝 Detecting font family: thmanyah serif display 1.2
✅ Mapped to: font-8-display (Thmanyah Serif Display)
✅ Converted to Tailwind: w-full bg-background font-8-display
🔄 Processing style #2
...
✅ Processed 15 style objects
✅ Processed 8 span style objects
🖼️ Processing image #1: https://placehold.co/25x25
🖼️ Processing image #2: https://placehold.co/23x23
✅ Processed 2 images
✅ Conversion complete!
📄 Converted code length: 4523 characters
```

**What this means:**
- ✅ = Success/completed step
- 🔄 = Processing in progress
- 📝 = Information
- 🖼️ = Image processing
- 📄 = Code metrics

#### During Asset Upload:

```
📤 Uploading asset #1: airplane-icon.png
✅ File validation passed
📦 File size: 12.5 KB
🎨 File type: image/png
✅ Asset uploaded successfully: أيقونة الطيران
📊 Base64 length: 16842 characters
```

**What to check:**
- ✅ File validation passed → File is valid image
- 📦 File size → Should be < 5MB
- 📊 Base64 length → Larger means bigger file

#### During Data Mapping:

```
🔍 Extracting data fields from code...
✅ Found 8 data fields to map
🔗 Field mapping changed: field-0 → formData.monthlySalary
🔗 Field mapping changed: field-1 → formData.basicSalary
🔍 Validating field mappings...
✅ All fields validated
📌 Field mapping: 17,500 → formData.monthlySalary
📌 Field mapping: 8,203 → formData.basicSalary
✅ Total mappings created: 8
```

**What to verify:**
- ✅ Found X data fields → Should match your expectations
- 📌 Field mapping → Verify correct field is mapped

#### During Template Rendering:

```
🔍 CustomTemplateRenderer mounted
Template ID: template-1234567890
Template name: صفحة المزايا الوظيفية
🎨 Rendering custom template: صفحة المزايا الوظيفية
📊 Form data: {name: 'عبدالله أحمد', monthlySalary: 17500, basicSalary: 8203...}
🖼️ Replacing assets...
✅ Replaced 3 occurrence(s) of https://placehold.co/25x25
✅ Total assets replaced: 3
📝 Replacing data fields...
📌 Mapping: 17,500 → formData.monthlySalary = 17,500
✅ Replaced 1 JSX expression(s)
✅ Replaced 2 text content(s)
✅ Total data fields replaced: 8
🧹 Cleaning up code for rendering...
✅ Template rendering complete!
📄 Final HTML length: 4523 characters
```

**What to check:**
- Assets replaced count → Should match number of images
- Data fields replaced → Should match your mappings
- No ❌ errors → Everything worked correctly

#### Error Indicators:

```
❌ Invalid file type: application/pdf
❌ File too large: 10485760 bytes
❌ Unmapped fields found: 3
❌ Error processing style: TypeError...
❌ Error rendering template: ReferenceError...
```

**What to do:**
- Read the error message carefully
- Check the preceding logs to see where it failed
- Refer to Troubleshooting section below

---

## Troubleshooting

### Issue: Fonts Not Showing Correctly

**Symptoms:**
- Arabic text displays in wrong font
- PDF shows system fonts instead of Thmanyah fonts

**Solution:**
1. Check console for font mapping:
   ```
   📝 Detecting font family: [font-name]
   ✅ Mapped to: font-8-[type]
   ```
2. Verify font files exist in `/public/fonts/thmanyah/`
3. Ensure browser loaded fonts (Network tab → filter by `.woff2`)

### Issue: Data Not Replacing

**Symptoms:**
- See placeholders (17,500) instead of actual values
- Console shows "Replaced 0 occurrence(s)"

**Solution:**
1. Check data mapping in Step 4:
   ```
   📌 Field mapping: [placeholder] → [field]
   ```
2. Verify formData has the field:
   ```
   📊 Form data: {monthlySalary: 17500...}
   ```
3. Check placeholder format matches exactly (commas, spacing)

### Issue: Images Not Displaying

**Symptoms:**
- Broken image icons
- Console error: "Failed to load image"

**Solution:**
1. Check asset upload logs:
   ```
   ✅ Asset uploaded successfully: [name]
   📊 Base64 length: [number] characters
   ```
2. Verify base64 starts with `data:image/`
3. Check file size (must be < 5MB)

### Issue: PDF Missing Arabic Text

**Symptoms:**
- PDF shows empty boxes or question marks
- Arabic characters not rendered

**Solution:**
1. Verify `dir="rtl"` is present:
   ```html
   <div className="page" dir="rtl">
   ```
2. Check font mapping in console
3. Ensure print settings: "Background graphics: ON"

### Issue: Template Not Saving

**Symptoms:**
- Error message after clicking "حفظ"
- Template doesn't appear in /custom-templates

**Solution:**
1. Check browser console for errors
2. Verify localStorage is not full:
   ```javascript
   // In console:
   localStorage.length
   // Should be > 0
   ```
3. Try clearing old templates if storage is full

---

## Testing Checklist

Before using a custom template in production:

- [ ] Template renders in preview with sample data
- [ ] All fonts display correctly (Arabic text readable)
- [ ] All images load (no broken icons)
- [ ] Data mappings work (numbers format correctly)
- [ ] PDF prints correctly (window.print() works)
- [ ] Arabic text flows RTL
- [ ] Colors preserved in print
- [ ] Page fits A4 dimensions (no content cut off)
- [ ] No console errors (❌) during rendering
- [ ] Footer displays correctly

---

## Performance Notes

### Storage Limits

Templates stored in localStorage:
- **Max size:** ~10MB per origin
- **Typical template:** 500KB - 2MB
- **Limit:** ~5-10 templates before needing cleanup

### Image Optimization

For best performance:
- **PNG:** < 500KB per image
- **SVG:** < 100KB (ideal for icons)
- **JPG:** < 1MB (for photos)

If over limits:
1. Compress images before upload
2. Use SVG for icons/logos
3. Reduce image dimensions in Figma

---

## Summary

**This system successfully:**
1. ✅ Reads Figma JSX code
2. ✅ Understands structure and styles
3. ✅ Converts to React/Tailwind
4. ✅ Maps Figma fonts → Thmanyah fonts
5. ✅ Supports Arabic & RTL
6. ✅ Embeds images as base64
7. ✅ Binds dynamic data (formData)
8. ✅ Generates print-ready PDFs
9. ✅ Preserves fonts in PDF
10. ✅ Works exactly like existing builder!

**Key Difference from Manual Builder:**
- Manual: Hand-coded React components
- Custom: Figma → Automatic conversion

**Same Result:**
- Both produce A4 PDFs
- Both use Thmanyah fonts
- Both support Arabic/RTL
- Both use window.print()
- Both embed fonts in PDF

---

*Last Updated: November 2024*
