import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
