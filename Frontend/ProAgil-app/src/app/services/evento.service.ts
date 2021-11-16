import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Evento } from '../models/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  baseUrl = "http://localhost:5000/api/evento";

  constructor(
    private httpClient: HttpClient
    ,private toastrService: ToastrService
    ) { }

  findAllEventos(): Observable<Evento[]> {
    return this.httpClient.get<Evento[]>(this.baseUrl).pipe(
      tap(res => this.successMessage('Eventos encontrados com sucesso!'))
    );;
  }

  findAllByTema(tema: string): Observable<Evento> {
    return this.httpClient.get<Evento>(`${this.baseUrl}/getByTema/${tema}`).pipe(
      tap(res => this.successMessage('Eventos encontrados com sucesso!'))
    );
  }

  findOneById(id: number): Observable<Evento> {
    return this.httpClient.get<Evento>(`${this.baseUrl}/${id}`).pipe(
      tap(res => this.successMessage('Evento encontrado com sucesso!'))
    );
  }

  putEvento(evento: Evento) {
    evento.qtdPessoas = Number(evento.qtdPessoas);
    return this.httpClient.put(this.baseUrl + '/' + evento.id, evento).pipe(
      tap(res => this.successMessage('Evento atualizado com sucesso!'))
    );
  }

  postEvento(evento: Evento) {
    evento.qtdPessoas = Number(evento.qtdPessoas)
    return this.httpClient.post(this.baseUrl, evento).pipe(
      tap(res => {this.successMessage('Evento criado com sucesso!'); return res})
    );
  }

  deleteEvento(id: Number) {
    return this.httpClient.delete(this.baseUrl + '/' + id).pipe(
      tap(res => this.successMessage('Evento deletado com sucesso!'))
    );
  }

  successMessage(message: string) {
    this.toastrService.success(message, '', {
      progressBar: true
    })
  }
}
