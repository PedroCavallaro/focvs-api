import { RecoverPasswordStatus } from '../enums/recover-password.status';

export type CachedCodeObject = {
  code: string;
  status: RecoverPasswordStatus;
};
