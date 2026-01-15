"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TbTicket, TbUser, TbMail, TbCash, TbChartBar, TbFileText, TbPackage, TbSpeakerphone, TbClipboardList, TbBuilding, TbHome, TbDiscount } from 'react-icons/tb';

// Module mapping configuration
const MODULE_MAPPING = {
  '/dashboard/orders': { name: 'Orders', icon: TbTicket },
  '/dashboard/customers': { name: 'Customers', icon: TbUser },
  '/dashboard/discounts': { name: 'Discounts', icon: TbDiscount },
  '/dashboard/emails': { name: 'Emails', icon: TbMail },
  '/dashboard/payments': { name: 'Payments', icon: TbCash },
  '/dashboard/analytics': { name: 'Analytics', icon: TbChartBar },
  '/dashboard/documents': { name: 'Documents', icon: TbFileText },
  '/dashboard/inventory': { name: 'Inventory', icon: TbPackage },
  '/dashboard/marketing': { name: 'Marketing', icon: TbSpeakerphone },
  '/dashboard/products': { name: 'Products', icon: TbPackage },
  '/dashboard/reports': { name: 'Reports', icon: TbClipboardList },
  '/dashboard/stock-movements': { name: 'Stock Movements', icon: TbPackage },
  '/dashboard/stores': { name: 'Stores', icon: TbBuilding },
  '/dashboard/home': { name: 'Home', icon: TbHome },
};

const NavigationHistoryContext = createContext();

