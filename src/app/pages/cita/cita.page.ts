import { Component, Inject, OnInit } from '@angular/core';
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
import { lastValueFrom } from 'rxjs';

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
  textoescuchado=''
  citasAgendadas: any[]  = [];
  cargandoCitas: boolean = false;
  citaForm = new FormGroup({
    id: new FormControl(''),
    fecha: new FormControl('', Validators.required),
    hora: new FormControl('', Validators.required),
    motivo: new FormControl('', Validators.required),
  });

  constructor(
    private reconocimientoVoz: ServicioReconocimientoVoz,
    private citaService: CitasService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarCitas();

    this.reconocimientoVoz.hablar(
      'Por favor, di lo siguiente:  Fecha, Hora y Motivo de la consulta. Por ejemplo:  Fecha, 15 de octubre. Hora, 10 de la mañana. Motivo, queratometría.'
    );
    this.cedula = localStorage.getItem('cedula');
  }

  async cargarCitas() {
    this.cargandoCitas = true;
    try {
      const userId = localStorage.getItem('id');
      if (userId) {
        this.citaService.obtenerCitasPorUsuario(this.userId).subscribe(
          (response: any) => {
            console.log('Respuesta completa:', response);
            
            // Acceder correctamente a los datos
            if (response && response.data) {
              this.citas = Array.isArray(response.data) ? response.data : [];
              console.log('Citas asignadas:', this.citas);
              
              // Si necesitas transformar los datos:
              this.citas = this.transformarCitas(response.data);
            } else {
              this.citas = [];
              console.warn('La respuesta no contiene datos de citas');
            }
          },
          (error: any) => {
            console.error('Error al obtener citas:', error);
            this.citas = [];
            if (error.status === 404) {
              this.mostrarAlerta('No se encontraron citas para este usuario');
            }
          }
        );
       
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
      this.mostrarAlerta('Error al cargar tus citas agendadas');
    } finally {
      this.cargandoCitas = false;
    }
  }
  private transformarCitas(citasData: any[]): any[] {
    return citasData.map(cita => ({
      id: cita.id,
      fecha: this.formatearFechaArray(cita.fecha), // Convierte [2025, 12, 2] a Date
      hora: this.formatearHoraArray(cita.hora),    // Convierte [14, 0] a "14:00"
      motivo: cita.motivo,
      // Puedes agregar más campos si necesitas
      usuario: {
        nombre: cita.userId.nombre,
        apellido: cita.userId.apellido
      }
    }));
  }
  
private formatearFechaArray(fechaArray: number[]): Date {
  return new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2]);
}

