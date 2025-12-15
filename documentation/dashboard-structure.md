# Dashboard Structure & Architecture Guide

## 🎯 What This Dashboard Is

Think of this dashboard as a **modular admin system** built like LEGO blocks. Each section (Orders, Customers, Products, etc.) follows the exact same pattern, making it super easy to understand once you learn the basics.

### The Big Picture (In Plain English)

Imagine you're building a restaurant menu system:
- **The Menu (App Layer)**: Lists what's available - just the table of contents
- **The Kitchen (Route Layer)**: Takes orders and plates everything nicely with garnish
- **The Chef (Component Layer)**: Does the actual cooking and knows all the recipes

Your dashboard works the same way:
1. **App Layer** says "Here's the Orders page"
2. **Route Layer** arranges the page with header, buttons, and table
3. **Component Layer** fetches data from the server and displays it

### Why This Pattern Is Powerful

- ✅ **Consistent**: Every module looks and feels the same
- ✅ **Reusable**: Copy a module, change the data source, done!
- ✅ **Maintainable**: Fix something once, it works everywhere
- ✅ **Scalable**: Adding new sections takes minutes, not hours

---

## 🏗️ Architecture Overview

### The Three-Layer Pattern

Every dashboard module follows this exact structure:

```
📁 app/dashboard/[module]/
   └── page.jsx                          [LAYER 1: Next.js Routing]
        ↓
📁 routes/Dashboard/[Module]/
   └── main.jsx                          [LAYER 2: Page Layout]
        ↓
📁 components/dashboard/[module]/
   └── [Module]Table.jsx                 [LAYER 3: Data & Display]
```

**Real Example (Orders Module):**

```
app/dashboard/orders/page.jsx
   → Imports the Orders component
   → Sets page metadata (title, description)
   
routes/Dashboard/Orders/main.jsx
   → Arranges the page layout
   → Adds header with title and actions
   → Includes the OrdersTable component
   
components/dashboard/orders/OrdersTable.jsx
   → Fetches order data from API
   → Defines table columns
   → Handles sorting, filtering, search
   → Renders the data table
```

---

## 🎨 Core Components (The Building Blocks)

### 1. PageContainer
**What it does:** Wraps your entire page content with consistent spacing and responsive width.

```jsx
<PageContainer>
  {/* Your page content here */}
</PageContainer>
```

**When to use:** Every single page in the dashboard. Always.

---

### 2. DashboardHeader
**What it does:** Shows the page title, icon, and action buttons at the top of every page.

```jsx
<DashboardHeader
  title="Orders"
  icon={<TbTicket size={24} />}
  actions={
    <Button onClick={handleNewOrder}>
      Create Order
    </Button>
  }
/>
```

**Features:**
- Page title with icon
- Action buttons (right side)
- Optional breadcrumb navigation
- Optional subtitle/badges
- Automatically updates browser tab title

---

### 3. NeviosEnhancedTable
**What it does:** The powerhouse table component that handles everything: data display, pagination, sorting, filtering, and search.

```jsx
<NeviosEnhancedTable
  columns={columnDefinitions}
  data={data}
  loading={loading}
  error={error}
  totalCount={totalCount}
  pagination={pagination}
  onPaginationChange={handlePaginationChange}
  sortModel={sortModel}
  onSortChange={handleSortChange}
  enableSearch={true}
  searchTerm={searchTerm}
  onSearchChange={updateSearch}
  enableFilters={true}
  filterConfigs={ORDERS_FILTER_CONFIG}
  activeFilters={filters}
  onFiltersChange={updateFilters}
/>
```

**Key Features:**
- ✅ Server-side pagination (50 items per page)
- ✅ Column sorting
- ✅ Advanced filtering
- ✅ Real-time search with debouncing
- ✅ Row selection with checkboxes
- ✅ Bulk actions
- ✅ Loading/error/empty states
- ✅ Sticky footer
- ✅ Responsive design

---

### 4. NeviosFormPaper
**What it does:** A paper/card component for forms with consistent styling.

```jsx
<NeviosFormPaper 
  title="Customer Information"
  icon={<TbUser />}
  description="Enter customer details below"
>
  {/* Form fields here */}
</NeviosFormPaper>
```

**When to use:** Create/Edit pages, any form section.

---

### 5. NeviosTwoColumnFormContainer
**What it does:** Creates a responsive two-column layout (main content + sidebar).

