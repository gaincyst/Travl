# Profile Avatar Upload - Testing Checklist

## Pre-Testing Setup

### ✅ Step 1: Configure Cloudinary
- [ ] Sign up at https://cloudinary.com or use existing account
- [ ] Copy Cloud Name, API Key, and API Secret
- [ ] Update `backendd/.env` with credentials:
  ```
  CLOUDINARY_CLOUD_NAME=your_value
  CLOUDINARY_API_KEY=your_value
  CLOUDINARY_API_SECRET=your_value
  ```

### ✅ Step 2: Verify Database
- [ ] MySQL is running on localhost:3306
- [ ] Database: `travel_db`
- [ ] Table: `user_profiles` exists
- [ ] Column: `avatar_url` exists (if not, run migration)

### ✅ Step 3: Start Servers
```bash
# Terminal 1: Backend
cd backendd
npm run dev
# Should show: ✅ MySQL Database connected successfully

# Terminal 2: Frontend
cd vite-project
npm run dev
# Should show: VITE v... ready in ... ms
```

---

## Testing Workflow

### Test 1: User Authentication
- [ ] Open http://localhost:5173
- [ ] Login with existing user account
- [ ] Verify you're on the dashboard
- [ ] Navigate to Profile page

### Test 2: Avatar Section Visibility
- [ ] Profile page loads successfully
- [ ] Avatar circle visible in hero section
- [ ] Circle has camera icon and "Add Photo" text
- [ ] Circle is clickable (cursor changes to pointer)

### Test 3: File Selection
- [ ] Click on avatar circle
- [ ] File browser opens
- [ ] Can select image files from disk

### Test 4: Valid Image Upload (JPG)
- [ ] Select a JPG image (< 2MB)
- [ ] File upload starts
- [ ] "Uploading..." appears on avatar
- [ ] Avatar image displays after upload completes
- [ ] Browser console shows no errors
- [ ] Backend logs show successful upload

### Test 5: Valid Image Upload (PNG)
- [ ] Click avatar again
- [ ] Select a PNG image (< 2MB)
- [ ] Image uploads successfully
- [ ] Avatar updates in UI
- [ ] Previous avatar replaced (not added)

### Test 6: File Size Validation
- [ ] Click avatar
- [ ] Try to upload image > 2MB
- [ ] Error appears: "File size must be less than 2MB"
- [ ] Error disappears after 3 seconds
- [ ] Avatar not updated

### Test 7: File Type Validation
- [ ] Click avatar
- [ ] Try to upload non-image file (.txt, .pdf, etc.)
- [ ] Error appears: "Only JPG, JPEG, and PNG images are allowed"
- [ ] Error disappears after 3 seconds
- [ ] Avatar not updated

### Test 8: Data Persistence
- [ ] Upload avatar successfully
- [ ] Refresh page (F5)
- [ ] Avatar still displays in profile
- [ ] Check browser Network tab - avatar_url in API response
- [ ] Check Cloudinary dashboard - image visible in voyago_profiles folder

### Test 9: Multiple User Uploads
- [ ] Logout
- [ ] Login with different user account
- [ ] Navigate to their profile
- [ ] Upload different avatar image
- [ ] Verify each user has their own avatar
- [ ] Images are separate in Cloudinary

### Test 10: Database Verification
- [ ] Open MySQL CLI or tool
- [ ] Run: `SELECT user_id, avatar_url FROM user_profiles WHERE avatar_url IS NOT NULL;`
- [ ] Verify avatar_url contains Cloudinary URL
- [ ] URL format: `https://res.cloudinary.com/.../voyago_profiles/user_X_avatar...`

### Test 11: Backend Logs
- [ ] Check backend terminal
- [ ] Verify logs show:
  ```
  [Profile][POST /api/profile/avatar] userId=<number>
  [Profile] Avatar uploaded successfully for userId=<number>
  ```

### Test 12: Network Inspector
- [ ] Open Chrome DevTools (F12)
- [ ] Go to Network tab
- [ ] Upload avatar
- [ ] Verify:
  - [ ] POST request to `/api/profile/avatar`
  - [ ] Status code: 200
  - [ ] Request headers include: `Authorization: Bearer <token>`
  - [ ] Response contains `avatarUrl` with Cloudinary link

---

## Error Scenarios to Test

### Error Test 1: No Cloudinary Credentials
- [ ] Comment out Cloudinary vars in .env
- [ ] Restart backend
- [ ] Try to upload
- [ ] Error message shown: "Failed to upload image to Cloudinary"
- [ ] Backend logs show warning about missing credentials

