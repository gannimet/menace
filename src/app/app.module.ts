import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TttBoardComponent } from './components/ttt-board/ttt-board.component';
import { ResultPipe } from './pipes/result.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TttBoardComponent,
    ResultPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
