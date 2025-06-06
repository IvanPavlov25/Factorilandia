// src/parchment.js
// Sistema de pergaminos/cofres para Factorilandia
export class ParchmentManager {
  constructor() {
    this.parchments = [
      this.makeParchment("¿Qué es factorización?", "Hay diferentes tipos de trinomios, lo que equivale un método de factorización para cada uno de ellos... recordemos que la factorización es la <b>reagrupación</b> de una expresión matemática en factores de una multiplicación."),
      this.makeParchment("¿Qué es factorización?", "El término <b>Trinomio</b> se emplea en el ámbito de las matemáticas con referencia a la expresión algebraica formada por tres términos que están vinculados por los signos menos (–) o más (+).<br><br><span style='color:green;font-weight:bold;'>5p + 2r - 4s</span>"),
      this.makeParchment("Primer tesoro", "<ul><li>¿Qué entiende por factorización?</li><li>¿Qué es un trinomio?</li><li>¿Qué es una expresión cuadrática?</li><li>¿Cómo se determina el grado de una expresión algebraica?</li></ul>"),
      this.makeParchment("¿Qué es factorización?", "Hay diferentes tipos de trinomios, lo que equivale un método de factorización para cada uno de ellos... recordemos que la factorización es la <b>reagrupación</b> de una expresión matemática en factores de una multiplicación.<br><br><img src='https://i.imgur.com/0y8FQ2B.png' style='max-width:200px;'>")
    ];
    
    // Iniciar con todos los cofres cerrados
    this.opened = {};
  }
  
  makeParchment(title, html) {
    return `<div style='position:relative;width:600px;height:340px;background:#fff7ea;border-radius:18px;box-shadow:0 8px 32px #000a;padding:32px 48px;display:flex;flex-direction:column;align-items:center;justify-content:center;'>
      <div style='font-size:1.5em;font-weight:bold;margin-bottom:12px;color:#333333;'>${title}</div>
      <div style='font-size:1.1em;text-align:center;color:#333333;'>${html}</div>
    </div>`;
  }
  
  show(index, title, content) {
    if(document.querySelector('.parchment-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'parchment-overlay';
    
    let parchmentContent;
    if (title && content) {
      // Si se pasan título y contenido, crea un pergamino personalizado
      parchmentContent = this.makeParchment(title, content);
    } else {
      // Si solo se pasa el índice, usa uno de los predefinidos
      parchmentContent = this.parchments[index];
    }
    
    overlay.innerHTML = `
      <div class="parchment-img" style="position:relative;">
        ${parchmentContent}
        <button class="parchment-close" style="position:absolute;bottom:10px;right:10px;background:#8d6e63;color:white;border:none;padding:8px 16px;border-radius:5px;cursor:pointer;font-weight:bold;">Cerrar</button>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Estilo para la superposición
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '3000';
    
    // Efecto de entrada
    const parchmentImg = overlay.querySelector('.parchment-img');
    parchmentImg.style.transform = 'scale(0.9)';
    parchmentImg.style.opacity = '0';
    parchmentImg.style.transition = 'all 0.3s ease-out';
    
    setTimeout(() => {
      parchmentImg.style.transform = 'scale(1)';
      parchmentImg.style.opacity = '1';
    }, 50);
    
    overlay.querySelector('.parchment-close').onclick = () => {
      // Efecto de salida
      parchmentImg.style.transform = 'scale(0.9)';
      parchmentImg.style.opacity = '0';
      
      setTimeout(() => {
        overlay.remove();
      }, 300);
    };
  }
  
  openChest(chestID, parchmentIndex, title, content) {
    // Marcar el cofre como abierto
    this.opened[chestID] = true;
    localStorage.setItem('factorilandia_chests', JSON.stringify(this.opened));
    
    // Mostrar el pergamino
    if (title && content) {
      this.show(parchmentIndex, title, content);
    } else {
      this.show(parchmentIndex);
    }
  }
} 