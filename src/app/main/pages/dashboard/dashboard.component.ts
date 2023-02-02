import { Component, ViewEncapsulation, OnInit, ElementRef } from '@angular/core';
import { EventService } from '../events/services/event.service';
import { Event } from '../events/models/event.model';

import * as echarts from "echarts";
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'app/main/admin/users/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class DashboardComponent implements OnInit {
  
  private days: number[] = [];

  public eventsList: Event[];
  public annualRev= 0;
  public annualSpending= 0;
  public monthlyRev= 0;
  public monthlySpending= 0;
  public monthlyAdvances= 0

  private annualRevCategories = [];
  private tempAnnualRevCategories = [];
  private monthlyRevCategories = [];
  private tempMonthlyRevCategories = [];

  private annualSpeningCategories = [];
  private tempAnnualSpeningCategories = [];
  private monthlySpeningCategories = [];
  private tempMonthlySpeningCategories = [];
  
  public currentYears = [];
  public year = new Date().getFullYear();
  public month = new Date().getMonth();
  public chosenYear = new Date().getFullYear();
  public chosenMonth = new Date().getMonth();

  public chartMonth = new Date(this.year,this.month,1);

  private revenueData = [];
  private spendingData= [];
  private balanceData= [];

  public lineChart;
  public annualRevChart ;
  public monthlyRevChart ;
  public annualSpendingChart ;
  public monthlySpendingChart;

  constructor(private eventService : EventService, private elm:ElementRef, private userService: UserService, private route: Router) {}

  calculateYears(cYear){
    let yearsArray = [];
    for(let i = 2019;i<cYear+2;i++){
      yearsArray.push(i);
    }
    return yearsArray;
  }
  
  calculateAnnual(events : Event[]){
    this.annualRev = 0;
    this.annualSpending = 0;
    let today = new Date();
    let thisYear = today.getFullYear();
    for(const event of events){
      let day = new Date(event.date);
      let year = day.getFullYear();
      if((event.type == 'Revenue') && (year == thisYear)){
        this.annualRev = this.annualRev + event.value;
      }else if((event.type == 'Dépense') && (year == thisYear)){
        this.annualSpending = this.annualSpending + event.value;
      }
    }
    
  }
  AnnualCategory(events : Event[]){
    this.annualRevCategories = [];
    this.annualSpeningCategories = [];
    let today = new Date();
    let thisYear = today.getFullYear();
    for(const event of events){
      let day = new Date(event.date);
      let year = day.getFullYear();
      if((event.type == 'Revenue') && (year == thisYear)){
        this.tempAnnualRevCategories.push({
          name:event.category.name,
          value:event.value
        });
      }else if((event.type == 'Dépense') && (year == thisYear)){
        this.tempAnnualSpeningCategories.push({
          name:event.category.name,
          value:event.value
        });
      }
    }

    const groupByName = this.tempAnnualRevCategories.reduce((group, item) => {
      const { name } = item;
      const { value } = item;
      group[name] = group[name] ?? [];
      group[name].push((item));
      return group;
    }, {});
    
    let names = Object.keys(groupByName);
    let tempVal = 0;
    for(let name of names){
      if(groupByName[name].length>1){
        for(let a of groupByName[name]){
          tempVal = tempVal + a.value
        }
        this.annualRevCategories.push({
          name:groupByName[name][0].name,
          value: tempVal
        });      
      }else{
        this.annualRevCategories.push({
          name:groupByName[name][0].name,
          value: groupByName[name][0].value
        });
      }
      tempVal = 0;
    }

    // ________________________________________________________

    const groupByNameDep = this.tempAnnualSpeningCategories.reduce((group, item) => {
      const { name } = item;
      const { value } = item;
      group[name] = group[name] ?? [];
      group[name].push((item));
      return group;
    }, {});
    
    let namesDep = Object.keys(groupByNameDep);
    let tempDepVal = 0;
    for(let name of namesDep){
      if(groupByNameDep[name].length>1){
        for(let a of groupByNameDep[name]){
          tempDepVal = tempDepVal + a.value
        }
        this.annualSpeningCategories.push({
          name:groupByNameDep[name][0].name,
          value: tempDepVal
        });      
      }else{
        this.annualSpeningCategories.push({
          name:groupByNameDep[name][0].name,
          value: groupByNameDep[name][0].value
        });
      }
      tempDepVal = 0;
    }
    
  }
  MonthlyCategory(events : Event[]){
    this.monthlyRevCategories = [];
    this.monthlySpeningCategories = []
    let today = new Date();
    let thisMonth = today.getMonth();
    let thisYear = today.getFullYear();
    for(const event of events){
      let day = new Date(event.date);
      let month = day.getMonth();
      let year = day.getFullYear();
      if((event.type == 'Revenue') && (month == thisMonth) && (year == thisYear)){
        this.tempMonthlyRevCategories.push({
          name:event.category.name,
          value:event.value
        });    
       }else if ((event.type == 'Dépense') && (month == thisMonth) && (year == thisYear)){
        this.tempMonthlySpeningCategories.push({
          name:event.category.name,
          value:event.value
        });   
       }
    }
    const groupByName = this.tempMonthlyRevCategories.reduce((group, item) => {
      const { name } = item;
      const { value } = item;
      group[name] = group[name] ?? [];
      group[name].push((item));
      return group;
    }, {});
    let names = Object.keys(groupByName);
    let tempVal = 0;
    for(let name of names){
      if(groupByName[name].length>1){
        for(let a of groupByName[name]){
          tempVal = tempVal + a.value
        }
        this.monthlyRevCategories.push({
          name:groupByName[name][0].name,
          value: tempVal
        });      
      }else{
        this.monthlyRevCategories.push({
          name:groupByName[name][0].name,
          value: groupByName[name][0].value
        });
      }
      tempVal = 0;
    }
     // ________________________________________________________

     const groupByNameDep = this.tempMonthlySpeningCategories.reduce((group, item) => {
      const { name } = item;
      const { value } = item;
      group[name] = group[name] ?? [];
      group[name].push((item));
      return group;
    }, {});
    
    let namesDep = Object.keys(groupByNameDep);
    let tempDepVal = 0;
    for(let name of namesDep){
      if(groupByNameDep[name].length>1){
        for(let a of groupByNameDep[name]){
          tempDepVal = tempDepVal + a.value
        }
        this.monthlySpeningCategories.push({
          name:groupByNameDep[name][0].name,
          value: tempDepVal
        });      
      }else{
        this.monthlySpeningCategories.push({
          name:groupByNameDep[name][0].name,
          value: groupByNameDep[name][0].value
        });
      }
      tempDepVal = 0;
    }
  }
  calculatemonthly(events : Event[]){
    this.monthlyRev = 0;
    this.monthlySpending = 0;
    this.monthlyAdvances = 0;
    let today = new Date();
    let thisMonth = today.getMonth();
    let thisYear = today.getFullYear();
    for(const event of events){
      let day = new Date(event.date);
      let month = day.getMonth();
      let year = day.getFullYear();
      if((event.type == 'Revenue') && (month == thisMonth) && (year == thisYear)){
        this.monthlyRev = this.monthlyRev + event.value;
      }else if((event.type == 'Dépense') && (month == thisMonth) && (year == thisYear)){
        this.monthlySpending = this.monthlySpending + event.value;
      }else if((event.type == 'Avance') && (month == thisMonth) && (year == thisYear)){
        this.monthlyAdvances = this.monthlyAdvances + event.value;
      }
    }
  }
  
  refreshEventsList(chartMonth) {
    chartMonth = new Date(this.year,this.month,1);
    this.eventService.getEventsList().subscribe(data=>{
      this.eventsList = data as Event[];

      this.calculateAnnual(this.eventsList);
      this.calculatemonthly(this.eventsList);
      this.AnnualCategory(this.eventsList);
      this.MonthlyCategory(this.eventsList);
      this.getDataInMonth(chartMonth);
      
      if(document.getElementById('linechart')==null){
        return
      }
      echarts.dispose(document.getElementById('linechart'));
      this.lineChart = echarts.init(document.getElementById('linechart'));

      if(document.getElementById('annualRevChart')==null){
        return
      }
      echarts.dispose(document.getElementById('annualRevChart'));
      this.annualRevChart = echarts.init(document.getElementById('annualRevChart'));
      
      if(document.getElementById('monthlyRevChart')==null){
        return
      }
      echarts.dispose(document.getElementById('monthlyRevChart'));
      this.monthlyRevChart = echarts.init(document.getElementById('monthlyRevChart'));
      
      if(document.getElementById('annualSpendingChart')==null){
        return
      }
      echarts.dispose(document.getElementById('annualSpendingChart'));
      this.annualSpendingChart = echarts.init(document.getElementById('annualSpendingChart'));
      
      if(document.getElementById('monthlySpendingChart')==null){
        return
      }
      echarts.dispose(document.getElementById('monthlySpendingChart'));
      this.monthlySpendingChart = echarts.init(document.getElementById('monthlySpendingChart'));
      

      this.annualRevChart.setOption( {
        title: {
          text: 'Dépense annuel',
          subtext: 'Total: ' + this.annualSpending,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal',          
          bottom: 'bottom'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            data: this.annualSpeningCategories,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
      this.monthlyRevChart.setOption({
        title: {
          text: 'Dépense mensuel',
          subtext: 'Total: ' + this.monthlySpending,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal',          
          bottom: 'bottom'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            data: this.monthlySpeningCategories,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
      this.annualSpendingChart.setOption({
        title: {
          text: 'Revenu annuel',
          subtext: 'Total: ' + this.annualRev,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal',          
          bottom: 'bottom'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            data: this.annualRevCategories,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
      this.monthlySpendingChart.setOption({
        title: {
          text: 'Revenu mensuel',
          subtext: 'Total: ' + this.monthlyRev,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal',          
          bottom: 'bottom'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            data: this.monthlyRevCategories,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
      this.lineChart.setOption({
      
        title: {
          text: 'Opérations financières '
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
        data: ['Revenue', 'Dépense', 'Balance']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.days
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Revenue',
            type: 'line',
            data: this.revenueData,
            color: '#28C76F'
          },
          {
            name: 'Dépense',
            type: 'line',
            data: this.spendingData,
            color: '#EA5455'
          },
          {
            name: 'Balance',
            type: 'line',
            data: this.balanceData,
            color: '#7367F0'
          },
        ]
    });
      },(err)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.userService.logout();
            this.route.navigate(['pages/authentication/login-v2']);
          }
        }else{
          alert('Erreur');
        }
      }
      );
  }
  refreshLineChart() {
    let chartMonth = new Date(this.chosenYear,this.chosenMonth,1);
    this.eventService.getEventsList().subscribe(data=>{
      this.eventsList = data as Event[];
      this.getDataInMonth(chartMonth);
      

      this.lineChart.setOption({
      
        title: {
          text: 'Opérations financières '
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
        data: ['Revenue', 'Dépense', 'Balance']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.days
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Revenue',
            type: 'line',
            data: this.revenueData,
            color: '#28C76F'
          },
          {
            name: 'Dépense',
            type: 'line',
            data: this.spendingData,
            color: '#EA5455'
          },
          {
            name: 'Balance',
            type: 'line',
            data: this.balanceData,
            color: '#7367F0'
          },
        ]
    });
      },(err)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            this.userService.logout();
            this.route.navigate(['pages/authentication/login-v2']);
          }
        }else{
          alert('Erreur');
        }
      }
      );
  }
  getDaysInMonth(tempDate) {
    var date = new Date(tempDate.toString());
    var month = date.getMonth();
    while (date.getMonth() === month) {
      this.days.push(new Date(date).getDate());
      date.setDate(date.getDate() + 1);
    }
  }
  getDataInMonth(tempDate) {
    this.days= [];
    if(this.revenueData.length>10){
      this.revenueData = [];
      this.spendingData = [];
      this.balanceData = [];
    }
    this.getDaysInMonth(tempDate);
    var date = new Date(tempDate.toString());
    var month = date.getMonth();
    var year = date.getFullYear();
    while (date.getMonth() === month) {
      this.revenueData.push(0);
      this.spendingData.push(0);
      date.setDate(date.getDate() + 1);
    }
    for(let event of this.eventsList){
      let eventDate = new Date(event.date);
      if(eventDate.getMonth()===month && event.type === 'Revenue' && eventDate.getFullYear()===year){
        this.revenueData[eventDate.getDate()-1]= this.revenueData[eventDate.getDate()-1] + event.value;
      }else if(eventDate.getMonth()===month && event.type === 'Dépense' && eventDate.getFullYear()===year){
        this.spendingData[eventDate.getDate()-1]= this.spendingData[eventDate.getDate()-1] + event.value;
      }
    }
    let balanceVal=0;
    for(let i=0;i<this.revenueData.length;i++){
      balanceVal = balanceVal +this.revenueData[i]-this.spendingData[i]
      this.balanceData.push(balanceVal);
    }
  }
  ngOnInit() :void {
    this.refreshEventsList(this.chartMonth);
    this.getDaysInMonth(this.chartMonth);
    this.currentYears = this.calculateYears(this.year);
  }
 
}

