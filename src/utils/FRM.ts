import axios from 'axios';

export default class FRM {
  static async fetch<T>(serverUrl: string, endpoint: string): Promise<T> {
    return axios.get<T>(endpoint, {
      baseURL: serverUrl,
    }).then(({ data, }) => data);
  }
}
