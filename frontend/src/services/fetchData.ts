async function fetchData(endpoint: string, method: string, options = {}) {
  const url: string = "http://localhost:5000";

  try {
    const response = await fetch(url + endpoint, { ...options, method });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error ocurred during fetch data:", error);
    throw error;
  }
}

export { fetchData };
