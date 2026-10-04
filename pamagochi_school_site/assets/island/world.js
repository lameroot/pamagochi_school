import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {COLORS,PATTERN_CHOICES,ROCKET_CHOICES,SHAPES} from './logic.js';

export async function createWorld(host,callbacks){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#deedf5');scene.fog=new THREE.Fog('#deedf5',44,95);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;
 host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();callbacks.onError();});
 const camera=new THREE.PerspectiveCamera(41,1,.1,150);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=!reduced;controls.dampingFactor=.08;controls.enablePan=false;controls.minDistance=5;controls.maxDistance=48;controls.minPolarAngle=.2;controls.maxPolarAngle=Math.PI*.46;controls.target.set(0,.15,0);
 controls.touches={ONE:THREE.TOUCH.ROTATE,TWO:THREE.TOUCH.DOLLY_PAN};
 scene.add(new THREE.HemisphereLight('#e9f6ff','#aaa681',1.9));
 const sun=new THREE.DirectionalLight('#fff0da',2.7);sun.position.set(-5,13,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-13;sun.shadow.camera.right=13;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;sun.shadow.camera.near=.5;sun.shadow.camera.far=45;sun.shadow.normalBias=.025;sun.shadow.bias=-.0001;scene.add(sun);
 const fill=new THREE.DirectionalLight('#b9dcff',1.3);fill.position.set(5,5,-8);scene.add(fill);
 let model;
 try{model=(await new GLTFLoader().loadAsync(new URL('./island.glb',import.meta.url).href)).scene;}catch(e){renderer.dispose();controls.dispose();throw e;}
 const items={},docks={},sequence=[],originalPositions=new Map();let robot,rocket;
 model.traverse(o=>{
  if(o.isMesh){o.castShadow=!o.name.startsWith('Cloud');o.receiveShadow=true;}
  const d=o.userData;
  if(d.interactive==='item'){items[d.item]=o;originalPositions.set(o,o.position.clone());}
  if(d.interactive==='dock')docks[d.shape]=o;
  if(d.interactive==='sequence')sequence[d.slot]=o;
  if(d.role==='explorer')robot=o;
  if(d.role==='rocket')rocket=o;
 });
 if(!robot||!rocket||Object.keys(items).length!==4||sequence.length!==6)throw new Error('Invalid Blender model: required named interaction nodes are missing');
 scene.add(model);
 // Only answer pieces are procedural; the complete island, objects, explorer and rocket
 // were authored/exported in Blender. This lets incorrect choices really appear in 3D.
 const palette=new THREE.Group(),answers=new THREE.Group();scene.add(palette,answers);
 const geometries={cube:new THREE.BoxGeometry(.6,.6,.6),sphere:new THREE.SphereGeometry(.33,24,16),cone:new THREE.ConeGeometry(.34,.7,32),cylinder:new THREE.CylinderGeometry(.33,.33,.67,32)};
 const materials=Object.fromEntries(Object.entries(COLORS).map(([name,color])=>[name,new THREE.MeshStandardMaterial({color,roughness:.56})]));
 const ghostMaterial=new THREE.MeshStandardMaterial({color:'#afc3cd',transparent:true,opacity:.24,roughness:1,depthWrite:false});
 const socketGeometry=new THREE.CylinderGeometry(.42,.42,.1,32),socketMaterial=new THREE.MeshStandardMaterial({color:'#f7ecdc',roughness:.9});
 function piece(value){const[c,s]=value.split('-');const o=new THREE.Mesh(geometries[s],materials[c]);o.castShadow=true;o.receiveShadow=true;return o;}
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.49,.025,10,48),new THREE.MeshBasicMaterial({color:'#327cce'}));ring.rotation.x=-Math.PI/2;ring.visible=false;scene.add(ring);
 const rocketBase=rocket.position.clone(),robotBase=robot.position.clone();
 const body=rocket.children.find(o=>/^Rocket[ _]body/.test(o.name)),nose=rocket.children.find(o=>/^Rocket[ _]nose/.test(o.name));
 if(!body||!nose)throw new Error('Missing rocket components');
 const bodyMaterial=body.material,noseMaterial=nose.material;
 const rocketPieces=new THREE.Group();rocket.add(rocketPieces);
 let state=null,selected=null,activeSlot=0,previousStation=-1,wasBridgeSolved=false;
 let tween=null,route=[],launchTime=null,celebrationUntil=0,lastTime=0;
 const markers=[];
 const locations=[new THREE.Vector3(-3.6,3.3,.1),new THREE.Vector3(2.9,1.5,-2.5),new THREE.Vector3(4.1,3.5,2.45)];
 for(let i=0;i<3;i++){
  const el=document.createElement('button');el.className='map-marker';el.textContent=String(i+1);el.dataset.station=i;el.setAttribute('aria-label',['Перейти к мастерской форм','Перейти к мосту секретов','Перейти в космопорт'][i]);el.addEventListener('click',()=>callbacks.onStation(i));document.getElementById('markers').append(el);markers.push(el);
 }
 function moveCamera(position,target){
  if(reduced){camera.position.copy(position);controls.target.copy(target);controls.update();return;}
  tween={start:performance.now(),from:camera.position.clone(),to:position,fromTarget:controls.target.clone(),target};
 }
 controls.addEventListener('start',()=>{tween=null;});
 function overview(){
  const fit=Math.max(1,1.25/camera.aspect);moveCamera(new THREE.Vector3(9,12.5,18).multiplyScalar(fit),new THREE.Vector3(0,0,0));
 }
 const cameraTargets=[new THREE.Vector3(-3.55,.85,.1),new THREE.Vector3(2.75,.65,-2),new THREE.Vector3(4.1,1.3,2.2)];
 function walk(points){route=points.map(v=>new THREE.Vector3(v[0],v[1],v[2]));if(reduced&&route.length){robot.position.copy(route.at(-1));route=[];}}
 function focus(i){
  const target=cameraTargets[i],fit=Math.max(1,1.03/camera.aspect),offset=[new THREE.Vector3(1,6.7,8.8),new THREE.Vector3(1.8,6.4,9.5),new THREE.Vector3(4,5.2,7.8)][i];
  moveCamera(target.clone().add(offset.multiplyScalar(fit)),target.clone());
  walk([[0,.3,1.2],...[ [[-1.05,.3,.95]],[[2,.3,.2],[1.25,.5,-1.65]],[[2.4,.3,1.4],[3.1,.65,2.5]] ][i]]);
 }
 function update(s,item,slot){
  state=s;selected=item;activeSlot=slot;
  for(const shape of SHAPES){
   const object=items[shape],dock=SHAPES.find(d=>s.placements[d]===shape);
   object.position.copy(dock?docks[dock].position:originalPositions.get(object));if(dock)object.position.y+=.07;
  }
  if(s.station!==previousStation){palette.clear();
   if(s.station!==0){const choices=s.station===1?PATTERN_CHOICES:ROCKET_CHOICES;
    choices.forEach((v,i)=>{const g=new THREE.Group();g.userData={interactive:'piece',value:v};
     if(s.station===1)g.position.set(.2+i*.99,.5,-.85);else g.position.set(2.45+(i%3)*1.08,.38,-.25-Math.floor(i/3)*1.02);
     const socket=new THREE.Mesh(socketGeometry,socketMaterial);socket.receiveShadow=true;g.add(socket);
     const mesh=piece(v);mesh.position.y=.4;g.add(mesh);palette.add(g);
    });
   }
   previousStation=s.station;
  }
  answers.clear();
  for(let i=0;i<2;i++){
   const node=sequence[i+4];node.children.forEach(o=>o.visible=!s.sequence[i]);
   if(s.sequence[i]){const o=piece(s.sequence[i]);o.position.copy(node.position);o.position.y+=.35;o.userData={interactive:'sequence',slot:i+4};answers.add(o);}
  }
  // Correct parts use the original Blender meshes. Wrong choices remain editable and visible.
  rocketPieces.clear();
  [body,nose].forEach((original,i)=>{
   const value=s.rocket[i],expected=i===0?'blue-cylinder':'coral-cone';
   original.userData={interactive:'rocketSlot',slot:i};
   const preview=s.station!==2&&!value;
   original.visible=preview||!value||value===expected;original.material=(value||preview)?(i===0?bodyMaterial:noseMaterial):ghostMaterial;
   if(value&&value!==expected){const mesh=piece(value);mesh.position.copy(original.position);mesh.scale.set(i===0?1.65:1.6,i===0?2:1.15,i===0?1.65:1.6);mesh.userData={interactive:'rocketSlot',slot:i};rocketPieces.add(mesh);}
  });
  if(s.solved[1]&&!wasBridgeSolved&&s.station===1)walk([[1.3,.51,-3.12],[3.4,.51,-3.12],[5.15,.51,-3.12]]);
  wasBridgeSolved=s.solved[1];
 }
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
 const hitTargets=()=>[model,palette,answers];
 function hits(e){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(hitTargets(),true).filter(h=>{let o=h.object;while(o){if(!o.visible)return false;o=o.parent;}return true;});}
 function interactive(o){while(o){if(o.userData.interactive)return o.userData;o=o.parent;}return null;}
 renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,id:e.pointerId,time:performance.now()};});
 renderer.domElement.addEventListener('pointercancel',()=>down=null);
 renderer.domElement.addEventListener('pointerup',e=>{
  if(!down||down.id!==e.pointerId||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7||performance.now()-down.time>650){down=null;return;}down=null;
  const list=hits(e);if(!list.length)return;
  const hit=list[0],d=interactive(hit.object);
  if(d?.interactive==='item'){if(state.station!==0)callbacks.onStation(0);callbacks.onItem(d.item);return;}
  if(d?.interactive==='dock'){if(state.station!==0)callbacks.onStation(0);callbacks.onDock(d.shape);return;}
  if(d?.interactive==='piece'){callbacks.onPiece(d.value);return;}
  if(d?.interactive==='sequence'&&d.slot>=4){if(state.station!==1)callbacks.onStation(1);callbacks.onSlot(d.slot-4);return;}
  if(d?.interactive==='rocketSlot'){if(state.station!==2)callbacks.onStation(2);callbacks.onSlot(d.slot);return;}
  // Walk only on the paths/bridge/deck, not through buildings or off cliffs.
  if(/Walkway|Path_to_bridge|Bridge_platform|Launchpad_deck/.test(hit.object.name))walk([[hit.point.x,hit.point.y+.07,hit.point.z]]);
 });
 host.addEventListener('keydown',e=>{
  if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();
  const pos=robot.position.clone();pos.x+=e.key==='ArrowRight'?.3:e.key==='ArrowLeft'?-.3:0;pos.z+=e.key==='ArrowDown'?.3:e.key==='ArrowUp'?-.3:0;
  // Keyboard roaming stays inside the broad central pedestrian path.
  pos.x=THREE.MathUtils.clamp(pos.x,-5.2,5.1);pos.z=THREE.MathUtils.clamp(pos.z,.6,1.3);pos.y=.3;walk([[pos.x,pos.y,pos.z]]);
 });
 function resize(){const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
 resize();camera.position.set(9,12.5,18).multiplyScalar(Math.max(1,1.25/camera.aspect));controls.update();
 let lastAspect=camera.aspect;
 new ResizeObserver(()=>{resize();if(Math.abs(camera.aspect-lastAspect)>.2){lastAspect=camera.aspect;overview();}}).observe(host);
 const projected=new THREE.Vector3();
 function animate(now){
  requestAnimationFrame(animate);if(document.hidden)return;
  const dt=Math.min((now-lastTime)/1000,.06);lastTime=now;
  if(tween){const t=Math.min((now-tween.start)/950,1),ease=t*t*(3-2*t);camera.position.lerpVectors(tween.from,tween.to,ease);controls.target.lerpVectors(tween.fromTarget,tween.target,ease);if(t===1)tween=null;}
  if(route.length){const dest=route[0],delta=dest.clone().sub(robot.position);if(delta.length()<.06){robot.position.copy(dest);route.shift();}else{robot.position.addScaledVector(delta.normalize(),Math.min(dt*2.1,robot.position.distanceTo(dest)));robot.rotation.y=Math.atan2(delta.x,delta.z);}}
  if(launchTime!==null&&!reduced){const t=(now-launchTime)/1000;rocket.position.y=rocketBase.y+Math.min(t*t*.75,26);if(t>7){launchTime=null;rocket.position.copy(rocketBase);}}
  if(now<celebrationUntil&&!reduced)robot.scale.setScalar(1+Math.sin(now*.018)*.035);else robot.scale.setScalar(1);
  ring.visible=Boolean(state&&((state.station===0&&selected)||state.station===1||state.station===2));
  if(ring.visible){
   if(state.station===0)ring.position.copy(items[selected].position).add(new THREE.Vector3(0,.025,0));
   else if(state.station===1)ring.position.copy(sequence[activeSlot+4].position).add(new THREE.Vector3(0,.02,0));
   else ring.position.copy(rocket.position).add(new THREE.Vector3(0,activeSlot===0?.34:1.66,0));
  }
  controls.update();
  locations.forEach((loc,i)=>{projected.copy(loc).project(camera);const b=markers[i];b.style.left=(projected.x*.5+.5)*host.clientWidth+'px';b.style.top=(-projected.y*.5+.5)*host.clientHeight+'px';b.hidden=projected.z>1||Math.abs(projected.x)>1||Math.abs(projected.y)>1;});
  renderer.render(scene,camera);
 }
 requestAnimationFrame(animate);
 return {update,focus,overview,zoom(f){const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*f,5,48));moveCamera(controls.target.clone().add(offset),controls.target.clone());},orbit(){const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/5);moveCamera(controls.target.clone().add(offset),controls.target.clone());},celebrate(){celebrationUntil=performance.now()+1300;},launch(){launchTime=performance.now();},reset(){rocket.position.copy(rocketBase);robot.position.copy(robotBase);robot.rotation.y=0;route=[];launchTime=null;wasBridgeSolved=false;}};
}
