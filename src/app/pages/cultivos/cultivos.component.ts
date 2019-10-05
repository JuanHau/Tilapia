import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CultivosService } from "../../services/cultivos.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Cultivos } from 'src/app/interfaces/cultivos.interface';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';


@Component({
  selector: 'app-cultivos',
  templateUrl: './cultivos.component.html',
  styleUrls: ['./cultivos.component.css']
})
export class CultivosComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns = ['indice', 'estatus', 'fechaInicio', 'fechaFin', "pecesInicio", "pecesActual", "tiempoLectura", "botones"];
  dataSource: any;

  constructor(public cultivosService: CultivosService, private modalService: NgbModal) {
    this.obtenerCultivo();
  }
  
  cultivo: Cultivos = {
    fechaFin: "",
    fechaInicio: "",
    identificador: 0,
    indice: 0,
    pecesActual: "",
    pecesInicio: 0,
    estatus: true,
    tiempoLectura: 0
  };

  identificador: Number;

  public mostrar = true;

  formCultivo = new FormGroup({
    fechaInicio: new FormControl(''),
    fechaFin: new FormControl(''),
    pecesInicio: new FormControl(''),
    pecesActual: new FormControl(''),
    tiempoLectura: new FormControl(''),
    estatus: new FormControl('')
  });

  titulo: String;

  public nuevo(content, titulo) {
    this.titulo = titulo;
    this.formCultivo.patchValue({
      estatus: 1,
      fechaFin: '',
      fechaInicio: '',
      pecesActual: '',
      pecesInicio: '',
      tiempoLectura: ''
    });
    this.modalService.open(content);
  }

  public cambiarEstatus(identificador: Number,estatus: boolean){
    let accion: String = estatus ? "activar" : "inactivar";
    Swal.fire({
      type: 'question',
      title: accion.charAt(0).toUpperCase() + accion.slice(1) + ' cultivo',
      text: '¿Desea ' + accion + ' el cultivo?',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      focusCancel: true,
      confirmButtonText: accion.charAt(0).toUpperCase() + accion.slice(1),
      preConfirm: ()=>{
        this.cultivosService.cambiarEstatus(identificador, estatus);
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result)=>{
      if(result.value){
        this.obtenerCultivo();
        Swal.fire(
          {
            type: 'success',
            title: estatus ? 'Registro activado correctamente':'Registro inactivado correctamente',
            showConfirmButton: false,
            timer: 1500
          }
        );
      }
    })
  }

  public guardado(data: FormGroup){
    this.cultivo.fechaFin = data.controls["fechaFin"].value;
    this.cultivo.pecesActual = data.controls["pecesActual"].value == "Sin revisión" ? "" : data.controls["pecesActual"].value;
    this.cultivo.tiempoLectura = data.controls["tiempoLectura"].value;
    this.cultivo.identificador = this.identificador;
    this.cultivosService.ActualizarCultivo(this.cultivo).then(()=> {
      this.obtenerCultivo();
      this.modalService.dismissAll("Si");
      Swal.fire(
        {
          type: 'success',
          title: 'Registro modificado correctamente',
          showConfirmButton: false,
          timer: 1500
        }
      );
    });
  }

  public obtenerCultivo(){
    this.cultivosService.CargarCultivos().subscribe(
      x=> {
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = x;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    )
  }

  public open(content, titulo, idc, modo) {
    this.identificador = idc;
    this.mostrar = true;
    this.cultivosService.BuscarCultivo(idc).then(() => {
      this.titulo = titulo;
      this.formCultivo.patchValue({
        fechaInicio: this.cultivosService.cultivo[0].fechaInicio,
        fechaFin: this.cultivosService.cultivo[0].fechaFin,
        pecesInicio: this.cultivosService.cultivo[0].pecesInicio,
        pecesActual: this.cultivosService.cultivo[0].pecesActual,
        tiempoLectura: this.cultivosService.cultivo[0].tiempoLectura,
        estatus: this.cultivosService.cultivo[0].estatus ? 1 : 0
      });

      this.formCultivo.controls["fechaFin"].enable();
      this.formCultivo.controls["pecesActual"].enable();
      this.formCultivo.controls["tiempoLectura"].enable();

      this.formCultivo.controls["fechaInicio"].disable();
      this.formCultivo.controls["pecesInicio"].disable();
      
      if (modo === "V") {
        this.formCultivo.controls["fechaFin"].disable();
        this.formCultivo.controls["pecesActual"].disable();
        this.formCultivo.controls["tiempoLectura"].disable();
        this.mostrar = false;
      }
      
      this.modalService.open(content);

    }).catch(() => {
      //CONFIGURAR EL MENSAJE CON SWEET ALERT
    })


  }

  ngOnInit() {
  }
}



