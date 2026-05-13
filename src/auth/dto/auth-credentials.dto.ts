import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  // at least 1 lowercase letter
  // at least 1 uppercase letter
  // at least 1 number OR special character
  // no min/max length restriction
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*]).+$/, {
    message:
      'password must contain at least 1 lowercase letter, at least 1 uppercase letter, and at least 1 number or special character',
  })
  password: string;
}

export { AuthCredentialsDto };
