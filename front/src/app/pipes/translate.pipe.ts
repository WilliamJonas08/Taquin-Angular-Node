import { Pipe, PipeTransform } from '@angular/core';
import { translations } from './fr';

@Pipe({
name: 'Translate', 
})

export class TranslatePipe implements PipeTransform {
  transform(value:string): string {
    // Si translation[value] existe -> translation[value]
    // Sinon -> value
    return translations[value] ? translations[value] : value
  }

  //ON PEUT AJOUTER DES IF SI ON VEUT CHOISIR LA LANGUE DU SITE INTERNET PAR EXEMPLE
}
