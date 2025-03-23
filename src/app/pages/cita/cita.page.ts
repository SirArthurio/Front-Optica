import { Component, OnInit } from '@angular/core';
import { ServicioReconocimientoVoz } from 'src/app/components/ServicioReconocimientoVoz.service';
import { IonHeader } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/Context/auth.service';
import { CitasService } from 'src/app/API/citas.service';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.page.html',
  styleUrls: ['./cita.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    NgClass,
  ],
})
export class CitaPage implements OnInit {
  textoReconocido = '';
  grabando = false;
  citas: { userId: string; fecha: string; hora: string; motivo: string }[] = []; 
  confirmando = false;
  cedula: string | null = '';
  userId: string = localStorage.getItem('id')!;

  citaForm = new FormGroup({
    id: new FormControl(''),
    fecha: new FormControl('', Validators.required),
    hora: new FormControl('', Validators.required),
    motivo: new FormControl('', Validators.required),
  });

  constructor(
    private reconocimientoVoz: ServicioReconocimientoVoz,
    private alertCtrl: AlertController,
    private cita: CitasService
  ) {}

  ngOnInit() {
    this.reconocimientoVoz.hablar(
      'Por favor, di lo siguiente:  Fecha, Hora y Motivo de la consulta. Por ejemplo:  Fecha, 15 de octubre. Hora, 10 de la mañana. Motivo, queratometría.'
    );
    this.cedula = localStorage.getItem('cedula');
  }

  async iniciarReconocimiento(): Promise<void> {
    this.grabando = true;
    try {
      this.textoReconocido =
        await this.reconocimientoVoz.iniciarReconocimiento();
      console.log(this.textoReconocido);
      this.procesarTexto(this.textoReconocido);
    } catch (error) {
      console.error('Error en el reconocimiento:', error);
      alert(error); 
    } finally {
      this.grabando = false;
    }
  }

  detenerReconocimiento(): void {
    this.reconocimientoVoz.detenerReconocimiento();
    this.grabando = false;
  }

  async procesarTexto(texto: string): Promise<void> {
    const fechaMatch = texto.match(
      /Fecha,\s+(\d{1,2}\sde\s\w+|\d{1,2}\/\d{1,2}\/\d{4})/i
    );
    const horaMatch = texto.match(
      /(\d{1,2})\s*(de la\s)?(mañana|tarde|noche)/i
    );
    const motivoMatch = texto.match(/Motivo,\s+(queratometría|refracción)/i);

    if (fechaMatch && horaMatch && motivoMatch) {
      const fecha = fechaMatch[1].trim();
      const hora = horaMatch[0].trim();
      const motivo = motivoMatch[1].toLowerCase();

      const fechaFormateada = this.formatearFecha(fecha);
      const horaFormateada = this.formatearHora(hora);

      if (fechaFormateada && horaFormateada) {
        const alert = await this.alertCtrl.create({
          header: 'Confirmar cita',
          message: `
            ¿Confirma los siguientes datos para apartar la cita?</p>
            Cédula: ${this.cedula}
            Fecha: ${fechaFormateada}
            Hora: ${horaFormateada}
            Motivo: ${motivo}
          `,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                this.reconocimientoVoz.hablar(
                  'Cita cancelada. Por favor, intente nuevamente.'
                );
              },
            },
            {
              text: 'Confirmar',
              handler: () => {
                const itemCita = {
                  userId: { id: this.userId },
                  fecha: fechaFormateada,
                  hora: horaFormateada,
                  motivo: motivo,
                };

                this.cita.apartarCita(itemCita).subscribe(
                  (response: any) => {
                    if (
                      response.mensaje ===
                      'Horario ocupado. Opciones disponibles:'
                    ) {
                      const horariosDisponibles = response.horariosDisponibles
                        .map((hora: number[]) => `${hora[0]}:${hora[1]}`)
                        .join(', ');

                      this.reconocimientoVoz.hablar(
                        `Horario ocupado. Los horarios disponibles son: ${horariosDisponibles}`
                      );
                      this.mostrarAlerta(
                        `Horario ocupado. Los horarios disponibles son: ${horariosDisponibles}`
                      );
                    } else if (
                      response.mensaje === 'Cita agendada correctamente.'
                    ) {
                      // Cita agendada correctamente
                      this.reconocimientoVoz.hablar(
                        'Cita agendada correctamente.'
                      );
                      this.mostrarAlerta('Cita agendada correctamente.');
                    } else {
                      // Otro mensaje de error
                      this.reconocimientoVoz.hablar(
                        'Error al agendar la cita. Por favor, intente nuevamente.'
                      );
                      this.mostrarAlerta(
                        'Error al agendar la cita. Por favor, intente nuevamente.'
                      );
                    }
                  },
                  (error) => {
                    console.error('Error al agendar la cita:', error);
                    this.reconocimientoVoz.hablar(
                      'Error al agendar la cita. Por favor, intente nuevamente.'
                    );
                    this.mostrarAlerta(
                      'Error al agendar la cita. Por favor, intente nuevamente.'
                    );
                  }
                );
              },
            },
          ],
        });

        await alert.present();
      } else {
        console.error('Fecha o hora no válida');
      }
    } else {
      console.error('No se pudo extraer la fecha, la hora o el motivo');
    }
  }
  async mostrarAlerta(mensaje: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Información',
      message: mensaje,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  confirmarCita(cita: {
    userId: string;
    fecha: string;
    hora: string;
    motivo: string;
  }): void {
    const mensajeConfirmacion = `Cita agendada  el ${cita.fecha} a las ${cita.hora}, motivo: ${cita.motivo}.`;
    this.reconocimientoVoz.hablar(mensajeConfirmacion);
  }

  formatearFecha(fecha: string): string | null {
    try {
      const meses: { [key: string]: string } = {
        enero: '01',
        febrero: '02',
        marzo: '03',
        abril: '04',
        mayo: '05',
        junio: '06',
        julio: '07',
        agosto: '08',
        septiembre: '09',
        octubre: '10',
        noviembre: '11',
        diciembre: '12',
      };

      const match = fecha.match(/(\d{1,2})\s+de\s+(\w+)/i); 
      if (match) {
        const dia = match[1].padStart(2, '0'); 
        const mesTexto = match[2].toLowerCase();
        const mes = meses[mesTexto] || '00'; 
        if (mes === '00') {
          console.error('Mes no válido:', mesTexto);
          return null;
        }
        const anio = new Date().getFullYear().toString();
        return `${anio}-${mes}-${dia}`; 
      }
      return null;
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return null;
    }
  }

  formatearHora(hora: string): string | null {
    try {
      const match = hora.match(/(\d{1,2})\s*(de la\s)?(mañana|tarde|noche)/i);
      if (!match) {
        return null;
      }

      let horas = parseInt(match[1], 10); 
      const periodo = match[3].toLowerCase(); 

      if (periodo === 'tarde' || periodo === 'noche') {
        if (horas < 12) {
          horas += 12; 
        }
      } else if (periodo === 'mañana' && horas === 12) {
        horas = 0; 
      }

      return `${horas.toString().padStart(2, '0')}:00`;
    } catch (error) {
      console.error('Error al formatear la hora:', error);
      return null;
    }
  }
}
