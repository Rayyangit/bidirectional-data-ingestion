import axios from 'axios'
import qs from 'qs'
const api = axios.create({
  baseURL: 'http://localhost:8080',
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  withCredentials: true, // You can keep this if you need to handle cookies for cross-origin requests
})





api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export default api
