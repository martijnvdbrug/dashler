import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements AfterViewInit {

  message = 'Loading...';
  messages = [
    'Connecting to dimension C-132...',
    'Crystalizing xanthenite...',
    'Undoing Cronenbergization of C-137...',
    'Splitting time into zones...',
    'Getting data from Gazorpazorp...'
  ];

  async ngAfterViewInit(): Promise<void> {
    setTimeout(() => this.randomMessage(), 10000);
  }

  randomMessage() {
    this.message = this.messages[Math.floor(Math.random() * Math.floor(this.messages.length))];
    setTimeout(() => this.randomMessage(), 10000);
  }

}
