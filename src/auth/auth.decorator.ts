import { SetMetadata } from '@nestjs/common';

export const Autorization = (...args: string[]) => SetMetadata('auth', args);
