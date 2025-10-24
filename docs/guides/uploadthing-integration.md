# UploadThing File Upload Integration Guide

**Created:** October 24, 2025  
**Status:** ✅ Production Ready  
**Feature:** Real file upload for site diary photos

---

## 🚀 Quick Setup (For AI Assistants & New Developers)

**Environment Variable Required:**

```bash
# apps/web/.env.local
UPLOADTHING_SECRET=your-secret-token-here  # Get from uploadthing.com/dashboard
```

**Key Files:**

- `apps/web/src/app/api/uploadthing/core.ts` - Upload config (4MB, 5 files max)
- `apps/web/src/app/api/uploadthing/delete/route.ts` - File deletion endpoint
- `apps/web/src/components/site-diary/image-uploader.tsx` - Upload UI
- `apps/web/next.config.ts` - CDN config (`*.ufs.sh` pattern)

**Code Quality:** ✅ Production ready, TypeScript + ESLint passing, no breaking changes

---

## 📋 Overview

This guide documents the UploadThing integration for photo uploads in the Site Diary application.

### What Changed

**Before:**

- Users manually entered image URLs
- No actual file upload functionality
- Images stored as external URLs only

**After:**

- Users drag & drop or select files from their device
- Files uploaded to UploadThing CDN
- Automatic image optimization
- Professional upload UI with progress indicators

---

## 🏗️ Architecture

### Component Structure

```
┌─────────────────────────────────────────┐
│         ImageUploader Component         │
│  (site-diary/image-uploader.tsx)        │
└────────────┬────────────────────────────┘
             │
             ├─ Uses UploadDropzone
             │  (from @uploadthing/react)
             │
             ├─ Calls /api/uploadthing
             │  (Next.js API route)
             │
             └─ Returns file URLs
                (stored in attachments[])
```

### File Upload Flow

1. **User interaction**
   - Drag & drop files onto dropzone
   - Or click to browse files

2. **Client-side validation**
   - Check file size (max 4MB)
   - Check file type (images only)
   - Check file count (max 5 per upload)

3. **Upload to UploadThing**
   - POST to `/api/uploadthing`
   - Files sent to UploadThing CDN
   - Progress tracking shown to user

4. **Server-side processing**
   - `core.ts` middleware runs (authentication could be added here)
   - File stored on UploadThing CDN
   - `onUploadComplete` callback runs

5. **URL returned**
   - UploadThing returns CDN URL (e.g., `https://utfs.io/f/abc123.jpg` or `https://*.ufs.sh/f/abc123.jpg`)
   - Client accesses URL via `file.ufsUrl` (v9) or `file.fileUrl` as fallback
   - URL added to `attachments` array
   - Image displayed in preview grid

---

## 📁 Files Modified/Created

### Created Files

1. **`apps/web/src/app/api/uploadthing/core.ts`**
   - File router configuration
   - Upload limits and permissions
   - Middleware and completion hooks

2. **`apps/web/src/app/api/uploadthing/route.ts`**
   - Next.js API route handler
   - Exports GET and POST handlers

3. **`apps/web/src/lib/uploadthing.ts`**
   - Client-side upload components
   - Type-safe wrappers for UploadButton and UploadDropzone

### Modified Files

1. **`apps/web/src/components/site-diary/image-uploader.tsx`**
   - Replaced URL input with file upload dropzone
   - Added drag & drop functionality
   - Maintained image preview and removal features

2. **`apps/web/next.config.ts`**
   - Added `utfs.io` and `*.ufs.sh` to remotePatterns
   - Allows Next.js Image to load UploadThing images from both CDN formats

3. **`apps/web/.env.local`**
   - Added `UPLOADTHING_SECRET` environment variable

4. **`CLAUDE.md`**
   - Documented UploadThing setup
   - Added troubleshooting guide

---

## 🔧 Configuration

### UploadThing Version

**Current Version:** v7.7.4  
**Migration Status:** Prepared for v9

**API Changes:**

- ✅ Using `file.ufsUrl` (v9) with `file.fileUrl` fallback for compatibility
- ✅ Removed deprecated `file.url` property usage
- ✅ Server callbacks return minimal data (v9 pattern)

**Note:** The application is compatible with both UploadThing v7/v8 and the upcoming v9 API. When v9 is released, no code changes will be required.

### Environment Variables

**Required:**

```bash
# apps/web/.env.local
UPLOADTHING_SECRET=your-secret-token-here
```

**How to get token:**

1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Create a new app in the dashboard
3. Go to Settings → API Keys
4. Copy the secret token
5. Add to `.env.local`
6. Restart dev server

### Upload Limits

**Current configuration:**

