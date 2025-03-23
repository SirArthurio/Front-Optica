import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/element';
import { IonicModule } from '@ionic/angular';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

Swiper.use([Autoplay, Pagination]);

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  styles: [
    `
    :host {
      display: block;
    }
    
    swiper-container::part(bullet) {
      background: rgba(255, 255, 255, 0.5);
      width: 10px;
      height: 10px;
      opacity: 1;
    }
    
    swiper-container::part(bullet-active) {
      background: white;
      width: 12px;
      height: 12px;
    }
    
    .testimonial-swiper::part(bullet) {
      background: rgba(20, 184, 166, 0.3);
    }
    
    .testimonial-swiper::part(bullet-active) {
      background: rgb(20, 184, 166);
    }
  `,
  ],
  imports: [IonicModule, CommonModule, FormsModule, RouterLink,],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InicioPage implements AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper!: ElementRef;
  servicios = [
    {
      imagen:
        'https://www.protegerips.com/wp-content/uploads/2023/07/Consulta-cirugia-Refractiva.webp',
      titulo: 'Queratometria',
      descripcion:'Medición de la curvatura de la córnea para evaluar su forma y detectar astigmatismo u otras irregularidades. Es esencial en la adaptación de lentes de contacto y cirugías refractivas.',
      url: '/inf-queratometria',
    },
    {
      imagen:
        'https://luistrombetta.com/wp-content/uploads/refraccion-visual-2.jpg',
      titulo: 'Refracción',
      descripcion:'Examen ocular que determina el error refractivo (miopía, hipermetropía, astigmatismo o presbicia) para prescribir lentes o evaluar la visión.',
      url: '/inf-refraccion',
    },
    {
      imagen:
        'https://lafarmaciadelourdes.com/wp-content/uploads/2023/05/Productosoptica-farmalourdes1.jpg',
      titulo: 'Productos',
      descripcion:'Descubre la amplia gama de productos que tenemos para ofrecerte!. ',
       url: '/productos',
    },
  
  ];

  SlideImg = [
    {
      img: 'https://www.incornea.com.co/pictures/pages/ktp/bogota-optometras.jpg',
      titulo: 'Examen de Queratometria',
    },
    {
      img: 'https://www.eltiempo.com/files/image_640_428/uploads/2019/09/03/5d6e8a5f4e3b8.jpeg',
      titulo: 'Examen de Refraccion',
    },
    {
      img: 'https://imagenes.eltiempo.com/files/image_1200_600/uploads/2022/03/23/623b933f8ee75.jpeg',
      titulo: 'Examen de X',
    },
  ];
  testimonials = [
    {
      name: "María García",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      text: "Excelente atención y profesionalismo. El personal médico siempre está dispuesto a resolver todas mis dudas.",
    },
    {
      name: "Carlos Rodríguez",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Las instalaciones son modernas y limpias. Me encanta la puntualidad y el trato amable de todos los especialistas.",
    },
    {
      name: "Laura Martínez",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Gracias al equipo de nutrición he logrado mejorar significativamente mi salud. Totalmente recomendado.",
    },
    {
      name: "José Pérez",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      text: "El servicio de fisioterapia es excepcional. En pocas sesiones noté una gran mejoría en mi lesión.",
    },
  ]

  ngAfterViewInit(): void {
    setTimeout(() => {
      const swiperEl = this.swiper.nativeElement;
      swiperEl.swiper.autoplay.start();
      console.log('Autoplay iniciado manualmente.');
    }, 300);
  }
}
