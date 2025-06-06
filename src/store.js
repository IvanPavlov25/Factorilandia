// src/store.js
// Tienda para Factorilandia
export class Store {
  constructor(player, inventory) {
    this.player = player;
    this.inventory = inventory;
    this.dom = document.getElementById('tienda');
  }
  show() {
    this.dom.style.display = 'block';
    let html = '<h3>Tienda de Factorilandia</h3>';
    html += '<div>Armas:<br>';
    html += `<button class="btn" onclick="window.Factorilandia.store.buyWeapon('Vara Mágica',20,80)">Vara Mágica (+20 daño) - 80 monedas</button><br>`;
    html += `<button class="btn" onclick="window.Factorilandia.store.buyWeapon('Espada Luminosa',35,180)">Espada Luminosa (+35 daño) - 180 monedas</button><br>`;
    html += '<br>Objetos:<br>';
    html += `<button class="btn" onclick="window.Factorilandia.store.buyItem('Poción de Salud', 'salud', 50, 40)">Poción de Salud (+50HP) - 40 monedas</button><br>`;
    html += `<button class="btn" onclick="window.Factorilandia.store.buyItem('Orbe Extra', 'orbe', 1, 30)">Orbe de Sabiduría (+1) - 30 monedas</button><br>`;
    html += '</div>';
    html += '<button class="btn" onclick="window.Factorilandia.store.hide()">Cerrar</button>';
    this.dom.innerHTML = html;
  }
  hide() { this.dom.style.display = 'none'; }
  buyWeapon(nombre, daño, costo) {
    if (this.player.monedas >= costo) {
      this.player.monedas -= costo;
      this.player.arma = {nombre, daño, costo};
      window.Factorilandia.hud.showMessage(`¡Has comprado y equipado: ${nombre}!`);
      window.Factorilandia.hud.update();
    } else {
      window.Factorilandia.hud.showMessage('No tienes monedas suficientes.');
    }
  }
  buyItem(nombre, tipo, valor, costo) {
    if (this.player.monedas >= costo) {
      this.player.monedas -= costo;
      this.player.inventario.push({nombre, tipo, valor});
      window.Factorilandia.hud.showMessage(`¡Has comprado: ${nombre}!`);
      window.Factorilandia.hud.update();
    } else {
      window.Factorilandia.hud.showMessage('No tienes monedas suficientes.');
    }
  }
} 