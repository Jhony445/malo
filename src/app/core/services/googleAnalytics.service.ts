import { Injectable } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
declare let gtag: Function; // Declaración global de gtag

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {

  // Método para enviar un evento de vista de página
  public sendPageView(page_path: string): void {
    gtag('config', 'G-VRD0T4F087', { page_path });
  }

  // Método para enviar un evento personalizado
  public sendEvent(eventName: string, params: any): void {
    gtag('event', eventName, params);
  }
}