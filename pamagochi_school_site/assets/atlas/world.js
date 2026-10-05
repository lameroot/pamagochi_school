import * as T from 'three';
import {STATIONS,OBSTACLES,walkable,route,LANTERNS} from './logic.js';

// Original low-poly art. No downloaded character pack, textures or runtime CDN.
export function createWorld(host, callbacks) {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
  host.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new T.Scene();scene.background=new T.Color('#c8dfe2');scene.fog=new T.Fog('#c8dfe2',45,100);
  const camera=new T.OrthographicCamera(-20,20,12,-12,.1,140);
  const hemi=new T.HemisphereLight('#fff8e2','#708f9b',2.7);scene.add(hemi);
  const sun=new T.DirectionalLight('#fff1d2',3);sun.position.set(-12,25,15);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-24,right:24,top:20,bottom:-20,near:1,far:70});sun.shadow.normalBias=.04;scene.add(sun);
  const mats=new Map();
  function mat(color){if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color,roughness:.92}));return mats.get(color);}
  function mesh(geo,color,x=0,y=0,z=0,parent=scene){const m=new T.Mesh(geo,typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  const box=(w,h,d,c,x,y,z,p)=>mesh(new T.BoxGeometry(w,h,d),c,x,y,z,p);
  const ball=(r,c,x,y,z,p)=>mesh(new T.IcosahedronGeometry(r,1),c,x,y,z,p);
  const cyl=(r1,r2,h,c,x,y,z,p,n=12)=>mesh(new T.CylinderGeometry(r1,r2,h,n),c,x,y,z,p);
  // Floating island halves with faceted sandstone strata.
  for(const x of [-7.65,7.65]){
    box(12,1.6,16,'#ae946e',x,-1.12,0);
    box(12.3,.4,16.3,'#d3c499',x,-.26,0);
    box(12.2,.17,16.2,'#9ebc83',x,.015,0);
    for(let i=0;i<8;i++){const rock=ball(1.2,'#b49d76',x-5+i*1.5,-1.6,7.6);rock.scale.y=1.4;}
  }
  const water=box(3.1,.1,17,'#72babc',0,-.1,0);water.castShadow=false;
  // A shallow waterfall and its mist at the front edge.
  box(3.1,3.4,.15,'#91d0cd',0,-1.8,8.15);
  for(let i=0;i<8;i++){const m=ball(.6,'#d7ece1',-1.3+i*.4,-3.3,8.2);m.scale.set(1,.4,1);}
  const ripples=[];
  for(let i=0;i<16;i++){const m=box(.4+(i%3)*.25,.018,.055,'#b9e5da',(i%3-1)*.7,-.03,-7+i*.95);m.castShadow=false;ripples.push(m);}
  // Small path stones leading between the three world puzzles.
  function trail(points){for(const [x,z] of points){const m=cyl(.3,.37,.05,'#d8d3ad',x,.14,z,scene,7);m.rotation.y=x;}}
  trail([[-9,4],[-8,3.5],[-7,3],[-6,2.5],[-5,2],[-4,2],[2.4,2],[3,1],[3.5,0],[4,-1],[4.5,-2],[5.8,-1.8],[6.4,-.7],[7,.4],[8,1.5],[9,2.4]]);
  function tree(x,z,r,i){
    if(i===7)return;
    const g=new T.Group();g.position.set(x,0,z);scene.add(g);
    cyl(.19,.28,1.7,'#897452',0,.85,0,g,7);
    const c=['#779b67','#648d69','#aec783'][i%3];
    if(i%2){cyl(0,1.25,2.5,c,0,2.15,0,g,7);cyl(0,.95,1.8,c,0,3.2,0,g,7);}
    else{ball(1.3,c,0,2.3,0,g);ball(.95,c,.5,3.15,0,g);ball(.8,c,-.6,2.8,0,g);}
    g.scale.setScalar(r);
  }
  OBSTACLES.forEach(([x,z,r],i)=>tree(x,z,r,i));
  // Deterministic decoration, kept away from traversable routes.
  for(let i=0;i<58;i++){
    const x=(i%2?-1:1)*(2.8+(i*1.731%10)),z=(i*2.319%14)-7;
    if(STATIONS.some(s=>Math.hypot(s.x-x,s.z-z)<2))continue;
    if(i%4===0){const rock=ball(.18+(i%3)*.08,'#a3ad8f',x,.2,z);rock.scale.y=.65;}
    else{cyl(.025,.035,.28,'#6d995d',x,.2,z,scene,5);ball(.095,['#f3dfb1','#ebe8d5','#d3ad94'][i%3],x,.37,z);}
  }
  // Camp: explorer's tent and a rolled map table.
  const tent=mesh(new T.ConeGeometry(1.45,1.9,4),'#efc57d',-10,.98,0);tent.rotation.y=Math.PI/4;
  const door=box(.65,.9,.05,'#696b55',-10,.5,1.03);
  box(1.2,.12,.7,'#927c58',-8.2,.65,-.7);box(.12,.65,.12,'#756247',-8.6,.32,-.7);box(.12,.65,.12,'#756247',-7.8,.32,-.7);box(.8,.035,.55,'#fff2ce',-8.2,.74,-.7);
  // Bridge actually changes collision and appearance after the pattern solution.
  const bridge=new T.Group();scene.add(bridge);
  const bridgeGhost=new T.Group();scene.add(bridgeGhost);
  for(let i=0;i<8;i++){
    const x=-1.64+i*.47,color=i%2?'#639cce':'#df705e';
    box(.44,.18,1.65,i%2?'#dcb88a':'#eed2a0',x,.13,2,bridge);
    if(i%3===0)cyl(.15,.15,.018,color,x,.23,2,bridge,24);
    else if(i%3===1)box(.26,.018,.26,color,x,.23,2,bridge);
    else cyl(.18,.18,.018,color,x,.23,2,bridge,3);
  }
  for(const z of [1.15,2.85]){box(4,.1,.1,'#98734f',0,.95,z,bridge);for(const x of [-1.9,1.9])cyl(.06,.08,.95,'#ac8556',x,.5,z,bridge);}
  for(const x of [-2,2]){box(.7,.17,1.65,'#c4a078',x,.13,2,bridgeGhost);}
  const sign=box(.75,.6,.1,'#e6c894',-3.5,.95,1);cyl(.055,.055,.7,'#9a7e58',-3.5,.35,1);
  // Garden lanterns mirror the actual counting data.
  const lanternMats=[],garden=new T.Group();garden.position.set(5,0,-4.2);scene.add(garden);
  box(4,.15,2.1,'#8fa97b',0,.1,0,garden);
  LANTERNS.forEach(([color,big],i)=>{
    const x=(i%5-2)*.73,z=Math.floor(i/5)*.8-.4;
    cyl(.035,.035,.7,'#6e8262',x,.5,z,garden);
    const m=new T.MeshStandardMaterial({color:color==='yellow'?'#f3cd70':'#81bdde',roughness:.5,emissive:color==='yellow'?'#d68e1a':'#499ebc',emissiveIntensity:0});
    lanternMats.push(m);const l=mesh(new T.SphereGeometry(big?.23:.14,10,8),m,x,big?1:.83,z,garden);l.scale.y=1.25;
  });
  // Lighthouse: creamy tower, teal copper roof, glass and a warm crystal.
  const tower=new T.Group();tower.position.set(11,0,3);scene.add(tower);
  cyl(1,1.3,.35,'#b8b696',0,.2,0,tower);
  cyl(.65,1,3.2,'#ede3c2',0,1.9,0,tower);
  cyl(.9,.9,.2,'#7faba7',0,3.5,0,tower);
  for(let i=0;i<6;i++){const a=i*Math.PI/3;cyl(.045,.045,1.05,'#6a9291',Math.sin(a)*.64,4.03,Math.cos(a)*.64,tower,6);}
  cyl(0,1.1,.95,'#568e89',0,4.92,0,tower,6);
  ball(.13,'#e6bd6b',0,5.45,0,tower);
  const lightMat=new T.MeshStandardMaterial({color:'#c0cfc3',emissive:'#ffcc61',emissiveIntensity:0,roughness:.4});
  const beacon=mesh(new T.OctahedronGeometry(.45),lightMat,0,4,0,tower);
  const beam=mesh(new T.CylinderGeometry(1.6,.25,11,32,1,true),new T.MeshBasicMaterial({color:'#ffeab4',transparent:true,opacity:.13,depthWrite:false,side:T.DoubleSide}),0,9,0,tower);beam.visible=false;beam.castShadow=false;
  // Interaction circles and numbered signposts.
  const rings=STATIONS.map((s,i)=>{
    const ring=mesh(new T.TorusGeometry(.7,.055,8,40),'#f9e6a4',s.x,.18,s.z);ring.rotation.x=-Math.PI/2;
    const c=document.createElement('canvas');c.width=128;c.height=128;const ctx=c.getContext('2d');
    ctx.fillStyle='#fff9e5';ctx.beginPath();ctx.arc(64,64,48,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c0a66e';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle='#48615c';ctx.font='bold 52px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),64,66);
    const sprite=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false}));sprite.position.set(s.x,2.1,s.z);sprite.scale.set(.85,.85,1);scene.add(sprite);
    return {ring,sprite};
  });
  // Lumi, an original fox-like light keeper, facing +z. Pivoted limbs animate.
  const player=new T.Group();scene.add(player);
  const body=new T.Group();player.add(body);
  const orange='#dc9252',cream='#fff0cf',dark='#354a4f';
  const torso=ball(.38,orange,0,.7,0,body);torso.scale.set(.85,1.3,.85);
  ball(.29,cream,0,.76,.18,body);
  const head=ball(.47,orange,0,1.31,.03,body);head.scale.set(1.1,.94,.9);
  for(const x of [-.28,.28]){
    const ear=mesh(new T.ConeGeometry(.2,.55,3),orange,x,1.8,0,body);ear.rotation.z=x<0?.16:-.16;
    mesh(new T.ConeGeometry(.11,.32,3),'#efc2a0',x,1.81,.09,body);
    ball(.12,cream,x*.75,1.18,.34,body);
    const eye=ball(.048,dark,x*.75,1.4,.414,body);ball(.016,'#ffffff',x*.75-.01,1.42,.452,body);
  }
  ball(.065,dark,0,1.23,.47,body);
  const scarfMat=new T.MeshStandardMaterial({color:'#568bc3',roughness:.8});
  cyl(.31,.32,.14,scarfMat,0,1.02,.015,body);
  const scarf=box(.17,.43,.08,scarfMat,.22,.84,.33,body);scarf.rotation.z=-.2;
  const tail=new T.Group();tail.position.set(0,.55,-.24);tail.rotation.x=-.65;body.add(tail);
  const tailMesh=ball(.28,orange,0,.12,-.36,tail);tailMesh.scale.set(.8,.85,1.9);ball(.19,cream,0,.15,-.74,tail);
  const legs=[],arms=[];
  for(const x of [-.2,.2]){
    const leg=new T.Group();leg.position.set(x,.43,0);body.add(leg);box(.18,.32,.2,orange,0,-.16,0,leg);ball(.13,dark,0,-.31,.06,leg);legs.push(leg);
    const arm=new T.Group();arm.position.set(x*1.7,.94,0);body.add(arm);cyl(.085,.09,.35,orange,0,-.17,0,arm,8);arms.push(arm);
  }
  // Pik, a small hovering companion rather than a second controllable character.
  const pik=new T.Group();scene.add(pik);ball(.22,'#c5dfcc',0,0,0,pik);box(.26,.1,.08,dark,0,.03,.18,pik);ball(.025,'#f6e4a5',-.07,.04,.23,pik);ball(.025,'#f6e4a5',.07,.04,.23,pik);
  const targetRing=mesh(new T.TorusGeometry(.22,.025,6,24),'#fff5c8',0,.16,0);targetRing.rotation.x=-Math.PI/2;targetRing.visible=false;
  let solved=[false,false,false],path=[],paused=true,overview=true,near=-1,time=0,previous=0,disposed=false,lost=false;
  const keys=new Set(),touch=new Set(),focus=new T.Vector3(-1,0,0);
  const forward=new T.Vector3(-.32,0,-1).normalize(),right=new T.Vector3(1,0,-.32).normalize();
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);const aspect=w/h;const height=overview?Math.max(22,36/aspect):15;camera.left=-height*aspect/2;camera.right=height*aspect/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();}
  const observer=new ResizeObserver(resize);observer.observe(host);
  function resetPosition(){player.position.set(-8.5,.12,4);path=[];targetRing.visible=false;near=-1;}
  resetPosition();
  function update(state){solved=[...state.solved];bridge.visible=solved[0];bridgeGhost.visible=!solved[0];lanternMats.forEach(m=>m.emissiveIntensity=solved[1]?.9:0);lightMat.emissiveIntensity=solved[2]?2:0;lightMat.color.set(solved[2]?'#ffdd86':'#c0cfc3');beam.visible=solved[2];scarfMat.color.set({blue:'#568bc3',purple:'#a58acf',green:'#74a784'}[state.scarf]);rings.forEach(({ring},i)=>ring.material=mat(solved[i]?'#a1d6ae':'#f9e6a4'));host.dataset.bridge=String(solved[0]);host.dataset.garden=String(solved[1]);host.dataset.beacon=String(solved[2]);}
  function travel(to){path=route(player.position,to,solved[0]);if(!path.length){callbacks.onBlocked();return false;}targetRing.position.set(to.x,.16,to.z);targetRing.visible=true;return true;}
  function clearInput(){keys.clear();touch.clear();}
  function keydown(e){
    if(paused||e.target.closest('button,a,input,select,dialog'))return;
    const codes=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyE'];
    if(!codes.includes(e.code))return;e.preventDefault();
    if(e.code==='KeyE'){if(!e.repeat&&near>=0)callbacks.onInteract(near);return;}
    keys.add(e.code);path=[];targetRing.visible=false;
  }
  const keyup=e=>keys.delete(e.code);
  window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',clearInput);
  const visibility=()=>{if(document.hidden)clearInput();previous=0;};document.addEventListener('visibilitychange',visibility);
  const ray=new T.Raycaster(),pointer=new T.Vector2(),plane=new T.Plane(new T.Vector3(0,1,0),0);
  function click(e){if(paused)return;host.focus({preventScroll:true});const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const point=new T.Vector3();if(ray.ray.intersectPlane(plane,point))travel(point);}
  renderer.domElement.addEventListener('pointerdown',click);
  const onLost=e=>{e.preventDefault();lost=true;paused=true;clearInput();callbacks.onError();};
  renderer.domElement.addEventListener('webglcontextlost',onLost);
  function frame(ms){
    if(disposed)return;requestAnimationFrame(frame);
    const dt=previous?Math.min((ms-previous)/1000,.05):0;previous=ms;
    if(document.hidden||lost)return;
    if(!paused)time+=dt;
    let vx=0,vz=0,moving=false;
    if(!paused){
      const up=keys.has('KeyW')||keys.has('ArrowUp')||touch.has('up'),down=keys.has('KeyS')||keys.has('ArrowDown')||touch.has('down');
      const left=keys.has('KeyA')||keys.has('ArrowLeft')||touch.has('left'),r=keys.has('KeyD')||keys.has('ArrowRight')||touch.has('right');
      vx=forward.x*(Number(up)-Number(down))+right.x*(Number(r)-Number(left));vz=forward.z*(Number(up)-Number(down))+right.z*(Number(r)-Number(left));
      if(vx||vz){path=[];targetRing.visible=false;}
      if(!vx&&!vz&&path.length){const p=path[0],dx=p.x-player.position.x,dz=p.z-player.position.z,d=Math.hypot(dx,dz);if(d<.12)path.shift();else{vx=dx/d;vz=dz/d;}}
      const len=Math.hypot(vx,vz);if(len){vx/=len;vz/=len;const step=Math.min(3.7*dt,path.length?Math.hypot(path[0].x-player.position.x,path[0].z-player.position.z):Infinity);const old=player.position.clone();
        if(walkable(player.position.x+vx*step,player.position.z,solved[0]))player.position.x+=vx*step;
        if(walkable(player.position.x,player.position.z+vz*step,solved[0]))player.position.z+=vz*step;
        moving=old.distanceTo(player.position)>.001;player.rotation.y=Math.atan2(vx,vz);
      }
      if(!path.length)targetRing.visible=false;
      const next=STATIONS.findIndex(s=>Math.hypot(s.x-player.position.x,s.z-player.position.z)<1.25);
      if(next!==near){near=next;callbacks.onNear(near);}
    }
    body.position.y=!reduced&&moving?Math.abs(Math.sin(time*11))*.06:0;
    legs.forEach((leg,i)=>leg.rotation.x=!reduced&&moving?Math.sin(time*11+i*Math.PI)*.45:0);
    arms.forEach((arm,i)=>arm.rotation.x=!reduced&&moving?-Math.sin(time*11+i*Math.PI)*.4:0);
    if(!reduced)tail.rotation.z=Math.sin(time*3)*.08;
    pik.position.set(player.position.x-.65,1.5+(!reduced?Math.sin(time*2)*.09:0),player.position.z-.6);
    if(!reduced){beacon.rotation.y=time*.5;ripples.forEach((m,i)=>m.position.z=-7+(i*.95+time*.35)%15);}
    const desired=overview?new T.Vector3(0,0,0):new T.Vector3(player.position.x,0,player.position.z);
    focus.lerp(desired,reduced?1:1-Math.exp(-dt*5));camera.position.copy(focus).add(new T.Vector3(9,23,28));camera.lookAt(focus);
    renderer.render(scene,camera);
    // Read-only observability for accessibility diagnostics and browser tests.
    host.dataset.position=player.position.x.toFixed(2)+','+player.position.z.toFixed(2);
    host.dataset.bridge=String(solved[0]);host.dataset.garden=String(solved[1]);host.dataset.beacon=String(solved[2]);
  }
  resize();requestAnimationFrame(frame);
  return {
    update,travel,resetPosition,
    pause(value){paused=value;clearInput();if(value){path=[];targetRing.visible=false;}},
    setOverview(value){overview=value;resize();},getOverview:()=>overview,
    direction(dir,pressed){if(pressed&&!paused){touch.add(dir);path=[];}else touch.delete(dir);},
    dispose(){disposed=true;observer.disconnect();window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',clearInput);document.removeEventListener('visibilitychange',visibility);renderer.domElement.removeEventListener('pointerdown',click);renderer.domElement.removeEventListener('webglcontextlost',onLost);scene.traverse(o=>{o.geometry?.dispose();});mats.forEach(m=>m.dispose());renderer.dispose();}
  };
}
