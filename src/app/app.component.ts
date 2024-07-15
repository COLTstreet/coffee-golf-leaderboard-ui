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
  public monthData: any[] = [];
  public userScoreData: any[] = [];
  public months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  constructor(
    public _dataService: DataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.selectedDate = new Date();
    this.updateDataByDay();
    // this.getMonthlyLeaderboard();
  }

  updateDataByDay() {
    let callDate = `${this.months[this.selectedDate.getMonth()]}-${
      this.selectedDate.toLocaleDateString().split('/')[1]
    }-${this.selectedDate.getFullYear()}`;
    this._dataService.getScoresByDay(callDate).subscribe((response: any) => {
      this.scores = response.sort((a: any, b: any) =>
        Number(a.strokes) > Number(b.strokes) ? 1 : -1
      );
    });

    // this.getMonthlyLeaderboard()
  }

  getMonthlyLeaderboard() {
    let monthNum = this.selectedDate.getMonth() + 1;
    let daysInMonth = new Date(this.selectedDate.getFullYear(), monthNum, 0).getDate();

    let calls = 0
    for (let index = 1; index <= daysInMonth; index++) {
      let callDate = `${this.months[monthNum - 1]}-${index}-${this.selectedDate.getFullYear()}`;
      this._dataService.getScoresByDay(callDate).subscribe((response: any) => {
        this.monthData.push(...response);

        calls++
        if(calls === daysInMonth) {
          console.log(this.monthData);
          this.calculateScores(this.monthData, daysInMonth)
        }
      });
    }
  }

  calculateScores(data: any, daysInMonth: any) {
    const uniqueNames = [...new Set(data.map((item: any) => item.name))];
    console.log(uniqueNames)

    this.userScoreData = []
    for (let index = 0; index < uniqueNames.length; index++) {
      const user = uniqueNames[index];

      let userData = this.monthData.filter((ele: any) => ele.name === user)
      

      userData = userData.filter((ele: any) => {
        let userDate = new Date(ele.timestamp.seconds * 1000)
        console.log(userDate)
        return userDate.getMonth() === this.selectedDate.getMonth() ? true : false
      })
      let total = 0;
      for(let x = 0; x < userData.length; x++) {
        total += Number(userData[x].strokes)

        if(x === userData.length - 1) {
          let temp = {
            avatarUrl: userData[x].avatarUrl,
            name: userData[x].name,
            nickname: userData[x].nickname,
            strokes: total
          }
          this.userScoreData.push(temp)
        }
      }
      
    }
    this.userScoreData.sort((a: any, b: any) =>a.strokes > b.strokes ? 1 : -1);
    console.log(this.userScoreData)
  }
}