### Error Test 2: Invalid JWT Token
- [ ] Open DevTools Console
- [ ] Set: `localStorage.removeItem('token')`
- [ ] Refresh page
- [ ] Try to upload
- [ ] Should be redirected to login or show auth error

### Error Test 3: Network Failure Simulation
- [ ] Open DevTools Network tab
- [ ] Check "Offline" mode
- [ ] Try to upload
- [ ] Error displayed: "Failed to upload avatar"
- [ ] Go back online

### Error Test 4: User Not in Database
- [ ] Backend: Manually create JWT with non-existent user_id
- [ ] Try to upload
- [ ] Error: "User not found"

---

## Performance & Security Tests

### Performance Test 1: Large File Handling
- [ ] Create 1.8MB image
- [ ] Upload - should work
- [ ] Create 2.1MB image
- [ ] Upload - should show error (before sending to backend)

### Performance Test 2: Upload Timeout
- [ ] Note upload time for various sizes
- [ ] Should complete within reasonable time (< 10 seconds)

### Security Test 1: File Type Bypass
- [ ] Rename .exe to .jpg
- [ ] Try to upload - should be rejected by backend
- [ ] Check Cloudinary dashboard - file not uploaded

### Security Test 2: Authorization Check
- [ ] Intercept request in DevTools
- [ ] Remove Authorization header
- [ ] Send request
- [ ] Get 401 Unauthorized response

### Security Test 3: User Isolation
- [ ] User A uploads avatar
- [ ] User A gets Cloudinary URL
- [ ] User B cannot modify User A's avatar_url in database
- [ ] Each user can only update their own profile

---

## Persistence Tests

### Persistence Test 1: Browser Restart
- [ ] Upload avatar
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Login again
- [ ] Avatar still displays

### Persistence Test 2: Incognito Window
- [ ] Open incognito window
- [ ] Login with same user
- [ ] Navigate to profile
- [ ] Avatar displays (not from cache)

### Persistence Test 3: Different Browser
- [ ] Upload avatar in Chrome
- [ ] Open Firefox
- [ ] Login with same account
- [ ] Avatar displays in Firefox

---

## UI/UX Tests

### UX Test 1: Visual Feedback
- [ ] Upload starts
- [ ] "Uploading..." appears
- [ ] Cannot upload another file during upload
- [ ] Upload completes, feedback disappears

### UX Test 2: Error Display
- [ ] Trigger error
- [ ] Error message visible
- [ ] Error automatically clears after 3 seconds
- [ ] Can retry upload

### UX Test 3: Avatar Display
- [ ] No avatar: circle is teal with camera icon
- [ ] With avatar: circle shows image
- [ ] Image centered and covers full circle
- [ ] Image not stretched or distorted

---

## Frontend & Backend Logs

### Backend Logs to Verify
```
✅ Database connected
[Profile][POST /api/profile/avatar] userId=<number>
[Profile] Avatar uploaded successfully for userId=<number>
```

### Frontend Console (no errors)
- [ ] No red error messages
- [ ] Upload function logs (if enabled)
- [ ] API response logged

### Cloudinary Dashboard
- [ ] Login to https://console.cloudinary.com
- [ ] Media Library > voyago_profiles folder
- [ ] Verify uploaded images are there
- [ ] Image naming: `user_<userId>_avatar`

---

## Final Checklist

- [ ] All 12 core tests passed
- [ ] All 4 error scenario tests passed
- [ ] No console errors
- [ ] Backend logs clean
- [ ] Database contains avatar_url
- [ ] Cloudinary dashboard shows images
- [ ] Feature ready for deployment

---

## Notes for Debugging

**Common Issues:**

1. **Upload fails silently**
   - Check browser console for errors
   - Check backend logs
   - Verify Cloudinary credentials in .env
   - Restart backend after .env changes

2. **Avatar doesn't display**
   - Check if Cloudinary URL is valid
   - Check database - does avatar_url have value?
   - Check browser Network tab - verify response

3. **CORS errors**
   - Verify FRONTEND_URL in backend .env
   - Ensure frontend and backend URLs match

4. **File input not showing**
   - Check avatarFileInputRef is properly set
   - Verify input element created in JSX
   - Check browser console for React errors

---

**Test Date:** ________________
**Tester Name:** ________________
**Result:** ☐ PASS ☐ FAIL
**Notes:** ________________________________________
