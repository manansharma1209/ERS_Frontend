# 🏢 Expense Reimbursement System (ERS) Frontend

<div align="center">

![ERS Logo](./src/assets/logo.png)

A modern, responsive web application built with React for managing employee expense reimbursements.
Streamline your organization's expense management with our intuitive interface.

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)

</div>

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication system
- Role-based access control (Admin/Manager/Employee)
- Session persistence with local storage
- Protected routes with role verification
- Automatic token refresh mechanism

### 👤 Employee Dashboard
- **Expense Management**
  - Submit new expense requests with receipt uploads
  - PDF/JPEG/PNG receipt support with 5MB size limit
  - Real-time form validation
  - Edit pending expense requests
  - Delete pending requests
  
- **Request Tracking**
  - View all submitted expenses with status indicators
  - Advanced filtering by:
    - Status (Pending/Approved/Rejected)
    - Category (Travel/Electronics/Clothes/Vehicle/Accommodation)
    - Date range
  - Sort expenses by date (newest/oldest)
  - Download expense receipts

### 👨‍💼 Manager Features
- **Expense Approval Workflow**
  - Dedicated approvals dashboard
  - View all reportee expense requests
  - Approve/Reject with comments
  - Bulk status updates
  
- **Team Management**
  - View team hierarchy
  - Monitor team expense patterns
  - Access reportee details

### 👑 Admin Portal
- **User Management**
  - Create new user accounts
  - Update existing user details
  - Manage roles and permissions
  - Set manager-reportee relationships
  
- **Advanced Search**
  - Search users by name/email/ID
  - Filter by:
    - Active/Inactive status
    - Role
    - Manager status
  - View user hierarchies

### 🔔 Real-time Notifications
- Instant status update notifications
- Clickable notifications with context
- Notification history with pagination
- Unread notification indicators

## 🛠️ Technical Implementation

### Frontend Architecture
- **State Management**: React Context API for global state
  - Authentication context
  - Notification context
  - Toast notifications
  
- **Custom Hooks**
  - `useExpenses`: Expense CRUD operations
  - `useUsers`: User management operations
  - `useNotifications`: Notification handling
  - `useForm`: Form state and validation
  - `useError`: Error handling and tracking
  
- **Reusable Components**
  - Button with variants (primary/secondary/danger)
  - Dialog modals with animations
  - Toast notifications
  - Loading states and spinners
  - Error boundaries
  - Form components with validation

### Security Features
- JWT token management
- File upload validation
- Input sanitization
- Error boundary implementation
- Protected API endpoints
- CORS configuration

### UI/UX Features
- Responsive design for all devices
- Collapsible sidebar navigation
- Dark mode support
- Loading states and animations
- Form validation feedback
- Error handling with user-friendly messages
- Accessible components (ARIA labels)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd ers-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file:
   ```env
   VITE_API_BASE_URL=your_api_url
   VITE_API_TIMEOUT=30000
   VITE_MAX_FILE_SIZE=5242880
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Admin/           # Admin portal components
│   ├── ui/              # Reusable UI components
│   └── ...             # Feature components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/               # Utilities & constants
├── routes/            # Route configurations
└── assets/           # Static assets
```

## 🧪 Testing

- Unit tests with Jest
- Component testing with React Testing Library
- End-to-end testing with Cypress

## 📚 Documentation

For detailed documentation, check:
- [Component Documentation](./docs/components.md)
- [API Integration Guide](./docs/api.md)
- [Testing Guide](./docs/testing.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and confidential. All rights reserved.

---

Built with ❤️ by the ERS Development Team