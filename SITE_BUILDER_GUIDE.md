# 🚀 SITE BUILDER - USER GUIDE

## Overview

The **DesertPort Autos Site Builder** is a professional, world-class visual website builder that surpasses Framer in functionality and ease of use. Built with Next.js, React, Framer Motion, and Firebase, it provides complete control over every aspect of your website.

---

## 🎯 Key Features

### 1. **Advanced Design Controls**
- **Color Picker**: HEX color picker with 25 preset colors
- **Typography**: Full control over fonts, sizes, weights, line heights, and letter spacing
- **Spacing**: Visual padding/margin editor with responsive controls
- **Layout**: Full-width, contained, or narrow layouts with responsive columns

### 2. **Professional Component Library**
5 pre-built, production-ready templates:
1. **Video Hero** - Full-screen video background
2. **Feature Grid** - 3-column feature showcase
3. **Image + Text** - Side-by-side content layout
4. **Testimonials** - Customer testimonial carousel
5. **CTA Banner** - Call-to-action with gradient

### 3. **Responsive Design**
- Desktop, Tablet, and Mobile preview modes
- Responsive column controls (1-6 columns)
- Real-time viewport switching

### 4. **Drag & Drop**
- Reorder sections with drag-and-drop
- Visual feedback and smooth animations
- Automatic save on reorder

### 5. **Save & Publish**
- Save drafts to Firebase
- Publish live with one click
- Version control and rollback support

---

## 📍 How to Access

1. **Login to Admin**
   ```
   http://localhost:3001/admin
   ```
   Enter your admin credentials (email: `marvin.aduosei1@gmail.com`)

2. **Navigate to Site Builder**
   Once logged in, you'll see the admin dashboard. Click on "Site Builder" or go directly to:
   ```
   http://localhost:3001/admin/builder
   ```

---

## 🎨 Using the Site Builder

### **Interface Layout**

The Site Builder has 3 main panels:

```
┌─────────────┬──────────────────┬─────────────────┐
│   LEFT      │     CENTER       │     RIGHT       │
│  SIDEBAR    │     CANVAS       │    PROPERTIES   │
│             │                  │   (when selected)│
│ • Sections  │  • Live Preview  │  • Colors       │
│ • Library   │  • Viewport      │  • Typography   │
│ • Settings  │  • Inspector     │  • Spacing      │
│             │                  │  • Layout       │
└─────────────┴──────────────────┴─────────────────┘
```

---

### **Step-by-Step Tutorial**

#### **Step 1: Add a Section**

1. In the left sidebar, click **"Show Library"**
2. Browse through the component templates
3. Click any template to add it to your page
4. The section appears in the canvas and section list

#### **Step 2: Customize Colors**

1. Click on a section in the canvas or section list
2. The **Properties Panel** opens on the right
3. Click the **"Colors"** tab
4. Click any color swatch to open the color picker
5. Choose from presets or enter a custom HEX code
6. Changes apply instantly in the preview

#### **Step 3: Edit Typography**

1. With a section selected, click the **"Type"** tab
2. Choose a font family from the dropdown
3. Adjust heading, subheading, and body text sizes
4. Set font weights (thin → black)
5. Fine-tune line heights and letter spacing

#### **Step 4: Adjust Spacing**

1. Click the **"Space"** tab
2. Use the visual padding editor or dropdowns
3. Set padding (inner spacing)
4. Set margins (outer spacing)
5. Adjust gap between elements

#### **Step 5: Configure Layout**

1. Click the **"Layout"** tab
2. Choose layout type:
   - **Full Width**: Spans entire viewport
   - **Contained**: Max-width container
   - **Narrow**: Centered narrow layout
3. Set max width (for contained/narrow)
4. Choose content alignment (left, center, right)
5. Configure responsive columns for mobile, tablet, desktop

#### **Step 6: Reorder Sections**

1. In the left sidebar section list
2. **Drag** the grip icon (⋮⋮) on any section
3. **Drop** it in a new position
4. Sections reorder instantly in the preview

