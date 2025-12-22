/**
 * Configuration for dashboard overlay routes
 * Add new overlay modules here to enable the slide-up overlay behavior
 */

export const OVERLAY_ROUTES = {
	// Settings overlay - for all settings pages
	settings: {
		pattern: '/dashboard/settings',
		showCloseButton: true,
		hasBackdrop: true,
		backdropBlur: true,
		description: 'Settings and configuration pages'
	},
	
	// Future overlay modules can be added here:
	// quickActions: {
	// 	pattern: '/dashboard/quick-actions',
	// 	showCloseButton: true,
	// 	hasBackdrop: true,
	// 	backdropBlur: true,
	// 	description: 'Quick create actions for orders, customers, products'
	// },
	
	// search: {
	// 	pattern: '/dashboard/search',
	// 	showCloseButton: true,
	// 	hasBackdrop: true,
	// 	backdropBlur: true,
	// 	description: 'Global search overlay'
	// },
	
	// notifications: {
	// 	pattern: '/dashboard/notifications',
	// 	showCloseButton: true,
	// 	hasBackdrop: true,
	// 	backdropBlur: false,
	// 	description: 'Notification center'
	// },
};

/**
 * Get all active overlay patterns
 * @returns {string[]} Array of route patterns
 */
export function getOverlayPatterns() {
	return Object.values(OVERLAY_ROUTES).map(route => route.pattern);
}

/**
 * Get overlay configuration by pattern
 * @param {string} pathname - Current pathname
 * @returns {object|null} Overlay configuration or null
 */
export function getOverlayConfig(pathname) {
	for (const [key, config] of Object.entries(OVERLAY_ROUTES)) {
		if (pathname?.startsWith(config.pattern)) {
			return { key, ...config };
		}
	}
	return null;
}

