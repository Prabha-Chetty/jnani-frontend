# Jnani Study Center - Modern Education Platform

A sophisticated web application for managing a study center with a modern dark theme design and comprehensive admin panel.

## 🎨 Design System & Theme Guidelines

### Color Palette
Our application uses a sophisticated dark theme with carefully selected colors:

#### Primary Colors
- **Primary (Navy Blue)**: `#1e293b` - Main brand color for buttons, links, and accents
- **Secondary (Gold)**: `#f59e0b` - Highlight color for CTAs and important elements
- **Success (Emerald)**: `#10b981` - Success states and positive actions
- **Warning (Orange)**: `#f97316` - Warning states and caution elements
- **Error (Red)**: `#ef4444` - Error states and destructive actions

#### Background Colors
- **Main Background**: `#0f172a` (dark-900) - Primary page background
- **Surface Background**: `#1e293b` (dark-800) - Cards, panels, and elevated surfaces
- **Secondary Surface**: `#334155` (dark-700) - Hover states and secondary elements

#### Text Colors
- **Primary Text**: `#f8fafc` (dark-50) - Main text content
- **Secondary Text**: `#cbd5e1` (dark-300) - Subtle text and descriptions
- **Muted Text**: `#94a3b8` (dark-400) - Placeholder and disabled text

### Design Principles

#### 1. Dark Theme First
- All new components must use dark backgrounds (`bg-dark-800`, `bg-dark-900`)
- Text should be light colored for maximum contrast
- Use glass morphism effects for modern UI elements

#### 2. Consistent Spacing
- Use Tailwind's spacing scale: `p-4`, `m-6`, `gap-8`
- Maintain consistent padding in cards: `p-6` for content, `p-4` for compact
- Use `space-y-4` for vertical spacing between elements

#### 3. Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Use semantic heading tags with appropriate weights
- **Body Text**: `text-dark-100` for primary content
- **Captions**: `text-dark-400` for secondary information

#### 4. Interactive Elements
- **Buttons**: Use `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`
- **Hover Effects**: Always include smooth transitions (`transition-all duration-200`)
- **Focus States**: Include focus rings for accessibility
- **Loading States**: Use skeleton loaders or spinners

#### 5. Component Guidelines

##### Cards
```jsx
<div className="card p-6">
  <h3 className="text-lg font-semibold text-dark-100 mb-4">Card Title</h3>
  <p className="text-dark-300">Card content</p>
</div>
```

##### Forms
```jsx
<input 
  className="input-field w-full"
  placeholder="Enter your text"
/>
```

##### Tables
```jsx
<div className="table-dark">
  <table className="min-w-full">
    <thead>
      <tr>
        <th>Header</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Content</td>
      </tr>
    </tbody>
  </table>
</div>
```

##### Modals
```jsx
<div className="modal-overlay">
  <div className="modal-content p-6">
    {/* Modal content */}
  </div>
</div>
```

### Animation Guidelines
- **Page Transitions**: Use `animate-fade-in` for page loads
- **Component Mounting**: Use `animate-slide-up` for modals and dropdowns
- **Hover Effects**: Use `hover-lift` for cards and `hover-glow` for buttons
- **Loading States**: Use smooth spinners with `animate-spin`

## 🚀 Features

### Main Website
- **Modern Dark Theme**: Sophisticated dark interface with gold accents
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Course Information**: Comprehensive course listings and descriptions
- **Contact Information**: Easy-to-find contact details and location

### Admin Panel
- **Dashboard**: Overview with statistics and quick actions
- **Student Management**: Full CRUD operations with profile image uploads
- **Faculty Management**: Complete faculty information management
- **Event Management**: Create and manage events with media uploads
- **Library Management**: Digital library with file upload support
- **Class Management**: Predefined class levels and configurations
- **User Management**: Role-based access control system
- **Settings**: Comprehensive system configuration

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **React Hot Toast**: Toast notifications

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **PostgreSQL**: Primary database
- **Pydantic**: Data validation
- **Python-multipart**: File upload handling

## 📁 Project Structure

```
jnani_web/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── globals.css        # Global styles and dark theme
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   └── admin/            # Admin-specific components
├── backend/              # FastAPI backend
│   ├── app/              # Backend application
│   ├── requirements.txt  # Python dependencies
│   └── main.py          # FastAPI entry point
├── public/               # Static assets
└── tailwind.config.js   # Tailwind configuration
```

## 🎯 Development Rules

### For New Features
1. **Always use dark theme colors** - No white backgrounds unless absolutely necessary
2. **Follow the color palette** - Use defined primary, secondary, and status colors
3. **Include smooth transitions** - All interactive elements need hover and focus states
4. **Use semantic HTML** - Proper heading hierarchy and accessible markup
5. **Mobile-first design** - Ensure responsive behavior on all screen sizes
6. **Consistent spacing** - Follow the established spacing patterns
7. **Component reusability** - Create reusable components with proper props
8. **Error handling** - Include proper error states and user feedback
9. **Loading states** - Show appropriate loading indicators
10. **Accessibility** - Include ARIA labels and keyboard navigation

### Code Quality
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful component and function names
- Include proper JSDoc comments for complex functions
- Test components on different screen sizes
- Ensure proper contrast ratios for accessibility

### File Naming Conventions
- **Components**: PascalCase (e.g., `StudentForm.tsx`)
- **Pages**: kebab-case (e.g., `student-management.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- PostgreSQL database

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd jnani_web
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp backend/env.example backend/.env
# Edit .env with your database credentials
```

5. **Start the development servers**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
uvicorn app.main:app --reload --port 8000
```

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/jnani_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🎨 Customization

### Adding New Colors
1. Update `tailwind.config.js` with new color definitions
2. Add corresponding CSS variables in `globals.css`
3. Update this README with new color documentation

### Creating New Components
1. Follow the established component patterns
2. Use the provided utility classes
3. Include proper TypeScript interfaces
4. Add hover and focus states
5. Test on multiple screen sizes

## 🤝 Contributing

1. Follow the design system guidelines
2. Use the established color palette
3. Include proper TypeScript types
4. Test on mobile and desktop
5. Ensure accessibility compliance
6. Update documentation as needed

## 📄 License

This project is proprietary software for Jnani Study Center.

---

**Remember**: Every new feature should enhance the sophisticated dark theme experience while maintaining consistency with the established design system. 