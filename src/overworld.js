// src/overworld.js
// Mapa overworld tipo Mario World para Factorilandia
import { svgPersonaje, svgMinion, svgMonstruo, svgProfesor, svgWarrior } from './sprites.js';

export class OverworldMap {
  constructor(data, game, parchments, hud) {
    this.data = data;
    this.game = game;
    this.parchments = parchments;
    this.hud = hud;
    this.nodos = data.mapNodos;
    this.rutasAdicionales = data.rutasAdicionales || [];
    this.nodoActual = 0;
    this.moviendo = false;
    this.direccion = 1; // 1 derecha, -1 izquierda
    this.animacion = null;

    // contenedor del overworld y configuración inicial de estilos
    this.container = document.getElementById('overworld');
    if (this.container) {
      this.container.classList.add('overworld-container');
    }

    // Nueva propiedad para controlar qué isla se está mostrando actualmente
    this.islaActual = 0;

    window.addEventListener('keydown', e => this.handleKey(e));
  }
  
  // Obtener nodos para la isla actual
  getNodosIslaActual() {
    // Filtrar correctamente para cada isla
    return this.nodos.filter(nodo => {
      // Para la isla 0, incluir el nodo de inicio y los nodos de isla 0
      if (this.islaActual === 0) {
        return nodo.isla === 0 || nodo.tipo === 'inicio';
      } 
      // Para las demás islas, solo incluir nodos que tengan explícitamente esa isla
      else {
        return nodo.isla === this.islaActual;
      }
    });
  }
  
  // Ajustar coordenadas para centrar la isla actual
  ajustarCoordenadas(x, y) {
    // Desplazamiento para centrar la isla actual
    // Asegurarse de que cada isla tenga su propio espacio visual
    return { 
      x: x, // No aplicamos desplazamiento horizontal por isla
      y: y 
    };
  }
  
