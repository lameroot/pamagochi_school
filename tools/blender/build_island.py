"""Original island model. Execute through official Blender MCP with mcp_client.py.
All design coordinates below are browser Y-up; p() converts them to Blender Z-up.
Does not delete or modify any other scene. Output directory is relative to project cwd.
"""
import bpy, math, random, json
from pathlib import Path
from mathutils import Vector
random.seed(19)
ROOT = Path(globals().get('PROJECT_ROOT', Path.cwd()))
OUT = ROOT / 'pamagochi_school_site/assets/island'
scene = bpy.data.scenes.new('Island of Shapes')
bpy.context.window.scene = scene
parent = None

def p(v): return (v[0], -v[2], v[1])
def mat(name, hexcolor, rough=.65, metal=0):
    h=hexcolor.lstrip('#'); rgb=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    rgb=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    m=bpy.data.materials.new(name); m.diffuse_color=(*rgb,1); m.use_nodes=True
    bs=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'); bs.inputs['Base Color'].default_value=(*rgb,1)
    bs.inputs['Roughness'].default_value=rough; bs.inputs['Metallic'].default_value=metal
    return m
M={n:mat(n,c) for n,c in {'cream':'#fff3db','sand':'#e4c7a1','rock':'#c7ad92','grass':'#a2d5b3','mint':'#b8dfb9','teal':'#409f96','pine':'#398d80','blue':'#639dec','coral':'#ed8271','yellow':'#f6c965','navy':'#263f50','white':'#fffdf5','wood':'#bc8863','water':'#9cdae8'}.items()}

def finish(o,name,material,bevel=0):
    o.name=name
    if material:o.data.materials.append(M[material])
    if parent:o.parent=parent
    if bevel:
        b=o.modifiers.new('Soft crafted edges','BEVEL'); b.width=bevel; b.segments=3
        o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return o

def box(name,loc,size,material,bevel=.04):
    bpy.ops.mesh.primitive_cube_add(size=1,location=p(loc)); o=bpy.context.object
    o.scale=(size[0],size[2],size[1]); bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(o,name,material,bevel)
def cyl(name,loc,r,h,material,vertices=48,r2=None):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices,radius1=r,radius2=r if r2 is None else r2,depth=h,location=p(loc))
    o=finish(bpy.context.object,name,material,.025 if r2 is None else 0)
    for f in o.data.polygons:f.use_smooth=len(f.vertices)==4
    return o

def ball(name,loc,r,material,scale=(1,1,1)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,radius=r,location=p(loc)); o=bpy.context.object
    o.scale=(scale[0],scale[2],scale[1]); finish(o,name,material)
    for f in o.data.polygons:f.use_smooth=True
    return o

def ring(name,loc,r,t,material,vertical=False):
    bpy.ops.mesh.primitive_torus_add(major_radius=r,minor_radius=t,major_segments=48,minor_segments=10,location=p(loc))
    o=finish(bpy.context.object,name,material)
    if vertical:o.rotation_euler.x=math.pi/2
    for f in o.data.polygons:f.use_smooth=True
    return o

def group(name,loc,**extras):
    o=bpy.data.objects.new(name,None); scene.collection.objects.link(o); o.location=p(loc)
    for k,v in extras.items():o[k]=v
    return o

def text(name,body,loc,size=.3,material='navy',ground=False):
    c=bpy.data.curves.new(name,'FONT'); c.body=body;c.align_x='CENTER';c.size=size;c.extrude=.002
    o=bpy.data.objects.new(name,c); scene.collection.objects.link(o); o.location=p(loc)
    if not ground:o.rotation_euler.x=math.pi/2
    if parent:o.parent=parent
    c.materials.append(M[material]); bpy.ops.object.select_all(action='DESELECT'); bpy.context.view_layer.objects.active=o;o.select_set(True)
    bpy.ops.object.convert(target='MESH');o.select_set(False)
    return o

# Layered elliptical floating island, with faceted stone skirt.
for i,(y,r,h,col) in enumerate([(-1.7,6.1,1.25,'rock'),(-.9,7,1,'sand'),(-.3,7.5,.65,'cream'),(.05,7.55,.22,'grass')]):
    o=cyl('Island layer '+str(i),(0,y,0),r,h,col,64);o.scale.y=.76
for i in range(40):
    a=2*math.pi*i/40;r=random.uniform(6.4,7)
    o=cyl('Cliff stone',(math.cos(a)*r,-1.35,math.sin(a)*r*.75),random.uniform(.4,.7),random.uniform(1.1,2.3),'sand' if i%3 else 'rock',5,r2=.48)
# Paths built from rounded paving stones; deliberately broad for the explorer.
for i in range(21):
    x=-5+i*.49; z=.75+.6*math.sin(i*.29)
    box('Walkway',(x,.21,z),(.63,.13,1.25),'cream',.17)
