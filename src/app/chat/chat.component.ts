import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Mensaje } from './models/mensaje';
import { RequestDto } from './models/requestDto';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private client!: Client;
  conectado: boolean = false;
  mensaje: Mensaje = new Mensaje();
  requestDto: RequestDto = new RequestDto();
  mensajes: Mensaje[] = [];
  escribiendo: string ='';
  usuarioId: string = '';

  constructor() { }

  ngOnInit(): void {

    // crear una instancia del cliente y conectarse al websocket
    this.client = new Client();
    this.client.webSocketFactory = () => {
      //return new SockJS( "http://localhost:8183/agcrccortes-websocket" );
      return new SockJS( "http://10.223.105.30:8183/atcmovilbackend/agcrccortes-websocket" );
    }

    // escucha cuando alguien se conecta
    this.client.onConnect = ( frame ) => {
      console.log( 'Conectados Chat: ' + this.client.connected + ' : ' + frame );
      this.conectado = true;

      // parametros: ( nombre del evento, evento que responde el broker)
      // el subscribe sirve de escucha
      this.client.subscribe( '/channel/recibo/coordenadas', e => {
        console.log( "Recibido del servidor en el Usuario: ");
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

  enviarMensaje(): void{

    // manejamos el tipo de mensaje para saber que cosa enviar
    // parametros de envio, ( destino del endpoint, un objeto )

    this.mensaje.color = "rojo";
    this.mensaje.texto = "texto";
    this.client.publish(
      {
        destination: '/app/coordenadas',
        body: JSON.stringify( this.mensaje )
      } );
    this.mensaje.texto = '';
    console.log('enviando');
  }

  escribiendoEvento(): void{
    this.client.publish(
      {
        destination: '/app/coordenadas',
        body: JSON.stringify( this.mensaje )
      } );
  }
}
