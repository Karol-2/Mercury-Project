export const fetchData = async (
  url: string,
  method: string,
  options: RequestInit = {},
  token?: string,
) => {
  if (token) {
    options.headers = {
      ...options.headers,
      "Authorization": `Bearer ${token}`
    }
  }

  try {
    const response = await fetch(url, { ...options, method });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error ocurred during fetch data:", error);
    throw error;
  }
};
