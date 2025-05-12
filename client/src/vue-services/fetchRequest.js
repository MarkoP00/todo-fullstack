import callToast from "./callToast";

export default async function apiRequest(
  url = "http://localhost:5050/api/todos",
  method = "GET",
  body = null
) {
  try {
    const config = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body && ["POST", "PUT", "PATCH"].includes(config.method)) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      callToast(
        responseData.message ||
          `Request failed ${response.status}. Error: ${response.message}`,
        "warning"
      );
      return responseData.data || null;
    }

    if (method !== "GET") {
      callToast(
        responseData.message || "Operation completed successfully",
        "success"
      );
    }

    return responseData.data || responseData;
  } catch (err) {
    callToast("Network error occurred", "error");
    return null;
  }
}
