async function fetchData(endpoint: string, options = {}) {
    const url: string = "http://localhost:5000"
    try {
      const response = await fetch(url + endpoint, options);
  
      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error ocurred during fetch data:', error);
      throw error;
    }
  }
  
  export { fetchData };