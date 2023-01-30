import { Component, OnInit } from '@angular/core';
import { FileServerService } from '../services/file-server.service';
import { Wso2Service } from '../services/wso2.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {
  year = new Date().getFullYear();
  constructor( private wso2Service:Wso2Service ) { }

  ngOnInit(): void {
    this.wso2Service.getToken().subscribe((resp:any)=>{
      console.log(resp);
      localStorage.setItem('token',resp.data.access_token);
    });

  }

}
