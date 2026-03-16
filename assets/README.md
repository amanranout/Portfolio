# Assets Folder

This folder contains media files for your portfolio.

## Files to Add

### 1. **photo.jpg** (or .png)
- Your profile photo/headshot
- Recommended dimensions: 400x400 pixels or larger
- Supported formats: .jpg, .jpeg, .png
- Replace the filename in `index.html` if using a different format
  - Current reference: `src="assets/photo.jpg"`

### 2. **resume.pdf**
- Your original resume/CV in PDF format
- This will be downloaded when users click "Download Resume" button
- Current reference: `onclick="window.open('assets/resume.pdf')"`

## Instructions

1. Add your profile photo to this folder with the name `photo.jpg`
2. Add your resume to this folder with the name `resume.pdf`
3. If your files have different names or extensions, update the references in `index.html`:
   - For photo: Line 76 - `src="assets/photo.jpg"`
   - For resume: Line 71 - `onclick="window.open('assets/resume.pdf')"`

## File Size Recommendations

- **Photo**: Keep under 500KB for optimal website performance
- **Resume**: Keep under 5MB for faster downloads
