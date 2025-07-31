// src/data.js
// Datos principales del juego Factorilandia
export class GameData {
  constructor() {
    this.player = {
      nivel: 1,
      exp: 0,
      salud: 100,
      saludMax: 100,
      monedas: 0,
      orbes: 3,
      inventario: [],
      arma: {nombre: "Bastón básico", daño: 10, costo: 0},
      expSigNivel: 60,
    };
      this.islas = [
        {
          nombre: "Factorilandia",
          tema: "Factorización de polinomios",
          color: "#A0D8A8",
          descripcion: "Isla que recorre en orden todos los casos de factorización.",
          enemigos: [
          {
            nombre: "Monstruo Factor Común",
            salud: 60,
            color: "#ffb74d",
            ejercicios: [
              {pregunta: "¿Factoriza: 3x + 6?", respuesta: "3(x+2)"},
              {pregunta: "¿Factoriza: 5y - 10?", respuesta: "5(y-2)"},
              {pregunta: "¿Factoriza: 4a^2 + 8a?", respuesta: "4a(a+2)"}
            ],
            pregunta: "¿Factoriza: 3x + 6?",
            respuesta: "3(x+2)"
          },
          {
            nombre: "Bestia de las Aspas",
            salud: 70,
            color: "#9e9d24",
            ejercicios: [
              {pregunta: "¿Factoriza: 2x^2 + 7x + 3?", respuesta: "(2x+1)(x+3)"},
              {pregunta: "¿Factoriza: 3x^2 + 8x + 4?", respuesta: "(3x+2)(x+2)"},
              {pregunta: "¿Factoriza: 6a^2 + 11a + 3?", respuesta: "(3a+1)(2a+3)"}
            ],
            pregunta: "¿Factoriza: 2x^2 + 7x + 3?",
            respuesta: "(2x+1)(x+3)"
          },
          {
            nombre: "Monstruo TCP",
            salud: 80,
            color: "#7cb342",
            ejercicios: [
              {pregunta: "¿Factoriza: 4a^2 + 12a + 9?", respuesta: "(2a+3)^2"},
              {pregunta: "¿Factoriza: 9x^2 - 30x + 25?", respuesta: "(3x-5)^2"},
              {pregunta: "¿Factoriza: 16m^2 + 40m + 25?", respuesta: "(4m+5)^2"}
            ],
            pregunta: "¿Factoriza: 4a^2 + 12a + 9?",
            respuesta: "(2a+3)^2"
          },
          {
            nombre: "Lobo Coeficiente",
            salud: 90,
            color: "#26a69a",
            ejercicios: [
              {pregunta: "¿Factoriza: x^2 - x - 12?", respuesta: "(x+3)(x-4)"},
              {pregunta: "¿Factoriza: x^2 + 4x - 21?", respuesta: "(x+7)(x-3)"},
              {pregunta: "¿Factoriza: x^2 - 2x - 24?", respuesta: "(x-6)(x+4)"}
            ],
            pregunta: "¿Factoriza: x^2 - x - 12?",
            respuesta: "(x+3)(x-4)"
          },
          {
            nombre: "Espectro Cuadrático",
            salud: 85,
            color: "#ff8a65",
            ejercicios: [
              {pregunta: "¿Factoriza: x^2 - 3x - 4?", respuesta: "(x-4)(x+1)"},
              {pregunta: "¿Factoriza: 2x^2 + x - 6?", respuesta: "(2x-3)(x+2)"},
              {pregunta: "¿Factoriza: a^2 + 2a - 15?", respuesta: "(a+5)(a-3)"}
            ],
            pregunta: "¿Factoriza: x^2 - 3x - 4?",
            respuesta: "(x-4)(x+1)"
          }
        ],
        monstruo: {
          nombre: "Gran Factorizador",
          salud: 120,
          ejercicios: [
            {pregunta: "¿Factoriza: 8m^2 - 12m?", respuesta: "4m(2m-3)"},
            {pregunta: "¿Factoriza: a^2 + 18a + 81?", respuesta: "(a+9)^2"},
            {pregunta: "¿Factoriza: 25k^2 - 1?", respuesta: "(5k+1)(5k-1)"},
            {pregunta: "¿Factoriza: x^2 + x - 20?", respuesta: "(x+5)(x-4)"}
          ],
          pregunta: "¿Factoriza: 8m^2 - 12m?",
          respuesta: "4m(2m-3)"
        }
      },
      {
        nombre: "Isla ax²+bx+c",
        tema: "Trinomios generales",
        color: "#F0A0D8",
        descripcion: "En esta isla aprenderás a factorizar trinomios con coeficiente principal distinto de 1.",
        enemigos: [
          {
            nombre: "Bandido Ax²",
            salud: 70,
            color: "#ab47bc",
            ejercicios: [
              {pregunta: "¿Factoriza: 2x^2 + 5x + 3?", respuesta: "(2x+3)(x+1)"},
              {pregunta: "¿Factoriza: 3x^2 + 10x + 7?", respuesta: "(3x+7)(x+1)"},
              {pregunta: "¿Factoriza: 4a^2 + 11a + 6?", respuesta: "(4a+3)(a+2)"}
            ],
            pregunta: "¿Factoriza: 2x^2 + 5x + 3?",
            respuesta: "(2x+3)(x+1)"
          },
          {
            nombre: "Asaltante Bx",
            salud: 80,
            color: "#ff7043",
            ejercicios: [
              {pregunta: "¿Factoriza: 5x^2 + 13x + 6?", respuesta: "(5x+3)(x+2)"},
              {pregunta: "¿Factoriza: 6m^2 + 7m - 3?", respuesta: "(3m-1)(2m+3)"},
              {pregunta: "¿Factoriza: 3y^2 - 4y - 4?", respuesta: "(3y+2)(y-2)"}
            ],
            pregunta: "¿Factoriza: 5x^2 + 13x + 6?",
            respuesta: "(5x+3)(x+2)"
          },
          {
            nombre: "Cazador C",
            salud: 85,
            color: "#26a69a",
            ejercicios: [
              {pregunta: "¿Factoriza: 4x^2 - x - 5?", respuesta: "(4x+5)(x-1)"},
              {pregunta: "¿Factoriza: 7x^2 + 2x - 3?", respuesta: "(7x-3)(x+1)"},
              {pregunta: "¿Factoriza: 3a^2 - a - 4?", respuesta: "(3a+4)(a-1)"}
            ],
            pregunta: "¿Factoriza: 4x^2 - x - 5?",
            respuesta: "(4x+5)(x-1)"
          }
        ],
        monstruo: {
          nombre: "Señor ax²+bx+c",
          salud: 130,
          ejercicios: [
            {pregunta: "¿Factoriza: 6x^2 + x - 2?", respuesta: "(3x+2)(2x-1)"},
            {pregunta: "¿Factoriza: 8a^2 + 14a + 3?", respuesta: "(4a+1)(2a+3)"},
            {pregunta: "¿Factoriza: 9m^2 - 6m - 8?", respuesta: "(3m+2)(3m-4)"}
          ],
          pregunta: "¿Factoriza: 6x^2 + x - 2?",
          respuesta: "(3x+2)(2x-1)"
        }
      }
    ];
    
    // Mapa estilo laberinto con nodos en una trayectoria más clara y organizada
      this.mapNodos = [
        {x:70,  y:300, tipo:'inicio'},
        {x:145, y:260, tipo:'profesor', isla:0},
        {x:220, y:320, tipo:'cofre', isla:0, chestID:'chest1', parchment:0},
        {x:295, y:260, tipo:'minion', isla:0, idx:0},
        {x:370, y:320, tipo:'cofre', isla:0, chestID:'chest2', parchment:1},
        {x:445, y:260, tipo:'minion', isla:0, idx:1},
        {x:520, y:320, tipo:'cofre', isla:0, chestID:'chest3', parchment:2},
        {x:595, y:260, tipo:'minion', isla:0, idx:2},
        {x:670, y:320, tipo:'cofre', isla:0, chestID:'chest4', parchment:3},
        {x:745, y:260, tipo:'minion', isla:0, idx:3},
        {x:820, y:320, tipo:'cofre', isla:0, chestID:'chest5', parchment:4},
        {x:895, y:260, tipo:'minion', isla:0, idx:4},
        {x:970, y:320, tipo:'monstruo', isla:0},
        // Isla 1: ax²+bx+c
        {x:145, y:260, tipo:'profesor', isla:1},
        {x:220, y:320, tipo:'cofre', isla:1, chestID:'chest6', parchment:0},
        {x:295, y:260, tipo:'minion', isla:1, idx:0},
        {x:370, y:320, tipo:'cofre', isla:1, chestID:'chest7', parchment:1},
        {x:445, y:260, tipo:'minion', isla:1, idx:1},
        {x:520, y:320, tipo:'cofre', isla:1, chestID:'chest8', parchment:2},
        {x:595, y:260, tipo:'minion', isla:1, idx:2},
        {x:670, y:320, tipo:'monstruo', isla:1},
      ];
    
    // Rutas alternativas o atajos (para expansión futura)
    this.rutasAdicionales = [];
    
    // Inicializar arrays de enemigos derrotados
    this.enemigosDerrotados = {
      minions: [],
      monstruos: []
    };
    
      // Contenido educativo de los pergaminos reorganizado por temas
      this.pergaminos = [
      {
        titulo: "Factor común",
        contenido: "Extraer el factor que se repite en todos los términos. Ejemplo: 3x² + 6x = 3x(x + 2)"
      },
      {
        titulo: "Factorización por aspas",
        contenido: "Para un trinomio ax^2+bx+c, busca dos números que multiplicados den a·c y sumados den b. Ejemplo: 2x²+7x+3 = (2x+1)(x+3)"
      },
      {
        titulo: "Trinomio cuadrado perfecto",
        contenido: "Forma: a² ± 2ab + b² = (a ± b)². Ejemplo: x² + 6x + 9 = (x + 3)²"
      },
      {
        titulo: "Trinomio general",
        contenido: "Buscar dos números que multiplicados den a·c y sumados b. Factorizar por agrupación. Ejemplo: 2x² + 5x + 2 = (2x + 1)(x + 2)"
      },
      {
        titulo: "Ecuación cuadrática",
        contenido: "Usar la fórmula x = [–b ± √(b² – 4ac)]/(2a) para hallar raíces y escribir como factores. Ejemplo: x² – 3x – 4 = (x – 4)(x + 1)"
      }
    ];
  }
  
  // Método para verificar si un enemigo ha sido derrotado
  esEnemigoDerrotado(tipo, isla, idx) {
    if (tipo === 'minion') {
      return this.enemigosDerrotados.minions.some(e => e.isla === isla && e.idx === idx);
    } else if (tipo === 'monstruo') {
      return this.enemigosDerrotados.monstruos.some(e => e.isla === isla);
    }
    return false;
  }
  
  // Método para ver si una isla está completada
  esIslaCompletada(islaIdx) {
    // Una isla está completa si su monstruo ha sido derrotado
    return this.esEnemigoDerrotado('monstruo', islaIdx);
  }
} 
