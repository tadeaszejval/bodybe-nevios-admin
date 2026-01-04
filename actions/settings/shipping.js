import { getRequest, postRequest, putRequest, deleteRequest } from "../../src/utils/neviosExpress";

/**
 * Shipping Methods Actions
 */

export async function retrieveShippingMethods() {
	try {
		const response = await getRequest(
			"/server/configuration/shipping-methods/retrieve"
		);
		return response;
	} catch (error) {
		console.error("Error retrieving shipping methods:", error);
		throw error;
	}
}

export async function createShippingMethod(data) {
	try {
		const response = await postRequest(
			"/server/configuration/shipping-methods/create",
			data
		);
		return response;
	} catch (error) {
		console.error("Error creating shipping method:", error);
		throw error;
	}
}

export async function modifyShippingMethod(id, data) {
	try {
		const response = await putRequest(
			`/server/configuration/shipping-methods/modify/${id}`,
			data
		);
		return response;
	} catch (error) {
		console.error("Error modifying shipping method:", error);
		throw error;
	}
}

export async function deleteShippingMethod(id) {
	try {
		const response = await deleteRequest(
			`/server/configuration/shipping-methods/delete/${id}`
		);
		return response;
	} catch (error) {
		console.error("Error deleting shipping method:", error);
		throw error;
	}
}

/**
 * Shipping Zones Actions
 */

export async function queryShippingZones(params = {}) {
	try {
		const response = await getRequest(
			"/server/configuration/shipping-zones/query",
			params
		);
		return response;
	} catch (error) {
		console.error("Error querying shipping zones:", error);
		throw error;
	}
}

export async function retrieveShippingZones(params = {}) {
	try {
		const response = await getRequest(
			"/server/configuration/shipping-zones/retrieve",
			params
		);
		return response;
	} catch (error) {
		console.error("Error retrieving shipping zones:", error);
		throw error;
	}
}

export async function createShippingZone(data) {
	try {
		const response = await postRequest(
			"/server/configuration/shipping-zones/create",
			data
		);
		return response;
	} catch (error) {
		console.error("Error creating shipping zone:", error);
		throw error;
	}
}

export async function modifyShippingZone(id, data) {
	try {
		const response = await putRequest(
			`/server/configuration/shipping-zones/modify/${id}`,
			data
		);
		return response;
	} catch (error) {
		console.error("Error modifying shipping zone:", error);
		throw error;
	}
}

export async function deleteShippingZone(id) {
	try {
		const response = await deleteRequest(
			`/server/configuration/shipping-zones/delete/${id}`
		);
		return response;
	} catch (error) {
		console.error("Error deleting shipping zone:", error);
		throw error;
	}
}

/**
 * Shipping Sets Actions
 */

export async function retrieveShippingSets(params = {}) {
	try {
		const response = await getRequest(
			"/server/configuration/shipping-sets/retrieve",
			params
		);
		return response;
	} catch (error) {
		console.error("Error retrieving shipping sets:", error);
		throw error;
	}
}

export async function createShippingSet(data) {
	try {
		const response = await postRequest(
			"/server/configuration/shipping-sets/create",
			data
		);
		return response;
	} catch (error) {
		console.error("Error creating shipping set:", error);
		throw error;
	}
}

export async function modifyShippingSet(id, data) {
	try {
		const response = await putRequest(
			`/server/configuration/shipping-sets/modify/${id}`,
			data
		);
		return response;
	} catch (error) {
		console.error("Error modifying shipping set:", error);
		throw error;
	}
}

export async function deleteShippingSet(id) {
	try {
		const response = await deleteRequest(
			`/server/configuration/shipping-sets/delete/${id}`
		);
		return response;
	} catch (error) {
		console.error("Error deleting shipping set:", error);
		throw error;
	}
}

