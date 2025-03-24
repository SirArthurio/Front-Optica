import { Injectable } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class ServicioReconocimientoVoz {
  private reconocedor: any;
  private isNative = false;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();

    if (!this.isNative) {
      this.inicializarReconocimientoWeb();
    }
  }

  private inicializarReconocimientoWeb() {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn('Tu navegador no soporta la API de Web Speech.');
      return;
    }

    this.reconocedor = new SpeechRecognitionAPI();
    this.reconocedor.lang = 'es-ES';
    this.reconocedor.continuous = false;
    this.reconocedor.interimResults = false;
  }

  async iniciarReconocimiento(): Promise<string> {
    if (this.isNative) {
      try {
        // Paso 1: Verificar permisos
        const permiso = await SpeechRecognition.checkPermissions();
        
        if (permiso.speechRecognition !== 'granted') {
          // Paso 2: Solicitar permisos si no están concedidos
          await SpeechRecognition.requestPermissions();
        }

        // Paso 3: Iniciar reconocimiento
        const { matches } = await SpeechRecognition.start({
          language: 'es-ES',
          prompt: 'Por favor, habla ahora',
          partialResults: false,
          popup: true,
          maxResults: 1
        });

        return matches?.[0] || '';
      } catch (error) {
        console.error('Error en reconocimiento:', error);
        throw new Error('No se pudo iniciar el reconocimiento de voz');
      }
    } else {
      return new Promise((resolve, reject) => {
        if (!this.reconocedor) {
          reject('Reconocimiento de voz no disponible');
          return;
        }

        this.reconocedor.onresult = (evento: any) => {
          resolve(evento.results[0][0].transcript);
        };

        this.reconocedor.onerror = (evento: any) => {
          reject(evento.error);
        };

        this.reconocedor.start();
      });
    }
  }

  async hablar(texto: string): Promise<void> {
    if (this.isNative) {
      try {
        await TextToSpeech.speak({
          text: texto,
          lang: 'es-ES',
          rate: 1.0
        });
      } catch (error) {
        console.error('Error al hablar:', error);
      }
    } else {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }
    }
  }

  async detenerReconocimiento(): Promise<void> {
    if (this.isNative) {
      await SpeechRecognition.stop();
    } else if (this.reconocedor) {
      this.reconocedor.stop();
    }
  }
}