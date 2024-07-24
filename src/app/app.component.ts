import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import moment from 'moment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, CalendarModule, ButtonModule, TabViewModule],
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
  public uniqueNames: any[] = [];
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
  }

  previousDay() {
    this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    this.selectedDate = new Date(this.selectedDate.toLocaleDateString())
    this.updateDataByDay()
  }

  nextDay() {
    this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    this.selectedDate = new Date(this.selectedDate.toLocaleDateString())
    this.updateDataByDay()
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

    this.getMonthlyLeaderboard()
  }

  getMonthlyLeaderboard() {
    let monthNum = this.selectedDate.getMonth() + 1;
    let daysInMonth = new Date(this.selectedDate.getFullYear(), monthNum, 0).getDate();
    this.monthData = []
    let missingDates = []

    let now = moment()
    let selected = moment(this.selectedDate)

    if(`${now.month()+1}-${now.date()}` === `${selected.month()+1}-${selected.date()}`) 
      daysInMonth = now.date()

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

    this.userScoreData = []
    for (let index = 0; index < uniqueNames.length; index++) {
      const user = uniqueNames[index];

      let userData = this.monthData.filter((ele: any) => ele.name === user)

      userData.map((ele: any) => {
        let userDate = new Date(ele.timestamp.seconds * 1000)
        let userMomentDate = moment(userDate)
        ele.date = `${this.months[userMomentDate.month()]}-${userMomentDate.date()}-${userMomentDate.year()}`
      })
      
      // this.userScoreData.push(userData)
      if(userData.length > daysInMonth - 5) {
        this.uniqueNames.push(userData[0].nickname)
        this.userScoreData.push(userData.sort((a: any, b: any) => moment(a.date) > moment(a.date) ? 1 : -1))
      //   let total = 0;
      //   for(let x = 0; x < userData.length; x++) {
      //     total += Number(userData[x].strokes)
  
      //     if(x === userData.length - 1) {
      //       let temp = {
      //         avatarUrl: userData[x].avatarUrl,
      //         name: userData[x].name,
      //         nickname: userData[x].nickname,
      //         scores: total
      //       }
      //       this.userScoreData.push(temp)
      //     }
      //   }
      }
      
    }
    this.buildMonthlyTable(this.userScoreData)
  }

  buildMonthlyTable(d: any) {


    const tableBody = document.querySelector('#data-table tbody');
    const nameHeaders = document.querySelector('#name-headers');

    // Extract unique names for column headers
    const uniqueNames = [...new Set(d.flat().map((obj: any) => obj.name))];

    // Add name headers
    uniqueNames.forEach((name) => {
      let nameHeader: any;
      nameHeader = document.createElement('th');
      nameHeader.textContent = name;
      nameHeaders!.appendChild(nameHeader);
    });

    // Create a map to store data by date and name
    let dataMap: any
    dataMap = {}

    d.forEach((arr: any) => {
        arr.forEach((obj: any) => {
            if (!dataMap[obj.date]) {
                dataMap[obj.date] = { timestamp: new Date(obj.timestamp.seconds * 1000).toLocaleString() };
            }
            dataMap[obj.date][obj.name] = obj;
        });
    });

    // Get sorted dates
    const sortedDates = Object.keys(dataMap).sort((a: any, b: any) => new Date(a).getTime() - new Date(b).getTime());

    // Fill the table with sorted data
    sortedDates.forEach(date => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date}</td>
        `;

        uniqueNames.forEach((name: any) => {
            const cell = document.createElement('td');
            if (dataMap[date][name]) {
                const obj = dataMap[date][name];
                if(obj.strokes === "") {
                  cell.classList.add("missing")
                }
                cell.innerHTML = `${obj.strokes}`;
            } else {
              cell.classList.add("missing")
            }
            row.appendChild(cell);
        });

        tableBody!.appendChild(row);
    });
  }
}
