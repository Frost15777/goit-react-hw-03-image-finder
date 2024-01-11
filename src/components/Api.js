import axios from 'axios';

const API_KEY = '40855799-bf33be6349e332f70260dbd75';

export const fetchImages = async (query, page) => {
  try {
    const response = await axios.get(`https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};