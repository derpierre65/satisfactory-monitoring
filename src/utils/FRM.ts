import axios from 'axios';
import type { GetModListResponse } from '@derpierre65/ficsit-remote-monitoring';

export default class FRM {
  static getModList(): Promise<GetModListResponse> {
    return axios.get<GetModListResponse>('getModList').then(({ data, }) => data);
  }
}
