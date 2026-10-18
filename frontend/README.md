# 🌱 ReuseHub - Sustainable Campus Resource Sharing Platform

<br>

**ReuseHub** is a modern web application designed to promote sustainability on college campuses by enabling students and staff to share, donate, and request items within their community. The platform reduces waste, encourages resource reuse, and builds a culture of sustainability.

## ✨ Features

### 🎯 Core Functionality
- **User Authentication** - Secure signup/signin with role-based access (User, Admin, NGO)
- **Item Sharing** - Post items to share with the campus community
- **Item Donation** - Donate items to registered NGOs
- **Browse Items** - Discover available items with advanced filtering
- **Request System** - Request items from other users with terms & conditions
- **Admin Dashboard** - Approve/reject pending items with full oversight
- **Impact Tracking** - Real-time statistics on items shared, users active, and waste reduced

### 🎨 User Experience
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Modern UI** - Clean interface with smooth animations using Framer Motion
- **Image Upload** - Instant preview with file upload for item listings
- **Quantity Selectors** - Easy-to-use controls for requesting multiple items
- **Category System** - Organized categories including Books, Electronics, Project Components, etc.
- **Search & Filter** - Find items quickly with keyword search and category filters

### 🔐 Security & Roles
- **Role-Based Access Control** - Different permissions for Users, Admins, and NGOs
- **Admin Approval Flow** - Items require admin approval before appearing publicly
- **Terms & Conditions** - Legal protection with damage responsibility clauses
- **Persistent Storage** - LocalStorage-based data persistence

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm installed

### Installation

# Install dependencies
npm install

# Start development server
npm run dev
```
## 👤 Getting Started

To test the application:

- Create an **Admin account** and a **User account** using the signup page  
- Login with both roles in different sessions (or browser/incognito)  
- Use the **User account** to add and request items  
- Use the **Admin account** to approve or reject items from the admin dashboard  

💡 This helps demonstrate the complete workflow of the platform.
- Standard user features
- Can add and request items
- View personal dashboard

## 📂 Project Structure

```
reusehub/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── pages/          # Page components
│   │   │   ├── layouts/        # Layout components
│   │   │   └── ui/             # Reusable UI components
│   │   ├── utils/
│   │   │   ├── api.ts          # API functions & mock backend
│   │   │   └── sampleData.ts   # Pre-loaded demo data
│   │   ├── routes.tsx          # Application routing
│   │   └── App.tsx             # Main app component
│   ├── imports/                # Sample item images
│   └── styles/
│       ├── theme.css           # Tailwind theme variables
│       └── fonts.css           # Font imports
├── package.json
├── vite.config.ts
└── README.md
```

## 🎯 User Roles

### 👤 Regular User
- Browse approved items
- Add items for sharing/donation (requires admin approval)
- Request items from other users
- Track personal requests
- View impact dashboard

### 🛡️ Admin
- All user permissions
- Access admin dashboard
- Approve/reject pending items
- View all items (pending, approved, rejected)
- Access database viewer for demos

### ❤️ NGO
- Browse donation items
- Request pickups for donated items
- Add donation items
- View donation impact

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| React 18.3 | UI framework |
| TypeScript | Type-safe development |
| Tailwind CSS v4 | Styling & theming |
| Framer Motion | Animations |
| React Router | Client-side routing |
| Lucide Icons | Icon library |
| Vite | Build tool & dev server |
| LocalStorage | Data persistence |

## 🎨 Design System

### Color Palette
- **Primary (Green)**: `#2d6a4f` - Represents sustainability
- **Secondary (Blue)**: `#0077b6` - Trust and reliability
- **Accent (Teal)**: `#06d6a0` - Energy and action
- **Backgrounds**: Adaptive light/dark themes

## 🔄 Core Workflows

### Adding an Item
1. User clicks "Add Item"
2. Fills in details (title, description, category, quantity, etc.)
3. Uploads image with instant preview
4. Submits for admin approval
5. Item appears as "pending" in admin dashboard
6. Admin approves → item appears in Browse/Dashboard
7. Admin rejects → item is removed

### Requesting an Item
1. User browses items on Dashboard or Browse Items page
2. Selects quantity using quantity selector
3. Clicks "Get this Item"
4. Reviews and accepts Terms & Conditions
5. Request is sent to item owner
6. Owner approves/rejects from Requests page


## 📊 Sample Data

This project uses localStorage for data persistence.

👉 To test the application:
- Add a few sample items manually using the "Add Item" feature
- Example items:
  - Laptop (Electronics)
  - Aptitude Book (Books)
  - Arduino Kit (Project Components)

💡 Once added, items will appear in the dashboard and can be used to test the full workflow.

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

Built with 💚 for a sustainable future

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

<div align="center">
  Made with passion for sustainability 🌍
</div>