  draw() {
    // 1) Medir ancho y calcular paso entre nodos
    const width = this.container ? this.container.clientWidth : 0;
    const count = this.nodos.length;
    const padding = 40;
    const usable = width - padding * 2;
    const step = count > 1 ? usable / (count - 1) : 0;

    // 2) Reasignar x de cada nodo
    this.nodos.forEach((nodo, i) => {
      nodo.x = padding + step * i;
    });

    // Obtener nodos filtrados para la isla actual
    const nodosVisibles = this.getNodosIslaActual();

    // Limpiar cualquier contenido previo del SVG
    this.container.innerHTML = '';

    console.log(`Dibujando isla ${this.islaActual} con ${nodosVisibles.length} nodos visibles`);
    
    // SVG fondo tipo Mario World
    const svg = [`<svg width='100%' height='420' viewBox='0 0 1000 420' style='background:#b2f0c2'>`];
    
    // Definir gradientes y patrones
    svg.push(`
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8fd7f0;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#c9f7e1;stop-opacity:0.3" />
        </linearGradient>
        <linearGradient id="water" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#5bbce4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#007bb8;stop-opacity:1" />
        </linearGradient>
        <pattern id="grass" patternUnits="userSpaceOnUse" width="20" height="20">
          <path d="M 0,20 L 20,0 L 0,0 Z" fill="#a8d5a0"/>
          <path d="M 0,20 L 20,0 L 20,20 Z" fill="#96c58f"/>
        </pattern>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    `);
    
    // Texto para mostrar la isla actual
    const nombreIsla = this.data.islas[this.islaActual]?.nombre || "Inicio";
    svg.push(`<text x='50' y='30' fill='#2E7D32' font-weight='bold' font-size='24'>${nombreIsla}</text>`);
    
    // Agua y fondo
    svg.push(`<rect x='0' y='0' width='1000' height='420' fill='url(#bg)' opacity='0.4'/>`);
    svg.push(`<rect x='0' y='350' width='1000' height='70' fill='url(#water)'/>`); // agua inferior
    
    // Añadir pequeñas islas aleatorias en el agua
    for(let i=0; i<5; i++) {
      const x = 100 + Math.random() * 800;
      const y = 360 + Math.random() * 30;
      const radio = 10 + Math.random() * 15;
      svg.push(`<ellipse cx='${x}' cy='${y}' rx='${radio}' ry='${radio/2}' fill='#96c58f' stroke='#75a97a' stroke-width='2'/>`);
    }
    
    // Dibujar caminos principales para nodos visibles
    for(let i=0; i<nodosVisibles.length-1; i++){
      // Evitar conectar nodos de diferentes islas si no están directamente conectados
      if (nodosVisibles[i].isla !== undefined && 
          nodosVisibles[i+1].isla !== undefined && 
          Math.abs(nodosVisibles[i].isla - nodosVisibles[i+1].isla) > 1) {
        continue;
      }
      
      // Ajustar coordenadas para la vista actual
      const inicio = this.ajustarCoordenadas(nodosVisibles[i].x, nodosVisibles[i].y);
      const fin = this.ajustarCoordenadas(nodosVisibles[i+1].x, nodosVisibles[i+1].y);
      
      // Camino principal con efecto de profundidad
      svg.push(`<line x1='${inicio.x}' y1='${inicio.y}' x2='${fin.x}' y2='${fin.y}' stroke='#e0c95b' stroke-width='16' stroke-linecap='round'/>`);
      svg.push(`<line x1='${inicio.x}' y1='${inicio.y}' x2='${fin.x}' y2='${fin.y}' stroke='#a67c00' stroke-width='6' stroke-linecap='round'/>`);
    }
    
    // Dibujar rutas alternativas (atajos o caminos secretos)
    this.rutasAdicionales.forEach(ruta => {
      if (ruta.desbloqueado) {
        // Verificar si ambos nodos están en la vista actual
        const nodoOrigen = this.nodos[ruta.nodoOrigen];
        const nodoDestino = this.nodos[ruta.nodoDestino];
        
        if (nodoOrigen.isla === this.islaActual || nodoOrigen.isla === this.islaActual + 1) {
          if (nodoDestino.isla === this.islaActual || nodoDestino.isla === this.islaActual + 1) {
            // Ajustar coordenadas para la vista actual
            const inicio = this.ajustarCoordenadas(nodoOrigen.x, nodoOrigen.y);
            const fin = this.ajustarCoordenadas(nodoDestino.x, nodoDestino.y);
            
            // Camino alternativo con estilo punteado
            svg.push(`<line x1='${inicio.x}' y1='${inicio.y}' x2='${fin.x}' y2='${fin.y}' stroke='#e0c95b' stroke-width='12' stroke-linecap='round' stroke-dasharray='5,3'/>`);
            svg.push(`<line x1='${inicio.x}' y1='${inicio.y}' x2='${fin.x}' y2='${fin.y}' stroke='#a67c00' stroke-width='4' stroke-linecap='round' stroke-dasharray='5,3'/>`);
          }
        }
      }
    });
    
    // Árboles y decoraciones del escenario
    for(let i=0; i<18; i++){
      let x = 60 + Math.random() * 880, y = 60 + Math.random() * 280;
      
      // Evitar poner árboles cerca de los nodos
      let demasiado_cerca = nodosVisibles.some(nodo => {
        const nodoAjustado = this.ajustarCoordenadas(nodo.x, nodo.y);
        return Math.sqrt(Math.pow(nodoAjustado.x - x, 2) + Math.pow(nodoAjustado.y - y, 2)) < 50;
      });
      
      if (!demasiado_cerca) {
        // Diferentes tipos de vegetación aleatoria
        const tipo = Math.floor(Math.random() * 3);
        
        if (tipo === 0) {
          // Árboles grandes
          svg.push(`<ellipse cx='${x}' cy='${y}' rx='18' ry='28' fill='#70be8c' stroke='#388e3c' stroke-width='3'/>`);
        } else if (tipo === 1) {
          // Arbustos
          svg.push(`<circle cx='${x}' cy='${y}' r='12' fill='#81c784' stroke='#4caf50' stroke-width='2'/>`);
        } else {
          // Flores
          const color = ['#ffeb3b', '#ff9800', '#e91e63'][Math.floor(Math.random() * 3)];
          svg.push(`<circle cx='${x}' cy='${y+5}' r='5' fill='#81c784'/>`);
          svg.push(`<circle cx='${x}' cy='${y}' r='4' fill='${color}'/>`);
        }
      }
    }
    
    // Nodos del mapa
    nodosVisibles.forEach((nodo, i) => {
      let icon = '';
      
      // Ajustar coordenadas para la vista actual
      const pos = this.ajustarCoordenadas(nodo.x, nodo.y);
      
      if(nodo.tipo === 'inicio') {
        // Nodo de inicio con diseño especial
        icon = `
          <g transform='translate(-30,-30)'>
            <circle cx='30' cy='30' r='28' fill='#4db6ac' stroke='#00796b' stroke-width='3'/>
            <text x='30' y='35' text-anchor='middle' fill='#fff' font-weight='bold' font-size='14'>INICIO</text>
          </g>`;
      }
      
      if(nodo.tipo === 'minion') {
        // Comprobar si el minion ha sido derrotado
        const derrotado = this.data.esEnemigoDerrotado ? 
          this.data.esEnemigoDerrotado('minion', nodo.isla, nodo.idx) : false;
        
        if (!derrotado) {
          // Obtener color personalizado para este minion si existe
          const minion = this.data.islas[nodo.isla]?.enemigos[nodo.idx];
          const color = minion?.color || '#ff9800';
          
          // Minions con colores específicos por isla
          icon = `
            <g transform='translate(-30,-30)'>
              <circle cx='60' cy='60' r='40' fill='${color}' stroke='#e65100' stroke-width='4'/>
              <ellipse cx='50' cy='55' rx='8' ry='12' fill='#fff'/>
              <ellipse cx='70' cy='55' rx='8' ry='12' fill='#fff'/>
              <ellipse cx='50' cy='55' rx='3' ry='5' fill='#000'/>
              <ellipse cx='70' cy='55' rx='3' ry='5' fill='#000'/>
              <ellipse cx='60' cy='75' rx='12' ry='5' fill='#a67c00'/>
            </g>`;
        } else {
          // Nodo vacío con marca de derrotado 
          icon = `
            <g transform='translate(-30,-30)'>
              <circle cx='60' cy='60' r='40' fill='#e0e0e0' stroke='#9e9e9e' stroke-width='2' opacity='0.5'/>
              <path d="M40,40 L80,80 M80,40 L40,80" stroke="#9e9e9e" stroke-width="4" opacity="0.6"/>
            </g>`;
        }
      }
      
      if(nodo.tipo === 'cofre') {
        // Verificar si el cofre ha sido abierto
        const chestWasOpened = this.game.parchments.opened[nodo.chestID] || false;
        
        if (!chestWasOpened) {
          // Cofre cerrado
          icon = `
            <g transform='translate(-30,-30)'>
              <rect x='15' y='20' width='50' height='40' rx='5' fill='#8d6e63' stroke='#5d4037' stroke-width='3'/>
              <rect x='15' y='20' width='50' height='15' rx='5' fill='#5d4037'/>
              <circle cx='40' cy='40' r='5' fill='#ffca28'/>
              <rect x='35' y='40' width='10' height='5' fill='#ffca28'/>
              <text x='40' y='65' text-anchor='middle' fill='#333333' font-weight='bold' font-size='12'>COFRE</text>
            </g>`;
        } else {
          // Cofre abierto
          icon = `
            <g transform='translate(-30,-30)'>
              <rect x='15' y='20' width='50' height='40' rx='5' fill='#8d6e63' stroke='#5d4037' stroke-width='3'/>
              <rect x='15' y='20' width='50' height='20' rx='5' fill='#5d4037' transform='rotate(-40, 15, 20)'/>
              <rect x='15' y='46' width='50' height='14' rx='3' fill='#b28956' stroke='#5d4037' stroke-width='1'/>
              <polygon points='40,38 32,45 48,45' fill='#ffdb66'/>
              <text x='40' y='65' text-anchor='middle' fill='#333333' font-weight='bold' font-size='12'>ABIERTO</text>
            </g>`;
        }
      }
      
      if(nodo.tipo === 'monstruo') {
        // Comprobar si el monstruo ha sido derrotado
        const derrotado = this.data.esEnemigoDerrotado ? 
          this.data.esEnemigoDerrotado('monstruo', nodo.isla) : false;
        
        if (!derrotado) {
          // Obtener nombre del monstruo para personalizar
          const nombreMonstruo = this.data.islas[nodo.isla]?.monstruo?.nombre || "Jefe";
          // Colores de monstruos por isla
          const coloresMonstruos = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5'];
          const colorMonstruo = coloresMonstruos[nodo.isla % coloresMonstruos.length];
          
          // Monstruo principal con diseño personalizado por isla
          icon = `
            <g transform='translate(-30,-30)'>
              <circle cx='60' cy='60' r='44' fill='${colorMonstruo}' stroke='#d32f2f' stroke-width='4'/>
              <ellipse cx='50' cy='55' rx='10' ry='14' fill='#fff'/>
              <ellipse cx='70' cy='55' rx='10' ry='14' fill='#fff'/>
              <ellipse cx='50' cy='55' rx='4' ry='6' fill='#000'/>
              <ellipse cx='70' cy='55' rx='4' ry='6' fill='#000'/>
              <ellipse cx='60' cy='80' rx='16' ry='7' fill='#a67c00'/>
              <path d='M40,40 l-10,-10 M80,40 l10,-10 M40,35 l-12,-5 M80,35 l12,-5' stroke='${colorMonstruo}' stroke-width='3'/>
              <text x='60' y='100' text-anchor='middle' fill='#fff' font-weight='bold' font-size='16'>JEFE</text>
            </g>`;
        } else {
          // Nodo vacío con marca de derrotado 
          icon = `
            <g transform='translate(-30,-30)'>
              <circle cx='60' cy='60' r='44' fill='#e0e0e0' stroke='#9e9e9e' stroke-width='2' opacity='0.5'/>
              <path d="M35,35 L85,85 M85,35 L35,85" stroke="#9e9e9e" stroke-width='6' opacity="0.6"/>
              <text x='60' y='64' text-anchor='middle' fill='#9e9e9e' font-weight='bold' font-size='14'>DERROTADO</text>
            </g>`;
        }
      }
      
      if(nodo.tipo === 'profesor') {
        // Profesor más reconocible y con indicación de tema
        const temaIsla = this.data.islas[nodo.isla]?.tema || "Factorización";
        
        icon = `
          <g transform='translate(-30,-30)'>
            <circle cx='30' cy='30' r='28' fill='#42a5f5' stroke='#1976d2' stroke-width='3'/>
            <ellipse cx='30' cy='40' rx='14' ry='12' fill='#fff'/>
            <ellipse cx='24' cy='40' rx='2' ry='4' fill='#000'/>
            <ellipse cx='36' cy='40' rx='2' ry='4' fill='#000'/>
            <polygon points='30,18 36,38 24,38' fill='#1976d2'/>
            <ellipse cx='30' cy='55' rx='6' ry='3' fill='#e0c95b'/>
            <rect x='24' y='60' width='12' height='6' rx='3' fill='#a67c00'/>
            <text x='30' y='30' text-anchor='middle' fill='#fff' font-weight='bold' font-size='10'>PROF</text>
          </g>`;
      }
      
      if(nodo.tipo === 'fin') {
        // Meta final más visible
        icon = `
          <circle cx='${pos.x}' cy='${pos.y}' r='22' fill='#4caf50' stroke='#2e7d32' stroke-width='4'/>
          <text x='${pos.x}' y='${pos.y+7}' font-size='18' text-anchor='middle' fill='#fff' font-weight='bold'>META</text>
          <circle cx='${pos.x}' cy='${pos.y}' r='32' fill='none' stroke='#81c784' stroke-width='2' stroke-dasharray='5,5'>
            <animate attributeName='stroke-dashoffset' from='0' to='20' dur='2s' repeatCount='indefinite' />
          </circle>`;
      }
      
      // Buscar el índice original del nodo en la lista completa
      const idxOriginal = this.nodos.findIndex(n => n.x === nodo.x && n.y === nodo.y && n.tipo === nodo.tipo);
      
      // Agregar efecto de brillo y animación para nodos disponibles
      const esAccesible = (idxOriginal === this.nodoActual + 1) || 
                          (idxOriginal === this.nodoActual - 1) || 
                          this.rutasAdicionales.some(r => r.desbloqueado && 
                          ((r.nodoOrigen === this.nodoActual && r.nodoDestino === idxOriginal) || 
                          (r.nodoDestino === this.nodoActual && r.nodoOrigen === idxOriginal)));
      
      const escala = idxOriginal === this.nodoActual ? 1.2 : 1;
      const filtro = (idxOriginal === this.nodoActual || esAccesible) ? "url(#glow)" : "";
      const animacion = esAccesible ? `<animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />` : "";
      
      // No dibujar el ícono final directamente si ya se dibujó
      if (nodo.tipo !== 'fin') {
        svg.push(`
          <g class='map-nodo node${idxOriginal === this.nodoActual ? ' selected' : ''}'
             data-idx='${idxOriginal}' 
             transform='translate(${pos.x-30},${pos.y-40}) scale(${escala})' 
             style='filter: ${filtro}; opacity: ${esAccesible ? 0.9 : 1}'>
            ${icon}
            ${animacion}
          </g>`);
      }
    });
    
    // Dibuja el personaje guerrero en su posición actual
    const nodoActualVisible = nodosVisibles.find((_, i) => {
      const idxOriginal = this.nodos.findIndex(n => n.x === nodosVisibles[i].x && n.y === nodosVisibles[i].y);
      return idxOriginal === this.nodoActual;
    });
    
    if (nodoActualVisible) {
      const p = this.ajustarCoordenadas(nodoActualVisible.x, nodoActualVisible.y);
      // Añade sombra para destacar al personaje
      svg.push(`<ellipse cx='${p.x}' cy='${p.y+10}' rx='20' ry='8' fill='rgba(0,0,0,0.3)' />`);
      // Dibuja el guerrero con un tamaño y posición ajustados
      svg.push(`<g id="guerrero-personaje" class='map-personaje' transform='translate(${p.x-30},${p.y-60}) scale(1)'>${svgWarrior()}</g>`);
    }
    
    svg.push('</svg>');
    this.container.innerHTML = svg.join('');
    
    // Añade animación al personaje
    if (nodoActualVisible) {
      const guerrero = document.getElementById('guerrero-personaje');
      const p = this.ajustarCoordenadas(nodoActualVisible.x, nodoActualVisible.y);
      if (guerrero) {
        guerrero.animate([
          { transform: `translate(${p.x-30}px,${p.y-60}px) scale(1)` },
          { transform: `translate(${p.x-30}px,${p.y-63}px) scale(1)` },
          { transform: `translate(${p.x-30}px,${p.y-60}px) scale(1)` }
        ], {
          duration: 1000,
          iterations: Infinity
        });
        
        // Aplicar filtro al guerrero
        guerrero.style.filter = 'url(#glow)';
      }
    }
    
    // Añadir eventos de clic a los nodos para permitir moverse al hacer clic
    document.querySelectorAll('.map-nodo').forEach(nodo => {
      const idx = parseInt(nodo.dataset.idx);
      // Solo permitir clic en nodos adyacentes o accesibles por rutas alternativas
      const esAccesible = (idx === this.nodoActual + 1) || 
                         (idx === this.nodoActual - 1) || 
                         this.rutasAdicionales.some(r => r.desbloqueado && 
                         ((r.nodoOrigen === this.nodoActual && r.nodoDestino === idx) || 
                          (r.nodoDestino === this.nodoActual && r.nodoOrigen === idx)));
      
      if (esAccesible) {
        nodo.style.cursor = 'pointer';
        nodo.addEventListener('click', () => {
          if (!this.moviendo) {
            this.direccion = idx > this.nodoActual ? 1 : -1;
            this.moverPersonaje(idx);
          }
        });
      }
    });
  }
  
