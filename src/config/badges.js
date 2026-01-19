"use client";
import { 
  TbGenderMale, 
  TbGenderFemale, 
  TbGenderNeutrois,
  TbCheck,
  TbEdit,
  TbArchive,
  TbMail,
  TbMailOff,
  TbCreditCard,
  TbCash,
  TbX,
  TbClock,
  TbTruck,
  TbPackage,
  TbCircleCheck,
  TbAlertCircle,
  TbArrowDown,
  TbArrowUp,
  TbFileDescription,
  TbFileBroken,
  TbShoppingCart,
  TbBuildingStore,
  TbTruckDelivery,
  TbBriefcase,
  TbDots,
  TbBuildingCommunity,
  TbTruckLoading,
  TbArrowBack,
  TbAlertTriangle,
  TbMinus,
  TbRefresh,
  TbReceipt,
  TbArrowsExchange,
  TbArrowLoopRight,
  TbMailForward,
  TbMailCheck,
  TbMailOpened,
  TbMailPlus,
  TbMailX,
  TbMailCog,
} from "react-icons/tb";

/**
 * Centralized Badge Configurations
 * 
 * Each config key maps to an object of possible values
 * Each value has: label, color, and optional icon
 */
export const BADGE_CONFIGS = {
  // Gender badges
  gender: {
    MALE: {
      label: "Male",
      color: "blue",
      icon: <TbGenderMale size={14} />
    },
    FEMALE: {
      label: "Female",
      color: "pink",
      icon: <TbGenderFemale size={14} />
    },
    NOT_SPECIFIED: {
      label: "Not Specified",
      color: "gray",
      icon: <TbGenderNeutrois size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray",
      icon: <TbGenderNeutrois size={14} />
    }
  },

  // Product status badges
  productStatus: {
    ACTIVE: {
      label: "Active",
      color: "green",
      icon: <TbCheck size={14} />
    },
    DRAFT: {
      label: "Draft",
      color: "gray",
      icon: <TbEdit size={14} />
    },
    ARCHIVED: {
      label: "Archived",
      color: "gray",
      icon: <TbArchive size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray",
      icon: <TbEdit size={14} />
    }
  },

  // Subscription status badges
  subscribed: {
    true: {
      label: "Subscribed",
      color: "green",
      icon: <TbMail size={14} />
    },
    false: {
      label: "Unsubscribed",
      color: "gray",
      icon: <TbMailOff size={14} />
    },
    SUBSCRIBED: {
      label: "Subscribed",
      color: "green",
      icon: <TbMail size={14} />
    },
    UNSUBSCRIBED: {
      label: "Unsubscribed",
      color: "gray",
      icon: <TbMailOff size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray",
      icon: <TbMailOff size={14} />
    }
  },

  // Account status badges
  accountStatus: {
    true: {
      label: "Active",
      color: "green",
      icon: <TbCheck size={14} />
    },
    false: {
      label: "Disabled",
      color: "red",
      icon: <TbX size={14} />
    },
    ACTIVE: {
      label: "Active",
      color: "green",
      icon: <TbCheck size={14} />
    },
    DISABLED: {
      label: "Disabled",
      color: "red",
      icon: <TbX size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Payment status badges
  paymentStatus: {
    PAID: {
      label: "Paid",
      color: "green",
      icon: <TbCheck size={14} />
    },
    UNPAID: {
      label: "Unpaid",
      color: "red",
      icon: <TbClock size={14} />
    },
    PENDING: {
      label: "Pending",
      color: "yellow",
      icon: <TbClock size={14} />
    },
    REFUNDED: {
      label: "Refunded",
      color: "orange",
      icon: <TbAlertCircle size={14} />
    },
    PARTIALLY_PAID: {
      label: "Partially Paid",
      color: "yellow",
      icon: <TbClock size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Fulfillment status badges
  fulfillmentStatus: {
    FULFILLED: {
      label: "Fulfilled",
      color: "green",
      icon: <TbCircleCheck size={14} />
    },
    UNFULFILLED: {
      label: "Unfulfilled",
      color: "gray",
      icon: <TbPackage size={14} />
    },
    PARTIALLY_FULFILLED: {
      label: "Partially Fulfilled",
      color: "yellow",
      icon: <TbPackage size={14} />
    },
    CANCELLED: {
      label: "Cancelled",
      color: "red",
      icon: <TbX size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Delivery status badges
  deliveryStatus: {
    PENDING: {
      label: "Pending",
      color: "gray",
      icon: <TbClock size={14} />
    },
    IN_TRANSIT: {
      label: "In Transit",
      color: "blue",
      icon: <TbTruck size={14} />
    },
    DELIVERED: {
      label: "Delivered",
      color: "green",
      icon: <TbCircleCheck size={14} />
    },
    FAILED: {
      label: "Failed",
      color: "red",
      icon: <TbX size={14} />
    },
    RETURNED: {
      label: "Returned",
      color: "orange",
      icon: <TbAlertCircle size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Discount type badges
  discountType: {
    PERCENTAGE: {
      label: "Percentage",
      color: "blue"
    },
    FIXED: {
      label: "Fixed Amount",
      color: "green"
    },
    FREE_SHIPPING: {
      label: "Free Shipping",
      color: "yellow"
    },
    VOUCHER: {
      label: "Gift Card",
      color: "orange"
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Discount status badges
  discountStatus: {
    ACTIVE: {
      label: "Active",
      color: "green",
      icon: <TbCheck size={14} />
    },
    RESERVED: {
      label: "Reserved",
      color: "yellow",
      icon: <TbClock size={14} />
    },
    USED: {
      label: "Used",
      color: "red",
      icon: <TbX size={14} />
    },
    INACTIVE: {
      label: "Inactive",
      color: "gray",
      icon: <TbX size={14} />
    },
    EXPIRED: {
      label: "Expired",
      color: "red",
      icon: <TbClock size={14} />
    },
    SCHEDULED: {
      label: "Scheduled",
      color: "blue",
      icon: <TbClock size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Email status badges
  emailStatus: {
    PROCESSING: {
      label: "Processing",
      color: "gray",
      icon: <TbArrowLoopRight size={14} />
    },
    SCHEDULED: {
      label: "Scheduled",
      color: "gray",
      icon: <TbClock size={14} />
    },
    SENT: {
      label: "Sent",
      color: "blue",
      icon: <TbMailForward size={14} />
    },
    DELIVERED: {
      label: "Delivered",
      color: "blue",
      icon: <TbMailCheck size={14} />
    },
    DELIVERY_DELAYED: {
      label: "Delivery Delayed",
      color: "orange",
      icon: <TbClock size={14} />
    },
    COMPLAINED: {
      label: "Complained",
      color: "red",
      icon: <TbMailCog size={14} />
    },
    BOUNCED: {
      label: "Bounced",
      color: "red",
      icon: <TbMailX size={14} />
    },
    OPENED: {
      label: "Opened",
      color: "green",
      icon: <TbMailOpened size={14} />
    },
    CLICKED: {
      label: "Clicked",
      color: "green",
      icon: <TbMailPlus size={14} />
    },
    PENDING: {
      label: "Pending",
      color: "yellow",
      icon: <TbClock size={14} />
    },
    FAILED: {
      label: "Failed",
      color: "red",
      icon: <TbX size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Document status badges
  documentStatus: {
    DRAFT: {
      label: "Draft",
      color: "gray",
      icon: <TbEdit size={14} />
    },
    ISSUED: {
      label: "Issued",
      color: "blue",
      icon: <TbMail size={14} />
    },
    SENT: {
      label: "Sent",
      color: "blue",
      icon: <TbMail size={14} />
    },
    PAID: {
      label: "Paid",
      color: "green",
      icon: <TbCheck size={14} />
    },
    COMPLETED: {
      label: "Completed",
      color: "green",
      icon: <TbCheck size={14} />
    },
    CANCELLED: {
      label: "Cancelled",
      color: "red",
      icon: <TbX size={14} />
    },
    OVERDUE: {
      label: "Overdue",
      color: "red",
      icon: <TbAlertCircle size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Document type badges
  documentType: {
    INVOICE: {
      label: "Invoice",
      color: "blue",
      icon: <TbFileDescription size={14} />
    },
    DEPOSIT_INVOICE: {
      label: "Deposit Invoice",
      color: "orange",
      icon: <TbFileBroken size={14} />
    },
    QUOTE: {
      label: "Quote",
      color: "gray"
    },
    RECEIPT: {
      label: "Receipt",
      color: "green"
    },
    CREDIT_NOTE: {
      label: "Credit Note",
      color: "orange"
    },
    PROFORMA: {
      label: "Proforma",
      color: "yellow"
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Transaction type badges
  transactionType: {
    INCOMING: {
      label: "Incoming",
      color: "green",
      icon: <TbArrowDown size={14} />
    },
    OUTGOING: {
      label: "Outgoing",
      color: "red",
      icon: <TbArrowUp size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Sales channel type badges
  salesChannelType: {
    SHOPIFY: {
      label: "Shopify",
      color: "green",
      icon: <TbShoppingCart size={14} />
    },
    RETAIL: {
      label: "Retail",
      color: "blue",
      icon: <TbBuildingStore size={14} />
    },
    WHOLESALE: {
      label: "Wholesale",
      color: "purple",
      icon: <TbTruckDelivery size={14} />
    },
    B2B: {
      label: "B2B",
      color: "orange",
      icon: <TbBriefcase size={14} />
    },
    OTHER: {
      label: "Other",
      color: "gray",
      icon: <TbDots size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray",
      icon: <TbDots size={14} />
    }
  },

  // Location status badges
  locationStatus: {
    true: {
      label: "Active",
      color: "green",
      icon: <TbCheck size={14} />
    },
    false: {
      label: "Inactive",
      color: "gray",
      icon: <TbX size={14} />
    },
    ACTIVE: {
      label: "Active",
      color: "green",
      icon: <TbCheck size={14} />
    },
    INACTIVE: {
      label: "Inactive",
      color: "gray",
      icon: <TbX size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Account status badges (customer registration)
  customerAccountStatus: {
    true: {
      label: "Registered",
      color: "green",
      icon: <TbCheck size={14} />
    },
    false: {
      label: "Not Registered",
      color: "gray",
      icon: <TbX size={14} />
    },
    ENABLED: {
      label: "Registered",
      color: "green",
      icon: <TbCheck size={14} />
    },
    DISABLED: {
      label: "Not Registered",
      color: "gray",
      icon: <TbX size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "red",
      icon: <TbX size={14} />
    }
  },

  // Company badge (just displays company name with icon)
  company: {
    // This is a special badge that just displays the value with an icon
    DEFAULT: {
      label: "",
      color: "blue",
      icon: <TbBuildingCommunity size={14} />
    }
  },

  // Reconciliation status badges
  reconciliationStatus: {
    EXACT_MATCH: {
      label: "Exact Match",
      color: "green",
      icon: <TbCheck size={14} />
    },
    OVERPAID: {
      label: "Overpaid",
      color: "blue",
      icon: <TbArrowUp size={14} />
    },
    UNDERPAID: {
      label: "Underpaid",
      color: "orange",
      icon: <TbAlertTriangle size={14} />
    },
    UNRECONCILED: {
      label: "Unreconciled",
      color: "gray",
      icon: <TbMinus size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Transaction category badges
  transactionCategory: {
    PAYMENT: {
      label: "Payment",
      color: "blue",
      icon: <TbCash size={14} />
    },
    REFUND: {
      label: "Refund",
      color: "orange",
      icon: <TbRefresh size={14} />
    },
    FEE: {
      label: "Fee",
      color: "red",
      icon: <TbReceipt size={14} />
    },
    TRANSFER: {
      label: "Transfer",
      color: "purple",
      icon: <TbArrowsExchange size={14} />
    },
    OTHER: {
      label: "Other",
      color: "gray",
      icon: <TbDots size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Order fulfillment status badges (orders module - different from fulfillments module)
  orderFulfillmentStatus: {
    UNFULFILLED: {
      label: "Unfulfilled",
      color: "gray",
      icon: <TbPackage size={14} />
    },
    PARTIALLY_FULFILLED: {
      label: "Partially Fulfilled",
      color: "yellow",
      icon: <TbTruckDelivery size={14} />
    },
    FULFILLED: {
      label: "Fulfilled",
      color: "blue",
      icon: <TbTruckLoading size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Fulfillment module status badges (different from orders)
  fulfillmentModuleStatus: {
    UNFULFILLED: {
      label: "Unfulfilled",
      color: "gray",
      icon: <TbPackage size={14} />
    },
    FULFILLED: {
      label: "Fulfilled",
      color: "green",
      icon: <TbTruckLoading size={14} />
    },
    CANCELLED: {
      label: "Cancelled",
      color: "red",
      icon: <TbX size={14} />
    },
    PARTIAL: {
      label: "Partial",
      color: "yellow",
      icon: <TbTruckDelivery size={14} />
    },
    PENDING: {
      label: "Pending",
      color: "blue",
      icon: <TbClock size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // General status badge (for generic statuses)
  generalStatus: {
    processed: {
      label: "Processed",
      color: "green"
    },
    possible_fraud: {
      label: "Possible Fraud",
      color: "yellow"
    },
    processing: {
      label: "Processing...",
      color: "blue"
    },
    failed: {
      label: "Failed",
      color: "red"
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Inventory movement type badges
  movementType: {
    SALE: {
      label: "Sale",
      color: "green",
      icon: <TbShoppingCart size={14} />
    },
    RETURN: {
      label: "Return",
      color: "blue",
      icon: <TbArrowBack size={14} />
    },
    ADJUSTMENT: {
      label: "Adjustment",
      color: "yellow",
      icon: <TbEdit size={14} />
    },
    TRANSFER: {
      label: "Transfer",
      color: "purple",
      icon: <TbArrowsExchange size={14} />
    },
    RESTOCK: {
      label: "Restock",
      color: "green",
      icon: <TbPackage size={14} />
    },
    DAMAGE: {
      label: "Damage",
      color: "red",
      icon: <TbAlertCircle size={14} />
    },
    LOSS: {
      label: "Loss",
      color: "red",
      icon: <TbX size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Backorder status badges
  backorderStatus: {
    PENDING: {
      label: "Pending",
      color: "yellow",
      icon: <TbClock size={14} />
    },
    PARTIAL: {
      label: "Partial",
      color: "blue",
      icon: <TbPackage size={14} />
    },
    NOTIFIED: {
      label: "Notified",
      color: "orange",
      icon: <TbMail size={14} />
    },
    FULFILLED: {
      label: "Fulfilled",
      color: "green",
      icon: <TbCheck size={14} />
    },
    CANCELLED: {
      label: "Cancelled",
      color: "red",
      icon: <TbX size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Order status badges (order lifecycle status)
  orderStatus: {
    ACTIVE: {
      label: "Active",
      color: "green",
      icon: <TbCircleCheck size={14} />
    },
    HOLD: {
      label: "Hold",
      color: "yellow",
      icon: <TbClock size={14} />
    },
    ARCHIVED: {
      label: "Archived",
      color: "gray",
      icon: <TbArchive size={14} />
    },
    CANCELLED: {
      label: "Cancelled",
      color: "red",
      icon: <TbX size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Order inventory status badges (stock availability for order)
  inventoryStatus: {
    PENDING: {
      label: "Pending",
      color: "gray",
      icon: <TbClock size={14} />
    },
    AVAILABLE: {
      label: "Available",
      color: "green",
      icon: <TbCircleCheck size={14} />
    },
    PARTIAL: {
      label: "Partial",
      color: "yellow",
      icon: <TbAlertTriangle size={14} />
    },
    BACKORDERED: {
      label: "Backordered",
      color: "orange",
      icon: <TbPackage size={14} />
    },
    ERROR: {
      label: "Error",
      color: "red",
      icon: <TbAlertCircle size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Auto-fulfill status badges (enabled/disabled)
  autoFulfill: {
    true: {
      label: "Enabled",
      color: "green",
      icon: <TbCheck size={14} />
    },
    false: {
      label: "Disabled",
      color: "gray",
      icon: <TbX size={14} />
    },
    ENABLED: {
      label: "Enabled",
      color: "green",
      icon: <TbCheck size={14} />
    },
    DISABLED: {
      label: "Disabled",
      color: "gray",
      icon: <TbX size={14} />
    }
  },

  // Inventory operation status badges
  inventoryOperationStatus: {
    DRAFT: {
      label: "Draft",
      color: "gray",
      icon: <TbEdit size={14} />
    },
    PROCESSING: {
      label: "Processing",
      color: "blue",
      icon: <TbRefresh size={14} />
    },
    COMPLETED: {
      label: "Completed",
      color: "green",
      icon: <TbCheck size={14} />
    },
    CANCELLED: {
      label: "Cancelled",
      color: "red",
      icon: <TbX size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },

  // Inventory operation type badges
  inventoryOperationType: {
    INTAKE: {
      label: "Intake",
      color: "green",
      icon: <TbArrowDown size={14} />
    },
    OUTBOUND: {
      label: "Outbound",
      color: "red",
      icon: <TbArrowUp size={14} />
    },
    UNKNOWN: {
      label: "Unknown",
      color: "gray"
    }
  },
};

/**
 * Helper function to get all possible values for a config key
 */
export function getBadgeConfigValues(configKey) {
  return BADGE_CONFIGS[configKey] ? Object.keys(BADGE_CONFIGS[configKey]) : [];
}

/**
 * Helper function to get badge config for a specific value
 */
export function getBadgeConfig(configKey, value) {
  const config = BADGE_CONFIGS[configKey];
  if (!config) return null;
  
  const normalizedValue = typeof value === 'string' ? value.toUpperCase() : value;
  return config[normalizedValue] || config.UNKNOWN || null;
}
