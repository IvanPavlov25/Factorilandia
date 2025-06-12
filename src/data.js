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
        nombre: "Cañón Espejo", 
        tema: "Diferencia de Cuadrados",
        descripcion: "Esta isla enseña a factorizar expresiones de la forma a² - b², que se convierten en (a+b)(a-b)",
        enemigos: [
          {
            nombre: "Minion Espejo",
            salud: 30,
            color: "#ff9800",
            ejercicios: [
              {pregunta: "¿Factoriza: x^2 - 4?", respuesta: "(x+2)(x-2)"},
              {pregunta: "¿Factoriza: a^2 - 9?", respuesta: "(a+3)(a-3)"},
              {pregunta: "¿Factoriza: 4x^2 - 1?", respuesta: "(2x+1)(2x-1)"}
            ],
            pregunta: "¿Factoriza: x^2 - 4?",
            respuesta: "(x+2)(x-2)"
          },
          {
            nombre: "Guardián Reflexivo",
            salud: 45,
            color: "#ffa726",
            ejercicios: [
              {pregunta: "¿Factoriza: y^2 - 25?", respuesta: "(y+5)(y-5)"},
              {pregunta: "¿Factoriza: 16m^2 - n^2?", respuesta: "(4m+n)(4m-n)"},
              {pregunta: "¿Factoriza: 49p^2 - 36q^2?", respuesta: "(7p+6q)(7p-6q)"}
            ],
            pregunta: "¿Factoriza: y^2 - 25?",
            respuesta: "(y+5)(y-5)"
          }
        ],
        monstruo: {
          nombre: "Espectro Δ²",
          salud: 70,
          ejercicios: [
            {pregunta: "¿Factoriza: 4x^2 - 25?", respuesta: "(2x+5)(2x-5)"},
            {pregunta: "¿Factoriza: 9y^2 - 4?", respuesta: "(3y+2)(3y-2)"},
            {pregunta: "¿Factoriza: 16a^2 - 81b^2?", respuesta: "(4a+9b)(4a-9b)"},
            {pregunta: "¿Factoriza: 25k^2 - 1?", respuesta: "(5k+1)(5k-1)"}
          ],
          pregunta: "¿Factoriza: 4x^2 - 25?",
          respuesta: "(2x+5)(2x-5)"
        },
      },
      {
        nombre: "Bosque Simétrico", 
        tema: "Trinomio Cuadrado Perfecto",
        descripcion: "Aprende a identificar y factorizar expresiones de la forma a² + 2ab + b², que se convierten en (a+b)²",
        enemigos: [
          {
            nombre: "Minion Simétrico",
            salud: 35,
            color: "#8bc34a",
            ejercicios: [
              {pregunta: "¿Factoriza: x^2 + 6x + 9?", respuesta: "(x+3)^2"},
              {pregunta: "¿Factoriza: a^2 - 8a + 16?", respuesta: "(a-4)^2"},
              {pregunta: "¿Factoriza: m^2 + 10m + 25?", respuesta: "(m+5)^2"}
            ],
            pregunta: "¿Factoriza: x^2 + 6x + 9?",
            respuesta: "(x+3)^2"
          },
          {
            nombre: "Guardián Perfecto",
            salud: 50,
            color: "#7cb342",
            ejercicios: [
              {pregunta: "¿Factoriza: y^2 - 10y + 25?", respuesta: "(y-5)^2"},
              {pregunta: "¿Factoriza: p^2 + 14p + 49?", respuesta: "(p+7)^2"},
              {pregunta: "¿Factoriza: n^2 - 12n + 36?", respuesta: "(n-6)^2"}
            ],
            pregunta: "¿Factoriza: y^2 - 10y + 25?",
            respuesta: "(y-5)^2"
          }
        ],
        monstruo: {
          nombre: "Monstruo TCP",
          salud: 80,
          ejercicios: [
            {pregunta: "¿Factoriza: 4a^2 + 12a + 9?", respuesta: "(2a+3)^2"},
            {pregunta: "¿Factoriza: 9x^2 - 30x + 25?", respuesta: "(3x-5)^2"},
            {pregunta: "¿Factoriza: 16m^2 + 40m + 25?", respuesta: "(4m+5)^2"},
            {pregunta: "¿Factoriza: a^2 + 18a + 81?", respuesta: "(a+9)^2"}
          ],
          pregunta: "¿Factoriza: 4a^2 + 12a + 9?",
          respuesta: "(2a+3)^2"
        },
      },
      {
        nombre: "Llanuras Algebraicas", 
        tema: "Trinomio de la forma x² + bx + c",
        descripcion: "Aprende a factorizar expresiones donde el coeficiente de x² es 1",
        enemigos: [
          {
            nombre: "Lobo Algebraico",
            salud: 40,
            color: "#26a69a",
            ejercicios: [
              {pregunta: "¿Factoriza: x^2 + 5x + 6?", respuesta: "(x+2)(x+3)"},
              {pregunta: "¿Factoriza: x^2 - x - 6?", respuesta: "(x-3)(x+2)"},
              {pregunta: "¿Factoriza: x^2 + 7x + 12?", respuesta: "(x+3)(x+4)"}
            ],
            pregunta: "¿Factoriza: x^2 + 5x + 6?",
            respuesta: "(x+2)(x+3)"
          },
          {
            nombre: "Guardián Coeficiente",
            salud: 55,
            color: "#009688",
            ejercicios: [
              {pregunta: "¿Factoriza: x^2 - 7x + 12?", respuesta: "(x-3)(x-4)"},
              {pregunta: "¿Factoriza: x^2 + 2x - 15?", respuesta: "(x+5)(x-3)"},
              {pregunta: "¿Factoriza: x^2 - 9x + 20?", respuesta: "(x-4)(x-5)"}
            ],
            pregunta: "¿Factoriza: x^2 - 7x + 12?",
            respuesta: "(x-3)(x-4)"
          }
        ],
        monstruo: {
          nombre: "Lobo Coeficiente",
          salud: 90,
          ejercicios: [
            {pregunta: "¿Factoriza: x^2 - x - 12?", respuesta: "(x+3)(x-4)"},
            {pregunta: "¿Factoriza: x^2 + 4x - 21?", respuesta: "(x+7)(x-3)"},
            {pregunta: "¿Factoriza: x^2 - 2x - 24?", respuesta: "(x-6)(x+4)"},
            {pregunta: "¿Factoriza: x^2 + x - 20?", respuesta: "(x+5)(x-4)"}
          ],
          pregunta: "¿Factoriza: x^2 - x - 12?",
          respuesta: "(x+3)(x-4)"
        },
      }
      // Las siguientes islas se implementarán más adelante
    ];
    
    // Mapa estilo laberinto con nodos en una trayectoria más clara y organizada
    this.mapNodos = [
      // ************ ISLA 0: Diferencia de Cuadrados ************
      // Inicio - zona inferior izquierda
      {x:80, y:300, tipo:'inicio'},
      {x:200, y:280, tipo:'profesor', isla:0},
      {x:320, y:300, tipo:'cofre', isla:0, chestID:'chest1', parchment:0},
      {x:440, y:240, tipo:'minion', isla:0, idx:0},
      {x:560, y:200, tipo:'cofre', isla:0, chestID:'chest2', parchment:1},
      {x:680, y:180, tipo:'minion', isla:0, idx:1},
      {x:800, y:200, tipo:'cofre', isla:0, chestID:'chest3', parchment:2},
      {x:920, y:250, tipo:'monstruo', isla:0},
      
      // ************ ISLA 1: Trinomio Cuadrado Perfecto ************
      {x:80, y:200, tipo:'profesor', isla:1},
      {x:200, y:160, tipo:'cofre', isla:1, chestID:'chest4', parchment:3},
      {x:320, y:180, tipo:'minion', isla:1, idx:0},
      {x:440, y:220, tipo:'minion', isla:1, idx:1},
      {x:560, y:180, tipo:'cofre', isla:1, chestID:'chest5', parchment:0},
      {x:680, y:220, tipo:'monstruo', isla:1},
      
      // ************ ISLA 2: Trinomio de la forma x² + bx + c ************
      {x:80, y:250, tipo:'profesor', isla:2},
      {x:200, y:220, tipo:'cofre', isla:2, chestID:'chest6', parchment:1},
      {x:320, y:180, tipo:'minion', isla:2, idx:0},
      {x:440, y:160, tipo:'minion', isla:2, idx:1},
      {x:560, y:200, tipo:'cofre', isla:2, chestID:'chest7', parchment:2},
      {x:680, y:240, tipo:'monstruo', isla:2},
      {x:800, y:180, tipo:'fin', isla:2},
    ];
    
    // Rutas alternativas o atajos (para expansión futura)
    this.rutasAdicionales = [
      // Atajos para isla 0
      {nodoOrigen: 2, nodoDestino: 5, desbloqueado: false},
      {nodoOrigen: 4, nodoDestino: 6, desbloqueado: false},
      
      // Atajos para isla 1
      {nodoOrigen: 9, nodoDestino: 12, desbloqueado: false},
      
      // Atajos para isla 2
      {nodoOrigen: 16, nodoDestino: 19, desbloqueado: false}
    ];
    
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
