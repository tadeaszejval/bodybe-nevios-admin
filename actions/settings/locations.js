import { getRequest, postRequest, putRequest, deleteRequest } from "../../src/utils/neviosExpress";

/**
 * Locations Actions
 */

export async function queryLocations(params = {}) {
	try {
		const response = await getRequest(
			"/server/configuration/locations/query",
			params
		);
		return response;
	} catch (error) {
		console.error("Error querying locations:", error);
		throw error;
	}
}

export async function retrieveLocations(id = null, params = {}) {
	try {
		const endpoint = id 
			? `/server/configuration/locations/retrieve/${id}`
			: "/server/configuration/locations/retrieve";
		
		const response = await getRequest(endpoint, params);
		return response;
	} catch (error) {
		console.error("Error retrieving locations:", error);
		throw error;
	}
}

export async function createLocation(data) {
	try {
		const response = await postRequest(
			"/server/configuration/locations/create",
			data
		);
		return response;
	} catch (error) {
		console.error("Error creating location:", error);
		throw error;
	}
}

export async function modifyLocation(id, data) {
	try {
		const response = await putRequest(
			`/server/configuration/locations/modify/${id}`,
			data
		);
		return response;
	} catch (error) {
		console.error("Error modifying location:", error);
		throw error;
	}
}

export async function setDefaultLocation(id) {
	try {
		const response = await putRequest(
			`/server/configuration/locations/set-default/${id}`
		);
		return response;
	} catch (error) {
		console.error("Error setting default location:", error);
		throw error;
	}
}

export async function deleteLocation(id) {
	try {
		const response = await deleteRequest(
			`/server/configuration/locations/delete/${id}`
		);
		return response;
	} catch (error) {
		console.error("Error deleting location:", error);
		throw error;
	}
}

/**
 * Location Shipping Rules Actions
 */

export async function queryLocationRules(params = {}) {
	try {
		const response = await getRequest(
			"/server/configuration/location-rules/query",
			params
		);
		return response;
	} catch (error) {
		console.error("Error querying location rules:", error);
		throw error;
	}
}

export async function retrieveLocationRules(params = {}) {
	try {
		const response = await getRequest(
			"/server/configuration/location-rules/retrieve",
			params
		);
		return response;
	} catch (error) {
		console.error("Error retrieving location rules:", error);
		throw error;
	}
}

export async function createLocationRule(data) {
	try {
		const response = await postRequest(
			"/server/configuration/location-rules/create",
			data
		);
		return response;
	} catch (error) {
		console.error("Error creating location rule:", error);
		throw error;
	}
}

export async function modifyLocationRule(id, data) {
	try {
		const response = await putRequest(
			`/server/configuration/location-rules/modify/${id}`,
			data
		);
		return response;
	} catch (error) {
		console.error("Error modifying location rule:", error);
		throw error;
	}
}

export async function deleteLocationRule(id) {
	try {
		const response = await deleteRequest(
			`/server/configuration/location-rules/delete/${id}`
		);
		return response;
	} catch (error) {
		console.error("Error deleting location rule:", error);
		throw error;
	}
}

