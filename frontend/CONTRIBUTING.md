# Contributing to ReuseHub

Thank you for your interest in ReuseHub! This guide will help you add additional sample data or modify existing data.

## 📦 Sample Data Already Included

The app comes with **pre-loaded sample data** that loads automatically on first run:

### Existing Demo Accounts
- **Lijashree** (Admin) - lijashree@college.edu / admin123
- **Krishnapriya** (User) - krishnapriya@college.edu / user123
- **Mithuna** (User) - mithuna@college.edu / user123

### Existing Sample Items
1. ASUS Laptop
2. HP Laptop Charger
3. Ultrasonic Sensor
4. Raspberry Pi 4
5. HTML & CSS Book

All with real images in `src/imports/`

---

## ➕ Adding More Sample Data

### Option 1: Through the UI (Recommended)

1. **Start the app**:
   ```bash
   pnpm run dev
   ```

2. **Create additional users**:
   - Click "Sign Up"
   - Fill in details with any role (User/Admin/NGO)
   - Sign up

3. **Add more items**:
   - Sign in as a user
   - Go to "Add Item"
   - Fill in details
   - Upload image
   - Submit

4. **Approve as admin**:
   - Sign in as Lijashree (admin)
   - Go to "Admin Panel"
   - Approve pending items

### Option 2: Edit Sample Data File (Advanced)

Edit `src/app/utils/sampleData.ts`:

```typescript
// Add to sampleUsers array
{
  id: 'user_3',
  email: 'newuser@college.edu',
  password: 'password123',
  name: 'New User Name',
  role: 'user',
}

// Add to sampleItems array
{
  id: 'item_6',
  title: 'Your Item Title',
  description: 'Item description',
  category: 'Books', // or 'Laptops', 'Project Components'
  quantity: 1,
  type: 'share', // or 'donate'
  status: 'approved',
  imageUrl: '/src/imports/your-image.jpeg',
  ownerName: 'Owner Name',
  ownerPhone: '1234567890',
  location: 'Your Location',
  timeSlot: 'Time Slot',
  ownerId: 'user_id',
  createdAt: new Date().toISOString(),
}
```

Then clear browser data and reload:
- DevTools → Application → Local Storage
- Clear `sample_data_loaded`
- Refresh page

---

## 🖼️ Adding Item Images

### Add New Images

1. Place image in `src/imports/` folder
2. Reference in sample data: `/src/imports/your-image.jpeg`
3. Supported formats: JPEG, PNG, JPG

### Image Guidelines
- Recommended size: 400-800px width
- Keep file size under 500KB
- Use descriptive filenames

---

## 🔄 Resetting Sample Data

### To Start Fresh

1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Find your localhost URL
4. Clear these keys:
   - `sample_data_loaded`
   - `mock_users`
   - `mock_items`
   - `mock_requests`
5. Refresh page

Sample data will reload automatically!

---

## 🧪 Testing Your Changes

After adding data:

1. **Test User Flow**:
   - Sign up/Sign in
   - Browse items
   - Request items
   - Check statistics

2. **Test Admin Flow**:
   - Login as admin
   - View all items
   - Approve/reject
   - Check admin panel

3. **Test Data Persistence**:
   - Logout
   - Login again
   - Data should persist

---

## 📝 Code Contribution Guidelines

### Before Submitting

- Follow existing code style
- Test all user roles (User, Admin, NGO)
- Update README if adding features
- Keep commits focused and descriptive

### Making Changes

1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Make changes
4. Test thoroughly
5. Commit: `git commit -m 'Add YourFeature'`
6. Push: `git push origin feature/YourFeature`
7. Open Pull Request

---

## 🐛 Reporting Issues

Found a bug? Please include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/OS info

---

## 💡 Feature Requests

We welcome ideas! Please include:

- Problem it solves
- Proposed solution
- Use case examples

---

## 📞 Questions?

Open an issue on GitHub or check existing documentation:
- `README.md` - Main documentation
- `FINAL_STATUS.md` - Complete feature list
- `CHANGES_MADE.md` - Changelog

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">
  Thank you for contributing to a sustainable future! 🌱
</div>
