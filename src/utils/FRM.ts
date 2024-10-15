import axios, { AxiosInstance } from 'axios';
import type { GetModListResponse } from '@derpierre65/ficsit-remote-monitoring';
import { ServerInfo } from 'stores/server.ts';

export default class FRM {
  server: ServerInfo;

  axiosInstance: AxiosInstance;

  constructor(server: ServerInfo) {
    this.server = server;
    this.axiosInstance = axios.create({
      baseURL: server.url,
    });
  }

  getModList(): Promise<GetModListResponse> {
    return this.axiosInstance.get<GetModListResponse>('getModList').then(({ data, }) => data);
  }
}
