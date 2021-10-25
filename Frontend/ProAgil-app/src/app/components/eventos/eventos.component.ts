import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: any = []

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }

  getEventos() {
    let baseUrl = "http://localhost:5000";

    this.httpClient.get(baseUrl + '/api/evento').subscribe(
      res => { this.eventos = res },
      err => { console.log(err) }
    );
  }

}
