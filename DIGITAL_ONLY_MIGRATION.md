# Digital-Only Platform Migration Plan

## Overview
Convert ReadAgain from a hybrid (ebook + physical) platform to a pure digital ebook platform.

---

## Backend Changes

### 1. Database Models
- Remove `format` field from Book model (default to ebook)
- Remove `shipping_address` fields from Order model
- Remove `shipping_method` and `shipping_cost` from Order model
- Remove ShippingZone model
- Remove ShippingMethod model
- Remove ShippingRate model
- Delete shipping-related migration files

### 2. API Endpoints
- Remove `/admin/shipping` routes
- Remove shipping zone endpoints
- Remove shipping method endpoints
- Remove shipping calculation logic from checkout
- Update book creation/update to not accept format field
- Simplify order creation (no shipping data)

### 3. Services
- Remove ShippingService
- Update OrderService to remove shipping logic
- Update CheckoutService to remove shipping calculations
- Update BookService to remove format filtering

### 4. Handlers
- Delete ShippingHandler
- Update BookHandler to remove format field
- Update OrderHandler to remove shipping status updates
- Update CheckoutHandler to remove shipping initialization

---

## Frontend Changes

### 1. Admin Panel

#### Book Management
- Remove format selection from BookAddModal
- Remove format selection from BookEditModal
- Remove format filter from BookFilters
- Remove format column from BookTable
- Remove format badge from book cards

#### Order Management
- Remove shipping address display
- Remove shipping method display
- Remove shipping cost display
- Remove shipping status updates
- Simplify order details modal

#### Shipping Management
- Delete ShippingManagement component
- Delete ShippingZoneModal component
- Delete ShippingMethodModal component
- Remove shipping route from admin routes
- Remove shipping menu item from AdminLayout sidebar

#### Settings
- Remove shipping settings section
- Remove shipping gateway configuration

### 2. User-Facing Pages

#### Cart Page
- Remove mixed cart warnings (ebook + physical)
- Remove format badges on cart items
- Remove shipping cost calculation
- Simplify cart summary (no shipping)

#### Checkout Page
- Remove shipping address form
- Remove shipping method selection
- Remove shipping cost display
- Simplify to: cart items + payment only

#### Order Confirmation
- Remove shipping address display
- Remove shipping method display
- Remove tracking information section
- Show only digital delivery info

#### Book Pages
- Remove format selection/display
- Remove physical availability indicators
- Remove "Add to Cart" format options
- Simplify to single "Buy Now" for ebook

#### User Dashboard
- Remove shipping address management
- Simplify order history (no shipping status)
- Remove physical book delivery tracking

### 3. Components

#### Delete Components
- ShippingManagement.jsx
- ShippingZoneModal.jsx
- ShippingMethodModal.jsx
- Any shipping-related form components

#### Update Components
- BookCard - remove format badge
- PublicBookCard - remove format display
- OrderCard - remove shipping info
- OrderDetailsModal - remove shipping section
- CheckoutFlow - simplify to payment only

### 4. Hooks
- Remove useShipping hook (if exists)
- Update useCart to remove format logic
- Update useCheckout to remove shipping logic
- Update useOrders to remove shipping data

### 5. Context
- Update CartContext to remove format tracking
- Remove isEbookOnly, isPhysicalOnly, isMixedCart functions
- Simplify cart calculations (no shipping)

---

## Database Migration

### Steps
1. Backup current database
2. Remove shipping-related tables
3. Remove format column from books table
4. Remove shipping columns from orders table
5. Update existing books to ebook format
6. Clean up orphaned shipping data

---

## Configuration Changes

### Environment Variables
- Remove shipping gateway configs
- Remove shipping calculation settings

### Docker Compose
- No changes needed (database structure only)

---

## Testing Checklist

### Backend
- Book creation without format field
- Order creation without shipping
- Checkout flow without shipping
- API endpoints return correct data

### Frontend
- Add book modal works without format
- Cart displays correctly
- Checkout completes without shipping
- Orders display correctly
- Admin book management works
- No shipping menu in admin

---

## Deployment Steps

1. Run database migration
2. Deploy backend changes
3. Deploy frontend changes
4. Verify all ebook purchases work
5. Remove shipping documentation
6. Update user guides

---

## Rollback Plan

If issues occur:
1. Restore database backup
2. Revert backend deployment
3. Revert frontend deployment
4. Restore shipping functionality

---

## Timeline Estimate

- Backend changes: 2-3 hours
- Frontend changes: 3-4 hours
- Testing: 1-2 hours
- Total: 6-9 hours

---

## Notes

- All existing physical book orders should be fulfilled before migration
- Notify users about platform change
- Update terms of service
- Update about page to reflect digital-only focus
- Consider refund policy for pending physical orders
