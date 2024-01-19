import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD ?
        '': 'http://localhost:4000'
})
//보내는 header에 accessToken을 함께보냄
axiosInstance.interceptors.request.use(function(config) {
   config.headers.Authorization = "Bearer " + localStorage.getItem('accessToken');
   return config;
}, function(error) {
    return Promise.reject(error);
})
//response가 올 때
//토큰 유효기간이 만료되었을 때의 처리
axiosInstance.interceptors.response.use(function(response) {
    return response;
 }, function(error) {
    if(error.response.data === 'jwt expired'){
        window.location.reload();
    }
    return Promise.reject(error);
})
export default axiosInstance;