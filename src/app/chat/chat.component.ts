import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Router } from '@angular/router';
import { UsernameService } from '../services/username.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  system: string = "system"

  usuarioLogeado: any

  imagen: any = null

  sendImage: any = null

  newMessage: string = "";

  messages: any = []



  constructor(private rest: RestService, private route: Router, private userSer: UsernameService, private http: HttpClient) { }

  ngOnInit(): void {
    this.usuarioLogeado = this.userSer.getToken()
  }

  home() {
    this.route.navigate([""])
  }

  logout() {
    this.userSer.logOut()
    this.route.navigate(["login"])
  }

  uploadImagen(event: any) {
    if (event.target.files && event.target.files[0]) {
      var file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imagen = reader.result;
      reader.readAsDataURL(file);
      this.sendImage = file
    }
  }

  sendMessage() {
    if (this.imagen == null) {
      let message = {
        emisor: this.system,
        text: "Por favor Selecciona Una  imagen",
        imagen: this.imagen
      }
      this.messages.push(message)

    } else {
      let message = {
        emisor: this.usuarioLogeado,
        text: this.newMessage,
        imagen: this.imagen
      }
      this.messages.push(message)
      this.newMessage = ""

      setTimeout(() => {
        this.receiveMessage()
      }, 30)
    }

    setTimeout(() => {
      this.scrollToTheLastElementByClassName()
    }, 35)
  }

  async receiveMessage() {
    try {
      // peticion
      const send = {
        imagen: this.imagen,
        user: this.usuarioLogeado
      }
      const formData = new FormData();
      formData.append('user', this.usuarioLogeado);
      formData.append('imagen', this.sendImage);
      console.log(formData.get('imagen'));


      this.http.post<any>('http://localhost:5000/chat', formData).subscribe(
        (res) => {
          console.log(res)
          if (res['bodypart'] == 'Brazo') {
            let message = {
              emisor: this.system,
              text: "The possible cause of the pain could be a injury, Tendinitis, Bursitis: Bursitis is the inflammation of the bursae, small fluid-filled sacs that cushion the joints. It can occur in the shoulder or elbow, causing arm pain, or joint problems. A temporary treatment could be Rest, Application of Ice or heat to the affected area, Medications such as analgesics. But the most important thing is to consult a doctor so that they can provide a better solution. :)",
              imagen: null
            }
            this.messages.push(message)
          } else if (res['bodypart'] == 'Cabeza') {
            let message = {
              emisor: this.system,
              text: "The possible cause of the pain could be a Migraine, Muscle tension: Tension and stress can cause headaches in the form of a feeling of pressure or tightness around the head, Sinusitis: Inflammation of the sinuses due to an infection or allergies can cause headaches in the forehead or around the eyes. A temporary treatment could be Rest, Medications such as analgesics. But the most important thing is to consult a doctor so that they can provide a better solution.",
              imagen: null
            }
            this.messages.push(message)

          } else if (res['bodypart'] == 'Pierna') {
            let message = {
              emisor: this.system,
              text: "The possible cause of the pain could be an injury, Sciatica: Sciatica is a condition that occurs due to compression or irritation of the sciatic nerve, which extends from the lower back to the leg. It can cause intense pain that radiates down the leg, Muscle cramps, Deep vein thrombosis, or joint problems. A temporary treatment could be Rest, Application of Ice or heat to the affected area, Medications such as analgesics. But the most important thing is to consult a doctor so that they can provide a better solution. ",
              imagen: null
            }
            this.messages.push(message)

          } else if (res['bodypart'] == 'Pie') {
            let message = {
              emisor: this.system,
              text: "The possible cause of the pain could be an injury, Plantar Fasciitis: inflammation of the tissue that connects the heel to the toes. It often causes pain in the heel or the bottom of the foot, especially when taking the first steps in the morning, Heel Spur: a bony growth on the heel that can cause pain and discomfort when walking or standing, Morton's Neuroma: inflammation of the interdigital nerve in the foot, which can cause pain in the front of the foot, burning sensation, or numbness, or Arthritis. A temporary treatment could be Application of Ice or heat to the affected area. But the most important thing is to consult a doctor so that they can provide a better solution",
              imagen: null
            }
            this.messages.push(message)

          } else if (res['bodypart'] == 'Espalda') {
            let message = {
              emisor: this.system,
              text: "The possible cause of the pain could be poor posture, injuries, spinal problems, or being overweight. A temporary treatment could be Resting and avoiding activities that worsen the pain, Application of Ice or heat to the affected area, Performing gentle stretching exercises, and Maintaining good posture when sitting and lifting heavy objects. But the most important thing is to consult a doctor so that they can provide a better solution.",
              imagen: null
            }
            this.messages.push(message)
          } else {
            let message = {
              emisor: this.system,
              text: "The possible cause of the pain could be an injury, inflammation, or joint problems. A temporary treatment could be Rest, Application of Ice or heat to the affected area, Medications such as analgesics. But the most important thing is to consult a doctor so that they can provide a better solution.",
              imagen: null
            }
            this.messages.push(message)
          }
          let message = {
            emisor: this.system,
            text: "Here are some hospitals near your area that I recommend.",
            imagen: null
          }
          this.messages.push(message)
          if (Array.isArray(res['hospitals'])) {
            let hospitals = res['hospitals'].map((item: any) => {
              return `Hospital: ${item.name_hospital}, Contacto: ${item.contact}`
            })
            let message = {
              emisor: this.system,
              text: hospitals.join('<br>'),
              imagen: null
            }
            this.messages.push(message)
          }
        },
        (error) => console.log(error)
      )
    } catch (error: any) { console.error('Error en la solicitud:', error); }
  }
  scrollToTheLastElementByClassName() {
    let elements = document.getElementsByClassName('msj')
    let lastone: any = elements[(elements.length - 1)]
    let toppos = lastone.offsetTop
    let vistaMensajes: any = document.getElementById('chatArea')
    vistaMensajes.scrollTop = toppos;
  }
}