  // Método para cambiar entre islas
  cambiarIsla(nuevaIsla) {
    // Verificar que la isla existe y está desbloqueada SOLO hacia adelante
    if (nuevaIsla > this.islaActual && nuevaIsla < this.data.islas.length && this.data.esIslaCompletada(this.islaActual)) {
      console.log(`Iniciando cambio de isla de ${this.islaActual} a ${nuevaIsla}`);
      
      // Cambiar a la nueva isla
      this.islaActual = nuevaIsla;
      
      // Reinicio COMPLETO de estado para la nueva isla
      // 1. Resetear pergaminos/cofres abiertos
      if (this.game && this.game.parchments) {
        this.game.parchments.opened = {};
      }
      
      // 2. Resetear COMPLETAMENTE enemigos derrotados (asegurando nuevas referencias de arrays)
      if (this.data && this.data.enemigosDerrotados) {
        this.data.enemigosDerrotados.minions = [];
        this.data.enemigosDerrotados.monstruos = [];
      }
      
      // Buscar el primer nodo de la nueva isla (normalmente el profesor)
      const nodosIsla = this.getNodosIslaActual();
      console.log(`Cambiando a isla ${nuevaIsla}, encontrados ${nodosIsla.length} nodos`);
      
      if (nodosIsla.length > 0) {
        // Encontrar el índice del primer nodo (usualmente el profesor) en la lista completa de nodos
        const primerNodo = this.nodos.findIndex(n => 
          n.isla === nuevaIsla && (n.tipo === 'profesor' || n.tipo === 'inicio')
        );
        
        if (primerNodo !== -1) {
          console.log(`Primer nodo identificado: ${primerNodo}, tipo: ${this.nodos[primerNodo].tipo}`);
          this.nodoActual = primerNodo;
        } else {
          console.log(`No se encontró nodo de profesor o inicio, usando el primer nodo de la isla: ${this.nodos.indexOf(nodosIsla[0])}`);
          this.nodoActual = this.nodos.indexOf(nodosIsla[0]);
        }
      } else {
        console.error(`¡Error! No se encontraron nodos para la isla ${nuevaIsla}`);
      }
      
      // FORZAR un reinicio completo del mapa
      this.container.innerHTML = '';
      
      // Redibujar el mapa con la nueva isla y nodos correctos
      this.draw();
      
      // Mostrar mensaje de bienvenida
      const nombreIsla = this.data.islas[nuevaIsla]?.nombre || "Desconocida";
      const temaIsla = this.data.islas[nuevaIsla]?.tema || "Factorización";
      this.hud.showMessage(`¡Bienvenido a "${nombreIsla}"! Tema: ${temaIsla}`);
      this.reproducirSonido('cambioIsla');
      
      console.log(`Cambio a isla ${nuevaIsla} completado`);
    } else if (nuevaIsla >= this.data.islas.length && this.data.esIslaCompletada(this.islaActual)) {
      this.hud.showMessage('¡Lo lograste! Felicidades por completar Factorilandia.');
    }
  }
  