```jsx
<NeviosTwoColumnFormContainer
  mainContent={
    <>
      <NeviosFormPaper title="Products">...</NeviosFormPaper>
      <NeviosFormPaper title="Pricing">...</NeviosFormPaper>
    </>
  }
  sideContent={
    <>
      <NeviosFormPaper title="Notes">...</NeviosFormPaper>
      <NeviosFormPaper title="Customer">...</NeviosFormPaper>
    </>
  }
  footerContent={
    <Button variant="contained">Create Order</Button>
  }
/>
```

**Layout:**
- Desktop: 65% main / 35% sidebar
- Mobile: Single column (stacks vertically)

---

## 🔄 Data Flow (How Data Moves Through The System)

### The useModuleQuery Hook (Your Best Friend)

This is the **magic hook** that handles all data fetching, pagination, sorting, filtering, and search.

**Location:** `/src/hooks/useModuleQuery.js`

**How to use it:**

```jsx
const {
  data,              // The actual data to display
  loading,           // Is data loading?
  error,             // Any errors?
  totalCount,        // Total records (for pagination)
  pagination,        // Current page info
  sortModel,         // Current sort settings
  filters,           // Active filters
  searchTerm,        // Current search query
  handlePaginationChange,
  handleSortChange,
  updateFilters,
  updateSearch,
  refreshData        // Manually refresh
} = useModuleQuery('order', {
  expand: ["customer", "shipping_method", "items"],
  initialFilters: {},
  initialSearch: "",
  enableSearch: true,
  transformData: transformOrderData
});
```

**Parameters:**

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `module` | string | Module name (e.g., 'order', 'customer') | ✅ Yes |
| `expand` | array | Related data to include | ❌ No |
| `initialFilters` | object | Starting filters | ❌ No |
| `initialSearch` | string | Starting search term | ❌ No |
| `enableSearch` | boolean | Enable search feature | ❌ No |
| `transformData` | function | Transform API data | ❌ No |

**What it returns:**

| Return Value | Description |
|--------------|-------------|
| `data` | Transformed array of records |
| `loading` | Boolean loading state |
| `error` | Error message (if any) |
| `totalCount` | Total number of records |
| `pagination` | `{ page: 0, pageSize: 50 }` |
| `sortModel` | Array of sort objects |
| `filters` | Current filter object |
| `searchTerm` | Current search string |
| `handlePaginationChange` | Function to change page |
| `handleSortChange` | Function to change sort |
| `updateFilters` | Function to update filters |
| `updateSearch` | Function to update search |
| `refreshData` | Function to manually refresh |

### The Data Transformation Pattern

**Why transform data?** The API returns raw data that might not match what your table needs.

**Example:**

```jsx
const transformOrderData = useCallback((orders) => {
  return orders.map(order => ({
    // Transform to match table columns
    id: order.id,
    order_name: order.name,
    order_date: order.created_at,
    customer_name: order.customer?.full_name || 'Unknown',
    total: {
      currency: order.local_currency,
      amount: order.total_amount || 0
    },
    fulfillment_status: order.fulfillment_status,
    payment_status: order.payment_status,
    
    // Keep original data for reference
    _original: order
  }));
}, []);
```

**Best Practice:** Always keep `_original` so you can access any field later.

---

## 📊 Table Column Definitions

### Column Factory Functions

These are helper functions that create column definitions with sensible defaults.

**Location:** `/src/components/ColumnDefinitions.jsx`

#### Available Factories:

**1. genericColumnFactory()**
```jsx
genericColumnFactory({
  field: "customer_name",
  headerName: "Customer",
  minWidth: 180,
  flex: 2
})
```

**2. clickableColumnFactory()**
```jsx
clickableColumnFactory({
  field: "order_name",
  headerName: "Order ID",
  minWidth: 150,
  link: (params) => `/dashboard/orders/${params.id}`
})
```
- Makes column clickable
- Navigates to specified route
- Shows pointer cursor on hover

**3. dateColumnFactory()**
```jsx
dateColumnFactory({
  field: "order_date",
  headerName: "Date",
  minWidth: 180
})
```
- Auto-formats dates
- Consistent date display

**4. currencyColumnFactory()**
```jsx
currencyColumnFactory({
  field: "total",
  headerName: "Total",
  minWidth: 120
})
```
- Formats currency values
- Adds currency symbol

