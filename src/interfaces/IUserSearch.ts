import { UserNS } from '../modules/users/interface/users';

export interface IUserSearch {
  displayName?: string;
  mail?: string;
  size?: number;
  username?: string;
  lineId?: number;
  jobRankId?: number;
  departmentId?: number;
  status?: string;
  store?: UserNS.UserStore;
  startDate?: Date;
  endDate?: Date;
  option?: string;
}
