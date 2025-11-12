import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { supabase } from '../../supabaseClient';
@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  async ngOnInit() {

    const { data: {session} } = await supabase.auth.getSession();
    if(!session) {
      supabase.auth.onAuthStateChange((event, session) => {
        if(session){
          console.log("User signed in", session.user);
        }
      });
    } else{
      console.log("User already signed in", session.user);
    }

  }

}