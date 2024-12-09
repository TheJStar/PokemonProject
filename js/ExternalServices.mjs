//const baseURL = import.meta.env.VITE_SERVER_URL;
const baseURL = "https://pokeapi.co/api/v2/";

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'serviceError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
  }
  async getData(category, offset, limit) {
    const response = await fetch(baseURL + `${category}/` + `?offset=${offset}&limit=${limit}`);
    const data = await convertToJson(response);
    return data.results;
  }
  async findDataById(id, category=null) {
    if (category != null) {
        const response = await fetch(baseURL + `${category}/${id}/`);
        const data = await convertToJson(response);
        return data;  
    } else {
        const response = await fetch(baseURL + `${this.category}/${id}/`);
        const data = await convertToJson(response);
        return data;
    }
  }
  async findDataByURL(url) {
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data;
  }
}