private formatearHoraArray(horaArray: number[]): string {
  return `${horaArray[0].toString().padStart(2, '0')}:${horaArray[1].toString().padStart(2, '0')}`;
}

  async iniciarReconocimiento(): Promise<void> {
    this.grabando = true;
    try {
      this.textoReconocido =
        await this.reconocimientoVoz.iniciarReconocimiento();
      console.log(this.textoReconocido);
      this.textoescuchado=this.textoReconocido
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
    try {
      // Convertir a minúsculas y normalizar espacios
      texto = texto.toLowerCase().replace(/\s+/g, ' ').trim();
      
      // Extraer componentes con regex más flexibles
      const fechaMatch = texto.match(/(?:fecha,?\s*)(\d{1,2}\s*de\s*\w+)/i);
      const horaMatch = texto.match(/(?:hora,?\s*)(\d{1,2})\s*(?:de la\s)?(mañana|tarde|noche)/i);
      const motivoMatch = texto.match(/(?:motivo,?\s*)(queratometría|refracción|refraccion)/i);
  
      if (!fechaMatch || !horaMatch || !motivoMatch) {
        throw new Error('No se pudieron extraer todos los datos. Por favor di: "Fecha [día y mes], Hora [formato 12h], Motivo [refracción o queratometría]"');
      }
  
      const fechaCruda = fechaMatch[1].trim();
      const horaCruda = horaMatch[0].replace('hora,', '').trim();
      let motivo = motivoMatch[1].trim();
  
      // Normalizar motivo
      motivo = motivo === 'refraccion' ? 'refracción' : motivo;
  
      console.log('Datos extraídos:', { fechaCruda, horaCruda, motivo });
  
      const fechaFormateada = this.formatearFecha(fechaCruda);
      const horaFormateada = this.formatearHora(horaCruda);
  
      if (!fechaFormateada || !horaFormateada) {
        throw new Error('Formato de fecha u hora no válido');
      }
  
      console.log('Datos formateados:', { fechaFormateada, horaFormateada, motivo });
  
      // Mostrar confirmación
      await this.mostrarConfirmacion(fechaFormateada, horaFormateada, motivo);
      
    } catch (error:any) {
      console.error('Error al procesar:', error);
      this.mostrarAlerta(error.message);
      this.reconocimientoVoz.hablar(error.message);
    }
  }
  
  async mostrarConfirmacion(fecha: string, hora: string, motivo: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar cita',
      message: `
       ¿Confirma estos datos?
      
      Fecha: ${fecha}
      Hora: ${hora}
      Motivo: ${motivo}
      `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.reconocimientoVoz.hablar('Cancelado. Puede intentar nuevamente.');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.enviarCitaAlServidor(fecha, hora, motivo);
          }
        }
      ]
    });
    await alert.present();
  }
  
  async enviarCitaAlServidor(fecha: string, hora: string, motivo: string) {
    try {
      const citaData = {
        userId: {id:this.userId},
        fecha: fecha,
        hora: hora,
        motivo: motivo
      };
  
      console.log('Enviando a API:', citaData);
      
      this.citaService.apartarCita(citaData).subscribe({
        next: (respuesta: any) => {
          if (respuesta.mensaje === 'Horario ocupado. Opciones disponibles:') {
            // Procesar horarios disponibles
            const horariosDisponibles = respuesta.horariosDisponibles
              .map((horaArray: number[]) => 
                `${horaArray[0].toString().padStart(2, '0')}:${horaArray[1].toString().padStart(2, '0')}`
              )
              .join(', ');
  
            const mensaje = `El horario seleccionado no está disponible. Horarios disponibles: ${horariosDisponibles}`;
            
            this.mostrarAlerta(mensaje);
            this.reconocimientoVoz.hablar(mensaje);
            
            // Opcional: Volver a iniciar el reconocimiento
            setTimeout(() => {
              this.iniciarReconocimiento();
            }, 5000);
            
          } else if (respuesta.mensaje === 'Cita agendada correctamente.') {
            this.mostrarAlerta('¡Cita agendada con éxito!');
            this.reconocimientoVoz.hablar('Su cita ha sido registrada exitosamente');
          } else {
            throw new Error(respuesta.mensaje || 'Error desconocido al agendar');
          }
        },
        error: (error) => {
          console.error('Error en la solicitud:', error);
          this.mostrarAlerta('Error al conectar con el servidor');
          this.reconocimientoVoz.hablar('Error al comunicarse con el sistema');
        }
      });
      
    } catch (error:any) {
      console.error('Error inesperado:', error);
      this.mostrarAlerta('Error inesperado: ' + error.message);
      this.reconocimientoVoz.hablar('Ocurrió un error inesperado');
    }
  }
  async mostrarAlerta(mensaje: string): Promise<void> {
    const alert = await this.alertController.create({
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
  formatearFechaParaMostrar(fechaString: string): string {
    const fecha = new Date(fechaString);
    const opciones: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  }
  
  async cancelarCita(citaId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro que deseas cancelar esta cita?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: async () => {
            try {
              await this.citaService.cancelarCita(citaId).toPromise();
              this.mostrarAlerta('Cita cancelada correctamente');
              this.reconocimientoVoz.hablar('Has cancelado la cita');
              this.cargarCitas(); // Recargar la lista
            } catch (error) {
              this.mostrarAlerta('Error al cancelar la cita');
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
