export class JwtPayloadDTO {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  iat: number;
  exp: number;
}
