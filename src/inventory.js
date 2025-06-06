// src/inventory.js
// Inventario y uso de objetos para Factorilandia
export class Inventory {
  constructor(player) {
    this.player = player;
    this.dom = document.getElementById('inventario');
  }
  show() {
    this.dom.style.display = 'block';
    let html = '<h3>Inventario</h3>';
    if (this.player.inventario.length === 0) html += 'Inventario vacío.';
    this.player.inventario.forEach((item,i) => {
      html += `<div class="item">${item.nombre} <button onclick="window.Factorilandia.inventory.use(${i})">Usar</button></div>`;
    });
    html += '<button class="btn" onclick="window.Factorilandia.inventory.hide()">Cerrar</button>';
    this.dom.innerHTML = html;
  }
  hide() { this.dom.style.display = 'none'; }
  use(idx) {
    const item = this.player.inventario[idx];
    if (item.tipo === 'salud') this.player.salud = Math.min(this.player.saludMax, this.player.salud + item.valor);
    if (item.tipo === 'orbe') this.player.orbes += item.valor;
    window.Factorilandia.hud.showMessage(`Has usado: ${item.nombre}.`);
    this.player.inventario.splice(idx, 1);
    window.Factorilandia.hud.update();
    this.show();
  }
} 