**5. numericColumnFactory()**
```jsx
numericColumnFactory({
  field: "quantity",
  headerName: "Qty",
  minWidth: 80
})
```
- Right-aligns numbers
- Number type validation

**6. idColumnFactory()**
```jsx
idColumnFactory({
  field: "id",
  headerName: "ID"
})
```
- Shows ID with copy button
- Click to copy to clipboard

### Custom Cell Rendering

For special cases (badges, custom formatting):

```jsx
genericColumnFactory({
  field: "payment_status",
  headerName: "Payment",
  renderCell: (params) => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <PaymentStatusBadge status={params.value} />
    </Box>
  )
})
```

---

## 📝 Complete Module Example: Orders

Let's walk through the **complete Orders module** to see how everything connects.

### Step 1: App Layer (Routing)
**File:** `app/dashboard/orders/page.jsx`

```jsx
import { Orders } from '../../../routes/Dashboard/Orders/main';

export default function Page() {
    return <Orders />;
}

export const metadata = {
    title: 'Orders • Vasky | Nevios',
};
```

**Purpose:** 
- Define the Next.js route
- Set page metadata
- Import and render the actual component

---

### Step 2: Route Layer (Layout)
**File:** `routes/Dashboard/Orders/main.jsx`

```jsx
"use client";
import React from "react";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { OrdersTable } from "../../../components/dashboard/orders/OrdersTable";
import { PageContainer } from "../../../components/PageContainer";
import { TbTicket } from "react-icons/tb";

export default function DashboardOrders() {
  return (
    <PageContainer>
      <DashboardHeader
        title="Orders"
        icon={<TbTicket size={24} />}
      />
      <OrdersTable tableHeight="100%" allowCheckboxSelection />
    </PageContainer>
  );
}

export const Orders = DashboardOrders;
```

**Purpose:**
- Compose the page layout
- Add header with title/icon
- Include the data table
- Wrap in PageContainer

---

### Step 3: Component Layer (Data & Table)
**File:** `components/dashboard/orders/OrdersTable.jsx`

```jsx
"use client";
import React, { useCallback } from "react";
import { Box } from "@mui/material";
import {
  currencyColumnFactory,
  dateColumnFactory,
  genericColumnFactory,
  clickableColumnFactory
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
import { FulfillmentStatusBadge } from "./FulfillmentStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { ORDERS_FILTER_CONFIG } from "../../nevios/NeviosFilters/OrdersFilterConfig";

export function OrdersTable({ tableHeight }) {
  // 1. Transform raw API data to table format
  const transformOrderData = useCallback((orders) => {
    return orders.map(order => ({
      id: order.id,
      order_name: order.name,
      order_date: order.created_at,
      customer_name: order.customer?.full_name || 'Unknown Customer',
      total: {
        currency: order.local_currency,
        amount: order.total_amount || 0
      },
      fulfillment_status: order.fulfillment_status,
      payment_status: order.payment_status,
      item_count: order.items?.length || 0,
      shipping_method: order.shipping_method?.name || 'Not specified',
      payment_method: order.payment_method?.name || 'Not specified',
      _original: order // Keep original data
    }));
  }, []);

  // 2. Fetch data using the module query hook
  const {
    data,
    loading,
    error,
    totalCount,
    pagination,
    sortModel,
    filters,
    searchTerm,
    handlePaginationChange,
    handleSortChange,
    updateFilters,
    updateSearch
  } = useModuleQuery('order', {
    expand: ["customer", "shipping_method", "items"],
    enableSearch: true,
    transformData: transformOrderData
  });

  // 3. Define table columns
  const columnDefinitions = [
    clickableColumnFactory({
      field: "order_name",
      headerName: "Order ID",
      minWidth: 150,
      link: (params) => `/dashboard/orders/${params.id}`
    }),
    dateColumnFactory({
      field: "order_date",
      headerName: "Date",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ fontSize: "s", color: "gray.600" }}>
          {formatReadableDatetime(params.value)}
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "customer_name",
      headerName: "Customer",
      minWidth: 180,
      flex: 2,
    }),
    currencyColumnFactory({
      field: "total",
      headerName: "Total",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <Box>
          {params.value.currency} {formatCurrencyNumber(params.value.amount)}
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "fulfillment_status",
      headerName: "Fulfillment",
      flex: 1.5,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FulfillmentStatusBadge status={params.value} />
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "payment_status",
      headerName: "Payment",
      flex: 1.5,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PaymentStatusBadge status={params.value} />
        </Box>
      ),
    }),
  ];

  // 4. Render the table
  return (
    <Box sx={{ flex: 1, display: "flex", height: "100%", width: "100%" }}>
      <NeviosEnhancedTable
        columns={columnDefinitions}
        data={data}
        loading={loading}
        error={error}
        totalCount={totalCount}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        sortModel={sortModel}
        onSortChange={handleSortChange}
        tableHeight={tableHeight}
        enableFilters={true}
        filterConfigs={ORDERS_FILTER_CONFIG}
        activeFilters={filters}
        onFiltersChange={updateFilters}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={updateSearch}
        searchPlaceholder="Search orders by customer, order ID, or details..."
        emptyStateProps={{
          title: 'No orders found',
          description: 'There are no orders to display',
        }}
      />
    </Box>
  );
}
```

