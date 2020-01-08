import { Pipe, PipeTransform } from '@angular/core';
import { Result } from '../menace/menace';

@Pipe({
  name: 'result',
  pure: true,
})
export class ResultPipe implements PipeTransform {

  transform(result: Result): string {
    switch (result) {
      case Result.Player:
        return 'Player has won';
      case Result.Menace:
        return 'Menace has won';
      case Result.Draw:
        return 'It\'s a draw';
    }
  }

}
