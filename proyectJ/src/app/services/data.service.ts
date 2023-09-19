import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataCrudModel } from '../models/data.model';
import { map } from "rxjs/operators";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
// Clase que define la comunicación entre la app y la base de datos
export class DataService {

  // Url de conexión hacia la base de datos firebase
  private url = "https://ang-proyect-default-rtdb.firebaseio.com";
  public user: any = {};

  constructor(private http: HttpClient, public auth: AngularFireAuth, private router:Router) { 
    // Parámetro que determina si se ha variado los datos de autenticación cambia cuando hay conexión con google
    this.auth.authState.subscribe( us => {
      if( !us ){
        return
      }
      // Parámetros globales que se los puede utilizar en cualquier parte del programa
      this.user.nombre = us.displayName;
      // El UID se genera cada vez que el usuario se loguee en la app
      this.user.uid = us.uid;
    })
  }

  // Metodo para realizar la inserción de un dato en firebase
  crearData(data: DataCrudModel){
    return this.http.post(`${this.url}/proyecto.json`, data)
            .pipe(map( (resp: any) => {
              // El método pipe y map devuelven los valores creados como resultado de la inserción 
              data.id = resp.name;
              return data;
            }))
  }

  // Se actualiza mediante la función put los datos almacenados en firebase para esto se toma en consideración el ID
  actualizarData(data: DataCrudModel){
    return this.http.put(`${this.url}/proyecto/${data.id}.json`, data)
  }

  // Se obtiene como formato json todos los datos almacenados en firebase
  obtenerData(){
    return this.http.get(`${this.url}/proyecto.json`)
            .pipe(map( this.crearVectorData ))
  }

  // Se obtiene un solo dato utilizando como consulta el id
  obtenerDataId(data: DataCrudModel){
    return this.http.get(`${this.url}/proyecto/${data.id}.json`)
  }

  // Método para eliminar un registro utilizando el id como identificador
  deleteData(data: DataCrudModel){
    return this.http.delete(`${this.url}/proyecto/${data.id}.json`)
  }

  // Se genera un vector de información que devuelve un json de la data en la base

  private crearVectorData(dataObject: {[key: string]: any}){
    const datos: DataCrudModel[] = [];

    if(dataObject === null){return [];}

    Object.keys( dataObject ).forEach( key => {
      const data: DataCrudModel = dataObject[key];
      data.id = key;
      datos.push(data);
    });

    return datos;
  }

  // Método para registrar el acceso utilizando GOOGLE
  async login() {
    // Los método aquí definidos corresponden al @angular/fire
    await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    await sessionStorage.setItem('token', this.user.uid);
    this.router.navigate(['/GestionarData'])
  }
  // Método para salir del sistema
  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/Login'])
  }
}
