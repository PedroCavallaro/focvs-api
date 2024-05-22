export enum TokenStatus {
  PENDING = 'PENDING',
  VALID = 'VALID'
}

export type TokenObject = {
  token: string;
  status: TokenStatus;
};
