"use server";
import { neviosExpress } from "../../src/utils/neviosExpress";

/**
 * Retrieve sales channels
 * @param {string} id - Optional sales channel ID
 * @param {string} expand - Optional comma-separated relations to expand (e.g., "markets")
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function retrieveSalesChannels(id = null, expand = null) {
	try {
		let endpoint = "/server/configuration/sales-channels/retrieve";
		
		if (id) {
			endpoint += `/${id}`;
		}
		
		const params = new URLSearchParams();
		if (expand) {
			params.append("expand", expand);
		}
		
		const queryString = params.toString();
		if (queryString) {
			endpoint += `?${queryString}`;
		}

		const response = await neviosExpress(endpoint, {
			method: "GET",
		});

		return response;
	} catch (error) {
		console.error("Error retrieving sales channels:", error);
		return {
			success: false,
			error: error.message || "Failed to retrieve sales channels",
		};
	}
}

/**
 * Create a new sales channel
 * @param {Object} data - Sales channel data
 * @param {string} data.id - Unique identifier
 * @param {string} data.name - Display name
 * @param {string} data.account_type - Type of account (retail, wholesale, b2b)
 * @param {string} data.order_name_format - Format for order names
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function createSalesChannel(data) {
	try {
		const response = await neviosExpress(
			"/server/configuration/sales-channels/create",
			{
				method: "POST",
				body: JSON.stringify(data),
			}
		);

		return response;
	} catch (error) {
		console.error("Error creating sales channel:", error);
		return {
			success: false,
			error: error.message || "Failed to create sales channel",
		};
	}
}

/**
 * Modify an existing sales channel
 * @param {string} id - Sales channel ID
 * @param {Object} data - Fields to update
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function modifySalesChannel(id, data) {
	try {
		const response = await neviosExpress(
			`/server/configuration/sales-channels/modify/${id}`,
			{
				method: "PUT",
				body: JSON.stringify(data),
			}
		);

		return response;
	} catch (error) {
		console.error("Error modifying sales channel:", error);
		return {
			success: false,
			error: error.message || "Failed to modify sales channel",
		};
	}
}

/**
 * Delete a sales channel
 * @param {string} id - Sales channel ID
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function deleteSalesChannel(id) {
	try {
		const response = await neviosExpress(
			`/server/configuration/sales-channels/delete/${id}`,
			{
				method: "DELETE",
			}
		);

		return response;
	} catch (error) {
		console.error("Error deleting sales channel:", error);
		return {
			success: false,
			error: error.message || "Failed to delete sales channel",
		};
	}
}