for i in range(9):box('Path to bridge',(2.4-i*.07,.22,.7-i*.42),(1.15,.12,.55),'cream',.13)
# Workshop on left.
cyl('Workshop terrace',(-3.6,.3,-.2),2.35,.28,'cream')
box('Workshop rear wall',(-3.6,1.2,-1.6),(4.2,1.8,.2),'sand',.1)
for x in [-5.65,-1.55]:
    cyl('Workshop column',(x,1.8,-1.35),.13,3.2,'wood')
    cyl('Column foot',(x,.49,-1.35),.22,.35,'coral')
for i in range(8):
    x=-5.45+i*.53
    box('Striped awning',(x,3.12,-.6),(.53,.16,2.5),'coral' if i%2==0 else 'cream',.06)
    ball('Scalloped awning',(x,2.96,.62),.265,'coral' if i%2==0 else 'cream',scale=(1,.7,.27))
# Solid objects and their docks: data extras are the runtime interaction contract.
for i,(shape,color,label) in enumerate([('sphere','yellow','BALL'),('cube','coral','GIFT'),('cylinder','teal','TIN'),('cone','blue','HAT')]):
    x=-5.25+i*1.1
    cyl('Object plinth',(x,.57,-.55),.46,.32,'white')
    parent=group('item_'+shape,(x,.76,-.55),interactive='item',item=shape)
    if shape=='sphere':
        ball('Toy ball',(0,.4,0),.38,color);ring('Ball seam',(0,.4,0),.382,.014,'cream')
    elif shape=='cube':
        box('Gift cube',(0,.36,0),(.69,.69,.69),color,.025)
        box('Gift ribbon',(0,.36,.35),(.09,.7,.018),'cream',.003)
        box('Gift ribbon top',(0,.713,0),(.09,.018,.7),'cream',.003)
    elif shape=='cylinder':
        cyl('Tin cylinder',(0,.4,0),.32,.76,color)
        for y in [.04,.77]:ring('Tin rim',(0,y,0),.32,.024,'cream')
    else:
        cyl('Party cone',(0,.45,0),.37,.85,color,r2=0);ring('Hat rim',(0,.045,0),.35,.025,'cream')
    parent=None
    parent=group('dock_'+shape,(x,.45,1.32),interactive='dock',shape=shape)
    cyl('Dock plate',(0,0,0),.49,.11,'cream');ring('Dock outline',(0,.065,0),.44,.025,'blue')
    text('Dock number',str(i+1),(0,.07,.12),.25,ground=True)
    parent=None
# Bridge learning platform in back-right.
box('Bridge platform',(2.9,.3,-2.65),(6.2,.25,1.75),'cream',.22)
for x in [.05,5.72]:
    for z in [-3.4,-1.92]:
        box('Bridge pillar',(x,.75,z),(.15,.8,.15),'sand')
        ball('Bridge cap',(x,1.2,z),.15,'yellow')
# Curved architectural arch.
for x in [.2,1.65]:box('Arch pillar',(x,1.45,-3.27),(.28,2.3,.3),'blue',.05)
for i in range(17):
    a=math.pi*i/16
    box('Arch curve',(.925+math.cos(a)*.725,2.6+math.sin(a)*.725,-3.27),(.25,.25,.32),'blue',.07)
for i in range(6):
    x=.25+i*1.05
    cyl('Sequence socket',(x,.48,-2.5),.43,.11,'blue' if i>=4 else 'sand')
    parent=group('sequence_'+str(i),(x,.55,-2.5),interactive='sequence',slot=i)
    if i<4:
        color='coral' if i%2==0 else 'blue';shape=['cube','sphere','cone'][i%3]
        if shape=='cube':box('Sequence cube',(0,.31,0),(.56,.56,.56),color,.018)
        elif shape=='sphere':ball('Sequence sphere',(0,.32,0),.3,color)
        else:cyl('Sequence cone',(0,.36,0),.32,.7,color,r2=0)
    else:text('Empty sequence','?',(0,.12,.1),.46,'navy',ground=True)
    parent=None
    text('Step number',str(i+1),(x,.445,-1.85),.22,ground=True)
# Launchpad and designed rocket; parts can be shown by the lesson runtime.
cyl('Launchpad lower',(4.1,.32,2.45),1.6,.35,'cream')
cyl('Launchpad blue ring',(4.1,.53,2.45),1.37,.09,'blue')
cyl('Launchpad deck',(4.1,.6,2.45),1.18,.09,'white')
parent=group('rocket',(4.1,.65,2.45),role='rocket')
cyl('Rocket engine',(0,.21,0),.43,.4,'navy')
cyl('Rocket body',(0,1.03,0),.55,1.35,'blue')
cyl('Rocket nose',(0,2.05,0),.55,.8,'coral',r2=0)
ring('Rocket porthole',(0,1.2,.545),.23,.045,'yellow',True)
ball('Porthole glass',(0,1.2,.56),.195,'navy',scale=(1,1,.16))
for x in [-.65,.65]:
    o=box('Rocket fin',(x,.5,0),(.22,.85,.55),'cream',.07);o.rotation_euler.y=.24 if x>0 else -.24
