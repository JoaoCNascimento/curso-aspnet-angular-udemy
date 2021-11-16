import { HttpClient } from "@angular/common/http";
import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Evento } from "src/app/models/Evento";
import { EventoService } from "src/app/services/evento.service";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { defineLocale, ptBrLocale } from "ngx-bootstrap/chronos";
defineLocale("pt-br", ptBrLocale);

@Component({
  selector: "app-eventos",
  templateUrl: "./eventos.component.html",
  styleUrls: ["./eventos.component.css"],
})
export class EventosComponent implements OnInit {
  file: File;
  fileNameToUpdate: string;

  eventos: Evento[] = [];
  evento: Evento;
  bodyDeletarEvento: string;
  imagemLargura: number = 100;
  imagemMargem: number = 2;
  mostrarImagem: boolean = false;
  registerForm: FormGroup;
  dataEvento: string;

  modoSalvar = "";

  dataAtual: string;

  eventosFiltrados: any = [];

  _filtroLista: string;

  constructor(
    private eventoService: EventoService,
    // , private modalService: BsModalService
    private fb: FormBuilder,
    private localeService: BsLocaleService
  ) {
    this.localeService.use("pt-br");
  }

  get filtroLista() {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
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
      (err) => console.log(err)
    );
  }

  validation() {
    this.modoSalvar = "post";

    this.registerForm = this.fb.group({
      id: [0],

      tema: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],

      local: ["", [Validators.required]],

      dataEvento: ["", [Validators.required]],

      imgUrl: ["", [Validators.required]],

      qtdPessoas: ["", [Validators.required, Validators.max(120000)]],

      telefone: ["", [Validators.required]],

      email: ["", [Validators.required, Validators.email]],
    });
  }

  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === "post") {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
          (res: Evento) => {
            template.hide();
            this.getEventos();
          },
          (error) => console.log(error)
        );

        return;
      }

      this.evento = Object.assign({}, this.registerForm.value);

      this.uploadImagem();

      this.eventoService.putEvento(this.evento).subscribe(
        (res) => {
          template.hide();
          this.getEventos();
        },
        (error) => console.log(error)
      );
    }
  }

  uploadImagem() {
    if(this.modoSalvar === 'post') {
      const nomeArquivo = this.evento.imgUrl.split('\\', 3);
      this.evento.imgUrl = nomeArquivo[2];

      this.eventoService.postUpload(this.file, nomeArquivo[2])
        .subscribe(() => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        });

      return;
    }

    this.eventoService.postUpload(this.file, this.fileNameToUpdate)
      .subscribe(() => {
        this.dataAtual = new Date().getMilliseconds().toString();
        this.getEventos();
      });
    this.evento.imgUrl = this.fileNameToUpdate;

    // const nomeArquivo = this.evento.imgUrl.split("\\", 3);
    // this.evento.imgUrl = nomeArquivo[2];

    // this.eventoService.postUpload(this.file).subscribe();
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
    }
  }

  confirmarExcluisaoEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.tema}`;
  }

  excluirEvento(template) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      (res) => {
        template.hide();
        this.getEventos();
      },
      (error) => console.log(error)
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = "put";
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imgUrl.toString();
    this.evento.dataEvento = new Date(this.evento.dataEvento);
    this.evento.imgUrl = "";
    this.registerForm.patchValue(this.evento);
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }
}
