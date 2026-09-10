import bpy
import math
import os
import random
from mathutils import Vector

# LAVENDISH Piña Colada Hero v4 — Blender-authored product asset.
# Zero paid API dependencies. Static product render must pass before web integration.

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT_DIR = os.path.join(ROOT, 'assets', '3d')
QA_DIR = os.path.join(OUT_DIR, 'qa-v4')
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(QA_DIR, exist_ok=True)
random.seed(47)


def hex_rgba(value):
    value = value.lstrip('#')
    rgb = [int(value[i:i+2], 16) / 255.0 for i in (0, 2, 4)]
    def lin(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (lin(rgb[0]), lin(rgb[1]), lin(rgb[2]), 1.0)


def socket(bsdf, names, value):
    for name in names:
        s = bsdf.inputs.get(name)
        if s is not None:
            s.default_value = value
            return


def make_material(name, color, rough=0.35, metallic=0.0, transmission=0.0,
                  ior=1.45, coat=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    socket(bsdf, ['Base Color'], color)
    socket(bsdf, ['Roughness'], rough)
    socket(bsdf, ['Metallic'], metallic)
    socket(bsdf, ['IOR'], ior)
    socket(bsdf, ['Transmission Weight', 'Transmission'], transmission)
    socket(bsdf, ['Coat Weight', 'Clearcoat'], coat)
    socket(bsdf, ['Coat Roughness', 'Clearcoat Roughness'], max(0.025, rough * 0.35))
    mat.diffuse_color = color
    return mat


def add_noise_bump(mat, scale=8.0, detail=4.0, strength=0.12, distance=0.06,
                   c0=None, c1=None):
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    bsdf = nodes.get('Principled BSDF')
    tex = nodes.new('ShaderNodeTexNoise')
    tex.inputs['Scale'].default_value = scale
    tex.inputs['Detail'].default_value = detail
    tex.inputs['Roughness'].default_value = 0.66
    bump = nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = strength
    bump.inputs['Distance'].default_value = distance
    links.new(tex.outputs['Fac'], bump.inputs['Height'])
    links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    if c0 and c1:
        ramp = nodes.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].color = c0
        ramp.color_ramp.elements[1].color = c1
        ramp.color_ramp.elements[0].position = 0.27
        ramp.color_ramp.elements[1].position = 0.77
        links.new(tex.outputs['Fac'], ramp.inputs['Fac'])
        links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])


def smooth(obj):
    if obj.type == 'MESH':
        for p in obj.data.polygons:
            p.use_smooth = True
    return obj


def bevel(obj, width=0.025, segments=3):
    m = obj.modifiers.new('Edge softness', 'BEVEL')
    m.width = width
    m.segments = segments
    m.limit_method = 'ANGLE'
    bpy.context.view_layer.objects.active = obj
    try:
        bpy.ops.object.modifier_apply(modifier=m.name)
    except Exception:
        pass
    return obj


