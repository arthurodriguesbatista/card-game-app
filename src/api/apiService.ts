import axios, { AxiosRequestConfig } from 'axios';

const create = (baseURL: string) =>
  axios.create({
    baseURL,
    timeout: 50000,
  });

export const mainApi = create(process.env.API_URL || 'http://localhost:3030');

export const fetcher = (url: string, params?: AxiosRequestConfig) =>
  mainApi.get(url, params).then((res) => res.data);
