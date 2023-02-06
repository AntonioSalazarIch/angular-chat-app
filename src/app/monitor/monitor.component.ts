import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Mensaje } from '../chat/models/mensaje';


@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  private client!: Client;
  conectado: boolean = false;
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = [];
  escribiendo: string ='';
  usuarioId: string = '';

  constructor() { }

  ngOnInit(): void {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS( "http://localhost:8080/prueba-socket" );
    }

    this.client.onConnect = ( frame ) => {
      console.log( 'Conectados Monitor: ' + this.client.connected + ' : ' + frame );
      this.conectado = true;
      console.log( "nombre de agencia: " + this.mensaje.agencia );

      // parametros: ( nombre del evento, evento que responde el broker)
      // el subscribe sirve de escucha
      this.client.subscribe( '/channel/devolviendo', e => {
        console.log( JSON.parse( e.body ) );
      } );

    }

    this.client.onDisconnect = ( frame ) => {
      console.log( 'Desconectados: ' + !this.client.connected + ' : ' + frame );
      this.conectado = false;
    }

  }

  conectar(): void{
    this.client.activate();
  }

  desconectar(): void{
    this.client.deactivate();
  }


}
