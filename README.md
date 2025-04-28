# Expense Reimbursement System (ERS) Frontend

A modern, responsive web application built with React for managing employee expense reimbursements. This system allows employees to submit expense requests and managers to process them efficiently.

## Features

### User Authentication
- Secure login system with email and password
- Role-based access control (Admin/Manager/Employee)
- Automatic redirect based on user role
- Session persistence

### Employee Features
- Submit new expense requests with receipts
- View all submitted expenses with status
- Filter expenses by status, category, and date
- Edit pending expense requests
- Delete pending expense requests
- Real-time status updates
- Download expense receipts

### Manager Features
- View expense requests from reportees
- Approve/Reject expenses with comments
- Filter reportee expenses by status and category
- Detailed view of expense information
- Manage team members

### Admin Features
- Add new users to the system
- Edit existing user details
- Search and filter users
- Activate/Deactivate user accounts
- Manage user roles and permissions
- View user hierarchies

### Notification System
- Real-time notifications for expense status changes
- Notification history with pagination
- Clear visual indicators for new notifications

## Technical Stack

- **Frontend Framework**: React
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **UI Components**: Custom components with Radix UI primitives
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/        # React components
│   ├── Admin/        # Admin-specific components
│   └── ui/           # Reusable UI components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and constants
├── routes/           # Route components and configurations
└── assets/          # Static assets
```

## Components Overview

### Core Components
- `Dashboard`: Main interface for expense management
- `ExpenseForm`: Form for creating/editing expenses
- `ExpenseList`: Displays list of expenses with filtering
- `ExpenseCard`: Individual expense display component
- `DashboardHeader`: Navigation and user menu
- `Sidebar`: Navigation sidebar with collapsible design

### Admin Components
- `AdminPage`: Admin dashboard interface
- `AddUser`: User creation/editing form
- `SearchUser`: User search and management interface

### UI Components
- `Button`: Reusable button component with variants
- `Card`: Container component with different styles
- `Dialog`: Modal dialog component
- `Toast`: Notification toast component
- `LoadingState`: Loading indicators
- `ErrorBoundary`: Error handling component

## Security Features

- Protected routes with role-based access
- Token-based authentication
- Secure file upload for receipts
- Input validation and sanitization
- Error boundary implementation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```env
   VITE_API_BASE_URL=your_api_url
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Best Practices

- Component-based architecture
- Responsive design principles
- Error handling and loading states
- Form validation
- Accessibility considerations
- Performance optimizations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is private and confidential. All rights reserved.

---

For more information or support, please contact the development team.