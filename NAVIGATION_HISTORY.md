# Navigation History System

## Overview
The navigation history system provides contextual back navigation between different dashboard modules. When users navigate from one module (e.g., Orders) to another (e.g., Customers), a "Go back to [previous module]" button appears in the top helper bar.

## How It Works

### 1. Navigation Tracking
- The system automatically tracks when users move between different dashboard modules
- It only tracks module-level navigation, not page-level navigation within the same module
- For example: Orders → Customers is tracked, but Orders → Order Details is not

### 2. Module Detection
The system recognizes these dashboard modules:
- Orders (`/dashboard/orders`)
- Customers (`/dashboard/customers`) 
- Emails (`/dashboard/emails`)
- Payments (`/dashboard/payments`)
- Analytics (`/dashboard/analytics`)
- Documents (`/dashboard/documents`)
- Inventory (`/dashboard/inventory`)
- Marketing (`/dashboard/marketing`)
- Products (`/dashboard/products`)
- Reports (`/dashboard/reports`)
- Stock Movements (`/dashboard/stock-movements`)
- Stores (`/dashboard/stores`)
- Home (`/dashboard/home`)

### 3. Back Button Display
- The back button appears in the black helper bar at the top of the screen
- It shows the previous module name and icon
- Example: "← Go back to Orders"
- The button only appears when there's a valid previous module to go back to

## Components

### NavigationHistoryContext
- Tracks navigation history and current/previous modules
- Provides functions for back navigation
- Automatically detects module changes via URL pathname

### NavigationBackButton
- Displays the back button in the helper bar
- Shows module icon and "Go back to [module]" text
- Handles click events to navigate back

### Integration
- Added to `DashboardLayout` component in the helper bar area
- Wrapped around the entire dashboard via `NavigationHistoryProvider`

## Usage Examples

### Scenario 1: Orders → Customer
1. User is viewing Orders list
2. User clicks on a customer link in an order
3. User navigates to Customer details page
4. Helper bar shows: "← Go back to Orders"
5. Clicking the button returns to Orders list

### Scenario 2: Customer → Email → Orders
1. User is viewing Customer details
2. User clicks on an email link
3. User navigates to Email details page
4. Helper bar shows: "← Go back to Customers"
5. User clicks on an order link from the email
6. User navigates to Order details page
7. Helper bar shows: "← Go back to Emails"

## Technical Details

### State Management
- Uses React Context for state management
- Tracks last 5 modules in history for performance
- Automatically cleans up old history entries

### Navigation Method
- Uses Next.js `router.push()` for navigation
- Maintains browser history properly
- Works with browser back/forward buttons

### Performance
- Only re-renders when module changes occur
- Minimal state updates for same-module navigation
- Efficient module detection via URL parsing

## Debugging
The system includes console logging (in development) to help debug navigation issues:
- Module detection events
- History updates
- Back button state changes

## Future Enhancements
- Breadcrumb trail for complex navigation paths
- Module-specific back actions
- Keyboard shortcuts for back navigation
- Analytics tracking of navigation patterns 