// src/combat3d.js
// Combate 3D cartoon con Three.js y UI HTML/CSS para Factorilandia
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

export class Combat3D {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'combat3d-container';
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100vw';
    this.container.style.height = '100vh';
    this.container.style.zIndex = '2000';
    this.container.style.display = 'none';
    document.body.appendChild(this.container);
    this.efectos = [];
    
    // Delay the initialization until the component is shown
    this.initialized = false;
  }
  
  init3D() {
    if (this.initialized) return; // Prevent multiple initializations
    
    try {
      // Check if WebGL is available
      if (!this.isWebGLAvailable()) {
        this.showWebGLError();
        return;
      }
      
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
      this.camera.position.set(0, 8, 16);
      this.camera.lookAt(0,0,0);
      
      // Create renderer with error handling
      try {
        this.renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
        this.renderer.setClearColor(0x101024);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
      } catch (e) {
        console.error("Error creating WebGL renderer:", e);
        this.showWebGLError();
        return;
      }
      
      // Arena
      const arenaGeo = new THREE.CylinderGeometry(6,6,1,64);
      const arenaMat = new THREE.MeshPhongMaterial({color:0x3a3aff, shininess:80});
      this.arena = new THREE.Mesh(arenaGeo, arenaMat);
      this.arena.position.y = 0.5;
      this.scene.add(this.arena);
      
      // Luces
      const light = new THREE.PointLight(0xffffff, 1.2, 100);
      light.position.set(0, 12, 8);
      this.scene.add(light);
      this.scene.add(new THREE.AmbientLight(0x404060, 0.7));
      
      // Héroe (Guerrero)
      this.crearGuerrero();
      
      // Enemigo (Monstruo)
      this.crearMonstruo();
      
      // Postes
      for(let i=0;i<8;i++){
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2,0.2,6,12),
          new THREE.MeshLambertMaterial({color:0x8888ff})
        );
        const angle = i*Math.PI/4;
        post.position.set(5.5*Math.cos(angle),3,5.5*Math.sin(angle));
        this.scene.add(post);
      }
      
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
      
      // Add resize handler
      window.addEventListener('resize', this.onWindowResize.bind(this));
      
      this.initialized = true; // Mark as initialized
    } catch (e) {
      console.error("Error initializing 3D scene:", e);
      this.showWebGLError();
    }
  }
  
  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }
  
  showWebGLError() {
    // Create fallback UI for users without WebGL
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'absolute';
    errorDiv.style.top = '30%';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translate(-50%, -50%)';
    errorDiv.style.background = '#f44336';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '20px';
    errorDiv.style.borderRadius = '10px';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
    errorDiv.innerHTML = `
      <h3>Error al cargar el modo 3D</h3>
      <p>Tu navegador no soporta WebGL o hay un problema con la tarjeta gráfica.</p>
      <p>Usaremos el modo 2D como alternativa.</p>
    `;
    this.container.appendChild(errorDiv);
  }
  
  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  crearGuerrero() {
    // Grupo principal para el guerrero
    this.hero = new THREE.Group();
    
    // Cuerpo
    const cuerpoGeo = new THREE.CylinderGeometry(0.6, 0.8, 1.8, 8);
    const cuerpoMat = new THREE.MeshLambertMaterial({color: 0x1a237e}); // Azul más oscuro para armadura
    const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat);
    cuerpo.position.y = 0.9;
    this.hero.add(cuerpo);
    
    // Cabeza
    const cabezaGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const cabezaMat = new THREE.MeshLambertMaterial({color: 0xd7ccc8}); // Tono piel más realista
    const cabeza = new THREE.Mesh(cabezaGeo, cabezaMat);
    cabeza.position.y = 2.1;
    this.hero.add(cabeza);
    
    // Casco
    const cascoGeo = new THREE.SphereGeometry(0.52, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.3);
    const cascoMat = new THREE.MeshPhongMaterial({color: 0x455a64, shininess: 60});
    const casco = new THREE.Mesh(cascoGeo, cascoMat);
    casco.position.y = 2.1;
    casco.rotation.x = -0.2;
    this.hero.add(casco);
    
    // Penacho del casco
    const penachoGeo = new THREE.BoxGeometry(0.1, 0.5, 0.7);
    const penachoMat = new THREE.MeshLambertMaterial({color: 0xe53935}); // Rojo intenso
    const penacho = new THREE.Mesh(penachoGeo, penachoMat);
    penacho.position.set(0, 2.5, 0.05);
    penacho.rotation.x = Math.PI / 6;
    this.hero.add(penacho);
    
    // Hombreras
    const hombreraGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const hombreraMat = new THREE.MeshPhongMaterial({color: 0x1a237e, shininess: 30});
    
    const hombreraIzq = new THREE.Mesh(hombreraGeo, hombreraMat);
    hombreraIzq.position.set(-0.8, 1.7, 0);
    hombreraIzq.scale.x = 0.8;
    this.hero.add(hombreraIzq);
    
    const hombreraDer = new THREE.Mesh(hombreraGeo, hombreraMat);
    hombreraDer.position.set(0.8, 1.7, 0);
    hombreraDer.scale.x = 0.8;
    this.hero.add(hombreraDer);
    
    // Espada mejorada
    const espadaGrupo = new THREE.Group();
    
    // Mango de la espada
    const espadaMango = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8),
      new THREE.MeshLambertMaterial({color: 0x4e342e}) // Marrón oscuro
    );
    espadaGrupo.add(espadaMango);
    
    // Guardia de la espada
    const espadaGuardia = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.1, 0.15),
      new THREE.MeshPhongMaterial({color: 0xffd54f, shininess: 100}) // Dorado
    );
    espadaGuardia.position.y = 0.3;
    espadaGrupo.add(espadaGuardia);
    
    // Hoja de la espada
    const espadaHoja = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 1.5, 0.05),
      new THREE.MeshPhongMaterial({color: 0xeceff1, shininess: 150}) // Plateado brillante
    );
    espadaHoja.position.y = 1.1;
    espadaGrupo.add(espadaHoja);
    
    // Añadir detalles a la hoja
    const espadaFilo = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.4, 0.01),
      new THREE.MeshBasicMaterial({color: 0xffffff}) // Brillo del filo
    );
    espadaFilo.position.set(0, 1.1, 0.03);
    espadaGrupo.add(espadaFilo);
    
    // Posición de la espada
    espadaGrupo.position.set(0.9, 1.3, 0);
    espadaGrupo.rotation.z = Math.PI / 8;
    this.hero.add(espadaGrupo);
    
    // Escudo mejorado
    const escudoGrupo = new THREE.Group();
    
    // Base del escudo
    const escudoBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1.0, 0.8),
      new THREE.MeshLambertMaterial({color: 0x3e2723}) // Marrón oscuro
    );
    escudoGrupo.add(escudoBase);
    
    // Frontal del escudo
    const escudoFrontal = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.9, 0.7),
      new THREE.MeshPhongMaterial({color: 0x1565c0, shininess: 50}) // Azul con brillo
    );
    escudoFrontal.position.z = 0;
    escudoFrontal.position.x = -0.08;
    escudoGrupo.add(escudoFrontal);
    
    // Emblema del escudo
    const emblemaGeo = new THREE.CircleGeometry(0.2, 16);
    const emblemaMat = new THREE.MeshBasicMaterial({color: 0xffd54f}); // Dorado
    const emblema = new THREE.Mesh(emblemaGeo, emblemaMat);
    emblema.position.set(-0.1, 0, 0);
    emblema.rotation.x = Math.PI / 2;
    escudoGrupo.add(emblema);
    
    // Posición del escudo
    escudoGrupo.position.set(-0.8, 1.2, 0);
    this.hero.add(escudoGrupo);
    
    // Posición final del guerrero
    this.hero.position.set(-2, 1.5, 0);
    this.scene.add(this.hero);
  }
  
  crearMonstruo() {
    this.enemy = new THREE.Group();
    
    // Cuerpo principal
    const cuerpoGeo = new THREE.SphereGeometry(1.7, 24, 24);
    const cuerpoMat = new THREE.MeshLambertMaterial({color: 0xd32f2f}); // Rojo más intenso
    const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat);
    cuerpo.position.y = 1.7;
    this.enemy.add(cuerpo);
    
    // Textura para el cuerpo
    const texturaCuerpo = new THREE.Mesh(
      new THREE.SphereGeometry(1.71, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0x000000, 
        wireframe: true,
        transparent: true,
        opacity: 0.1
      })
    );
    texturaCuerpo.position.y = 1.7;
    this.enemy.add(texturaCuerpo);
    
    // Ojos grandes y amenazantes
    const ojoGeo = new THREE.SphereGeometry(0.35, 20, 20);
    const ojoMat = new THREE.MeshLambertMaterial({color: 0xffeb3b}); // Amarillo brillante
    
    const ojoIzq = new THREE.Mesh(ojoGeo, ojoMat);
    ojoIzq.position.set(-0.6, 2.1, 1.1);
    this.enemy.add(ojoIzq);
    
    const ojoDer = new THREE.Mesh(ojoGeo, ojoMat);
    ojoDer.position.set(0.6, 2.1, 1.1);
    this.enemy.add(ojoDer);
    
    // Pupilas
    const pupilaGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const pupilaMat = new THREE.MeshBasicMaterial({color: 0x000000});
    
    const pupilaIzq = new THREE.Mesh(pupilaGeo, pupilaMat);
    pupilaIzq.position.set(-0.6, 2.1, 1.35);
    this.enemy.add(pupilaIzq);
    
    const pupilaDer = new THREE.Mesh(pupilaGeo, pupilaMat);
    pupilaDer.position.set(0.6, 2.1, 1.35);
    this.enemy.add(pupilaDer);
    
    // Brillo de los ojos
    const brilloGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const brilloMat = new THREE.MeshBasicMaterial({color: 0xffffff});
    
    const brilloIzq = new THREE.Mesh(brilloGeo, brilloMat);
    brilloIzq.position.set(-0.5, 2.2, 1.43);
    this.enemy.add(brilloIzq);
    
    const brilloDer = new THREE.Mesh(brilloGeo, brilloMat);
    brilloDer.position.set(0.7, 2.2, 1.43);
    this.enemy.add(brilloDer);
    
    // Cuernos más grandes e intimidantes
    const cuernoGeo = new THREE.ConeGeometry(0.3, 1.4, 10);
    const cuernoMat = new THREE.MeshLambertMaterial({color: 0x212121}); // Negro
    
    const cuernoIzq = new THREE.Mesh(cuernoGeo, cuernoMat);
    cuernoIzq.position.set(-0.9, 3.0, 0);
    cuernoIzq.rotation.x = -Math.PI / 6;
    cuernoIzq.rotation.z = -Math.PI / 8;
    this.enemy.add(cuernoIzq);
    
    const cuernoDer = new THREE.Mesh(cuernoGeo, cuernoMat);
    cuernoDer.position.set(0.9, 3.0, 0);
    cuernoDer.rotation.x = -Math.PI / 6;
    cuernoDer.rotation.z = Math.PI / 8;
    this.enemy.add(cuernoDer);
    
    // Pequeños cuernos extra
    for (let i = 0; i < 6; i++) {
      const miniCuernoGeo = new THREE.ConeGeometry(0.12, 0.5, 8);
      const miniCuerno = new THREE.Mesh(miniCuernoGeo, cuernoMat);
      const angulo = i * Math.PI / 3;
      const radio = 1.5;
      miniCuerno.position.set(
        Math.cos(angulo) * radio, 
        2.4, 
        Math.sin(angulo) * radio
      );
      miniCuerno.lookAt(new THREE.Vector3(0, 5, 0));
      this.enemy.add(miniCuerno);
    }
    
    // Boca amenazante
    const bocaGeo = new THREE.BoxGeometry(0.8, 0.4, 0.3);
    const bocaMat = new THREE.MeshLambertMaterial({color: 0x000000});
    const boca = new THREE.Mesh(bocaGeo, bocaMat);
    boca.position.set(0, 1.4, 1.3);
    this.enemy.add(boca);
    
    // Dientes
    for (let i = 0; i < 5; i++) {
      const dienteGeo = new THREE.ConeGeometry(0.06, 0.2, 4);
      const dienteMat = new THREE.MeshBasicMaterial({color: 0xffffff});
      const diente = new THREE.Mesh(dienteGeo, dienteMat);
      diente.position.set(-0.3 + i * 0.15, 1.2, 1.4);
      diente.rotation.x = Math.PI;
      this.enemy.add(diente);
    }
    
    // Posición final del monstruo
    this.enemy.position.set(2, 1.5, 0);
    this.scene.add(this.enemy);
  }
  
  crearEfectoAtaque() {
    // Crear un rayo láser que va del héroe al enemigo
    const geometria = new THREE.CylinderGeometry(0.15, 0.15, 4, 12);
    
    // Material brillante con emisión para efecto láser
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
    });
    
    const rayo = new THREE.Mesh(geometria, material);
    
    // Posicionamiento correcto del rayo entre los personajes
    rayo.position.set(0, 2, 0);
    rayo.rotation.z = Math.PI / 2;
    this.scene.add(rayo);
    
    // Añadir luz al rayo para efecto de brillo
    const luz = new THREE.PointLight(0x00ffff, 2, 5);
    luz.position.set(this.enemy.position.x - 2, this.enemy.position.y + 1.5, this.enemy.position.z);
    this.scene.add(luz);
    
    // Partículas en el punto de impacto (como un kame hame ha)
    const particulasGeom = new THREE.BufferGeometry();
    const posiciones = [];
    const colores = [];
    
    for (let i = 0; i < 300; i++) {
      posiciones.push(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      
      // Colores más brillantes y variados para las partículas
      const color = Math.random();
      colores.push(
        color < 0.3 ? 0 : 1, // Azules y blancos
        color,
        1
      );
    }
    
    particulasGeom.setAttribute('position', new THREE.Float32BufferAttribute(posiciones, 3));
    particulasGeom.setAttribute('color', new THREE.Float32BufferAttribute(colores, 3));
    
    const particulas = new THREE.Points(
      particulasGeom,
      new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      })
    );
    
    particulas.position.set(this.enemy.position.x, this.enemy.position.y + 1.5, this.enemy.position.z);
    this.scene.add(particulas);
    
    // Guardamos los efectos para poder animarlos y eliminarlos
    this.efectos.push({
      rayo,
      luz,
      particulas,
      tiempo: 0,
      duracion: 1.5 // segundos
    });
  }
  
  animate(tiempo) {
    tiempo = tiempo / 1000; // Convertir a segundos
    
    if (this.container.style.display === 'none') {
      this.animating = false;
      return; // Don't animate when not visible
    }
    
    // Animación de personajes - ahora se miran entre sí, no giran
    if (this.hero) {
      // El héroe mira hacia el enemigo
      this.hero.rotation.y = Math.PI / 6; // Fijo mirando hacia la derecha
    }
    
    if (this.enemy) {
      // El enemigo mira hacia el héroe
      this.enemy.rotation.y = -Math.PI / 6; // Fijo mirando hacia la izquierda
    }
    
    // Hero "respiración"
    if (this.hero) this.hero.position.y = 1.5 + Math.sin(tiempo * 2) * 0.05;
    
    // Monstruo flotante
    if (this.enemy) this.enemy.position.y = 1.5 + Math.sin(tiempo * 1.5) * 0.08;
    
    // Animar efectos
    for (let i = 0; i < this.efectos.length; i++) {
      const efecto = this.efectos[i];
      
      efecto.tiempo += 0.016; // Aproximadamente 60 fps
      
      if (efecto.tiempo < efecto.duracion) {
        // Animar rayo
        const progreso = efecto.tiempo / efecto.duracion;
        
        efecto.rayo.material.opacity = Math.sin(progreso * Math.PI) * 0.8;
        efecto.rayo.scale.y = Math.sin(progreso * Math.PI) * 1.2;
        
        // Animar partículas
        const escala = Math.sin(progreso * Math.PI) * 2;
        efecto.particulas.scale.set(escala, escala, escala);
        efecto.particulas.material.opacity = Math.sin(progreso * Math.PI) * 0.8;
        efecto.particulas.rotation.y += 0.1;
      } else {
        // Eliminar efectos terminados
        this.scene.remove(efecto.rayo);
        this.scene.remove(efecto.particulas);
        if (efecto.luz) {
          this.scene.remove(efecto.luz);
        }
        this.efectos.splice(i, 1);
        i--;
      }
    }
    
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
    
    // Continue animation loop
    this.animating = true;
    requestAnimationFrame(this.animate);
  }
  
  initUI() {
    this.ui = document.createElement('div');
    this.ui.id = 'combat3d-ui';
    this.ui.style.position = 'absolute';
    this.ui.style.left = '0';
    this.ui.style.bottom = '0';
    this.ui.style.width = '100vw';
    this.ui.style.height = 'auto';
    this.ui.style.display = 'flex';
    this.ui.style.alignItems = 'center';
    this.ui.style.justifyContent = 'center';
    this.ui.style.paddingBottom = '20px';
    this.ui.innerHTML = `
      <div style="display:flex;gap:20px;margin-bottom:100px;filter:drop-shadow(0 5px 10px rgba(0,0,0,0.5));">
        <div style="background:linear-gradient(to bottom, #0d1130, #1a237e); color:#fff; border-radius:12px; padding:20px; min-width:200px; font-family:monospace; border: 3px solid #43a047; box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);">
          <div style="margin-bottom:8px;font-size:1.1em;font-weight:bold;">Factoriza:</div>
          <div id="combat3d-expresion" style="font-size:1.4em;color:#ffee58;font-family:monospace;margin-bottom:12px;text-shadow:0 0 5px rgba(255,255,0,0.5);"></div>
          <input id="combat3d-input" style="width:100%;margin:8px 0;padding:8px;border-radius:6px;border:1px solid #7e57c2;box-shadow:inset 0 0 5px rgba(0,0,0,0.2);background-color:#f9f9ff;" autocomplete="off">
          <button id="combat3d-enviar" style="background:linear-gradient(to bottom, #4caf50, #2e7d32);color:#fff;font-weight:bold;padding:8px 18px;border:none;border-radius:6px;cursor:pointer;width:100%;transition:all 0.2s;margin-top:8px;">Enviar</button>
        </div>
        <div style="background:linear-gradient(to bottom, #0d1130, #1a237e); color:#fff; border-radius:12px; padding:20px; min-width:280px; font-family:'Press Start 2P',monospace; font-size:1.1em; text-align:center; border: 3px solid #1976d2; box-shadow: 0 0 15px rgba(33, 150, 243, 0.5);">
          <div id="combat3d-msg" style="line-height:1.5;">¡Batalla iniciada!<br>Factoriza la expresión para atacar al enemigo.</div>
          <button id="combat3d-pista" style="margin-top:16px;background:linear-gradient(to bottom, #2196f3, #0d47a1);color:#fff;font-weight:bold;padding:8px 18px;border:none;border-radius:6px;cursor:pointer;transition:all 0.2s;">Pista (3)</button>
        </div>
        <div style="background:linear-gradient(to bottom, #0d1130, #1a237e); color:#ffee58; border-radius:12px; padding:20px; min-width:180px; font-family:'Press Start 2P',monospace; text-shadow:0 0 5px rgba(0,0,0,0.5); border: 3px solid #ff9800; box-shadow: 0 0 15px rgba(255, 152, 0, 0.5);">
          <div id="combat3d-enemigo-nombre" style="font-size:1.2em;margin-bottom:10px;text-align:center;"></div>
          <div style="background:#293058; border-radius:4px; margin:12px 0; padding:3px; border:1px solid #4e4e4e;">
            <div id="combat3d-enemigo-barra" style="background:linear-gradient(to right, #43a047, #76ff03);height:20px;width:100%;border-radius:3px;transition:width 0.8s ease-in-out;"></div>
          </div>
          <div id="combat3d-enemigo-hp" style="text-align:center;font-size:1.2em;"></div>
        </div>
      </div>
    `;
    this.container.appendChild(this.ui);
    
    // Animation for buttons
    const buttons = this.ui.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = '0 0 10px rgba(255,255,255,0.3)';
      });
      button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'none';
      });
    });
    
    // Eventos
    this.ui.querySelector('#combat3d-enviar').onclick = () => this.onSubmit();
    this.ui.querySelector('#combat3d-input').onkeydown = e => { if(e.key==='Enter') this.onSubmit(); };
    this.ui.querySelector('#combat3d-pista').onclick = () => this.onPista();
  }
  
  show(expresion, respuesta, enemigoNombre, hpActual, hpMax, pista, onResult) {
    this.container.style.display = '';
    
    // Initialize components if not already initialized
    if (!this.initialized) {
      this.init3D();
      this.initUI();
    }
    
    // Check if WebGL initialization failed
    if (!this.initialized) {
      // Use a basic 2D fallback
      this.initBasic2DMode(expresion, respuesta, enemigoNombre, hpActual, hpMax);
      return;
    }
    
    // Asegurar que los inputs estén habilitados al iniciar cada combate
    const inputField = this.ui.querySelector('#combat3d-input');
    const submitButton = this.ui.querySelector('#combat3d-enviar');
    if (inputField) {
      inputField.disabled = false;
      inputField.style.backgroundColor = '#f9f9ff';
      inputField.style.borderColor = '#7e57c2';
      inputField.style.color = '#000';
      inputField.value = '';
    }
    if (submitButton) {
      submitButton.disabled = false;
    }
    
    this.ui.querySelector('#combat3d-expresion').textContent = expresion;
    this.ui.querySelector('#combat3d-enemigo-nombre').textContent = enemigoNombre;
    const pct = Math.max(0, Math.min(1, hpActual / hpMax));
    this.ui.querySelector('#combat3d-enemigo-barra').style.width = (pct * 100) + '%';
    this.ui.querySelector('#combat3d-enemigo-hp').textContent = hpActual + '/' + hpMax;
    this.ui.querySelector('#combat3d-msg').textContent = '¡Batalla iniciada! Factoriza la expresión para atacar al enemigo.';
    this.respuesta = respuesta;
    this.pista = pista;
    this.onResult = onResult;
    this.intentos = 0;
    this.ui.querySelector('#combat3d-pista').textContent = `Pista (3)`;
    this.pistasRestantes = 3;
    
    // Generar pistas progresivas basadas en la expresión y respuesta
    this.generarPistasProgresivas(expresion, respuesta);
    
    // Make sure animation loop is running
    if (this.animate && !this.animating) {
      this.animating = true;
      requestAnimationFrame(this.animate);
    }
  }
  
  initBasic2DMode(expresion, respuesta, enemigoNombre, hpActual, hpMax) {
    // Create a simple 2D fallback for browsers without WebGL
    if (!this.basic2DUI) {
      this.basic2DUI = document.createElement('div');
      this.basic2DUI.style.position = 'absolute';
      this.basic2DUI.style.top = '0';
      this.basic2DUI.style.left = '0';
      this.basic2DUI.style.width = '100%';
      this.basic2DUI.style.height = '100%';
      this.basic2DUI.style.background = 'linear-gradient(to bottom, #2c3e50, #4a69bd)';
      this.basic2DUI.style.display = 'flex';
      this.basic2DUI.style.flexDirection = 'column';
      this.basic2DUI.style.alignItems = 'center';
      this.basic2DUI.style.padding = '20px';
      
      this.basic2DUI.innerHTML = `
        <div style="margin-top:60px;background:rgba(0,0,0,0.5);padding:20px;border-radius:10px;text-align:center;color:white;">
          <h2 id="basic-enemy-name"></h2>
          <div style="width:200px;height:20px;background:#333;border-radius:10px;margin:10px auto;">
            <div id="basic-hp-bar" style="width:100%;height:20px;background:#4caf50;border-radius:10px;"></div>
          </div>
          <p id="basic-hp-text"></p>
        </div>
        
        <div style="width:80%;max-width:600px;margin-top:40px;background:rgba(255,255,255,0.9);padding:20px;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.3);">
          <h3>Factoriza:</h3>
          <div id="basic-expression" style="font-size:1.5em;font-weight:bold;margin:10px 0;"></div>
          <input id="basic-input" style="width:100%;padding:8px;margin:10px 0;border:1px solid #ddd;border-radius:4px;" placeholder="Escribe tu respuesta">
          <div style="display:flex;justify-content:space-between;">
            <button id="basic-hint" style="background:#2196f3;color:white;border:none;padding:8px 16px;border-radius:4px;">Pista (3)</button>
            <button id="basic-submit" style="background:#4caf50;color:white;border:none;padding:8px 16px;border-radius:4px;">Enviar</button>
          </div>
          <div id="basic-message" style="margin-top:15px;font-style:italic;"></div>
        </div>
      `;
      
      this.container.appendChild(this.basic2DUI);
      
      // Set up event listeners
      document.getElementById('basic-submit').addEventListener('click', () => this.submitBasic2D());
      document.getElementById('basic-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') this.submitBasic2D();
      });
      document.getElementById('basic-hint').addEventListener('click', () => this.hintBasic2D());
      
      // Store state for basic mode
      this.basic2DState = {
        pistasRestantes: 3,
        intentos: 0
      };
    }
    
    // Update UI with current battle info
    document.getElementById('basic-enemy-name').textContent = enemigoNombre;
    const pct = Math.max(0, Math.min(1, hpActual / hpMax));
    document.getElementById('basic-hp-bar').style.width = (pct * 100) + '%';
    document.getElementById('basic-hp-text').textContent = `${hpActual}/${hpMax}`;
    document.getElementById('basic-expression').textContent = expresion;
    document.getElementById('basic-message').textContent = '¡Batalla iniciada! Factoriza la expresión para atacar al enemigo.';
    document.getElementById('basic-input').value = '';
    document.getElementById('basic-hint').textContent = 'Pista (3)';
    
    // Store battle data
    this.respuesta = respuesta;
    this.onResult = onResult;
    this.basic2DState.pistasRestantes = 3;
    this.basic2DState.intentos = 0;
    
    // Generate hints
    this.generarPistasProgresivas(expresion, respuesta);
  }
  
  submitBasic2D() {
    const val = document.getElementById('basic-input').value.trim();
    this.basic2DState.intentos++;
    
    if (this.respuestasEquivalentes(val, this.respuesta)) {
      document.getElementById('basic-message').textContent = '¡Correcto! Has dañado al enemigo.';

      setTimeout(() => {
        if (this.onResult) this.onResult(true);
      }, 1500);
    } else {
      document.getElementById('basic-message').textContent = 'Incorrecto. El enemigo te ataca.';

      setTimeout(() => {
        if (this.basic2DState.intentos >= 3) {
          if (this.onResult) this.onResult(false);
        } else {
          document.getElementById('basic-message').textContent = 'Intenta de nuevo.';
        }
      }, 1200);
    }
  }
  
  hintBasic2D() {
    if (this.basic2DState.pistasRestantes > 0) {
      const pistaIndex = 3 - this.basic2DState.pistasRestantes;
      this.basic2DState.pistasRestantes--;
      
      document.getElementById('basic-hint').textContent = `Pista (${this.basic2DState.pistasRestantes})`;
      
      // Show the appropriate hint
      const pistaActual = this.pistasList[pistaIndex] || `La respuesta es: ${this.respuesta}`;
      
      if (this.basic2DState.pistasRestantes === 0) {
        document.getElementById('basic-message').innerHTML = `
          <div style="color:#ff9800;font-weight:bold;margin-bottom:8px">Solución:</div>
          <div style="color:#333;font-size:1.2em">${this.respuesta}</div>
        `;
      } else {
        document.getElementById('basic-message').innerHTML = `
          <div style="color:#2196f3;font-weight:bold;margin-bottom:8px">Pista ${3-this.basic2DState.pistasRestantes}:</div>
          <div>${pistaActual}</div>
        `;
      }
    } else {
      document.getElementById('basic-message').textContent = 'No te quedan pistas.';
    }
  }
  
  hide() {
    this.container.style.display = 'none';
    
    // Clean up effects when hidden
    if (this.efectos) {
      for (let i = 0; i < this.efectos.length; i++) {
        if (this.scene) {
          this.scene.remove(this.efectos[i].rayo);
          this.scene.remove(this.efectos[i].particulas);
          // También eliminar las luces creadas en los efectos de ataque
          if (this.efectos[i].luz) {
            this.scene.remove(this.efectos[i].luz);
          }
        }
      }
      this.efectos = [];
    }
    
    // Re-habilitar los campos de texto antes de esconder el combate
    // para asegurar que el próximo combate tenga campos utilizables
    const inputField = this.ui.querySelector('#combat3d-input');
    const submitButton = this.ui.querySelector('#combat3d-enviar');
    if (inputField) inputField.disabled = false;
    if (submitButton) submitButton.disabled = false;
    
    // Remove animation loop
    this.animating = false;
  }

  updateHP(hpActual, hpMax) {
    const pct = Math.max(0, Math.min(1, hpActual / hpMax));
    if (this.ui) {
      const bar = this.ui.querySelector('#combat3d-enemigo-barra');
      const text = this.ui.querySelector('#combat3d-enemigo-hp');
      if (bar) bar.style.width = (pct * 100) + '%';
      if (text) text.textContent = `${hpActual}/${hpMax}`;
    }

    if (this.basic2DUI) {
      const bar = document.getElementById('basic-hp-bar');
      const text = document.getElementById('basic-hp-text');
      if (bar) bar.style.width = (pct * 100) + '%';
      if (text) text.textContent = `${hpActual}/${hpMax}`;
    }
  }
  
  generarPistasProgresivas(expresion, respuesta) {
    // Crear una serie de pistas progresivas que dan cada vez más información
    this.pistasList = [];
    
    // Primera pista: consejo general
    if (expresion.includes('+') && expresion.includes('x^2')) {
      this.pistasList.push("Esta es una expresión cuadrática. Busca si se puede factorizar como (a+b)(c+d).");
    } else if (expresion.includes('x^3')) {
      this.pistasList.push("Esta es una expresión cúbica. Intenta factorizar primero un término común si existe.");
    } else {
      this.pistasList.push("Identifica si hay un factor común en todos los términos.");
    }
    
    // Segunda pista: más específica
    if (expresion.match(/x\^2\s*\+\s*\d+x\s*\+\s*\d+/)) {
      // Trinomio de la forma x^2 + bx + c
      const match = expresion.match(/x\^2\s*\+\s*(\d+)x\s*\+\s*(\d+)/);
      if (match) {
        const b = parseInt(match[1]);
        const c = parseInt(match[2]);
        this.pistasList.push(`Busca dos números que multiplicados den ${c} y sumados den ${b}.`);
      }
    } else if (expresion.match(/x\^2\s*\+\s*\d+x\s*-\s*\d+/)) {
      // Trinomio de la forma x^2 + bx - c
      const match = expresion.match(/x\^2\s*\+\s*(\d+)x\s*-\s*(\d+)/);
      if (match) {
        const b = parseInt(match[1]);
        const c = parseInt(match[2]);
        this.pistasList.push(`Busca dos números que multiplicados den -${c} y sumados den ${b}.`);
      }
    } else if (expresion.includes('(x+3)^2')) {
      this.pistasList.push("Desarrolla la expresión (x+3)² = (x+3)(x+3).");
    }
    
    // Tercera pista: casi solución
    const partes = respuesta.split(/[()]/);
    const factores = partes.filter(p => p && p !== '+' && p !== '-' && p !== '*');
    
    if (factores.length >= 2) {
      let pistaFinal = `La expresión puede factorizarse como (${factores[0].substring(0, factores[0].length/2)}...)(${factores[1].substring(0, factores[1].length/2)}...)`;
      this.pistasList.push(pistaFinal);
    } else {
      this.pistasList.push("La solución es " + respuesta.substring(0, respuesta.length/2) + "...");
    }
    
    // Asegurar que tengamos al menos 3 pistas
    while (this.pistasList.length < 3) {
      this.pistasList.push("La solución es: " + respuesta);
    }
  }
  
  onSubmit() {
    const val = this.ui.querySelector('#combat3d-input').value.trim();
    if (!val) return; // Don't process empty submissions
    
    this.intentos++;
    
    // Disable input during animation
    const inputField = this.ui.querySelector('#combat3d-input');
    const submitButton = this.ui.querySelector('#combat3d-enviar');
    inputField.disabled = true;
    submitButton.disabled = true;
    
    if(this.respuestasEquivalentes(val, this.respuesta)) {
      // Add success class to input
      inputField.style.backgroundColor = '#e8f5e9';
      inputField.style.borderColor = '#43a047';
      inputField.style.color = '#2e7d32';
      
      // Update UI message
      this.ui.querySelector('#combat3d-msg').innerHTML = `
        <div style="color:#4caf50;font-weight:bold;margin-bottom:12px;text-shadow:0 0 5px rgba(76,175,80,0.5);">¡CORRECTO!</div>
        <div style="background:rgba(76,175,80,0.1);padding:10px;border-radius:6px;border:1px solid #4caf50;line-height:1.5;">Has dañado al enemigo.</div>
      `;
      
      // Crear efecto de ataque cuando la respuesta es correcta
      this.crearEfectoAtaque();
      
      // Flash effect for successful attack
      this.container.style.backgroundColor = 'rgba(76,175,80,0.2)';
      setTimeout(() => {
        this.container.style.transition = 'background-color 1s ease-out';
        this.container.style.backgroundColor = 'transparent';
      }, 100);
      
      // Re-habilitar inputs antes de ocultar el combate
      setTimeout(() => {
        // Asegurar que los inputs estén habilitados antes de terminar
        inputField.disabled = false;
        submitButton.disabled = false;
        
        if(this.onResult) this.onResult(true);
      }, 1800);
    } else {
      // Add error class to input
      inputField.style.backgroundColor = '#ffebee';
      inputField.style.borderColor = '#e53935';
      inputField.style.color = '#c62828';
      
      // Update UI message
      this.ui.querySelector('#combat3d-msg').innerHTML = `
        <div style="color:#f44336;font-weight:bold;margin-bottom:12px;text-shadow:0 0 5px rgba(244,67,54,0.5);">INCORRECTO</div>
        <div style="background:rgba(244,67,54,0.1);padding:10px;border-radius:6px;border:1px solid #f44336;line-height:1.5;">El enemigo te ataca.</div>
      `;
      
      // Flash effect for enemy attack
      this.container.style.backgroundColor = 'rgba(244,67,54,0.2)';
      setTimeout(() => {
        this.container.style.transition = 'background-color 1s ease-out';
        this.container.style.backgroundColor = 'transparent';
      }, 100);
      
      setTimeout(()=>{
        if(this.intentos>=3) {
          // Re-habilitar inputs antes de ocultar el combate
          inputField.disabled = false;
          submitButton.disabled = false;
          
          if(this.onResult) this.onResult(false);
        } else {
          // Reset input and re-enable
          inputField.style.backgroundColor = '#f9f9ff';
          inputField.style.borderColor = '#7e57c2';
          inputField.style.color = '#000';
          inputField.value = '';
          inputField.disabled = false;
          submitButton.disabled = false;
          
          this.ui.querySelector('#combat3d-msg').innerHTML = `
            <div style="margin:10px 0;">Intento ${this.intentos}/3</div>
            <div style="font-size:0.9em;">Sigue intentando, quedan ${3-this.intentos} intentos.</div>
          `;
        }
      }, 1200);
    }
  }
  
  onPista() {
    if(this.pistasRestantes > 0) {
      const pistaIndex = 3 - this.pistasRestantes;
      this.pistasRestantes--;
      this.ui.querySelector('#combat3d-pista').textContent = `Pista (${this.pistasRestantes})`;
      
      // Mostrar la pista progresiva correspondiente
      const pistaActual = this.pistasList[pistaIndex] || `La respuesta es: ${this.respuesta}`;
      
      // Si es la última pista, mostrar la respuesta completa
      if (this.pistasRestantes === 0) {
        this.ui.querySelector('#combat3d-msg').innerHTML = `
          <div style="color:#ff9800;font-weight:bold;margin-bottom:12px;text-shadow:0 0 5px rgba(255,152,0,0.5);">SOLUCIÓN:</div>
          <div style="color:#ffee58;font-size:1.3em;background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border:1px solid #ff9800;">${this.respuesta}</div>
        `;
      } else {
        this.ui.querySelector('#combat3d-msg').innerHTML = `
          <div style="color:#2196f3;font-weight:bold;margin-bottom:12px;text-shadow:0 0 5px rgba(33,150,243,0.5);">PISTA ${3-this.pistasRestantes}:</div>
          <div style="background:rgba(33,150,243,0.1);padding:10px;border-radius:6px;border:1px solid #2196f3;line-height:1.5;">${pistaActual}</div>
        `;
      }
      
      // Animation effect
      const msgElement = this.ui.querySelector('#combat3d-msg');
      msgElement.style.transform = 'scale(0.95)';
      msgElement.style.opacity = '0.8';
      setTimeout(() => {
        msgElement.style.transition = 'all 0.3s ease-out';
        msgElement.style.transform = 'scale(1)';
        msgElement.style.opacity = '1';
      }, 10);
    } else {
      this.ui.querySelector('#combat3d-msg').innerHTML = `
        <div style="color:#f44336;margin:10px 0;">No te quedan pistas disponibles.</div>
        <div style="font-size:0.8em;margin-top:10px;">Intenta resolver la expresión o inténtalo de nuevo.</div>
      `;
    }
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
} 