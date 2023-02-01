import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class Wso2Service {

  constructor(private http:HttpClient) { }

  getToken(){
    return this.http.get(`${base_url}/wso2/token`).pipe(
      map((resp:any)=>{
        localStorage.setItem('token',resp.data.access_token);
      })
    );
  }
  
}
