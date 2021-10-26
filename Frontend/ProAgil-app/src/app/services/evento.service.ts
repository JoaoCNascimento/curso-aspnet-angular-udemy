import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  baseUrl = "http://localhost:5000/api/evento";

  constructor(private httpClient: HttpClient) { }

  findAllEventos(): Observable<Evento[]> {
    return this.httpClient.get<Evento[]>(this.baseUrl);
  }

  findAllByTema(tema: string): Observable<Evento> {
    return this.httpClient.get<Evento>(`${this.baseUrl}/getByTema/${tema}`);
  }

  findOneById(id: number): Observable<Evento> {
    return this.httpClient.get<Evento>(`${this.baseUrl}/${id}`);
  }
}
