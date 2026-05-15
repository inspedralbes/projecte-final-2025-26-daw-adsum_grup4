import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correu electrònic no és vàlid' })
  @IsNotEmpty({ message: 'El correu electrònic és obligatori' })
  email: string;

  @IsString({}, { message: 'La contrasenya ha de ser una cadena' })
  @IsNotEmpty({ message: 'La contrasenya és obligatòria' })
  password: string;
}
