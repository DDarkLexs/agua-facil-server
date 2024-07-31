import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class LocalizacaoService {
    constructor(private readonly httpService: HttpService) { }

    private findLocationByCoordenada(coordenada: string): Observable<AxiosResponse<LocationData>> {
        const [lat, lon] = coordenada.split(',');
        return this.httpService.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
    }

    async findLocationByCoordenadaAsync(coordenada: string): Promise<AxiosResponse<LocationData>> {
        const observable = this.findLocationByCoordenada(coordenada);
        return await lastValueFrom(observable);
    }
}
