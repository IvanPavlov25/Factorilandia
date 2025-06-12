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
          {nombre: "Minion Espejo", pregunta: "¿Factoriza: x^2 - 4?", respuesta: "(x+2)(x-2)", salud: 30, color: "#ff9800"},
          {nombre: "Guardián Reflexivo", pregunta: "¿Factoriza: y^2 - 25?", respuesta: "(y+5)(y-5)", salud: 45, color: "#ffa726"},
        ],
        monstruo: {nombre: "Espectro Δ²", pregunta: "¿Factoriza: 9a^2 - 16b^2?", respuesta: "(3a+4b)(3a-4b)", salud: 70},
      },
      {
        nombre: "Bosque Simétrico", 
        tema: "Trinomio Cuadrado Perfecto",
        descripcion: "Aprende a identificar y factorizar expresiones de la forma a² + 2ab + b², que se convierten en (a+b)²",
        enemigos: [
          {nombre: "Minion Simétrico", pregunta: "¿Factoriza: x^2 + 6x + 9?", respuesta: "(x+3)^2", salud: 35, color: "#8bc34a"},
          {nombre: "Guardián Perfecto", pregunta: "¿Factoriza: y^2 - 10y + 25?", respuesta: "(y-5)^2", salud: 50, color: "#7cb342"},
        ],
        monstruo: {nombre: "Monstruo TCP", pregunta: "¿Factoriza: 4a^2 + 12a + 9?", respuesta: "(2a+3)^2", salud: 80},
      },
      {
        nombre: "Llanuras Algebraicas", 
        tema: "Trinomio de la forma x² + bx + c",
        descripcion: "Aprende a factorizar expresiones donde el coeficiente de x² es 1",
        enemigos: [
          {nombre: "Lobo Algebraico", pregunta: "¿Factoriza: x^2 + 5x + 6?", respuesta: "(x+2)(x+3)", salud: 40, color: "#26a69a"},
          {nombre: "Guardián Coeficiente", pregunta: "¿Factoriza: x^2 - 7x + 12?", respuesta: "(x-3)(x-4)", salud: 55, color: "#009688"},
        ],
        monstruo: {nombre: "Lobo Coeficiente", pregunta: "¿Factoriza: x^2 - x - 12?", respuesta: "(x+3)(x-4)", salud: 90},
      }
      // Las siguientes islas se implementarán más adelante
    ];
    
    // Mapa estilo laberinto con nodos en una trayectoria más clara y organizada
    this.mapNodos = [
      // ************ ISLA 0: Diferencia de Cuadrados ************
      // Inicio - zona inferior izquierda
      {x:80, y:300, tipo:'inicio'},
      {x:220, y:280, tipo:'profesor', isla:0},
      {x:360, y:260, tipo:'minion', isla:0, idx:0},
      {x:500, y:240, tipo:'cofre', isla:0, chestID:'chest1', parchment:0},
      {x:640, y:220, tipo:'minion', isla:0, idx:1},
      {x:780, y:240, tipo:'cofre', isla:0, chestID:'chest2', parchment:1},
      {x:920, y:260, tipo:'monstruo', isla:0},
      
      // ************ ISLA 1: Trinomio Cuadrado Perfecto ************
      {x:80, y:200, tipo:'profesor', isla:1},
      {x:220, y:180, tipo:'minion', isla:1, idx:0},
      {x:360, y:160, tipo:'cofre', isla:1, chestID:'chest4', parchment:3},
      {x:500, y:180, tipo:'minion', isla:1, idx:1},
      {x:640, y:160, tipo:'cofre', isla:1, chestID:'chest5', parchment:0},
      {x:780, y:200, tipo:'monstruo', isla:1},
      
      // ************ ISLA 2: Trinomio de la forma x² + bx + c ************
      {x:80, y:250, tipo:'profesor', isla:2},
      {x:220, y:230, tipo:'minion', isla:2, idx:0},
      {x:360, y:210, tipo:'cofre', isla:2, chestID:'chest6', parchment:1},
      {x:500, y:190, tipo:'minion', isla:2, idx:1},
      {x:640, y:210, tipo:'cofre', isla:2, chestID:'chest7', parchment:2},
      {x:780, y:240, tipo:'monstruo', isla:2},
      {x:920, y:200, tipo:'fin', isla:2},
    ];
    
    // Rutas alternativas o atajos (para expansion futura)
    this.rutasAdicionales = [
      // Atajos para isla 0
      {nodoOrigen: 3, nodoDestino: 5, desbloqueado: false},
      {nodoOrigen: 2, nodoDestino: 6, desbloqueado: false},

      // Atajos para isla 1
      {nodoOrigen: 9, nodoDestino: 11, desbloqueado: false},

      // Atajos para isla 2
      {nodoOrigen: 14, nodoDestino: 18, desbloqueado: false}
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
