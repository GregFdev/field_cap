import { Component, OnInit, Input } from '@angular/core';
import { AlphaVantageService } from '../alpha-vantage.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnInit {

  @Input()
  public currency: string;
  public rate: string;
  public refreshTime: Date;
  public apiCallCount: number;
  public previousRate: string;

  constructor(private alphaVantageService: AlphaVantageService) { }

  ngOnInit() {

    this.previousRate = sessionStorage.getItem(this.currency);
    this.apiCallCount = parseInt(sessionStorage.getItem('count'), 10);

      let loop = setInterval(() => {

        try {
          
          this.alphaVantageService.get(this.currency).subscribe(result => {

            if (result['Note']) {         // result of too many API calls to service
              this.rate = this.previousRate;

            } else if (!result) {         // some type of API error so result is null
              this.rate = this.previousRate;

            } else {                      // valid rate from API
              this.rate = result['Realtime Currency Exchange Rate']['5. Exchange Rate'];
              this.refreshTime = result['Realtime Currency Exchange Rate']['6. Last Refreshed'];
              this.apiCallCount++;
              sessionStorage.setItem(this.currency, this.rate);
              sessionStorage.setItem('count', this.apiCallCount.toString());
            }

          });

        } catch {
          console.log(' possible ERROR with API call ')
          clearInterval(loop);

        };

        if (this.apiCallCount > 499) {
          alert('Too many API calls today.  Auto calling stopped.  Please try again tomorrow!');
          this.apiCallCount = 0;
          clearInterval(loop);
          
        }
      }, 6000);
    };
    
    
  };
