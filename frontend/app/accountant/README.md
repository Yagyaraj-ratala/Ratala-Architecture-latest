# Accountant Dashboard

## Overview
The Accountant Dashboard is a role-based financial management interface for users with the "accountant" role. It provides comprehensive tools for tracking expenditures and managing payments/receipts.

## Access
- **URL**: `/accountant`
- **Role Required**: `accountant`
- **Authentication**: JWT-based authentication required

## Features

### 1. Expenditure Management
Track all asset purchases and material expenditures with detailed information:

**Fields:**
- **SL No.**: Serial number for tracking (e.g., EXP-001)
- **Item Description**: Detailed description of the item/material
- **Quantity**: Amount purchased
- **Unit**: Measurement unit (pieces, sqft, sqm, kg, ltr, bag, bundle)
- **Rate**: Price per unit in NPR
- **Project Name**: Associated project
- **Location**: Project location
- **Date**: Purchase date
- **Total**: Auto-calculated (Qty × Rate)

**Actions:**
- Add new expenditure entries
- Edit existing entries
- Delete entries
- View complete expenditure history
- Real-time total calculation

### 2. Payment & Receipt Management
Track all financial transactions including outgoing payments and incoming receipts:

**Fields:**
- **ID**: Unique transaction identifier
- **Type**: Payment (outgoing) or Receipt (incoming)
- **Name**: Labour/Vendor name for payments, Client name for receipts
- **Site Name**: Associated project/site
- **Amount**: Transaction amount in NPR
- **Date**: Transaction date
- **Description**: Additional notes/details

**Actions:**
- Add new transactions
- Edit existing transactions
- Delete transactions
- Filter by type (Payment/Receipt)
- Visual differentiation (red for payments, green for receipts)

### 3. Financial Dashboard
Real-time financial overview with key metrics:

**Metrics:**
- **Total Expenditure**: Sum of all asset/material purchases
- **Total Payments**: Sum of all outgoing payments
- **Total Receipts**: Sum of all incoming receipts
- **Net Balance**: Receipts - Payments - Expenditure

**Visual Indicators:**
- Color-coded cards (red for expenses, green for income)
- Trend icons (up/down arrows)
- Responsive layout

## User Interface

### Header
- Company logo and branding
- User name and role display
- Logout functionality
- Mobile-responsive menu

### Sidebar
- Navigation between sections
- Quick financial summary cards
- Collapsible on mobile devices

### Main Content Area
- Tab-based navigation (Expenditure / Payments & Receipts)
- Data tables with sorting and filtering
- Inline forms for adding/editing entries
- Mobile-optimized tables

## Data Management

### Current Implementation
- **Storage**: In-memory (dummy data)
- **Persistence**: None (data resets on page refresh)
- **Database**: Not connected (as per requirements)

### Dummy Data Included
**Expenditure Entries (4 samples):**
1. Office Chairs - Mega Dream Machhapokhari
2. Conference Table - Lympia College HM Lab
3. LED Lights - Building Project Budanilkantha
4. Wooden Flooring - Mega Dream Machhapokhari

**Payment/Receipt Entries (5 samples):**
1. Payment to Ram Bahadur Thapa - Construction work
2. Payment to Shyam Kumar Shrestha - Electrical work
3. Receipt from ABC Corporation - First installment
4. Payment to Hari Prasad Gautam - Plumbing work
5. Receipt from XYZ Pvt. Ltd. - Second installment

## Authentication Flow

1. User logs in via `/login` with accountant credentials
2. Backend validates credentials and returns JWT token with role
3. Token stored in localStorage/sessionStorage
4. Login page redirects to `/accountant` for accountant role
5. Accountant page verifies:
   - Token exists and is valid
   - User role is "accountant"
   - Redirects to login if unauthorized

## Security

- Role-based access control (RBAC)
- JWT token verification on page load
- Automatic redirect for unauthorized users
- Protected API routes (ready for future implementation)

## Responsive Design

- **Desktop**: Full sidebar with all features visible
- **Tablet**: Collapsible sidebar, optimized tables
- **Mobile**: Hamburger menu, stacked cards, horizontal scroll tables

## Future Enhancements (Database Integration)

When connecting to database, implement:

### Database Schema

```sql
-- Expenditure Table
CREATE TABLE expenditures (
    id SERIAL PRIMARY KEY,
    slno VARCHAR(50) UNIQUE NOT NULL,
    item_description TEXT NOT NULL,
    qty DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('payment', 'receipt')),
    labour_name VARCHAR(255) NOT NULL,
    site_name VARCHAR(255) NOT NULL,
    pay_amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints to Create

```
POST   /api/accountant/expenditures      - Create expenditure
GET    /api/accountant/expenditures      - List expenditures
PUT    /api/accountant/expenditures/:id  - Update expenditure
DELETE /api/accountant/expenditures/:id  - Delete expenditure

POST   /api/accountant/payments          - Create payment/receipt
GET    /api/accountant/payments          - List payments/receipts
PUT    /api/accountant/payments/:id      - Update payment/receipt
DELETE /api/accountant/payments/:id      - Delete payment/receipt

GET    /api/accountant/summary           - Get financial summary
```

## Testing

### Test Credentials (To be created in database)
```
Email: accountant@ratalaarchitecture.com
Password: [Set in database]
Role: accountant
```

### Test Scenarios
1. Login with accountant credentials → Should redirect to `/accountant`
2. Login with admin credentials → Should redirect to `/admin`
3. Access `/accountant` without login → Should redirect to `/login`
4. Access `/accountant` with admin role → Should redirect to `/`
5. Add expenditure entry → Should appear in table
6. Edit expenditure → Should update values
7. Delete expenditure → Should remove from table
8. Add payment/receipt → Should appear with correct color coding
9. Check financial summary → Should show correct totals
10. Mobile navigation → Sidebar should collapse/expand

## Color Scheme

- **Primary**: Cyan (#06b6d4) to Blue (#2563eb) gradient
- **Expenditure**: Red tones (#ef4444)
- **Payments**: Orange tones (#f97316)
- **Receipts**: Green tones (#10b981)
- **Net Balance**: Blue (positive) / Red (negative)

## Dependencies

All dependencies are already included in the main project:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- React Icons (Feather Icons)
- Framer Motion (for animations)

## File Structure

```
frontend/app/accountant/
├── page.tsx       # Main accountant dashboard
└── layout.tsx     # Layout wrapper
```

## Notes

- All data is currently dummy/mock data
- No database connection as per requirements
- Ready for database integration when needed
- Fully responsive and mobile-friendly
- Follows the same design system as admin panel
- Role-based routing implemented in login page
