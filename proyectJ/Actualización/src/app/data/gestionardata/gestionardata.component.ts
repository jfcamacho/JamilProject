import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DataCrudModel } from 'src/app/models/data.model';
import { DataService } from 'src/app/services/data.service';
import { NgForm } from '@angular/forms';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from "@angular/fire/storage";

@Component({
  selector: 'app-gestionardata',
  templateUrl: './gestionardata.component.html',
  providers: [MessageService]
})
export class GestionardataComponent implements OnInit {
  upData: Boolean = false;
  upDataTitle: String;
  dataCrud: DataCrudModel;
  uploadedFiles: any[] = [];
  listData: DataCrudModel[] = [];

  constructor(private router:Router, private dataService: DataService, private messageService: MessageService, private storage: Storage) { }

  ngOnInit(): void {
    this.obtenerdata();
  }

  private obtenerdata(){
    this.dataCrud = new DataCrudModel();
    // Em método subscribe se usa para ejecutar el servicio
    this.dataService.obtenerData().subscribe( resp => {
      this.listData = resp;
    });
  }

  // Se devuelve el value del event para realizar una busqueda por contenido
  getEventValue($event:any) :string {
    return $event.target.value;
  }

  salir(){
    // se destruye el token de acceso almacenado en la session local
    sessionStorage.removeItem('token');
    this.dataService.logout();
  }

  // Método para generar un nuevo dato o actualizar un dato ya existente
  upDataEvent(data: DataCrudModel){
    //this.dataCrud.titulo === '' ? this.upDataTitle = 'NUEVO REGISTRO...' : this.upDataTitle = 'ACTUALIZAR REGISTRO...';
    this.showDialog();
    if(data != null){
      this.dataCrud = data;
    }else{
      this.dataCrud = new DataCrudModel();
    }
  }

  private showDialog(){
    this.upData ? this.upData = false : this.upData = true;
  }

  // Carga de imágenes al servidor firebase
  async onUpload($event: any) {
    // Se obtiene el archivo que se va a guardar
    const file =$event.files[0];
    // Se obtiene la referencia deonde será almacenado el archivo
    const imgref = ref(this.storage, `images/${file.name}`)
    this.messageService.add({key:'key2', severity:'info', summary: 'Cargando...', detail: 'Cargando contenido...', sticky: true});
    // Se almacena el archivo en firebase
    await uploadBytes(imgref, file)
    .then( resp => {
      const imgUrl = getDownloadURL(imgref).then (resp => {
        this.dataCrud.image = resp;
        this.messageService.clear();
        this.messageService.add({key:'key2', severity:'success', summary: 'Éxito...', detail: 'Contenido cargado...'});
      });
    })
    .catch( error => {
      console.log(error);
    })
  }

  // Carga de videos en el servido
  async onUploadVideo($event: any) {
    const file =$event.files[0];
    const imgref = ref(this.storage, `videos/${file.name}`)
    this.messageService.add({key:'key2', severity:'info', summary: 'Cargando...', detail: 'Cargando contenido...', sticky: true});

    await uploadBytes(imgref, file)
    .then( resp => {
      const imgUrl = getDownloadURL(imgref).then (resp => {
        this.dataCrud.video = resp;
        this.messageService.clear();
        this.messageService.add({key:'key2', severity:'success', summary: 'Éxito...', detail: 'Contenido cargado...'});
      });
    })
    .catch( error => {
      console.log(error);
    })
  }

  // Función para eliminaar un dato del servidor
  async borrar(data: DataCrudModel){
    await this.dataService.deleteData(data).subscribe( resp => {
      this.obtenerdata();
      this.messageService.add({key:'key1', severity:'success', summary: 'Éxito!!!', detail: 'Dato eliminado con éxito'});
    });
  }

  // Método para almacenar/actualizar un dato de firebase
  async guardar(form: NgForm){
    if(form.invalid){
      return
    }
    // Si el objeto tiene un id se actualiza caso contrario se elimina
    if(this.dataCrud.id){
      this.dataService.actualizarData(this.dataCrud).subscribe( resp => {
        this.obtenerdata();
        this.showDialog();
        this.messageService.add({key:'key1', severity:'success', summary: 'Éxito!!!', detail: 'Dato actualizado con éxito'});
      })
    }else {
      await this.dataService.crearData(this.dataCrud).subscribe( resp => {
        this.obtenerdata();
        this.showDialog();
        this.messageService.add({key:'key1', severity:'success', summary: 'Éxito!!!', detail: 'Dato registrado con éxito'});
      })
    }


  }

}
