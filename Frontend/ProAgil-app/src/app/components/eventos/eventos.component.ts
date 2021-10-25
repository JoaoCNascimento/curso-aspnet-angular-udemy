import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  _filtroLista: string;
  get filtroLista() {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  eventos: any = []
  imagemLargura: number = 100;
  imagemMargem: number = 2;
  mostrarImagem: boolean = false;

  eventosFiltrados: any = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }

  getEventos() {
    let baseUrl = "http://localhost:5000";

    this.httpClient.get(baseUrl + '/api/evento').subscribe(
      res => { this.eventos = res; },
      err => { console.log(err) }
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1)
  }
}
