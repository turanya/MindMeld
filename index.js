import axios from 'axios';

const API_KEY = 'AIzaSyCc2hPt9wpGIcUt6xWcmQofm4GOrPdmYzI';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

async function listModels() {
    try {
        console.log('Fetching available models...');
        const response = await axios.get(
            `${BASE_URL}/models?key=${API_KEY}`
        );
        return response.data;
    } catch (error) {
        console.error('Error listing models:', error.response?.data || error.message);
        throw error;
    }
}

async function run() {
    try {
        const models = await listModels();
        console.log('\nAvailable Models:', JSON.stringify(models, null, 2));
    } catch (error) {
        console.error('Failed to list models:', error.message);
    }
}

run();
