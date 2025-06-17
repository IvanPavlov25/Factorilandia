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
        nombre: "Trynomium Incompletum",
        tema: "Factorización de polinomios",
        color: "#A0D8A8",
        descripcion: "Una isla única que recopila los casos básicos de factorización.",
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
            nombre: "Espectro Δ²",
            salud: 70,
            color: "#ff9800",
            ejercicios: [
              {pregunta: "¿Factoriza: 4x^2 - 25?", respuesta: "(2x+5)(2x-5)"},
              {pregunta: "¿Factoriza: 9y^2 - 4?", respuesta: "(3y+2)(3y-2)"},
              {pregunta: "¿Factoriza: 16a^2 - 81b^2?", respuesta: "(4a+9b)(4a-9b)"}
            ],
            pregunta: "¿Factoriza: 4x^2 - 25?",
            respuesta: "(2x+5)(2x-5)"
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
      }
    ];
    
    // Mapa estilo laberinto con nodos en una trayectoria más clara y organizada
    this.mapNodos = [
      {x:80,  y:300, tipo:'inicio'},
      {x:170, y:280, tipo:'profesor', isla:0},
      {x:260, y:300, tipo:'cofre', isla:0, chestID:'chest1', parchment:2},
      {x:350, y:260, tipo:'minion', isla:0, idx:0},
      {x:440, y:240, tipo:'cofre', isla:0, chestID:'chest2', parchment:3},
      {x:530, y:220, tipo:'minion', isla:0, idx:1},
      {x:620, y:200, tipo:'cofre', isla:0, chestID:'chest3', parchment:1},
      {x:710, y:180, tipo:'minion', isla:0, idx:2},
      {x:800, y:200, tipo:'cofre', isla:0, chestID:'chest4', parchment:4},
      {x:890, y:220, tipo:'minion', isla:0, idx:3},
      {x:980, y:240, tipo:'monstruo', isla:0},
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
        titulo: "Introducción a la Factorización", 
        contenido: "Factorizar un polinomio significa encontrar expresiones más simples que al multiplicarse dan el polinomio original. Es como encontrar los factores de un número."
      },
      { 
        titulo: "Diferencia de Cuadrados", 
        contenido: "Una expresión de la forma a² - b² puede factorizarse como (a+b)(a-b). Por ejemplo: x² - 4 = (x+2)(x-2)"
      },
      { 
        titulo: "Factorización por factor común", 
        contenido: "Si todos los términos de un polinomio tienen un factor común, podemos sacarlo como factor. Por ejemplo: 3x² + 6x = 3x(x + 2)"
      },
      {
        titulo: "Trinomios Cuadráticos Perfectos",
        contenido: "Un trinomio de la forma a² + 2ab + b² puede factorizarse como (a + b)². Por ejemplo: x² + 6x + 9 = (x + 3)²"
      },
      {
        titulo: "Trinomio general ax²+bx+c",
        contenido: "Para factorizar ax²+bx+c se buscan dos números que multiplicados den ac y sumados den b, luego se usa agrupación para completar la factorización."
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
