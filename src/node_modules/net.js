export async function sendRequest(request) {
    const response = await fetch(process.env.OCEAN_API_URL, {
        method: "POST",
        body: request.toString()
    });

    const json = await response.json();

    if (json.error) {
        throw json.error
    }

    if (json.result) {
        return json.result
    }
}
