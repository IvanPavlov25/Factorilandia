// src/game.js
// Orquestador principal de Factorilandia
import { OverworldMap } from './overworld.js';
import { CombatSystem } from './combat.js';
import { Inventory } from './inventory.js';
import { Store } from './store.js';
import { HUD } from './hud.js';
import { ParchmentManager } from './parchment.js';
import { GameData } from './data.js';
import { Combat3D } from './combat3d.js';

export class Game {
  constructor() {
    // Eliminar cualquier dato previo de localStorage
    localStorage.clear();
    
    this.data = new GameData();
    this.hud = new HUD(this.data.player);
    this.parchments = new ParchmentManager();
    this.inventory = new Inventory(this.data.player);
    this.store = new Store(this.data.player, this.inventory);
    this.combat3d = new Combat3D();
    this.combat = new CombatSystem(this.data, this.hud, this.inventory);
    this.map = new OverworldMap(this.data, this, this.parchments, this.hud);
    this.start();
  }
  start() {
    this.hud.showMessage('¡Bienvenido a Factorilandia! Usa las flechas para moverte.');
    this.map.draw();
    this.hud.update();
  }
  
  // Llamado por OverworldMap cuando se entra a un nodo de combate
  startCombat3D(tipo, islaIdx, enemigoIdx) {
    const isla = this.data.islas[islaIdx];
    let enemigo;
    if(tipo==='minion') enemigo = isla.enemigos[enemigoIdx];
    else enemigo = isla.monstruo;
    this.combat3d.show(
      enemigo.pregunta,
      enemigo.respuesta,
      enemigo.nombre,
      enemigo.salud,
      enemigo.respuesta,
      (victoria) => {
        if(victoria) {
          this.hud.showMessage('¡Victoria! Has derrotado al enemigo.');
          this.data.player.exp += tipo==='monstruo' ? 50 : 25;
          this.data.player.monedas += tipo==='monstruo' ? 40 : 20;
          
          // Método simplificado para marcar enemigos derrotados
          if (tipo === 'minion') {
            if (!this.data.enemigosDerrotados.minions.some(e => e.isla === islaIdx && e.idx === enemigoIdx)) {
              this.data.enemigosDerrotados.minions.push({isla: islaIdx, idx: enemigoIdx});
              console.log("Minion derrotado y registrado:", islaIdx, enemigoIdx);
              console.log("Estado actual:", JSON.stringify(this.data.enemigosDerrotados));
            }
          } else if (tipo === 'monstruo') {
            if (!this.data.enemigosDerrotados.monstruos.some(e => e.isla === islaIdx)) {
              this.data.enemigosDerrotados.monstruos.push({isla: islaIdx});
              console.log("Monstruo derrotado y registrado:", islaIdx);
              console.log("Estado actual:", JSON.stringify(this.data.enemigosDerrotados));
            }
          }
        } else {
          this.hud.showMessage('Has perdido el combate. Recupérate y vuelve a intentarlo.');
          this.data.player.salud = this.data.player.saludMax;
        }
        
        // Actualizar HUD y mapa
        this.hud.update();
        
        // Crear un pequeño retraso para asegurar que el redibujado ocurra después de que
        // el UI de combate se haya ocultado completamente
        if (tipo === 'monstruo') {
          // Acabamos de derrotar al jefe: avanzamos automáticamente a la siguiente isla
          setTimeout(() => {
            this.map.cambiarIsla(islaIdx + 1);
          }, 800);
        } else {
          // Redibuja el mapa para reflejar minions o cofres abiertos
          setTimeout(() => {
            this.map.draw();
          }, 200);
        }
      }
    );
  }
  showTutorial() {
    const dom = document.getElementById('tutorial');
    dom.style.display = 'block';
    dom.innerHTML = '<h3>Profesor Mágico</h3><div>¡Bienvenido a Factorilandia! Explora el mapa, abre cofres y derrota enemigos resolviendo ejercicios de factorización.</div><button class="btn" onclick="window.Factorilandia.hideTutorial()">Cerrar</button>';
  }
  hideTutorial() {
    document.getElementById('tutorial').style.display = 'none';
  }
}
// Inicialización global
window.onload = () => { window.Factorilandia = new Game(); }; 