#### **Step 7: Save & Publish**

1. Click **"Save Changes"** to save as draft
2. Click **"Publish"** to make it live
3. Toast notifications confirm success
4. Your changes are saved to Firebase

---

## 🔥 Advanced Features

### **Viewport Preview**

Switch between device views:
- Click **Monitor icon** for desktop view
- Click **Tablet icon** for tablet view (768px)
- Click **Phone icon** for mobile view (375px)

### **Section Management**

- **Enable/Disable**: Toggle sections on/off without deleting
- **Duplicate**: Copy a section with all its styles
- **Delete**: Remove sections permanently

### **Content Editing**

1. Select a section
2. Click the **"Content"** tab
3. Edit section name
4. Toggle enable/disable
5. (More content controls coming soon!)

---

## 🎯 Pro Tips

### **Tip 1: Start with a Template**
Don't build from scratch! Browse the Component Library and start with a professional template. Customize it to match your brand.

### **Tip 2: Use the Color Presets**
The color picker includes 25 carefully selected colors that work well together. Use these for a cohesive design.

### **Tip 3: Test Responsiveness**
Always check your design in all 3 viewport modes before publishing. What looks great on desktop might need adjustments for mobile.

### **Tip 4: Consistent Spacing**
Use consistent spacing values (e.g., always use "lg" or "xl" for section padding) for a professional, harmonious design.

### **Tip 5: Typography Hierarchy**
Maintain a clear hierarchy:
- Headings: Large, bold, attention-grabbing
- Subheadings: Medium, semi-bold, descriptive
- Body: Base size, normal weight, readable

---

## 🛠️ Technical Details

### **File Structure**
```
components/admin/
├── site-builder-advanced.tsx    # Main builder interface
├── color-picker.tsx              # Color selection component
├── typography-controls.tsx       # Font/text controls
├── spacing-controls.tsx          # Padding/margin controls
├── layout-controls.tsx           # Layout configuration
└── component-library.tsx         # Pre-built templates

app/api/site-builder/
└── route.ts                      # Save/load API endpoints

types/
└── site-builder.ts               # TypeScript type definitions
```

### **Data Structure**

Each section has this structure:
```typescript
{
  id: string;
  name: string;
  type: 'hero' | 'about' | 'features' | ...;
  enabled: boolean;
  styles: {
    colors: { background, foreground, primary, ... };
    typography: { fontFamily, fontSize, ... };
    spacing: { paddingTop, paddingBottom, ... };
    layout: { type, maxWidth, alignment, columns };
  };
  content: { /* Section-specific content */ };
}
```

### **Firestore Collection**

Saved configurations are stored in `site_builder` collection:
```
site_builder/
└── home/
    ├── pageName: "home"
    ├── sections: [...]
    ├── globalStyles: {...}
    ├── isDraft: true/false
    ├── version: timestamp
    └── updatedAt: Date
```

---

## 🚨 Troubleshooting

### **Builder Not Loading**
- Ensure you're logged in as admin
- Check browser console for errors
- Verify Firebase connection

### **Changes Not Saving**
- Check your internet connection
- Verify Firebase credentials in `.env.local`
- Check browser console for API errors

### **Sections Not Appearing**
- Check if section is enabled (toggle in Content tab)
- Verify section has valid colors (not transparent)
- Try refreshing the preview

### **Color Picker Not Opening**
- Click the color swatch, not the label
- Close any open popovers first
- Try clicking outside and trying again

---

## 📞 Need Help?

If you encounter any issues or have questions, check:
1. Browser console for error messages
2. Network tab for failed API requests
3. Firebase console for data issues

---

## 🎉 What's Next?

Future enhancements planned:
- [ ] Animation controls
- [ ] Custom CSS editor
- [ ] Image upload & management
- [ ] Theme presets (one-click styling)
- [ ] Export/Import configurations
- [ ] A/B testing support
- [ ] SEO meta editor
- [ ] Version history browser

---

**Built with ❤️ for DesertPort Autos**
**Powered by Next.js, Firebase, and Framer Motion**

