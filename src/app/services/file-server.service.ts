import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FileServerService {

  constructor(private http: HttpClient) { }


  getToken() {
    let httpHeaders = new HttpHeaders();
   
    httpHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    httpHeaders.append('Access-Control-Allow-Origin', '*');
    httpHeaders.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    httpHeaders.append("Authorization", "Basic " + btoa("htpasjZfw8c_w6Y5iAX4ufW7_3oa:MS3vFz98wpKiu2zxsIVB2JWy5z8a"));

    let urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("username", "suscriber");
    urlencoded.append("password", "123456");
    console.log(urlencoded.toString());

    return this.http.post(`https://sso-poc.quito.gob.ec:9443/token`, urlencoded, { headers: httpHeaders });

  }

}
