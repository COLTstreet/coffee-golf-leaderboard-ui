import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class AppComponent {
  title = 'coffee-golf';

  public selectedDate: any;
  public scores: any = []

  constructor(public _dataService: DataService, private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.selectedDate = new Date()
    this._dataService.getScoresByDay('July-8-2024').subscribe((response: any) => {
      this.scores = response
    })

  }
}
