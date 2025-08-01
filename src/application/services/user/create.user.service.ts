/* EXTERN */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

/* Domain Layer */
import { UserEntity } from 'src/domain/entities/user.entities';

import { UserCreatorRepository, ID } from 'src/infrastructure/mongodb/repository/test/user.repo.basic.test.kit';
import { USER_CREATOR_REPOSITORY } from 'src/domain/ports/repositories/user.repository.token';

import { UserValidation } from 'src/domain/ports/validations/validation';
import { USER_VALIDATION } from 'src/domain/ports/validations/validations.token';        

import { ENCRYPT_TOKEN } from "src/domain/ports/crypto/encrypt.token";
import { EncryptStrategy } from "src/domain/ports/crypto/encrypt";

/* DTOS */
import { CreateUserDTO } from 'src/application/dtos/users/create.user.dto';
import { GetUserIdDTO } from 'src/application/dtos/users/get.user.dto';

@Injectable()
export class CreateUserService {

  constructor(
    @Inject(USER_CREATOR_REPOSITORY)
    private readonly repository: UserCreatorRepository,
    @Inject(ENCRYPT_TOKEN)
    private readonly encryptService: EncryptStrategy,
    @Inject(USER_VALIDATION)
     private userValidation: UserValidation
  ){}
  
  async create(dto: CreateUserDTO): Promise<GetUserIdDTO>
  {
    dto.scopes.forEach(scope => {
      if(!this.userValidation.isValidScopes(scope))
      {
        throw new BadRequestException("Invalid scope format.");
      }
    })

    if(!this.userValidation.isValidEmail(dto.email))
    {
      throw new BadRequestException("Invalid email.");
    }
    
    if(!this.userValidation.isValidProjectKey(dto.projectKey))
    {
      throw new BadRequestException("Invalid projectKey.");
    }

    if(!this.userValidation.isValidUsername(dto.name))
    {
      throw new BadRequestException("Invalid username.");
    }

    const user: UserEntity<ID> = {
      name: dto.name,
      email: dto.email,
      projectKey: dto.projectKey,
      scopes: dto.scopes,
      active: true,
    }

    if(dto?.password) 
    {
      if(!this.userValidation.isValidPassword(dto.password))
      {
        throw new BadRequestException("Invalid input");
      }

      const encryptPassword = await this.encryptService.hash(dto?.password);

      user.password = encryptPassword;
    }

    const result: string = await this.repository.create(user);
    return { id: result };
  }
}