**Purpose:**
- Fetch data from API
- Transform data to match table needs
- Define column structure
- Render the table with all features

---

## 🚀 How to Create a New Module

Let's say you want to add an **Invoices** module. Here's the step-by-step process:

### Step 1: Create the File Structure

```bash
# App layer
app/dashboard/invoices/page.jsx

# Route layer
routes/Dashboard/Invoices/main.jsx

# Component layer
components/dashboard/invoices/InvoicesTable.jsx
```

### Step 2: App Layer (`app/dashboard/invoices/page.jsx`)

```jsx
import { Invoices } from '../../../routes/Dashboard/Invoices/main';

export default function Page() {
    return <Invoices />;
}

export const metadata = {
    title: 'Invoices • Vasky | Nevios',
};
```

### Step 3: Route Layer (`routes/Dashboard/Invoices/main.jsx`)

```jsx
"use client";
import React from "react";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { InvoicesTable } from "../../../components/dashboard/invoices/InvoicesTable";
import { PageContainer } from "../../../components/PageContainer";
import { TbReceipt } from "react-icons/tb";
import { NeviosPrimaryButton } from "../../../components/nevios/NeviosButtons";
import { useRouter } from "next/navigation";

export default function DashboardInvoices() {
  const router = useRouter();

  return (
    <PageContainer>
      <DashboardHeader
        title="Invoices"
        icon={<TbReceipt size={24} />}
        actions={
          <NeviosPrimaryButton 
            size="small"
            onClick={() => router.push("/dashboard/invoices/create")}
          >
            Create Invoice
          </NeviosPrimaryButton>
        }
      />
      <InvoicesTable tableHeight="100%" />
    </PageContainer>
  );
}

export const Invoices = DashboardInvoices;
```

### Step 4: Component Layer (`components/dashboard/invoices/InvoicesTable.jsx`)

```jsx
"use client";
import React, { useCallback } from "react";
import { Box } from "@mui/material";
import {
  clickableColumnFactory,
  dateColumnFactory,
  genericColumnFactory,
  currencyColumnFactory
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { useModuleQuery } from "../../../hooks/useModuleQuery";

export function InvoicesTable({ tableHeight }) {
  // Transform data
  const transformInvoiceData = useCallback((invoices) => {
    return invoices.map(invoice => ({
      id: invoice.id,
      invoice_number: invoice.number,
      customer_name: invoice.customer?.full_name || 'Unknown',
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      total: {
        currency: invoice.currency,
        amount: invoice.total_amount
      },
      status: invoice.status,
      _original: invoice
    }));
  }, []);

  // Fetch data
  const {
    data,
    loading,
    error,
    totalCount,
    pagination,
    sortModel,
    filters,
    searchTerm,
    handlePaginationChange,
    handleSortChange,
    updateFilters,
    updateSearch
  } = useModuleQuery('invoice', {
    expand: ["customer"],
    enableSearch: true,
    transformData: transformInvoiceData
  });

  // Define columns
  const columnDefinitions = [
    clickableColumnFactory({
      field: "invoice_number",
      headerName: "Invoice #",
      minWidth: 150,
      link: (params) => `/dashboard/invoices/${params.id}`
    }),
    genericColumnFactory({
      field: "customer_name",
      headerName: "Customer",
      minWidth: 180,
      flex: 2
    }),
    dateColumnFactory({
      field: "issue_date",
      headerName: "Issue Date",
      minWidth: 140
    }),
    dateColumnFactory({
      field: "due_date",
      headerName: "Due Date",
      minWidth: 140
    }),
    currencyColumnFactory({
      field: "total",
      headerName: "Amount",
      minWidth: 120
    }),
    genericColumnFactory({
      field: "status",
      headerName: "Status",
      minWidth: 120
    })
  ];

  // Render table
  return (
    <Box sx={{ flex: 1, display: "flex", height: "100%" }}>
      <NeviosEnhancedTable
        columns={columnDefinitions}
        data={data}
        loading={loading}
        error={error}
        totalCount={totalCount}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        sortModel={sortModel}
        onSortChange={handleSortChange}
        tableHeight={tableHeight}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={updateSearch}
        searchPlaceholder="Search invoices..."
        emptyStateProps={{
          title: 'No invoices found',
          description: 'There are no invoices to display'
        }}
      />
    </Box>
  );
}
```

