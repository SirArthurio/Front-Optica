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
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
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
      descripcion:
        'Las flores son una de las formas más bonitas de expresar sentimientos, emociones y pensamientos. En nuestra tienda online encontrarás una amplia variedad de flores para regalar en cualquier ocasión.',
      url: '/examenes',
    },
    {
      imagen:
        'https://luistrombetta.com/wp-content/uploads/refraccion-visual-2.jpg',
      titulo: 'Refracción',
      descripcion:
        'Las flores son una de las formas más bonitas de expresar sentimientos, emociones y pensamientos. En nuestra tienda online encontrarás una amplia variedad de flores para regalar en cualquier ocasión.',
      url: '/examenes',
    },
    {
      imagen:
        'https://oasisfloral.mx/cdn/shop/articles/floralife_poder_de_las_flores-_1.png?v=1594230457',
      titulo: 'Flores',
      descripcion:
        'Las flores son una de las formas más bonitas de expresar sentimientos, emociones y pensamientos. En nuestra tienda online encontrarás una amplia variedad de flores para regalar en cualquier ocasión.',
      url: '/examenes',
    },
    {
      imagen:
        'https://oasisfloral.mx/cdn/shop/articles/floralife_poder_de_las_flores-_1.png?v=1594230457',
      titulo: 'Flores',
      descripcion:
        'Las flores son una de las formas más bonitas de expresar sentimientos, emociones y pensamientos. En nuestra tienda online encontrarás una amplia variedad de flores para regalar en cualquier ocasión.',
      url: '/examenes',
    },
    {
      imagen:
        'https://oasisfloral.mx/cdn/shop/articles/floralife_poder_de_las_flores-_1.png?v=1594230457',
      titulo: 'Flores',
      descripcion:
        'Las flores son una de las formas más bonitas de expresar sentimientos, emociones y pensamientos. En nuestra tienda online encontrarás una amplia variedad de flores para regalar en cualquier ocasión.',
      url: '/examenes',
    },
  ];

  SlideImg = [
    {
      img: 'https://www.incornea.com.co/pictures/pages/ktp/bogota-optometras.jpg',
      titulo: 'Examen de Matemáticas',
    },
    {
      img: 'https://www.eltiempo.com/files/image_640_428/uploads/2019/09/03/5d6e8a5f4e3b8.jpeg',
      titulo: 'Examen de Física',
    },
    {
      img: 'https://imagenes.eltiempo.com/files/image_1200_600/uploads/2022/03/23/623b933f8ee75.jpeg',
      titulo: 'Examen de Química',
    },
  ];

  ngAfterViewInit(): void {
    setTimeout(() => {
      const swiperEl = this.swiper.nativeElement;
      swiperEl.swiper.autoplay.start();
      console.log('Autoplay iniciado manualmente.');
    }, 300);
  }
}