ring('Rocket lower band',(0,.39,0),.56,.04,'cream')
parent=None
for x,z in [(2.9,3.25),(5.3,3.25),(3,-0.05),(5.5,1.6)]:
    cyl('Launch lamp',(x,.8,z),.065,1.2,'wood');ball('Lamp pearl',(x,1.42,z),.15,'yellow')
# Friendly articulated explorer, grouped for browser movement.
parent=group('explorer',(0,.3,1.1),role='explorer')
box('Robot body',(0,.65,0),(.61,.57,.4),'teal',.13)
box('Robot head',(0,1.2,0),(.86,.65,.52),'teal',.16)
box('Face plate',(0,1.22,.269),(.7,.46,.07),'cream',.12)
for x in [-.17,.17]:ball('Eye',(x,1.24,.324),.065,'navy',scale=(1,1,.4))
ring('Chest button',(0,.69,.22),.1,.018,'yellow',True)
for x in [-.2,.2]:
    box('Boot',(x,.13,.06),(.25,.2,.38),'teal',.075)
    cyl('Leg',(x,.32,0),.075,.27,'navy')
    ball('Shoulder',(x*1.9,.82,0),.115,'teal')
    box('Arm',(x*2,.62,0),(.15,.32,.17),'teal',.06)
cyl('Antenna',(0,1.68,0),.026,.27,'navy');ball('Antenna tip',(0,1.86,0),.1,'yellow')
parent=None
# Tree garden: sparse enough to keep all stations readable.
for i,(x,z,s) in enumerate([(-6,-2.3,1),(-5,-3.2,.9),(-2.9,-3.7,1.05),(-1,-3.7,.8),(3.7,-4.1,.7),(6,-.3,.9),(6,2,.7),(-5.9,2.6,.8),(-4,3.4,.75),(-1.9,3.7,1),(1,3.8,.75)]):
    cyl('Tree trunk',(x,.8*s,z),.12*s,1.4*s,'wood')
    if i%2:
        for j in range(3):cyl('Pine crown',(x,(1.4+j*.42)*s,z),(.65-j*.13)*s,.95*s,'pine',12,r2=0)
    else:
        ball('Round crown',(x,1.9*s,z),.76*s,'mint')
        ball('Round branch',(x+.4*s,1.6*s,z+.2),.46*s,'grass')
for i in range(45):
    a=random.random()*math.tau;r=random.uniform(5.5,6.6);x=math.cos(a)*r;z=math.sin(a)*r*.72
    if i%3==0:ball('Pebble',(x,.26,z),random.uniform(.1,.22),'sand',scale=(1,.55,.8))
    else:
        for j in range(3):cyl('Grass tuft',(x+j*.075,.32,z),.055,.28,'pine',5,r2=0)
# Decorative floating satellite islands and clouds.
for x,z,s in [(-10,-7,.8),(9,-8,.6),(-10,5,.4),(10,6,.45)]:
    cyl('Distant rock',(x,-1.4,z),s,1.8*s,'sand',7,r2=s*1.4)
    cyl('Distant lawn',(x,-.5,z),s*1.42,.18,'grass',16)
for x,y,z in [(-8,-3,0),(7,-3,-4),(-3,-3,6),(6,-3,6),(-3,0,-8)]:
    for j in range(4):ball('Cloud',(x+j*.6,y+(.2 if j%2 else 0),z),.72,'white',scale=(1,.5,.8))
# Studio lighting and camera, preserved in native authoring file.
world=bpy.data.worlds.new('Powder blue sky');world.use_nodes=True
next(n for n in world.node_tree.nodes if n.type=='BACKGROUND').inputs[0].default_value=(.55,.72,.88,1)
next(n for n in world.node_tree.nodes if n.type=='BACKGROUND').inputs[1].default_value=.7;scene.world=world
bpy.ops.object.light_add(type='AREA',location=p((-4,12,8)));bpy.context.object.data.energy=1800;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=8
light=bpy.context.object;light.rotation_euler=(Vector(p((0,0,0)))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=p((11,13,19)));camera=bpy.context.object
camera.rotation_euler=(Vector(p((0,0,0)))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=20;scene.camera=camera
scene.render.engine='CYCLES';scene.cycles.samples=24
scene.render.resolution_x=1400;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
# Export meshes + extras, no server-side dependency at runtime.
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'island.blend'))
bpy.ops.export_scene.gltf(filepath=str(OUT/'island.glb'),export_format='GLB',use_active_scene=True,export_apply=True,export_extras=True,export_cameras=False,export_lights=False)
result={'scene':scene.name,'objects':len(scene.objects),'blend':str(OUT/'island.blend'),'glb':str(OUT/'island.glb'),'bytes':(OUT/'island.glb').stat().st_size}
