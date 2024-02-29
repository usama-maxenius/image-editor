import { AUTH0_AUDIENCE_ID } from '../constants';

/**
 * Retrieves user data using the provided token and user ID.
 *
 * @param {string} token - The authentication token
 * @param {string} userId - The ID of the user
 * @return {void} No return value
 */
export const getUserData = async (
	token: string,
	userId: string
): Promise<void> => {
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append('Authorization', `Bearer ${token}`);

	try {
		const res = await fetch(
			`https://${AUTH0_AUDIENCE_ID}/api/v2/users/${userId}`,
			{
				headers: myHeaders,
			}
		);

		if (!res.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await res.json();
		return data;
	} catch (error) {
		console.error(error);
	}
};

/**
 * Updates user data with the given token, user ID, and request body.
 *
 * @param {string} token - The authentication token
 * @param {string} userId - The ID of the user to update
 * @param {any} body - The data to update for the user
 */
export const updateUserData = async (
	token: string,
	userId: string,
	body: any
): Promise<void> => {
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append('Authorization', `Bearer ${token}`);

	const raw = JSON.stringify(body);

	const requestOptions: any = {
		method: 'PATCH',
		headers: myHeaders,
		body: raw,
		redirect: 'follow',
	};

	try {
		const res = await fetch(
			`https://${AUTH0_AUDIENCE_ID}/api/v2/users/${userId}`,
			requestOptions
		);
		if (!res.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await res.json();
		return data;
	} catch (error) {
		console.error(error);
	}
};
