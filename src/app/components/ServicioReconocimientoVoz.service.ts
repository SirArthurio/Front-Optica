import { Injectable } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition'; // Importa el plugin

@Injectable({
  providedIn: 'root',
})
export class ServicioReconocimientoVoz {
  private reconocedor: any;
  private isNative = false; // Para saber si estamos en Android/iOS

  constructor() {
    // Verifica si estamos en un entorno nativo (Android/iOS)
    this.isNative = (window as any).capacitor !== undefined;

    if (!this.isNative) {
      // Usar la API de Web Speech en la web
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Tu navegador no soporta la API de Web Speech.');
      }

      this.reconocedor = new SpeechRecognition();
      this.reconocedor.lang = 'es-ES';
      this.reconocedor.continuous = false;
      this.reconocedor.interimResults = false;
    } else {
      // Configura el plugin de Capacitor para Android/iOS
      SpeechRecognition.requestPermissions(); // Solicita permisos
    }
  }

  iniciarReconocimiento(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isNative) {
        // Verificar permisos en la web
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            this.reconocedor.onresult = (evento: any) => {
              const resultado = evento.results[0][0].transcript;
              resolve(resultado); // Devuelve el texto reconocido
            };
  
            this.reconocedor.onerror = (evento: any) => {
              if (evento.error === 'not-allowed') {
                reject('Permisos de micrófono no otorgados. Por favor, permite el acceso al micrófono.');
              } else {
                reject(evento.error);
              }
            };
  
            this.reconocedor.onend = () => {
              // Resolver la promesa cuando el reconocimiento termine
              resolve('');
            };
  
            this.reconocedor.start();
          })
          .catch((error) => {
            reject('No se pudo acceder al micrófono. Asegúrate de que los permisos estén habilitados.');
          });
      } else {
        // Lógica para Android/iOS
        SpeechRecognition.start({
          language: 'es-ES',
          prompt: 'Habla ahora',
          partialResults: false,
          popup: true,
        })
          .then(({ matches }) => {
            if (matches && matches.length > 0) {
              resolve(matches[0]);
            } else {
              reject('No se reconoció ningún texto.');
            }
          })
          .catch((error) => {
            reject('Error en el reconocimiento de voz: ' + error.message);
          });
      }
    });
  }

  hablar(texto: string): void {
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-ES'; 
      synthesis.speak(utterance); 
    } else {
      console.warn('Tu navegador no soporta la síntesis de voz.');
    }
  }
  async detenerReconocimiento(): Promise<void> {
    if (this.isNative) {
      // Detener el reconocimiento en Android/iOS
      await SpeechRecognition.stop();
    } else {
      // Detener el reconocimiento en la web
      this.reconocedor.stop();
    }
  }
}