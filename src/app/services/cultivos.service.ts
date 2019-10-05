import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cultivos } from "../interfaces/cultivos.interface";
import { resolve } from 'url';
import { reject } from 'q';
import { Observable } from 'rxjs';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class CultivosService {

  cultivos: Cultivos[] = [];
  cultivo: Cultivos[] = [];

  constructor(private http: HttpClient) { 
    // this.CargarCultivos();
  }

  public CargarCultivos():Observable<Cultivos[]>{
    return this.http.get<Cultivos[]>('http://localhost/backend/api/ListarCultivos.php');


    // return new Promise((resolve, reject)=> {
    //   this.http.get('http://localhost/backend/api/ListarCultivos.php')
    //   .subscribe((resp: Cultivos[])=> {
    //     this.cultivos = resp;
    //     resolve();
    //   });
    // });
  }

  public BuscarCultivo(idc){
    return new Promise((resolve, reject)=> {
      this.http.get('http://localhost/backend/api/BuscarCultivo.php?idc=' + idc)
      .subscribe((resp: Cultivos[])=> {
        this.cultivo = resp;
        resolve();
      });
    });
  }

  public ActualizarCultivo(cultivo: Cultivos){
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');


    return new Promise((resolve, reject)=>{
      this.http.post('http://localhost/backend/api/ActualizarCultivo.php', {data: {cultivo}}, {headers: headers}).subscribe(()=> {
        resolve();
      });
    });
  }

  public cambiarEstatus(identificador: Number, estatus: boolean){
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

    return new Promise((resolve, reject)=>{
      this.http.post('http://localhost/backend/api/EstatusCultivo.php', {idc: identificador, estatus: estatus}, {headers: headers}).subscribe(()=> {
        resolve();
      });
    });
  }
}
