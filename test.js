const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=AMD%2CIBM%2CAAPL';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'Sign Up for Key',
		'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}