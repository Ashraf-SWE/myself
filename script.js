/* ============ Loader ============ */
window.addEventListener('load', ()=>{
  setTimeout(()=>{ document.getElementById('loader').classList.add('hide'); }, 900);
});

/* ============ Custom cursor ============ */
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx=0,my=0,rx=0,ry=0;
window.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  dot.style.left=mx+'px'; dot.style.top=my+'px';
});
function animCursor(){
  rx += (mx-rx)*0.15; ry += (my-ry)*0.15;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animCursor);
}
animCursor();
document.querySelectorAll('a,button,.project-card,.filter-btn,.contact-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.style.transform='translate(-50%,-50%) scale(1.7)');
  el.addEventListener('mouseleave',()=>ring.style.transform='translate(-50%,-50%) scale(1)');
});

/* ============ Scroll progress + header + reveal + nav active ============ */
const header = document.getElementById('site-header');
const progress = document.getElementById('scroll-progress');
const revealEls = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

function onScroll(){
  const st = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (st/max*100)+'%';
  header.classList.toggle('scrolled', st>40);

  revealEls.forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight*0.85) el.classList.add('in');
  });

  let current = sections[0].id;
  sections.forEach(sec=>{
    const r = sec.getBoundingClientRect();
    if(r.top <= 140) current = sec.id;
  });
  navLinks.forEach(l=> l.classList.toggle('active', l.getAttribute('href')==='#'+current));

  document.querySelectorAll('.t-item').forEach(t=>{
    const r=t.getBoundingClientRect();
    if(r.top < window.innerHeight*0.8) t.classList.add('in');
  });
}
window.addEventListener('scroll', onScroll);
onScroll();

/* ============ Mobile nav ============ */
const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');
burger.addEventListener('click', ()=>{
  navMenu.classList.toggle('open');
  burger.classList.toggle('open');
});
navLinks.forEach(l=> l.addEventListener('click', ()=> navMenu.classList.remove('open')));

/* ============ Typed effect ============ */
const typedWords = ['software_engineer', 'problem_solver', 'full_stack_dev', 'clean_code_enthusiast'];
const typedEl = document.getElementById('typed');
let wi=0, ci=0, deleting=false;
function typeLoop(){
  const word = typedWords[wi];
  if(!deleting){
    ci++;
    typedEl.textContent = word.slice(0,ci);
    if(ci===word.length){ deleting=true; setTimeout(typeLoop, 1400); return; }
  } else {
    ci--;
    typedEl.textContent = word.slice(0,ci);
    if(ci===0){ deleting=false; wi=(wi+1)%typedWords.length; }
  }
  setTimeout(typeLoop, deleting?45:90);
}
typeLoop();

/* ============ THREE.js Hero background — animated wireframe icosahedron + particles ============ */
(function(){
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth/canvas.clientHeight, 0.1, 1000);
  camera.position.z = 10;

  function resize(){
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const group = new THREE.Group();
  scene.add(group);

  const geo = new THREE.IcosahedronGeometry(3.4, 1);
  const mat = new THREE.MeshBasicMaterial({color:0x6C5CE7, wireframe:true, transparent:true, opacity:0.55});
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);

  const geo2 = new THREE.IcosahedronGeometry(4.6, 0);
  const mat2 = new THREE.MeshBasicMaterial({color:0x00D9C0, wireframe:true, transparent:true, opacity:0.18});
  const mesh2 = new THREE.Mesh(geo2, mat2);
  group.add(mesh2);

  // particles
  const pCount = 400;
  const pGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(pCount*3);
  for(let i=0;i<pCount;i++){
    positions[i*3] = (Math.random()-0.5)*24;
    positions[i*3+1] = (Math.random()-0.5)*14;
    positions[i*3+2] = (Math.random()-0.5)*14 - 4;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const pMat = new THREE.PointsMaterial({color:0x8A93A6, size:0.035, transparent:true, opacity:0.6});
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  let targetX=0, targetY=0;
  window.addEventListener('mousemove', e=>{
    targetX = (e.clientX/window.innerWidth - 0.5) * 0.6;
    targetY = (e.clientY/window.innerHeight - 0.5) * 0.6;
  });

  function animate(){
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.0018; mesh.rotation.y += 0.0026;
    mesh2.rotation.x -= 0.001; mesh2.rotation.y -= 0.0016;
    particles.rotation.y += 0.0004;
    group.rotation.y += (targetX - group.rotation.y)*0.03;
    group.rotation.x += (-targetY - group.rotation.x)*0.03;
    renderer.render(scene, camera);
  }
  animate();
})();