  handleKey(e) {
    if(document.activeElement.tagName==='INPUT' || this.moviendo) return;
    
    // Manejar movimiento derecha
    if(e.key==='ArrowRight' && this.nodoActual<this.nodos.length-1) {
      this.direccion = 1;
      this.moverPersonaje(this.nodoActual + 1);
    }
    
    // Manejar movimiento izquierda
    if(e.key==='ArrowLeft' && this.nodoActual>0) {
      this.direccion = -1;
      this.moverPersonaje(this.nodoActual - 1);
    }
    
    // Permitir navegación por atajos si están desbloqueados
    if(e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const atajos = this.rutasAdicionales.filter(r => r.desbloqueado && 
        (r.nodoOrigen === this.nodoActual || r.nodoDestino === this.nodoActual));
      
      if (atajos.length > 0) {
        const atajo = atajos[0];
        const destino = atajo.nodoOrigen === this.nodoActual ? atajo.nodoDestino : atajo.nodoOrigen;
        this.direccion = destino > this.nodoActual ? 1 : -1;
        this.moverPersonaje(destino);
      }
    }
  }
  
  moverPersonaje(nuevoNodo) {
    this.moviendo = true;
    
    // Guardar posición actual y destino
    const posActual = this.nodos[this.nodoActual];
    const posFinal = this.nodos[nuevoNodo];
    
    // Crear animación de salto tipo Mario
    const guerrero = document.getElementById('guerrero-personaje');
    const sombra = document.querySelector('#overworld svg ellipse');
    
    if (!guerrero || !sombra) {
      this.finalizarMovimiento(nuevoNodo);
      return;
    }
    
    // Determinar si es un movimiento por atajo o normal
    const esMovimientoPorAtajo = Math.abs(nuevoNodo - this.nodoActual) > 1;
    
    // Animación de salto de un nodo a otro
    const distancia = Math.sqrt(Math.pow(posFinal.x - posActual.x, 2) + Math.pow(posFinal.y - posActual.y, 2));
    const duracion = Math.min(1.2, Math.max(0.5, distancia / 300)); // Velocidad adaptativa con límites
    const pasos = 25;
    let paso = 0;
    
    // Cancelar animación previa si existe
    if (this.animacion) {
      clearInterval(this.animacion);
    }
    
    // Sonido de salto
    this.reproducirSonido(esMovimientoPorAtajo ? 'teleport' : 'jump');
    
    this.animacion = setInterval(() => {
      paso++;
      const progreso = paso / pasos;
      
      // Posición X e Y interpoladas
      const x = posActual.x + progreso * (posFinal.x - posActual.x);
      const y = posActual.y + progreso * (posFinal.y - posActual.y);
      
      // Aplicar efecto de salto parabólico
      const alturaSalto = esMovimientoPorAtajo ? 120 : 80; // Salto más alto para atajos
      const alturaCurva = posActual.y - Math.sin(progreso * Math.PI) * alturaSalto;
      
      // Efectos especiales para atajos
      if (esMovimientoPorAtajo && paso % 3 === 0) {
        // Añadir partículas de efecto especial para atajos
        const particula = document.createElement('div');
        particula.style.position = 'absolute';
        particula.style.width = '10px';
        particula.style.height = '10px';
        particula.style.borderRadius = '50%';
        particula.style.backgroundColor = '#64ffda';
        particula.style.left = `${x}px`;
        particula.style.top = `${alturaCurva}px`;
        particula.style.zIndex = '1000';
        particula.style.opacity = '0.8';
        this.container.appendChild(particula);
        
        // Animar y eliminar partícula
        setTimeout(() => {
          particula.style.transition = 'all 0.5s ease-out';
          particula.style.opacity = '0';
          particula.style.transform = 'scale(0.1)';
          setTimeout(() => particula.remove(), 500);
        }, 10);
      }
      
      // Aplicar transformación al guerrero
      const rotacion = esMovimientoPorAtajo ? 
                      this.direccion * 720 * progreso : // Giro completo para atajos
                      this.direccion * 10 * Math.sin(progreso * Math.PI); // Inclinación normal
                      
      guerrero.style.transform = `translate(${x-30}px,${alturaCurva-60}px) scale(1) rotate(${rotacion}deg)`;
      
      // Mover la sombra
      const escala = 1 - Math.sin(progreso * Math.PI) * 0.6;
      sombra.setAttribute('cx', x);
      sombra.setAttribute('cy', posFinal.y + 10); // Siempre mantener sombra a nivel del suelo
      sombra.setAttribute('rx', 20 * escala);
      sombra.setAttribute('ry', 8 * escala);
      sombra.setAttribute('opacity', 0.3 * escala);
      
      // Finalizar animación
      if (paso >= pasos) {
        clearInterval(this.animacion);
        this.animacion = null;
        this.finalizarMovimiento(nuevoNodo);
      }
    }, duracion * 1000 / pasos);
  }
  
