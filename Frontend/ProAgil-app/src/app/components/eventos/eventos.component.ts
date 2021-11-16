import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: Evento[] = [];
  evento: Evento;
  bodyDeletarEvento: string;
  imagemLargura: number = 100;
  imagemMargem: number = 2;
  mostrarImagem: boolean = false;
  registerForm: FormGroup;
  dataEvento: string;

  modoSalvar = "";

  eventosFiltrados: any = [];

  _filtroLista: string;

  constructor(
    private eventoService: EventoService
    // , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
  ) {
    this.localeService.use('pt-br');
  }

  get filtroLista() {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
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
    this.modoSalvar = "post"
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],

      local: ['', [Validators.required]],

      dataEvento: ['', [Validators.required]],

      imgUrl: ['', [Validators.required]],

      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],

      telefone: ['', [Validators.required]],

      email: ['', [Validators.required, Validators.email]],
    })
  }

  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if(this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);
        return this.eventoService.postEvento(this.evento).subscribe(
          (res: Evento) => {
            template.hide();
            this.getEventos();
          },
          error => console.log(error)
        );
      }

      this.evento = Object.assign({}, this.registerForm.value);
      this.eventoService.putEvento(this.evento).subscribe(
        res => {
          template.hide();
          this.getEventos();
        },
        error => console.log(error)
      )
    }
  }

  confirmarExcluisaoEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.tema}`;
  }

  excluirEvento(template) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      res => {
        template.hide();
        this.getEventos();
      },
      error => console.log(error)
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }



  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  editarEvento(evento_id: number, template: any) {
    this.modoSalvar = "put"
    this.registerForm.reset();
    this.eventoService.findOneById(evento_id).subscribe(
      (res: Evento) => {
        this.registerForm = this.fb.group({

          id: [res.id],

          tema: [res.tema, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],

          local: [res.local, [Validators.required]],

          dataEvento: [res.dataEvento, [Validators.required]],

          imgUrl: [res.imgUrl, [Validators.required]],

          qtdPessoas: [res.qtdPessoas, [Validators.required, Validators.max(120000)]],

          telefone: [res.telefone, [Validators.required]],

          email: [res.email, [Validators.required, Validators.email]],
        })
        template.show();
      }
    )
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1);
  }
}
