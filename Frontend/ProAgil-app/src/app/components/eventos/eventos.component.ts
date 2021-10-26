import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: Evento[] = []
  imagemLargura: number = 100;
  imagemMargem: number = 2;
  mostrarImagem: boolean = false;

  eventosFiltrados: any = [];
  modalRef: BsModalRef;

  _filtroLista: string;

  constructor(
    private eventoService: EventoService
    , private modalService: BsModalService
  ) { }

  get filtroLista() {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): void {
    this.getEventos();
  }

  getEventos() {
    this.eventoService.findAllEventos().subscribe(
      (res: Evento[]) => {
        this.eventos = res;
        this.eventosFiltrados = this.eventos;
      },
      err => console.log(err));
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1)
  }
}