/* ============ THREE.js Skills constellation ============ */
(function(){
  const canvas = document.getElementById('skills-canvas');
  const wrap = document.getElementById('skills-canvas-wrap');
  const tip = document.getElementById('skill-tip');
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 13;

  function resize(){
    const w = wrap.clientWidth, h = wrap.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const skillData = [
    {n:'JavaScript', c:0x6C5CE7, g:0},{n:'React', c:0x6C5CE7, g:0},{n:'TypeScript', c:0x6C5CE7, g:0},
    {n:'CSS3', c:0x6C5CE7, g:0},{n:'Next.js', c:0x6C5CE7, g:0},
    {n:'Node.js', c:0x00D9C0, g:1},{n:'Python', c:0x00D9C0, g:1},{n:'PostgreSQL', c:0x00D9C0, g:1},
    {n:'MongoDB', c:0x00D9C0, g:1},{n:'REST/GraphQL', c:0x00D9C0, g:1},
    {n:'Docker', c:0xe0b562, g:2},{n:'Git', c:0xe0b562, g:2},{n:'AWS', c:0xe0b562, g:2},{n:'CI/CD', c:0xe0b562, g:2}
  ];

  const nodeGroup = new THREE.Group();
  scene.add(nodeGroup);
  const nodes = [];
  const radius = 5.2;
  skillData.forEach((s,i)=>{
    const phi = Math.acos(-1 + (2*i)/skillData.length);
    const theta = Math.sqrt(skillData.length*Math.PI) * phi;
    const pos = new THREE.Vector3(
      radius*Math.cos(theta)*Math.sin(phi),
      radius*Math.sin(theta)*Math.sin(phi),
      radius*Math.cos(phi)
    );
    const sphereGeo = new THREE.SphereGeometry(0.16,16,16);
    const sphereMat = new THREE.MeshBasicMaterial({color:s.c});
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.copy(pos);
    sphere.userData = s;
    nodeGroup.add(sphere);
    nodes.push(sphere);
  });

  // connecting lines between nearby nodes
  const lineMat = new THREE.LineBasicMaterial({color:0x2a3350, transparent:true, opacity:0.5});
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      if(nodes[i].position.distanceTo(nodes[j].position) < 5.5){
        const g = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
        nodeGroup.add(new THREE.Line(g, lineMat));
      }
    }
  }

  const raycaster = new THREE.Raycaster();
  const mouseV = new THREE.Vector2();
  let hovered = null;

  wrap.addEventListener('mousemove', e=>{
    const rect = wrap.getBoundingClientRect();
    mouseV.x = ((e.clientX-rect.left)/rect.width)*2-1;
    mouseV.y = -((e.clientY-rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(mouseV, camera);
    const hits = raycaster.intersectObjects(nodes);
    if(hits.length){
      hovered = hits[0].object;
      tip.style.opacity=1;
      tip.textContent = hovered.userData.n;
      tip.style.left = (e.clientX-rect.left)+'px';
      tip.style.top = (e.clientY-rect.top)+'px';
      wrap.style.cursor='pointer';
    } else {
      hovered = null; tip.style.opacity=0; wrap.style.cursor='default';
    }
  });

  let autoRotate = true;
  wrap.addEventListener('mouseenter', ()=> autoRotate=false);
  wrap.addEventListener('mouseleave', ()=> autoRotate=true);

  let targetRotX=0, targetRotY=0;
  wrap.addEventListener('mousemove', e=>{
    const rect = wrap.getBoundingClientRect();
    targetRotY = ((e.clientX-rect.left)/rect.width - 0.5) * 1.2;
    targetRotX = ((e.clientY-rect.top)/rect.height - 0.5) * 1.2;
  });

  function animate(){
    requestAnimationFrame(animate);
    if(autoRotate){ nodeGroup.rotation.y += 0.0022; }
    else {
      nodeGroup.rotation.y += (targetRotY - nodeGroup.rotation.y)*0.04;
      nodeGroup.rotation.x += (targetRotX - nodeGroup.rotation.x)*0.04;
    }
    nodes.forEach(n=>{
      n.scale.setScalar(n===hovered ? 1.8 : 1);
    });
    renderer.render(scene, camera);
  }
  animate();
})();

/* ============ Projects data + render + filter ============ */
const projects = [
  {t:'TaskFlow — Team Kanban', d:'Real-time collaborative kanban board with live WebSocket sync and drag-and-drop support.', tags:['React','Node.js','Socket.io'], cat:'web', icon:'TF'},
  {t:'PayGate API', d:'Multi-gateway payment processing system with rate-limiting and fraud detection on a production-grade backend.', tags:['Node.js','PostgreSQL','Redis'], cat:'api', icon:'PG'},
  {t:'DevMetrics CLI', d:'Terminal-based productivity tracker for developers that analyzes git activity to surface insights.', tags:['Python','Typer','SQLite'], cat:'tool', icon:'DM'},
  {t:'ShopSphere', d:'Full-featured e-commerce platform — cart, checkout, admin dashboard, and inventory management.', tags:['Next.js','Stripe','MongoDB'], cat:'web', icon:'SS'},
  {t:'InsightGraph', d:'GraphQL-based analytics API with complex query optimization and a caching layer.', tags:['GraphQL','Node.js','Docker'], cat:'api', icon:'IG'},
  {t:'CodeSnap', d:'Browser extension that turns code snippets into beautiful, shareable images.', tags:['JavaScript','Canvas API'], cat:'tool', icon:'CS'}
];
const grid = document.getElementById('project-grid');
function renderProjects(filter){
  grid.innerHTML='';
  projects.filter(p=> filter==='all' || p.cat===filter).forEach((p,idx)=>{
    const card = document.createElement('div');
    card.className='project-card reveal in';
    card.style.transitionDelay=(idx*0.05)+'s';
    card.innerHTML = `
      <div class="pc-inner">
        <div class="pc-top">
          <div class="pc-icon">${p.icon}</div>
          <div class="pc-links">
            <a href="#" title="Live Demo">↗</a>
            <a href="#" title="Source Code">{ }</a>
          </div>
        </div>
        <div class="pc-title">${p.t}</div>
        <div class="pc-desc">${p.d}</div>
        <div class="pc-tags">${p.tags.map(tag=>`<span>${tag}</span>`).join('')}</div>
      </div>`;
    // 3D tilt on hover
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX-r.left)/r.width - 0.5;
      const py = (e.clientY-r.top)/r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${px*10}deg) rotateX(${-py*10}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform='perspective(700px) rotateY(0) rotateX(0) translateY(0)'; });
    grid.appendChild(card);
  });
}
renderProjects('all');
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

/* ============ Timeline data ============ */
const timelineData = [
  
  
  {date:'', role:'Junior Developer', co:'SelfCompany', desc:'Contributed to API development and a frontend component library.'},
  {date:'2026', role:'B.Sc. in SWE', co:'Daffodil International University', desc:'Specialized study in software engineering and distributed systems.'}
];
const tl = document.getElementById('timeline');
timelineData.forEach(item=>{
  const el = document.createElement('div');
  el.className='t-item';
  el.innerHTML = `
    <span class="t-date">${item.date}</span>
    <div class="t-role">${item.role}</div>
    <div class="t-company">${item.co}</div>
    <div class="t-desc">${item.desc}</div>`;
  tl.appendChild(el);
});
