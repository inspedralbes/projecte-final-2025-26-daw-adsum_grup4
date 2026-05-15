import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correu electrònic no és vàlid' })
  @IsNotEmpty({ message: 'El correu electrònic és obligatori' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contrasenya és obligatòria' })
  @MinLength(6, { message: 'La contrasenya ha de tenir almenys 6 caràcters' })
  password: string;

  @IsString()
  contrasenya?: string;
}