export function NavigationHistoryProvider({ children }) {
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [previousModule, setPreviousModule] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [isBackNavigation, setIsBackNavigation] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Extract module from pathname
  const getModuleFromPath = (path) => {
    if (!path || !path.startsWith('/dashboard/')) return null;
    
    // Extract the base module path (e.g., /dashboard/orders from /dashboard/orders/123)
    const pathParts = path.split('/');
    if (pathParts.length >= 3) {
      const moduleKey = `/${pathParts[1]}/${pathParts[2]}`;
      return MODULE_MAPPING[moduleKey] || null;
    }
    return null;
  };

  // Get the base module path for navigation
  const getModuleBasePath = (path) => {
    if (!path || !path.startsWith('/dashboard/')) return null;
    
    const pathParts = path.split('/');
    if (pathParts.length >= 3) {
      return `/${pathParts[1]}/${pathParts[2]}`;
    }
    return null;
  };

  // Get a user-friendly page description
  const getPageDescription = (path, moduleName) => {
    if (!path || !moduleName) return null;
    
    const pathParts = path.split('/');
    
    // Check if it's a detail page (has an ID)
    if (pathParts.length >= 4 && pathParts[3] && pathParts[3] !== 'create') {
      // It's a detail page like /dashboard/customers/123
      return `${moduleName.slice(0, -1)} Details`; // "Customers" -> "Customer Details"
    } else if (pathParts.length >= 4 && pathParts[3] === 'create') {
      // It's a create page like /dashboard/customers/create
      return `Create ${moduleName.slice(0, -1)}`; // "Customers" -> "Create Customer"
    } else {
      // It's the main list page
      return moduleName; // "Customers"
    }
  };

  useEffect(() => {
    const newModule = getModuleFromPath(pathname);
    const newModuleBasePath = getModuleBasePath(pathname);
    
    if (newModule && newModuleBasePath) {
      // Check if this navigation is going back to a previous page
      const isGoingBackToPreviousPage = previousPageUrl === pathname;
      
      // Only update history if we're switching to a different module AND it's not a back navigation
      if (!currentModule || currentModule.name !== newModule.name) {
        if (isGoingBackToPreviousPage) {
          // This is a back navigation - clear the back button state
          console.log('Back navigation detected, clearing back button state');
          setIsBackNavigation(true);
          setPreviousModule(null);
          setPreviousPageUrl(null);
        } else {
          // This is forward navigation to a new module
          console.log('Forward navigation detected to new module:', newModule.name);
          setIsBackNavigation(false);
          
          // Store the previous page URL before updating
          if (currentModule && navigationHistory.length > 0) {
            const lastEntry = navigationHistory[navigationHistory.length - 1];
            setPreviousPageUrl(lastEntry.fullPath);
            setPreviousModule({
              ...currentModule,
              pageDescription: lastEntry.pageDescription
            });
          }
        }
        
        setCurrentModule(newModule);
        
        // Add to history only if it's not a back navigation
        if (!isGoingBackToPreviousPage) {
          setNavigationHistory(prev => {
            const newHistory = [...prev];
            const pageDescription = getPageDescription(pathname, newModule.name);
            
            // Don't add if it's the same module as the last entry
            const lastEntry = newHistory[newHistory.length - 1];
            if (!lastEntry || lastEntry.moduleName !== newModule.name) {
              newHistory.push({
                moduleName: newModule.name,
                moduleIcon: newModule.icon,
                basePath: newModuleBasePath,
                fullPath: pathname,
                pageDescription: pageDescription,
                timestamp: Date.now()
              });
            } else {
              // Update the existing entry with the new page info
              newHistory[newHistory.length - 1] = {
                ...lastEntry,
                fullPath: pathname,
                pageDescription: pageDescription,
                timestamp: Date.now()
              };
            }
            
            // Keep only last 5 entries
            return newHistory.slice(-5);
          });
        }
      } else {
        // Same module, just update the current page info in history
        setNavigationHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length > 0) {
            const pageDescription = getPageDescription(pathname, newModule.name);
            newHistory[newHistory.length - 1] = {
              ...newHistory[newHistory.length - 1],
              fullPath: pathname,
              pageDescription: pageDescription,
              timestamp: Date.now()
            };
          }
          return newHistory;
        });
      }
    }
  }, [pathname, currentModule, previousPageUrl]);

  const canGoBack = () => {
    // Only show back button if:
    // 1. We have a previous module and URL
    // 2. We have enough history
    // 3. This is NOT a back navigation (we just went back)
    return previousModule && previousPageUrl && navigationHistory.length > 1 && !isBackNavigation;
  };

  const getBackButtonText = () => {
    if (!previousModule) return null;
    
    // Use the page description if available, otherwise fall back to module name
    const targetDescription = previousModule.pageDescription || previousModule.name;
    return `Go back to ${targetDescription}`;
  };

  const getBackUrl = () => {
    if (!canGoBack()) return null;
    return previousPageUrl;
  };

  const goBack = () => {
    const backUrl = getBackUrl();
    if (backUrl && router) {
      console.log('Navigating back to:', backUrl);
      // Mark that we're about to do a back navigation
      setIsBackNavigation(true);
      router.push(backUrl);
    }
  };

  const clearHistory = () => {
    setNavigationHistory([]);
    setPreviousModule(null);
    setPreviousPageUrl(null);
    setIsBackNavigation(false);
  };

  const pushToHistory = (route, metadata = {}) => {
    const module = getModuleFromPath(route);
    const basePath = getModuleBasePath(route);
    
    if (module && basePath) {
      const pageDescription = getPageDescription(route, module.name);
      setNavigationHistory(prev => [
        ...prev.slice(-4), // Keep only last 4 to make room for new one
        {
          moduleName: module.name,
          moduleIcon: module.icon,
          basePath: basePath,
          fullPath: route,
          pageDescription: pageDescription,
          timestamp: Date.now(),
          ...metadata
        }
      ]);
    }
  };

  const value = {
    navigationHistory,
    currentModule,
    previousModule,
    previousPageUrl,
    isBackNavigation,
    canGoBack: canGoBack(),
    backUrl: getBackUrl(),
    backButtonText: getBackButtonText(),
    goBack,
    clearHistory,
    pushToHistory,
    getModuleFromPath,
    MODULE_MAPPING
  };

  return (
    <NavigationHistoryContext.Provider value={value}>
      {children}
    </NavigationHistoryContext.Provider>
  );
}

export function useNavigationHistory() {
  const context = useContext(NavigationHistoryContext);
  if (!context) {
    throw new Error('useNavigationHistory must be used within a NavigationHistoryProvider');
  }
  return context;
} 