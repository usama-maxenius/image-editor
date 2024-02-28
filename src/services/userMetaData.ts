export const updateUserMetaData = (
	token: string,
	userId: string,
	body: any
) => {
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

	fetch(
		`https://dev-bg8owhj3eqxda764.us.auth0.com/api/v2/users/${userId}`,
		requestOptions
	)
		.then((response) => response.text())
		.then((result) => console.log(result))
		.catch((error) => console.error(error));
};
