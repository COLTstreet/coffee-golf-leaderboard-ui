import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, CalendarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class AppComponent {
  title = 'coffee-golf';

  public selectedDate: any;
  public scores: any = [];
  public months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor(
    public _dataService: DataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.selectedDate = new Date()
    let callDate = `${this.months[this.selectedDate.getMonth()]}-${this.selectedDate.toLocaleDateString().split("/")[1]}-${this.selectedDate.getFullYear()}`
    this._dataService
      .getScoresByDay(callDate)
      .subscribe((response: any) => {
        this.scores = response.sort((a: any, b: any) =>
          Number(a.strokes) > Number(b.strokes) ? 1 : -1
        );
      });
  }

  updateDataByDay() {
    let callDate = `${this.months[this.selectedDate.getMonth()]}-${this.selectedDate.toLocaleDateString().split("/")[1]}-${this.selectedDate.getFullYear()}`
    this._dataService
      .getScoresByDay(callDate)
      .subscribe((response: any) => {
        this.scores = response.sort((a: any, b: any) =>
          Number(a.strokes) > Number(b.strokes) ? 1 : -1
        );
      });
  }
}
