import { Maybe, UserRecord } from '@vize/types';
import { CGIResponse, getCGIJSON, ParsedCGIResponse } from '@vize/utils';
import { isDebugMode } from '../utils';

let user: Maybe<ParsedCGIResponse<UserRecord>> = null;

let getUserPromise: Maybe<Promise<ParsedCGIResponse<UserRecord>>> = null;

const DEBUG_USER = {
  id: 1,
  name: 'vize-developer',
  createdTime: new Date(),
  bizs: [] as number[],
  isAdmin: 1,
  isDeveloper: 0,
};

export async function getCurrentUser() {
  if (isDebugMode()) {
    return [true, DEBUG_USER, {} as CGIResponse<UserRecord>] as ParsedCGIResponse<UserRecord>;
  }

  if (user) {
    return user;
  }

  if (getUserPromise) {
    return await getUserPromise;
  }

  getUserPromise = getCGIJSON<UserRecord>('/user-info');
  user = await getUserPromise;
  return user;
}
