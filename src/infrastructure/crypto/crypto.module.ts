import { Module, Global } from '@nestjs/common';
import { ENCRYPT_TOKEN } from 'src/domain/ports/crypto/encrypt.token';
import { BcryptEncryptService } from './bcrypt.concrete';

@Global()
@Module({
  providers: [
    {
      provide: ENCRYPT_TOKEN,
      useClass: BcryptEncryptService,
    },
  ],
  exports: [ENCRYPT_TOKEN],
})
export class CryptoModule {}
