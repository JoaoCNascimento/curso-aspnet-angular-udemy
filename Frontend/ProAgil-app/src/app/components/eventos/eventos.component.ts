import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  registerForm: FormGroup;

  eventosFiltrados: any = [];
  modalRef: BsModalRef;

  _filtroLista: string;

  constructor(
    private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
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
    this.validation();
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

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [ Validators.required, Validators.minLength(4), Validators.maxLength(50)]],

      local: [ '', [ Validators.required]],

      dataEvento: [ '', [ Validators.required]],

      imgUrl: [ '', [ Validators.required]],

      qtdPessoas: [ '', [ Validators.required, Validators.max(120000)]],

      telefone: [ '', [ Validators.required]],

      email: [ '', [ Validators.required, Validators.email]],
    })
  }

  salvarAlteracao() {

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
