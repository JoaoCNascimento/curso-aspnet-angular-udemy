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

  findAllEventos() {
    return this.httpClient.get<Evento[]>(this.baseUrl).pipe(
      tap(res => this.successMessage('Eventos encontrados com sucesso!')),
      catchError(er => { this.handleErrors('Erro ao buscar eventos.'); return er; })

    );;
  }

  findAllByTema(tema: string) {
    return this.httpClient.get<Evento>(`${this.baseUrl}/getByTema/${tema}`).pipe(
      tap(res => this.successMessage('Eventos encontrados com sucesso!')),
      catchError(er => { this.handleErrors('Erro ao buscar eventos.'); return er; })
    );
  }

  findOneById(id: number) {
    return this.httpClient.get<Evento>(`${this.baseUrl}/${id}`).pipe(
      tap(res => this.successMessage('Evento encontrado com sucesso!')),
      catchError(er => { this.handleErrors('Erro ao buscar evento.'); return er; })
    );
  }

  putEvento(evento: Evento) {
    evento.qtdPessoas = Number(evento.qtdPessoas);
    return this.httpClient.put(this.baseUrl + '/' + evento.id, evento).pipe(
      tap(res => this.successMessage('Evento atualizado com sucesso!')),
      catchError(er => { this.handleErrors('Erro ao  o evento.'); return er; })
    );
  }

  postUpload(f: File, fileName: string) {
    const fileToUpload = <File>f[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileName);

    return this.httpClient.post(`${this.baseUrl}/upload`, formData).pipe(
      catchError(er => { this.handleErrors('Erro ao fazer upload de imagem do evento.'); return er; })
    );
  }

  postEvento(evento: Evento) {
    evento.qtdPessoas = Number(evento.qtdPessoas)
    return this.httpClient.post(this.baseUrl, evento).pipe(
      tap(res => {this.successMessage('Evento criado com sucesso!'); return res}),
      catchError(er => { this.handleErrors('Erro ao criar o evento.'); return er; })
    );
  }

  deleteEvento(id: Number) {
    return this.httpClient.delete(this.baseUrl + '/' + id).pipe(
      tap(res => this.successMessage('Evento deletado com sucesso!')),
      catchError(er => { this.handleErrors('Erro ao deletar o evento.'); return er; })
    );
  }

  successMessage(message: string) {
    this.toastrService.success(message, '', {
      progressBar: true
    })
  }

  handleErrors(message: any) {
    this.toastrService.error(message, '', {
      progressBar: true
    })
  }
}