```typescript
// apps/web/src/app/api/uploadthing/core.ts
imageUploader: f({
  image: {
    maxFileSize: '4MB', // Max size per file
    maxFileCount: 5, // Max files per upload session
  },
});
```

**Supported file types:**

- JPEG/JPG
- PNG
- GIF
- WebP

**To modify limits:**

Edit `apps/web/src/app/api/uploadthing/core.ts`:

```typescript
imageUploader: f({
  image: {
    maxFileSize: '8MB', // Increase to 8MB
    maxFileCount: 10, // Allow 10 images
  },
});
```

### Next.js Image Configuration

**Required for images to display:**

```typescript
// apps/web/next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io', // UploadThing CDN (legacy)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ufs.sh', // UploadThing CDN (new format)
        port: '',
        pathname: '/**',
      },
    ],
  },
};
```

**Note:** UploadThing uses both `utfs.io` and `*.ufs.sh` hostnames. Both are configured to ensure compatibility.

---

## 💻 Code Examples

### Using the ImageUploader Component

**In diary-form.tsx:**

```tsx
import { ImageUploader } from '@/components/site-diary/image-uploader';

const DiaryForm: React.FC = () => {
  const [formData, setFormData] = React.useState({
    images: [],
    // ... other fields
  });

  return (
    <form>
      {/* Other form fields */}

      <div>
        <h3 className="mb-4 text-lg font-semibold">Photos</h3>
        <ImageUploader
          images={formData.images}
          onChange={(images) => setFormData({ ...formData, images })}
        />
      </div>
    </form>
  );
};
```

### Customizing Upload Appearance

**In image-uploader.tsx:**

```tsx
<UploadDropzone
  endpoint="imageUploader"
  appearance={{
    container: 'border-2 border-dashed rounded-lg p-8',
    uploadIcon: 'text-primary',
    label: 'text-lg font-semibold',
    allowedContent: 'text-sm text-muted-foreground',
    button: 'bg-primary text-white px-4 py-2 rounded-md',
  }}
/>
```

### Adding Authentication

**In core.ts middleware:**

```typescript
.middleware(async () => {
  // Example: Check user authentication
  const user = await auth();

  if (!user) {
    throw new UploadThingError('Unauthorized - Please login');
  }

  // Pass user info to onUploadComplete
  return {
    uploadedBy: user.id,
    userName: user.name
  };
})
```

### Handling Upload Errors

**In image-uploader.tsx:**

```tsx
<UploadDropzone
  endpoint="imageUploader"
  onClientUploadComplete={(res) => {
    // Success handling
    if (res && res.length > 0) {
      // Use ufsUrl (UploadThing v9) with fallback
      const newUrls = res.map((file) => file.ufsUrl || file.fileUrl);
      onChange([...images, ...newUrls]);
      toast.success('Images uploaded successfully!');
    }
  }}
  onUploadError={(error: Error) => {
    // Error handling
    console.error('Upload error:', error);

    if (error.message.includes('FileSizeMismatch')) {
      toast.error('File too large. Max 4MB per image.');
    } else if (error.message.includes('FileCountMismatch')) {
      toast.error('Too many files. Max 5 images at a time.');
    } else {
      toast.error(`Upload failed: ${error.message}`);
    }
  }}
/>
```

---

## 🧪 Testing

### Manual Testing Checklist

**Create Diary Entry:**

- [ ] Open create diary form (`/diary/create`)
- [ ] Scroll to Photos section
- [ ] Drag & drop an image onto dropzone
- [ ] Verify upload progress indicator appears
- [ ] Verify image appears in preview grid after upload
- [ ] Click the X button to remove image
- [ ] Submit form and verify image URL saved

**Edit Diary Entry:**

- [ ] Open edit form for existing diary
- [ ] Verify existing images display correctly
- [ ] Add new image via upload
- [ ] Remove an existing image
- [ ] Save changes and verify on detail page

**Upload Limits:**

- [ ] Try uploading file > 4MB (should fail with error)
- [ ] Try uploading 6 images at once (should fail with error)
- [ ] Try uploading non-image file (should fail with error)

**Image Display:**

- [ ] View diary detail page
- [ ] Verify images load from UploadThing CDN (`utfs.io` or `ufs.sh`)
- [ ] Verify images are responsive (resize browser)
- [ ] Check image optimization (inspect Network tab)

### Error Scenarios

**Missing environment variable:**

```
Error: UPLOADTHING_SECRET is not defined
```

**Solution:** Add token to `.env.local` and restart server

**CDN not configured:**

```
Invalid src prop on next/image, hostname 'utfs.io' or '*.ufs.sh' is not configured
```

**Solution:** Add both `utfs.io` and `*.ufs.sh` to `next.config.ts` remotePatterns

**File too large:**

```
FileSizeMismatch: File size exceeds limit
```

