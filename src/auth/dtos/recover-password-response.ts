import { RecoverPasswordStatus } from '../enums/recover-password.status';

export class RecoverPasswordResponse {
  status: RecoverPasswordStatus;

  constructor(status: RecoverPasswordStatus) {
    this.status = status;
  }
}
