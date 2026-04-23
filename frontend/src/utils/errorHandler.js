export const handleError = (error, fallbackMessage = "Something went wrong ❌") => {
    console.error("Frontend Error:", error);

    // Axios response error (backend sent something)
    if (error?.response) {
        const status = error.response.status;

        if (status === 401) return "Session expired. Please login again.";
        if (status === 403) return "Access denied.";
        if (status === 404) return "Resource not found.";
        if (status >= 500) return "Server error. Try again later.";

        return (
            error.response.data?.message ||
            error.response.data?.error ||
            fallbackMessage
        );
    }

    // Network error (no response)
    if (error?.request) {
        return "Network error. Please check your connection.";
    }

    // Unknown / JS error
    return error?.message || fallbackMessage;
};