export const fetchData = async (url: string, method: string, options = {}) => {
  try {
    const response = await fetch(url, { ...options, method });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error ocurred during fetch data:", error);
    throw error;
  }
};
