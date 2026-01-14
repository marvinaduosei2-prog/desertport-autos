# 🎓 Site Builder - Complete User Guide

## 🚀 Getting Started

### **Step 1: Access the Site Builder**
1. Open your browser
2. Go to: `http://localhost:3001/admin`
3. Log in with your admin credentials
4. Click **"Site Builder"** in the left sidebar

---

## 📐 Understanding the Interface

### **Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  [💾 Save Changes]  [🔄 Refresh]  [👁️ Preview]             │
├──────────────┬──────────────────────────────────────────────┤
│              │                                               │
│  SECTIONS    │           PROPERTIES PANEL                    │
│  (Left)      │           (Right)                             │
│              │                                               │
│  ☰ Navigation│  [Content] [Design] [Layout] [Animations] [Assets]
│  🎬 Hero     │                                               │
│  ℹ️ About    │  ... controls based on active tab ...        │
│  🏷️ Categories│                                               │
│  🚗 Featured │                                               │
│  ✨ Experience│                                               │
│  💬 Testimonials                                             │
│  📄 Footer   │                                               │
│              │                                               │
└──────────────┴──────────────────────────────────────────────┘
```

---

## 🎯 Common Tasks

### **Task 1: Add a New Rotating Headline**

1. Click **"Hero Section"** in the left panel
2. Click the **"Content"** tab (should be active by default)
3. Scroll to **"Rotating Headlines"**
4. Click **"+ Add Headline"**
5. Type your new headline (e.g., "Luxury Redefined")
6. Adjust **"Rotation Speed"** slider (3-10 seconds)
7. Click **"💾 Save Changes"** at the top
8. ✅ Done! Your headline will now rotate on the homepage

---

### **Task 2: Change Section Colors**

1. Select any section (e.g., **"About"**)
2. Click the **"Design"** tab
3. You'll see 4 color pickers:
   - **Background Color** - Click the color swatch
   - **Text Color** - Pick from 25 presets or use HEX
   - **Accent Color** - Default is lime green (#84cc16)
   - **Border Color** - For cards and dividers
4. Click **"Apply Color"** in the picker
5. Click **"💾 Save Changes"**
6. ✅ Done! Your section now has custom colors

---

### **Task 3: Change Fonts**

1. Select any section
2. Click the **"Design"** tab
3. Scroll to **"Typography"**
4. Choose **Font Family** from dropdown:
   - Inter (modern, clean)
   - Poppins (friendly, rounded)
   - Montserrat (geometric, professional)
   - Playfair Display (elegant, serif)
   - And 4 more!
5. Adjust **Heading** settings:
   - Font Size (XS to 9XL)
   - Font Weight (thin to black)
   - Line Height (1.0 to 2.0)
   - Letter Spacing (-0.05em to 0.05em)
6. Repeat for **Subheading**, **Body**, and **Small** text
7. Click **"💾 Save Changes"**
8. ✅ Done! Your typography is customized

---

### **Task 4: Add Entrance Animations**

1. Select any section
2. Click the **"Animations"** tab
3. Under **"Entrance Animation"**:
   - Choose **Animation Type** (e.g., "Slide Up")
   - Set **Duration** (0.6 seconds is smooth)
   - Set **Delay** (0 for immediate, 0.2+ for stagger)
   - Choose **Easing** (easeOut is natural)
4. Click **"▶️ Replay"** to preview the animation
5. Adjust until it looks perfect
6. Click **"💾 Save Changes"**
7. ✅ Done! Your section will animate when scrolled into view

---

### **Task 5: Customize Hover Effects**

1. Select any section (works great on cards!)
2. Click the **"Animations"** tab
3. Scroll to **"Hover Effects"**
4. Adjust sliders:
   - **Scale**: 1.05x for subtle lift
   - **Rotate**: 0° (or -3° for tilt)
   - **Translate Y**: -5px to lift up
   - **Brightness**: 1.1 for slight glow
5. Hover over the **"Hover Over Me"** preview box
6. See the effect in real-time!
7. Click **"💾 Save Changes"**
8. ✅ Done! Your cards will react to hover

---

### **Task 6: Adjust Spacing**

1. Select any section
2. Click the **"Layout"** tab
3. You'll see a **Visual Padding Editor**:
   ```
   ┌──────────[↑ Top]──────────┐
   │                           │
   │  [← Left]  Content  [Right →]
   │                           │
   └──────────[↓ Bottom]───────┘
   ```
4. Click the arrow buttons to change padding
5. Or use the dropdowns below for precise control:
   - None, XS, SM, MD, LG, XL, 2XL, 3XL
6. Adjust **Margin** (space outside the section)
7. Adjust **Gap** (space between items inside)
8. Click **"💾 Save Changes"**
9. ✅ Done! Your spacing is perfect

---

### **Task 7: Upload Background Image/Video**

1. Select any section
2. Click the **"Assets"** tab
3. Choose what to upload:
   - **Background Image** (for static backgrounds)
   - **Background Video** (for motion backgrounds)
   - **Featured Image** (for section hero images)
4. Click **"Click to upload"** or drag file
5. Watch the progress bar (0% → 100%)
6. See live preview
7. Or paste a URL directly in the text field
8. Click **"💾 Save Changes"**
9. ✅ Done! Your asset is uploaded to Firebase

---

### **Task 8: Add/Edit Menu Items**

1. Click **"Navigation"** in the left panel
2. Click the **"Content"** tab
3. Scroll to **"Menu Items"**
4. To add: Click **"+ Add Menu Item"**
5. To edit: Change **Label** and **URL**
6. To hide: Toggle **"Enabled"** switch off
7. To delete: Click the **🗑️ Trash** icon
8. Click **"💾 Save Changes"**
9. ✅ Done! Your menu is updated

---

### **Task 9: Add Dynamic Stats to Hero**

1. Click **"Hero Section"**
2. Click the **"Content"** tab
3. Scroll to **"Dynamic Stats"**
4. Click **"+ Add Stat"**
5. Fill in:
   - **Value** (e.g., "100+")
   - **Label** (e.g., "Premium Vehicles")
   - **Icon** (optional)
6. Toggle **"Enabled"** to show/hide
7. Click **"💾 Save Changes"**
8. ✅ Done! Your stat appears in the hero section

---

### **Task 10: Edit Footer Links**

1. Click **"Footer"** in the left panel
2. Click the **"Content"** tab
3. You'll see 3 sections:
   - **Quick Links** (About, Contact, etc.)
   - **Resources Links** (Blog, Help, etc.)
   - **Legal Links** (Privacy, Terms, etc.)
4. Add/edit/delete links in each section
5. Update **Company Info**:
   - Company Name
   - Tagline
   - Email
   - Phone
6. Click **"💾 Save Changes"**
7. ✅ Done! Your footer is customized

---

## 🎨 Pro Tips

### **Tip 1: Use Consistent Colors**
- Pick 2-3 main colors and stick to them
- Use the **Accent Color** for CTAs and highlights
- Keep **Text Color** high contrast with **Background**

### **Tip 2: Don't Over-Animate**
- Use subtle animations (0.6s duration, easeOut)
- Avoid rotating or flipping for body content
- Save dramatic animations for hero sections

### **Tip 3: Spacing Matters**
- More padding = more "breathing room"
- Use LG or XL padding for hero sections
- Use MD padding for body sections
- Use SM gap between cards

### **Tip 4: Typography Hierarchy**
- Headings: Bold, Large (4XL-6XL)
- Subheadings: Semibold, Medium (XL-2XL)
- Body: Normal, Base (Base-LG)
- Small: Normal, Small (SM-XS)

### **Tip 5: Test on Mobile**
- Use **Max Width** to keep content readable
- Avoid extreme padding on small screens
- Test hover effects (they become taps on mobile)

---

## 🔧 Troubleshooting

### **Problem: Changes not appearing on homepage**
**Solution:**
1. Make sure you clicked **"💾 Save Changes"**
2. Refresh the homepage (Cmd/Ctrl + R)
3. Check browser console for errors (F12)

### **Problem: Upload fails**
**Solution:**
1. Check file size (must be under 50MB)
2. Ensure file is image or video format
3. Check Firebase Storage permissions
4. Try pasting URL instead

### **Problem: Animation not playing**
**Solution:**
1. Check **Duration** is not 0
2. Ensure **Animation Type** is not "None"
3. Scroll section into view (animations trigger on scroll)
4. Clear browser cache

### **Problem: Colors not changing**
**Solution:**
1. Make sure you clicked **"Apply Color"** in picker
2. Check **Background Color** is not transparent
3. Ensure **Text Color** contrasts with background
4. Save changes after editing

---

## 🎉 You're Ready!

You now have complete control over your automotive platform. Every pixel, color, font, animation, and asset can be customized without touching code!

**Enjoy your world-class Site Builder!** 🚀

---

## 📚 Additional Resources

- **SITE_BUILDER_FEATURES.md** - Full feature list
- **ELEMENTOR_LEVEL_COMPLETE.md** - Technical details
- **types/database.ts** - Data structure reference
- **lib/design-utils.ts** - Frontend integration guide