### Step 5: Add to Sidebar (`components/Sidebar.jsx`)

```jsx
<SidebarItem
  href="/dashboard/invoices"
  title="Invoices"
  icon={<TbReceipt size={18} />}
/>
```

### Step 6: Done! 🎉

Your new module is ready and follows the exact same pattern as all other modules.

---

## 📋 Form Pages (Create/Edit Pattern)

### Layout Structure

Form pages use a different component: `NeviosTwoColumnFormContainer`

**Example:** Create Order page

```jsx
<PageContainer customSx={{ maxWidth: "950px" }}>
  <DashboardHeader
    title="New Order"
    icon={<TbTicket size={24} />}
    actions={
      <Button 
        variant="outlined"
        onClick={() => router.push("/dashboard/orders")}
      >
        Back to Orders
      </Button>
    }
  />
  
  <NeviosTwoColumnFormContainer
    mainContent={
      <>
        <NeviosFormPaper title="Products">
          {/* Product selection fields */}
        </NeviosFormPaper>
        
        <NeviosFormPaper title="Pricing">
          {/* Pricing fields */}
        </NeviosFormPaper>
      </>
    }
    
    sideContent={
      <>
        <NeviosFormPaper 
          title="Notes" 
          icon={<TbPencil />}
          description="Private notes (not shared with customer)"
        >
          {/* Notes textarea */}
        </NeviosFormPaper>
        
        <NeviosFormPaper title="Customer">
          <NeviosSimpleSearch 
            placeholder="Search customers"
            onSearch={setSearchQuery}
            onResultSelect={handleSelectCustomer}
          />
        </NeviosFormPaper>
      </>
    }
    
    footerContent={
      <Button variant="contained" color="primary">
        Create Order
      </Button>
    }
  />
</PageContainer>
```

### Form Paper Props

```jsx
<NeviosFormPaper
  title="Section Title"              // Main title
  titleIcon={<TbIcon />}              // Icon next to title
  icon={<TbIcon />}                   // Action icon (top right)
  onClick={handleIconClick}           // Action icon handler
  description="Helper text"           // Gray text under title
  footerDescription="Footer text"     // Text in gray footer
  gap={1.5}                          // Spacing between children
>
  {/* Form content */}
</NeviosFormPaper>
```

---

## 🎨 Design System Rules

### Spacing

| Element | Spacing |
|---------|---------|
| Between form sections | `gap: 1.5` |
| Page top margin | `mt: 4` |
| Page bottom margin | `mb: { xs: 8, sm: 6 }` |
| Paper padding | `p: 2` |
| Section gaps | `gap: 2` |

### Elevation

| Component | Elevation |
|-----------|-----------|
| Papers | `elevation={2}` |
| Modals | `elevation={8}` |
| Drawers | `elevation={16}` |

### Colors

Status badges use semantic colors:
- Success: `success.main`
- Error: `error.main`
- Warning: `warning.main`
- Info: `info.main`
- Neutral: `gray.500`

### Typography

| Text Type | Variant |
|-----------|---------|
| Page titles | `fontSize: "xl"` |
| Section titles | `variant="paperTitle"` |
| Descriptions | `variant="paperDescription"` |
| Body text | `variant="body2"` |
| Small text | `fontSize: "xs"` |

---

## 🔐 Authentication & Authorization

### Protected Routes

All dashboard routes are wrapped in `RequireAuth`:

```jsx
// app/dashboard/layout.jsx
export default function DashboardPageLayout({ children }) {
  return (
    <RequireAuth>
      <NavigationHistoryProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </NavigationHistoryProvider>
    </RequireAuth>
  );
}
```