**Solution:** User should compress image or increase limit in `core.ts`

---

## 🚀 Deployment Considerations

### Environment Variables

**Production deployment:**

1. Add `UPLOADTHING_SECRET` to your hosting platform's environment variables
2. Ensure token has production permissions
3. Never commit token to git

**Example (Vercel):**

```bash
vercel env add UPLOADTHING_SECRET production
# Paste your production token when prompted
```

### UploadThing Plan Limits

**Free tier limits:**

- 2GB storage
- 2GB bandwidth per month
- Unlimited uploads

**Pro tier ($20/mo):**

- 100GB storage
- 100GB bandwidth
- Priority support

**Monitor usage:**

- Check UploadThing dashboard for usage stats
- Set up alerts for approaching limits
- Consider implementing file cleanup for old uploads

### Image Optimization

UploadThing automatically optimizes images:

- WebP conversion for supported browsers
- Responsive image serving
- CDN caching (global edge network)

**Additional optimizations:**

- Encourage users to compress large images before upload
- Add client-side image compression library (e.g., `browser-image-compression`)
- Set up image deletion for removed diary entries

---

## 🔍 Troubleshooting

### Common Issues

**"Upload failed" error**

**Cause:** Invalid or missing API token  
**Solution:**

1. Check `.env.local` has `UPLOADTHING_SECRET`
2. Verify token is correct in UploadThing dashboard
3. Restart dev server after adding token

**Images not displaying**

**Cause:** Next.js Image component not configured for UploadThing CDN  
**Solution:**

1. Check `next.config.ts` has both `utfs.io` and `*.ufs.sh` in remotePatterns
2. Restart dev server after config change

**"Cannot find module '@/app/api/uploadthing/core'" error**

**Cause:** Import path issue or file not created  
**Solution:**

1. Verify `core.ts` exists at correct path
2. Check TypeScript paths configuration in `tsconfig.json`
3. Restart TypeScript server in VS Code

**Upload stuck at "Uploading..."**

**Cause:** Network issue or server error  
**Solution:**

1. Check browser console for errors
2. Check network tab for failed requests
3. Verify UploadThing service status
4. Try with different file/browser

### Debug Mode

**Enable verbose logging:**

```typescript
// apps/web/src/app/api/uploadthing/core.ts
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      console.log('[UploadThing] Middleware running');
      return { uploadedBy: 'anonymous' };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('[UploadThing] Upload complete');
      console.log('[UploadThing] File name:', file.name);
      console.log('[UploadThing] File key:', file.key);
      console.log('[UploadThing] Metadata:', metadata);
      return { uploadedBy: metadata.uploadedBy };
    }),
};
```

**Check server logs:**

```bash
# Terminal running dev server will show:
[UploadThing] Middleware running
[UploadThing] Upload complete
[UploadThing] File name: photo.jpg
[UploadThing] File key: abc123
```

---

## 📚 Additional Resources

**UploadThing Documentation:**

- Getting Started: https://docs.uploadthing.com/getting-started
- Next.js Integration: https://docs.uploadthing.com/getting-started/appdir
- API Reference: https://docs.uploadthing.com/api-reference/server

**Related Project Files:**

- Image Uploader Component: `apps/web/src/components/site-diary/image-uploader.tsx`
- Upload Configuration: `apps/web/src/app/api/uploadthing/core.ts`
- API Route: `apps/web/src/app/api/uploadthing/route.ts`
- Client Utils: `apps/web/src/lib/uploadthing.ts`

**Developer Guides:**

- Frontend Patterns: `docs/guides/frontend-coding-patterns.md`
- Backend Patterns: `docs/guides/backend-coding-patterns.md`
- Code Modification Rules: `docs/guides/code-modification-rules.md`

---

## 🔄 Future Enhancements

### Potential Improvements

1. **Image Compression**
   - Add client-side compression before upload
   - Reduce bandwidth and storage costs
   - Library: `browser-image-compression`

2. **File Deletion**
   - Implement UploadThing file deletion API
   - Clean up orphaned files when diary deleted
   - Add "Delete All Photos" button

3. **Advanced Upload UI**
   - Show individual file progress bars
   - Add cancel upload functionality
   - Display file names and sizes

4. **Image Editing**
   - Crop/resize before upload
   - Add filters or adjustments
   - Library: `react-image-crop`

5. **Mobile Camera Integration**
   - Direct camera capture on mobile
   - Use device's native camera
   - Library: `react-camera-pro`

6. **Batch Operations**
   - Select multiple images to delete
   - Reorder images with drag & drop
   - Set featured/cover image

---

**Last Updated:** October 24, 2025  
**Maintainer:** Development Team  
**Status:** ✅ Production Ready
