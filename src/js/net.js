export async function sendRequest(request) {
    const response = await fetch("http://localhost:21000/dive", {
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

    return
}
