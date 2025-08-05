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
  startCombat3D(tipo, islaIdx, enemigoIdx, ejerciciosOverride) {
    const isla = this.data.islas[islaIdx];
    let enemigo;
    if (tipo === 'minion') enemigo = isla.enemigos[enemigoIdx];
    else enemigo = isla.monstruo;

    const ejercicios = ejerciciosOverride || enemigo.ejercicios || [{pregunta: enemigo.pregunta, respuesta: enemigo.respuesta}];
    let idxActual = 0;
    let hpActual = enemigo.salud;
    const hpMax = enemigo.salud;
    const damage = Math.ceil(hpMax / ejercicios.length);

    const lanzarEjercicio = () => {
      const ej = ejercicios[idxActual];
      this.combat3d.show(
        ej.pregunta,
        ej.respuesta,
        enemigo.nombre,
        hpActual,
        hpMax,
        ej.respuesta,
        (victoria) => {
          if (victoria) {
            hpActual = Math.max(0, hpActual - damage);
            this.combat3d.updateHP(hpActual, hpMax);
            idxActual++;
            if (hpActual > 0 && idxActual < ejercicios.length) {
              setTimeout(lanzarEjercicio, 500);
              return;
            }

            this.hud.showMessage('¡Victoria! Has derrotado al enemigo.');
            this.data.player.exp += tipo === 'monstruo' ? 50 : 25;
            this.data.player.monedas += tipo === 'monstruo' ? 40 : 20;

              if (tipo === 'minion') {
                if (!this.data.enemigosDerrotados.minions.some(e => e.isla === islaIdx && e.idx === enemigoIdx)) {
                  this.data.enemigosDerrotados.minions.push({isla: islaIdx, idx: enemigoIdx});
                  console.log('Minion derrotado y registrado:', islaIdx, enemigoIdx);
                  console.log('Estado actual:', JSON.stringify(this.data.enemigosDerrotados));
                }
              } else if (tipo === 'monstruo') {
                if (!this.data.enemigosDerrotados.monstruos.some(e => e.isla === islaIdx)) {
                  this.data.enemigosDerrotados.monstruos.push({isla: islaIdx});
                  console.log('Monstruo derrotado y registrado:', islaIdx);
                  console.log('Estado actual:', JSON.stringify(this.data.enemigosDerrotados));
                }
              } else if (tipo === 'jefe') {
                // lógica existente para el jefe final (cambiarIsla, etc.)
                setTimeout(() => {
                  const overlay = document.createElement('div');
                  overlay.id = 'congrats-overlay';
                  overlay.innerHTML = `<div class="message">¡Felicidades! Lo has logrado!</div>`;
                  document.body.appendChild(overlay);
                  overlay.addEventListener('click', () => overlay.remove());
                }, 500);
              }
            this.combat3d.hide();
          } else {
            this.hud.showMessage('Has perdido el combate. Recupérate y vuelve a intentarlo.');
            this.data.player.salud = this.data.player.saludMax;
            this.combat3d.hide();
          }

          this.hud.update();

          if (victoria && tipo === 'monstruo' && idxActual >= ejercicios.length) {
            setTimeout(() => {
              this.map.cambiarIsla(islaIdx + 1);
            }, 800);
          } else if (victoria && idxActual >= ejercicios.length) {
            setTimeout(() => {
              this.map.draw();
            }, 200);
          }
        }
      );
    };

    lanzarEjercicio();
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