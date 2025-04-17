import axios from 'axios'
import qs from 'qs'
const api = axios.create({
  baseURL: 'http://localhost:8080',
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  withCredentials: true, // You can keep this if you need to handle cookies for cross-origin requests
})

// Remove the request interceptor to eliminate the token validation part
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('ch_jwt')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

//Remove the response interceptor as well



api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export default api