  reproducirSonido(tipo) {
    // Esta función puede implementarse para reproducir sonidos
    // Por ahora es un placeholder para futuras mejoras
    console.log(`Reproduciendo sonido: ${tipo}`);
  }
  
  finalizarMovimiento(nuevoNodo) {
    this.nodoActual = nuevoNodo;
    this.moviendo = false;
    this.draw();
    this.eventoNodo();
  }
  
  eventoNodo() {
    const nodo = this.nodos[this.nodoActual];
    
    // Mostrar mensaje según el tipo de nodo
    if(nodo.tipo === 'inicio') {
      // Si la isla está completada y no es la última, avanzar automáticamente
      if (this.data.esIslaCompletada(this.islaActual) && this.islaActual < this.data.islas.length - 1) {
        this.hud.showMessage('¡Has completado esta isla! Avanzando a la siguiente...');
        setTimeout(() => this.cambiarIsla(this.islaActual + 1), 1800);
      } else {
        this.hud.showMessage('¡Bienvenido a Factorilandia! Usa las flechas ← → para moverte.');
      }
    }
    else if(nodo.tipo === 'cofre') {
      this.abrirCofre(nodo.chestID, nodo.parchment);
    }
    else if(nodo.tipo === 'minion') {
      // Comprobar si el minion ya ha sido derrotado
      const derrotado = this.data.esEnemigoDerrotado ? 
        this.data.esEnemigoDerrotado('minion', nodo.isla, nodo.idx) : false;
        
      if(derrotado) {
        this.hud.showMessage('Este enemigo ya ha sido derrotado. Puedes continuar tu camino.');
      } else {
        // Obtener nombre del minion para personalizar el mensaje
        const nombreMinion = this.data.islas[nodo.isla]?.enemigos[nodo.idx]?.nombre || "Minion";
        this.hud.showMessage(`¡${nombreMinion} del caos matemático aparece!`);
        setTimeout(() => this.game.startCombat3D('minion', nodo.isla, nodo.idx), 1000);
      }
    }
    else if(nodo.tipo === 'monstruo') {
      // Comprobar si el monstruo ya ha sido derrotado
      const derrotado = this.data.esEnemigoDerrotado ? 
        this.data.esEnemigoDerrotado('monstruo', nodo.isla) : false;
        
      if(derrotado) {
        this.hud.showMessage('Has derrotado a este monstruo. El camino está despejado.');
        
        // Si se acaba de derrotar al monstruo de la isla actual, mostrar opción para avanzar
        if (nodo.isla === this.islaActual) {
          setTimeout(() => {
            this.hud.showMessage('¡Has completado esta isla! Puedes avanzar a la siguiente.');
            // Opcionalmente, cambiar automáticamente a la siguiente isla
            if (this.islaActual < this.data.islas.length - 1) {
              setTimeout(() => this.cambiarIsla(this.islaActual + 1), 2000);
            }
          }, 2000);
        }
      } else {
        // Obtener nombre del monstruo para personalizar el mensaje
        const nombreMonstruo = this.data.islas[nodo.isla]?.monstruo?.nombre || "Jefe";
        this.hud.showMessage(`¡Cuidado! ¡${nombreMonstruo} te desafía!`);
        setTimeout(() => this.game.startCombat3D('monstruo', nodo.isla), 1000);
      }
    }
    else if(nodo.tipo === 'profesor') {
      // Mostrar tutorial temático según la isla
      const temaIsla = this.data.islas[nodo.isla]?.tema || "factorización";
      const nombreIsla = this.data.islas[nodo.isla]?.nombre || "esta isla";
      const descripcion = this.data.islas[nodo.isla]?.descripcion || "Explora y derrota enemigos resolviendo ejercicios de factorización.";
      
      this.hud.showMessage(`¡Hola! Soy el Profesor Mágico. En ${nombreIsla} aprenderás sobre ${temaIsla}.`);
      setTimeout(() => {
        const dom = document.getElementById('tutorial');
        dom.style.display = 'block';
        dom.innerHTML = `
          <h3>Profesor Mágico - ${temaIsla}</h3>
          <div>${descripcion}</div>
          <button class="btn" onclick="window.Factorilandia.hideTutorial()">Cerrar</button>
        `;
      }, 1500);
    }
    else if(nodo.tipo === 'fin') {
      // Verificar si toda la isla está completada
      if (this.data.esIslaCompletada(nodo.isla)) {
        this.hud.showMessage('¡Felicidades! Has completado la isla. ¡Bien hecho!');
      } else {
        this.hud.showMessage('¡Debes derrotar al jefe de la isla antes de continuar!');
      }
    }
  }
  
  abrirCofre(chestID, parchmentID) {
    // Obtener el contenido temático para este pergamino
    const contenido = this.data.pergaminos && this.data.pergaminos[parchmentID] 
      ? this.data.pergaminos[parchmentID] 
      : { 
          titulo: "Pergamino Antiguo", 
          contenido: "Factorizar un polinomio significa encontrar expresiones más simples que al multiplicarse dan el polinomio original."
        };
    
    // Mostrar animación de apertura de cofre
    this.hud.showMessage(`¡Has encontrado un pergamino antiguo en el cofre ${chestID.replace('chest', '')}!`);
    
    // Marcar el cofre como abierto y mostrar el pergamino
    setTimeout(() => {
      this.parchments.openChest(chestID, parchmentID, contenido.titulo, contenido.contenido);
      // Redibujar el mapa para mostrar el cofre abierto
      this.draw();
    }, 800);
  }
} 