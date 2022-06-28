import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VotingService } from './voting.service';
import { VotingComponent } from './voting/voting.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { VoteTypeService } from './vote-type.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    VotingComponent,
    HomeComponent,
    NotFoundComponent,
    AboutComponent,
    FaqComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [VotingService, VoteTypeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
