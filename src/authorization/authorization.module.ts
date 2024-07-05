import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AutorizacaoGuard } from './authorization.guard';

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: AutorizacaoGuard,
        },
    ],
})
export class AuthorizationModule { }
