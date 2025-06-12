// src/combat.js
// Sistema de combate JRPG cartoon para Factorilandia
export class CombatSystem {
  constructor(data, hud, inventory) {
    this.data = data;
    this.hud = hud;
    this.inventory = inventory;
    this.dom = document.getElementById('combateJRPG');
  }
  start(tipo, islaIdx, enemigoIdx) {
    this.dom.style.display = '';
    document.getElementById('overworld').style.display = 'none';
    let enemigo;
    const isla = this.data.islas[islaIdx];
    if(tipo==='minion') enemigo = JSON.parse(JSON.stringify(isla.enemigos[enemigoIdx]));
    else enemigo = JSON.parse(JSON.stringify(isla.monstruo));
    this.enemigo = enemigo;
    // Guardar la salud inicial para calcular correctamente la barra de vida
    this.enemigo.saludInicial = enemigo.salud;
    this.monstruoFinal = (tipo==='monstruo');
    this.renderCombate();
  }
  renderCombate() {
    this.dom.innerHTML = `
      <div class="combate-escena">
        <div>
          <div class="combate-barra"><div id="barraVidaJugador" class="combate-barra-vida"></div></div>
          <div class="combate-sprite" id="spriteJugador"></div>
          <div class="combate-nombre">Tú</div>
        </div>
        <div>
          <div class="combate-barra"><div id="barraVidaEnemigo" class="combate-barra-vida"></div></div>
          <div class="combate-sprite" id="spriteEnemigo"></div>
          <div class="combate-nombre">${this.enemigo.nombre}</div>
        </div>
      </div>
      <div id="combateQ" style="margin:18px 0 8px 0;font-weight:bold;">${this.enemigo.pregunta}</div>
      <input id="combateA" placeholder="Escribe tu respuesta">
      <button class="btn" id="btnResponder">Responder</button>
      <button class="btn" id="btnOrbe">Usar Orbe de Sabiduría</button>
      <div id="combateResult"></div>
    `;
    this.updateBarras();
    document.getElementById('btnResponder').onclick = () => this.responder();
    document.getElementById('btnOrbe').onclick = () => this.usarOrbe();
    document.getElementById('combateA').onkeydown = e => { if(e.key==='Enter') this.responder(); };
  }
  updateBarras() {
    let pctJ = Math.max(0, Math.min(1, this.data.player.salud/this.data.player.saludMax));
    // Calcular porcentaje de vida del enemigo usando su salud inicial
    const maxSaludEnemigo = this.enemigo.saludInicial || this.enemigo.salud;
    let pctE = Math.max(0, Math.min(1, this.enemigo.salud / maxSaludEnemigo));
    document.getElementById('barraVidaJugador').style.width = (pctJ*100)+'%';
    document.getElementById('barraVidaEnemigo').style.width = (pctE*100)+'%';
  }
  respuestasEquivalentes(resp1, resp2) {
    const norm = s => s.replace(/\s/g,'').replace(/\*\*/g,'^').replace(/\(([^()]+)\)/g,'$1').toLowerCase();

    // Intenta comparación directa y sin signos +
    if (norm(resp1) === norm(resp2) || norm(resp1).replace(/\+/g,'') === norm(resp2).replace(/\+/g,'')) {
        return true;
    }

    // Maneja propiedad conmutativa para expresiones como (x+a)(x-a) vs (x-a)(x+a)
    // Extraer factores si hay dos conjuntos de paréntesis
    const extractFactores = (s) => {
        const matches = s.match(/\(([^()]+)\)\(([^()]+)\)/);
        if (matches && matches.length >= 3) {
            return [matches[1], matches[2]]; // Devuelve los dos factores
        }
        return null;
    };

    // Intentar extraer factores de ambas respuestas
    const factores1 = extractFactores(resp1.replace(/\s/g, ''));
    const factores2 = extractFactores(resp2.replace(/\s/g, ''));

    // Si ambas expresiones tienen factores, probar combinaciones conmutativas
    if (factores1 && factores2) {
        // Probar orden directo
        if (norm(factores1[0]) === norm(factores2[0]) && norm(factores1[1]) === norm(factores2[1])) {
            return true;
        }
        // Probar orden invertido (conmutativo)
        if (norm(factores1[0]) === norm(factores2[1]) && norm(factores1[1]) === norm(factores2[0])) {
            return true;
        }
    }

    return false;
  }
  responder() {
    const input = document.getElementById('combateA').value.trim();
    let correcta = this.respuestasEquivalentes(input, this.enemigo.respuesta);
    if (correcta) {
      this.enemigo.salud -= this.data.player.arma.daño;
      document.getElementById('combateResult').textContent = `¡Correcto! Le hiciste ${this.data.player.arma.daño} de daño.`;
      document.getElementById('spriteEnemigo').classList.add('combate-anim');
      setTimeout(()=>document.getElementById('spriteEnemigo').classList.remove('combate-anim'),400);
      this.updateBarras();
      if (this.enemigo.salud <= 0) setTimeout(()=>this.victoria(), 700);
      else setTimeout(()=>{
        document.getElementById('combateQ').textContent = `${this.enemigo.pregunta} (${this.enemigo.salud} HP restantes)`;
      }, 700);
    } else {
      this.data.player.salud -= 20;
      document.getElementById('combateResult').textContent = `Incorrecto. El enemigo te hizo 20 de daño.`;
      document.getElementById('spriteJugador').classList.add('combate-anim');
      setTimeout(()=>document.getElementById('spriteJugador').classList.remove('combate-anim'),400);
      this.updateBarras();
      if (this.data.player.salud <= 0) setTimeout(()=>this.derrota(), 700);
      else setTimeout(()=>{
        document.getElementById('combateQ').textContent = `${this.enemigo.pregunta} (${this.enemigo.salud} HP restantes)`;
      }, 700);
    }
    this.hud.update();
  }
  victoria() {
    this.dom.style.display = 'none';
    document.getElementById('overworld').style.display = '';
    this.hud.showMessage('¡Victoria! Has derrotado al enemigo.');
    // Recompensas, desbloqueos, etc.
    this.data.player.exp += this.monstruoFinal ? 50 : 25;
    this.data.player.monedas += this.monstruoFinal ? 40 : 20;
    this.hud.update();
  }
  derrota() {
    this.dom.style.display = 'none';
    document.getElementById('overworld').style.display = '';
    this.hud.showMessage('Has perdido el combate. Recupérate y vuelve a intentarlo.');
    this.data.player.salud = this.data.player.saludMax;
    this.hud.update();
  }
  usarOrbe() {
    if (this.data.player.orbes > 0) {
      this.data.player.orbes--;
      document.getElementById('combateResult').textContent = 'Pista: ' + this.enemigo.respuesta;
      this.hud.update();
    } else {
      document.getElementById('combateResult').textContent = 'No te quedan orbes de sabiduría.';
    }
  }
}
