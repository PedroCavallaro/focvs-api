export enum RecoverPasswordStatus {
  PENDING = 'PENDING',
  VALID = 'VALID',
  SUCCESS = 'SUCCESS'
}

export type TokenObject = {
  token: string;
  status: RecoverPasswordStatus;
};
