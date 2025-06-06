// src/hud.js
// HUD y mensajes para Factorilandia
export class HUD {
  constructor(player) {
    this.player = player;
    this.dom = document.getElementById('hud');
    this.msgDom = document.getElementById('mensaje');
  }
  update() {
    this.dom.innerHTML = `
      <span>💪 Nivel: <span id="nivel">${this.player.nivel}</span></span> |
      <span>❤️ Salud: <span id="salud">${this.player.salud}</span></span> |
      <span>✨ Exp: <span id="exp">${this.player.exp}</span></span> |
      <span>🪙 Monedas: <span id="monedas">${this.player.monedas}</span></span> |
      <span>🧠 Orbes: <span id="orbes">${this.player.orbes}</span></span>
      <button class="btn" onclick="window.Factorilandia.inventory.show()">Inventario</button>
      <button class="btn" onclick="window.Factorilandia.store.show()">Tienda</button>
      <button class="btn" onclick="window.Factorilandia.showTutorial()">Tutorial</button>
    `;
  }
  showMessage(texto) {
    this.msgDom.innerHTML = texto;
  }
} 