### How It Works

1. User lands on dashboard route
2. `RequireAuth` checks authentication status
3. If not authenticated → redirect to `/login`
4. If authenticated → render dashboard

### Getting Current User

```jsx
import { useAuth } from "../context/AuthProvider";

function MyComponent() {
  const { user, signOut } = useAuth();
  
  return <div>Welcome, {user.email}</div>;
}
```

---

## 🌐 API Integration

### Base Configuration

**API URL:** `https://vasky-nevios-express-production.up.railway.app/api`

### Endpoint Pattern

```
POST /api/server/{module}/query
```

**Examples:**
- Orders: `/api/server/order/query`
- Customers: `/api/server/customer/query`
- Products: `/api/server/product/query`

### Request Format

```json
{
  "page": 1,
  "limit": 50,
  "orderBy": "created_at",
  "ascending": false,
  "expand": ["customer", "items"],
  "filters": {
    "status": "PENDING"
  },
  "search": "nike"
}
```

### Response Format

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Order #001", ... },
    { "id": 2, "name": "Order #002", ... }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 50,
    "totalRecords": 250,
    "totalPages": 5
  }
}
```

### Error Handling

The `useModuleQuery` hook automatically handles errors:

```jsx
const { data, loading, error } = useModuleQuery('order');

if (error) {
  // Error is displayed automatically in the table
  // You can also access error message: error.message
}
```

---

## 📱 Responsive Design

### Breakpoints

```jsx
{
  xs: 0,      // Mobile
  sm: 600,    // Tablet
  md: 960,    // Small desktop
  lg: 1280,   // Large desktop
  xl: 1920    // Extra large
}
```

### Responsive Patterns

**Hide on mobile:**
```jsx
sx={{ display: { xs: "none", sm: "block" } }}
```

**Stack on mobile:**
```jsx
sx={{ 
  flexDirection: { xs: "column", sm: "row" } 
}}
```

**Conditional sizing:**
```jsx
sx={{ 
  width: { xs: "100%", sm: "50%" } 
}}
```

### Sidebar Behavior

- **Desktop (sm+):** Fixed sidebar visible
- **Mobile (xs):** Sidebar hidden, use mobile navigation

---

## 🎯 Best Practices & Guidelines

### DO ✅

1. **Always use the three-layer pattern** for new modules
2. **Transform data** in the table component, not in the route
3. **Keep route components simple** - just layout and composition
4. **Use column factories** instead of defining columns manually
5. **Keep `_original` data** in transformations for reference
6. **Use semantic HTML** and ARIA labels for accessibility
7. **Test on mobile** - always check responsive behavior
8. **Follow spacing rules** - use the defined gap/margin values
9. **Reuse existing components** - don't create duplicates
10. **Add proper loading/error states** - users need feedback

### DON'T ❌

1. **Don't fetch data in route components** - use table components
2. **Don't duplicate code** - extract to shared components
3. **Don't hardcode values** - use theme variables and constants
4. **Don't skip error handling** - always handle potential errors
5. **Don't ignore TypeScript/prop types** - maintain type safety
6. **Don't create one-off solutions** - follow established patterns
7. **Don't forget pagination** - always use server-side pagination
8. **Don't skip empty states** - provide helpful empty messages
9. **Don't mix patterns** - be consistent across modules
10. **Don't forget to update sidebar** when adding new modules

---

## 🔧 Common Customizations

### Custom Column Rendering

```jsx
genericColumnFactory({
  field: "status",
  headerName: "Status",
  renderCell: (params) => (
    <Chip 
      label={params.value}
      color={params.value === 'active' ? 'success' : 'default'}
      size="small"
    />
  )
})
```

### Custom Row Styling

```jsx
<NeviosEnhancedTable
  ...
  getRowClassName={(params) => {
    if (params.row.payment_status === "REFUNDED") {
      return "datagrid-row-error";
    }
    return "";
  }}
/>
```

### Custom Empty State

```jsx
emptyStateProps={{
  title: 'No orders yet',
  description: 'Create your first order to get started',
  action: () => router.push('/dashboard/orders/create'),
  buttonText: 'Create First Order'
}}
```

### Conditional Actions

```jsx
<DashboardHeader
  title="Orders"
  actions={
    user?.role === 'admin' && (
      <Button onClick={handleExport}>
        Export All
      </Button>
    )
  }