def empty(name, parent=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    if parent:
        obj.parent = parent
    return obj


def uv_sphere(name, loc, scale, mat, parent=None, seg=64, rings=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    smooth(obj)
    obj.data.materials.append(mat)
    if parent:
        obj.parent = parent
    return obj


def cylinder(name, radius, depth, loc, mat, parent=None, vertices=96, bevel_w=0.018):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    obj = bpy.context.object
    obj.name = name
    smooth(obj)
    if bevel_w:
        bevel(obj, bevel_w, 4)
    obj.data.materials.append(mat)
    if parent:
        obj.parent = parent
    return obj


def torus(name, major, minor, loc, mat, parent=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor,
                                    major_segments=96, minor_segments=20, location=loc)
    obj = bpy.context.object
    obj.name = name
    smooth(obj)
    obj.data.materials.append(mat)
    if parent:
        obj.parent = parent
    return obj


def lathe_shell(name, profile, thickness, mat, parent=None, segments=160):
    n = len(profile)
    inner = [(z + (0.012 if i == 0 else 0), max(0.05, r - thickness))
             for i, (z, r) in enumerate(profile)]
    verts, faces = [], []
    for p in (profile, inner):
        for z, r in p:
            for s in range(segments):
                a = math.tau * s / segments
                verts.append((r * math.cos(a), r * math.sin(a), z))

    def ix(layer, ring, s):
        return layer * n * segments + ring * segments + (s % segments)

    for layer in (0, 1):
        for ring in range(n - 1):
            for s in range(segments):
                a, b = ix(layer, ring, s), ix(layer, ring, s + 1)
                c, d = ix(layer, ring + 1, s + 1), ix(layer, ring + 1, s)
                faces.append((a, b, c, d) if layer == 0 else (d, c, b, a))

    for ring in (0, n - 1):
        for s in range(segments):
            o0, o1 = ix(0, ring, s), ix(0, ring, s + 1)
            i1, i0 = ix(1, ring, s + 1), ix(1, ring, s)
            faces.append((o0, i0, i1, o1) if ring == n - 1 else (o0, o1, i1, i0))

    mesh = bpy.data.meshes.new(name + '_Mesh')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    smooth(obj)
    obj.data.materials.append(mat)
    if parent:
        obj.parent = parent
    return obj


def lathe_solid(name, profile, mat, parent=None, segments=160):
    verts, faces = [], []
    n = len(profile)
    for z, r in profile:
        for s in range(segments):
            a = math.tau * s / segments
            verts.append((r * math.cos(a), r * math.sin(a), z))
    bc = len(verts); verts.append((0, 0, profile[0][0]))
    tc = len(verts); verts.append((0, 0, profile[-1][0]))

    def ix(r, s):
        return r * segments + (s % segments)

    for ring in range(n - 1):
        for s in range(segments):
            faces.append((ix(ring, s), ix(ring, s+1), ix(ring+1, s+1), ix(ring+1, s)))
    for s in range(segments):
        faces.append((bc, ix(0, s+1), ix(0, s)))
        faces.append((tc, ix(n-1, s), ix(n-1, s+1)))

    mesh = bpy.data.meshes.new(name + '_Mesh')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    smooth(obj)
    obj.data.materials.append(mat)
    if parent:
        obj.parent = parent
    return obj


def curve_tube(name, points, radius, mat, parent=None, bevel_res=5):
    curve = bpy.data.curves.new(name + '_Curve', 'CURVE')
    curve.dimensions = '3D'
    curve.resolution_u = 3
    curve.bevel_depth = radius
    curve.bevel_resolution = bevel_res
    spline = curve.splines.new('BEZIER')
    spline.bezier_points.add(len(points) - 1)
    for bp, co in zip(spline.bezier_points, points):
        bp.co = co
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    if parent:
        obj.parent = parent
    return obj


def sector_prism(name, inner, outer, a0, a1, depth, mat, parent=None, segments=42):
    angles = [math.radians(a0 + (a1-a0)*i/segments) for i in range(segments+1)]
    verts, faces = [], []
    for y in (-depth/2, depth/2):
        for r in (inner, outer):
            for a in angles:
                verts.append((r*math.cos(a), y, r*math.sin(a)))
    stride = segments + 1

    def vid(side, ring, i):
        return side * 2 * stride + ring * stride + i

    for side in (0, 1):
        for i in range(segments):
            q = (vid(side,0,i),vid(side,0,i+1),vid(side,1,i+1),vid(side,1,i))
            faces.append(q if side else tuple(reversed(q)))
    for ring in (0, 1):
        for i in range(segments):
            q = (vid(0,ring,i),vid(1,ring,i),vid(1,ring,i+1),vid(0,ring,i+1))
            faces.append(q if ring else tuple(reversed(q)))
    for i in (0, segments):
        faces.append((vid(0,0,i),vid(1,0,i),vid(1,1,i),vid(0,1,i)))

    mesh = bpy.data.meshes.new(name + '_Mesh')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    bevel(obj, 0.014, 3)
    smooth(obj)
    obj.data.materials.append(mat)
    if parent:
        obj.parent = parent
    return obj


def leaf(name, length, width, mat, parent):
    verts = [
        (-width*0.38, -0.014, 0.0), (width*0.38, -0.014, 0.0),
        (width*0.22, -0.010, length*0.58), (0.0, 0.0, length),
        (-width*0.22, -0.010, length*0.58),
        (-width*0.38, 0.014, 0.0), (width*0.38, 0.014, 0.0),
        (width*0.22, 0.010, length*0.58), (0.0, 0.0, length),
        (-width*0.22, 0.010, length*0.58),
    ]
    faces = [(0,1,2,3,4),(9,8,7,6,5),(0,5,6,1),(1,6,7,2),(2,7,8,3),(3,8,9,4),(4,9,5,0)]
    mesh = bpy.data.meshes.new(name + '_Mesh')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    bevel(obj, 0.008, 2)
    obj.data.materials.append(mat)
    obj.parent = parent
    return obj


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()


def area_light(name, loc, energy, size, color, target=(0,0,2.2), shape='RECTANGLE'):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.shape = shape
    data.size = size
    data.color = color[:3]
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    look_at(obj, target)
    return obj


bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 720
scene.render.resolution_y = 960
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.film_transparent = False
scene.render.image_settings.color_depth = '8'
try:
    scene.view_settings.look = 'AgX - Medium High Contrast'
except Exception:
    pass

scene.world.use_nodes = True
wbg = scene.world.node_tree.nodes.get('Background')
wbg.inputs['Color'].default_value = hex_rgba('#06070c')
wbg.inputs['Strength'].default_value = 0.12

glass_mat = make_material('M_Glass', hex_rgba('#eef8ff'), rough=0.035, transmission=1.0, ior=1.45, coat=0.12)
ice_mat = make_material('M_CrushedIce', hex_rgba('#e8f5ff'), rough=0.18, transmission=0.58, ior=1.31, coat=0.10)
water_mat = make_material('M_Condensation', hex_rgba('#eafaff'), rough=0.08, transmission=0.92, ior=1.333, coat=0.06)
liquid_mat = make_material('M_PinaLiquid', hex_rgba('#f2d79a'), rough=0.34, coat=0.08)
add_noise_bump(liquid_mat, scale=5.5, detail=3.0, strength=0.025, distance=0.025)
foam_mat = make_material('M_Foam', hex_rgba('#fff1d0'), rough=0.62, coat=0.02)
straw_mat = make_material('M_Straw', hex_rgba('#d7a969'), rough=0.42, coat=0.05)
pine_mat = make_material('M_PineappleFlesh', hex_rgba('#f5bf36'), rough=0.48)
add_noise_bump(pine_mat, scale=7.0, detail=5.0, strength=0.11, distance=0.05,
               c0=hex_rgba('#d88b18'), c1=hex_rgba('#ffd75b'))
rind_mat = make_material('M_PineappleRind', hex_rgba('#7a7728'), rough=0.62)
add_noise_bump(rind_mat, scale=9.0, detail=4.0, strength=0.16, distance=0.05,
               c0=hex_rgba('#3f4a18'), c1=hex_rgba('#9a8a35'))
fiber_mat = make_material('M_PineappleFiber', hex_rgba('#b56d18'), rough=0.52)
leaf_mat = make_material('M_PineappleLeaf', hex_rgba('#30451a'), rough=0.58, coat=0.03)
cherry_mat = make_material('M_Cherry', hex_rgba('#b00e20'), rough=0.19, coat=0.42)
stem_mat = make_material('M_CherryStem', hex_rgba('#44551a'), rough=0.58)
table_mat = make_material('M_Table', hex_rgba('#15131a'), rough=0.30, coat=0.12)
back_mat = make_material('M_Backdrop', hex_rgba('#090912'), rough=0.76)

root = empty('PinaColada_Hero_v4')
glass = empty('Glass', root)
liquid = empty('Liquid', root)
foam = empty('Foam', root)
straw = empty('Straw', root)
pineapple = empty('Pineapple', root)
cherry = empty('Cherry', root)
condensation = empty('Condensation', root)

profile = [
    (1.18, 0.30),(1.27, 0.43),(1.39, 0.60),(1.57, 0.76),(1.83, 0.84),
    (2.13, 0.83),(2.40, 0.78),(2.66, 0.70),(2.89, 0.68),(3.08, 0.72),
    (3.28, 0.82),(3.43, 0.92),(3.50, 0.94),
]
lathe_shell('Glass_Bowl', profile, 0.040, glass_mat, glass)
cylinder('Glass_Stem', 0.105, 0.68, (0,0,0.72), glass_mat, glass, bevel_w=0.018)
uv_sphere('Glass_StemBulb', (0,0,1.07), (0.205,0.205,0.20), glass_mat, glass)
torus('Glass_Collar', 0.245, 0.045, (0,0,1.18), glass_mat, glass)
cylinder('Glass_Foot', 0.58, 0.095, (0,0,0.075), glass_mat, glass, bevel_w=0.040)
torus('Glass_FootRim', 0.50, 0.035, (0,0,0.11), glass_mat, glass)

liq = [
    (1.26, 0.27),(1.36,0.40),(1.48,0.56),(1.63,0.70),(1.85,0.78),
    (2.13,0.77),(2.40,0.72),(2.65,0.64),(2.87,0.62),(3.04,0.66),(3.16,0.72)
]
lathe_solid('Liquid_Body', liq, liquid_mat, liquid)
uv_sphere('Liquid_Meniscus', (0,0,3.165), (0.72,0.72,0.035), liquid_mat, liquid, seg=96, rings=24)

ice_positions = [
    (-.44,-.06,3.20,.25,.18,.18),(-.16,-.22,3.22,.27,.20,.17),
    (.14,-.20,3.24,.25,.18,.18),(.43,-.08,3.20,.23,.17,.17),
    (-.31,.12,3.29,.24,.19,.20),(.02,.10,3.31,.28,.20,.19),
    (.33,.12,3.29,.24,.18,.18),(-.18,-.02,3.39,.24,.19,.18),
    (.14,-.02,3.41,.24,.19,.19),(-.02,.13,3.48,.21,.17,.17),
    (-.48,.02,3.34,.18,.14,.16),(.48,.03,3.34,.18,.14,.16),
]
for i,(x,y,z,sx,sy,sz) in enumerate(ice_positions,1):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1, location=(x,y,z))
    obj = bpy.context.object
    obj.name = f'Ice_{i:02d}'
    obj.scale = (sx,sy,sz)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    for v in obj.data.vertices:
        v.co += Vector((random.uniform(-.025,.025),random.uniform(-.025,.025),random.uniform(-.025,.025)))
    bevel(obj, 0.035, 3)
    smooth(obj)
    obj.rotation_euler = (random.uniform(-.4,.4),random.uniform(-.4,.4),random.uniform(-.4,.4))
    obj.data.materials.append(ice_mat)
    obj.parent = root

uv_sphere('Foam_Crown', (0,0,3.18), (0.70,0.70,0.055), foam_mat, foam, seg=96, rings=24)
for i in range(18):
    a = random.uniform(0, math.tau)
    r = random.uniform(0.08, 0.64)
    s = random.uniform(0.018, 0.038)
    uv_sphere(f'Foam_Micro_{i+1:02d}', (math.cos(a)*r, math.sin(a)*r, 3.19+random.uniform(0,.035)),
              (s,s,s*.55), foam_mat, foam, seg=18, rings=10)

curve_tube('Straw_Main', [(-.38,-.08,3.05),(-.47,-.04,3.66),(-.57,.00,4.15)],
           0.045, straw_mat, straw, bevel_res=6)

sector_prism('Pineapple_Flesh', 0.05, 0.66, 23, 100, 0.18, pine_mat, pineapple, 42)
sector_prism('Pineapple_Rind', 0.66, 0.75, 23, 100, 0.205, rind_mat, pineapple, 42)
for i, ang in enumerate((38,58,79),1):
    a=math.radians(ang)
    curve_tube(f'Pineapple_Fiber_{i:02d}',
               [(0.13*math.cos(a),-.102,0.13*math.sin(a)),(0.61*math.cos(a),-.102,0.61*math.sin(a))],
               0.0065, fiber_mat, pineapple, bevel_res=2)
pineapple.location=(0.58,0.10,3.42)
pineapple.rotation_euler=(0,math.radians(-8),math.radians(-6))
for i,(rot_z,scale) in enumerate(((-17,0.74),(7,0.88),(27,0.66)),1):
    lf=leaf(f'Pineapple_Leaf_{i:02d}',0.88,0.19,leaf_mat,pineapple)
    lf.location=(0.18,0.04,0.42)
    lf.rotation_euler=(math.radians(-3),math.radians(-5),math.radians(rot_z))
    lf.scale=(scale,scale,scale)

uv_sphere('Cherry_Fruit', (0.35,-0.52,3.48), (0.16,0.155,0.155), cherry_mat, cherry, seg=64, rings=32)
curve_tube('Cherry_Stem', [(0.36,-0.51,3.60),(0.41,-0.46,3.79),(0.50,-0.36,3.91)],
           0.012, stem_mat, cherry, bevel_res=4)

drops=[]
for i in range(22):
    z=random.uniform(1.55,3.05)
    nearest=min(profile,key=lambda p:abs(p[0]-z))
    rr=nearest[1]+0.018
    a=random.uniform(math.radians(-68),math.radians(68))
    x=rr*math.sin(a); y=-rr*math.cos(a)
    s=random.uniform(.010,.028)
    o=uv_sphere(f'_drop_{i:02d}',(x,y,z),(s,s*.45,s*1.25),water_mat,None,seg=16,rings=8)
    drops.append(o)
for o in drops:
    o.select_set(True)
bpy.context.view_layer.objects.active=drops[0]
bpy.ops.object.join()
bpy.context.object.name='Condensation_Droplets'
bpy.context.object.parent=condensation

bpy.ops.mesh.primitive_cylinder_add(vertices=128,radius=4.6,depth=.16,location=(0,0,-.08))
table=bpy.context.object; table.name='Studio_Table'; bevel(table,.08,5); table.data.materials.append(table_mat)
bpy.ops.mesh.primitive_plane_add(size=20,location=(0,2.9,4.5),rotation=(math.radians(90),0,0))
back=bpy.context.object; back.name='Studio_Backdrop'; back.data.materials.append(back_mat)

area_light('Key_Softbox',(-3.6,-5.2,5.2),720,3.8,hex_rgba('#ffd7ad'),(0,0,2.25))
area_light('Rim_Cool',(3.8,1.4,4.8),980,3.0,hex_rgba('#9dbdff'),(0,0,2.35))
area_light('Top_Strip',(-.4,-.2,7.0),760,2.8,hex_rgba('#fff0d5'),(0,0,2.4))
area_light('Front_Fill',(2.8,-5.2,2.4),230,2.5,hex_rgba('#bed0ff'),(0,0,2.1))
area_light('Garnish_Kicker',(2.6,-1.5,4.5),250,1.5,hex_rgba('#ffc66e'),(.65,0,3.65))

cam_data=bpy.data.cameras.new('HeroCamera')
cam=bpy.data.objects.new('HeroCamera',cam_data)
bpy.context.collection.objects.link(cam)
scene.camera=cam
cam.data.lens=74
cam.data.sensor_width=36


def render_view(filename, location, target=(0,0,2.08), lens=74):
    cam.location=location
    cam.data.lens=lens
    look_at(cam,target)
    scene.render.filepath=os.path.join(QA_DIR,filename)
    bpy.ops.render.render(write_still=True)

render_view('hero_front.png',(0,-8.25,3.02),(0,0,2.08),74)
render_view('hero_right45.png',(4.45,-6.7,3.18),(0,0,2.12),76)

blend_path=os.path.join(OUT_DIR,'pina-colada-hero-v4.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend_path)

bpy.ops.object.select_all(action='DESELECT')
for obj in bpy.context.scene.objects:
    p=obj
    while p is not None:
        if p == root:
            obj.select_set(True)
            break
        p=p.parent
root.select_set(True)
bpy.context.view_layer.objects.active=root

glb_path=os.path.join(OUT_DIR,'pina-colada-hero-v4.glb')
bpy.ops.export_scene.gltf(
    filepath=glb_path,
    export_format='GLB',
    use_selection=True,
    export_yup=True,
    export_apply=True,
    export_materials='EXPORT',
    export_normals=True,
    export_cameras=False,
    export_lights=False,
)

print('V4_DONE', glb_path)
print('GLB_BYTES', os.path.getsize(glb_path))
print('QA_DIR', QA_DIR)