/>
```

---

## 🐛 Troubleshooting

### Table Not Loading

**Check:**
1. Is the API endpoint correct?
2. Is the module name correct in `useModuleQuery`?
3. Are you returning data in the correct format?
4. Check browser console for errors
5. Check network tab for API response

### Pagination Not Working

**Check:**
1. Is `totalCount` being set correctly?
2. Is `onPaginationChange` connected?
3. Is the API returning `pagination` object?

### Search Not Working

**Check:**
1. Is `enableSearch={true}` set?
2. Is `onSearchChange` connected to `updateSearch`?
3. Is the API endpoint supporting search?
4. Check if search term is being sent in request

### Columns Misaligned

**Check:**
1. Do field names match transformed data keys?
2. Are all columns using factories or all custom?
3. Check for `minWidth` conflicts

### Filters Not Applying

**Check:**
1. Is `filterConfigs` array provided?
2. Is `onFiltersChange` connected to `updateFilters`?
3. Are filter field names matching data keys?

---

## 📚 Quick Reference

### File Locations

```
app/dashboard/[module]/
  ├── page.jsx                 # Next.js route
  ├── create/page.jsx          # Create page
  └── [id]/page.jsx            # Detail/edit page

routes/Dashboard/[Module]/
  ├── main.jsx                 # List view layout
  ├── create.jsx               # Create form layout
  └── view.jsx                 # Detail view layout

components/dashboard/[module]/
  ├── [Module]Table.jsx        # Data table
  ├── [Status]Badge.jsx        # Status badges
  └── [Module]Form.jsx         # Form components

components/nevios/
  ├── NeviosEnhancedTable.jsx  # Main table component
  ├── NeviosFormPaper.jsx      # Form sections
  ├── NeviosFormContainer.jsx  # Form layouts
  ├── NeviosButtons.jsx        # Button components
  └── NeviosFilters/           # Filter configurations

hooks/
  └── useModuleQuery.js        # Data fetching hook
```

### Import Shortcuts

```jsx
// Core components
import { PageContainer } from "@/components/PageContainer";
import { DashboardHeader } from "@/components/DashboardHeader";
import { NeviosEnhancedTable } from "@/components/nevios/NeviosEnhancedTable";
import { NeviosFormPaper } from "@/components/nevios/NeviosFormPaper";
import { NeviosTwoColumnFormContainer } from "@/components/nevios/NeviosFormContainer";

// Data & utilities
import { useModuleQuery } from "@/hooks/useModuleQuery";
import { formatReadableDatetime, formatCurrencyNumber } from "@/core/formatters";

// Column factories
import {
  genericColumnFactory,
  clickableColumnFactory,
  dateColumnFactory,
  currencyColumnFactory
} from "@/components/ColumnDefinitions";

// Navigation
import { useRouter } from "next/navigation";
```

### Common Patterns Cheatsheet

**Simple list page:**
```jsx
PageContainer > DashboardHeader > [Module]Table
```

**List with action:**
```jsx
PageContainer > DashboardHeader(actions) > [Module]Table
```

**Create/Edit page:**
```jsx
PageContainer > DashboardHeader > NeviosTwoColumnFormContainer
```

**Detail view:**
```jsx
PageContainer > DashboardHeader > Custom content sections
```

---

## 🎓 Learning Path

If you're new to this dashboard:

1. **Week 1:** Understand the three layers and data flow
2. **Week 2:** Study the Orders module end-to-end
3. **Week 3:** Create a simple new module (copy Orders pattern)
4. **Week 4:** Customize table columns and filters
5. **Week 5:** Build create/edit forms
6. **Week 6:** Add advanced features (bulk actions, custom badges)

---

## 📞 Getting Help

When asking for help, include:

1. **What module** you're working on
2. **What layer** (app/route/component)
3. **What you expected** to happen
4. **What actually happened**
5. **Error messages** from console
6. **Code snippet** of the relevant section

---

## ✨ Summary

This dashboard is built on **consistent patterns** that make it easy to:
- Add new modules in minutes
- Maintain existing code
- Understand how everything works
- Scale to hundreds of modules

**Remember the golden rule:**  
*If you find yourself writing custom code, check if there's already a component or pattern for it!*

---

**Last Updated:** December 2025  
**Version:** 1.0  
**Maintainer:** Nevios Development Team

