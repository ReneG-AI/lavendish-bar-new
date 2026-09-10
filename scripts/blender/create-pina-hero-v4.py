import bpy
import math
import os
import random
from mathutils import Vector

# LAVENDISH Piña Colada Hero v4
# Native Blender authoring script. Zero paid API dependencies.

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT_DIR = os.path.join(ROOT, 'assets', '3d')
QA_DIR = os.path.join(OUT_DIR, 'qa-v4')
os.makedirs(QA_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

random.seed(47)

# ---------- helpers ----------

def srgb(hex_value):
    hex_value = hex_value.lstrip('#')
    return tuple(int(hex_value[i:i+2], 16) / 255.0 for i in (0, 2, 4)) + (1.0,)


def set_socket(bsdf, candidates, value):
    for name in candidates:
        sock = bsdf.inputs.get(name)
        if sock is not None:
            sock.default_value = value
            return True
    return False


def material(name, base, roughness=0.35, metallic=0.0, transmission=0.0,
             ior=1.45, coat=0.0, alpha=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = base
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    set_socket(bsdf, ['Base Color'], base)
    set_socket(bsdf, ['Roughness'], roughness)
    set_socket(bsdf, ['Metallic'], metallic)
    set_socket(bsdf, ['IOR'], ior)
    set_socket(bsdf, ['Transmission Weight', 'Transmission'], transmission)
    set_socket(bsdf, ['Coat Weight', 'Clearcoat'], coat)
    set_socket(bsdf, ['Coat Roughness', 'Clearcoat Roughness'], max(0.03, roughness * 0.45))
    set_socket(bsdf, ['Alpha'], alpha)
    if alpha < 1.0:
        try:
            mat.surface_render_method = 'DITHERED'
        except Exception:
            try:
                mat.blend_method = 'BLEND'
            except Exception:
                pass
    return mat


def add_noise_to_material(mat, scale=6.0, detail=3.0, strength=0.12, dark=None, light=None):
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get('Principled BSDF')
    noise = nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = scale
    noise.inputs['Detail'].default_value = detail
    noise.inputs['Roughness'].default_value = 0.7
    bump = nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = strength
    bump.inputs['Distance'].default_value = 0.08
    links.new(noise.outputs['Fac'], bump.inputs['Height'])
    links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    if dark and light:
        ramp = nodes.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].color = dark
        ramp.color_ramp.elements[1].color = light
        ramp.color_ramp.elements[0].position = 0.28
        ramp.color_ramp.elements[1].position = 0.78
        links.new(noise.outputs['Fac'], ramp.inputs['Fac'])
        links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])


def smooth(obj):
    if obj.type == 'MESH':
        for p in obj.data.polygons:
            p.use_smooth = True
    return obj


def bevel(obj, width=0.04, segments=3):
    mod = obj.modifiers.new('Micro bevel', 'BEVEL')
    mod.width = width
    mod.segments = segments
    mod.limit_method = 'ANGLE'
    bpy.context.view_layer.objects.active = obj
    try:
        bpy.ops.object.modifier_apply(modifier=mod.name)
    except Exception:
        pass
    return obj


def empty(name, parent=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    if parent:
        obj.parent = parent
    return obj


def add_uv_sphere(name, loc, scale, mat, parent=None, segments=64, rings=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    smooth(obj)
    obj.data.materials.append(mat)
    if parent:
        obj.parent = parent
    return obj


def add_cylinder(name, radius, depth, loc, mat, parent=None, vertices=96, bevel_width=0.03):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    obj = bpy.context.object
    obj.name = name
    smooth(obj)
    if bevel_width:
        bevel(obj, bevel_width, 4)
    obj.data.materials.append(mat)
    if parent:
        obj.parent = parent
    return obj


def lathe_shell(name, profile, thickness, mat, parent=None, segments=128):
    # profile: list[(z, outer_radius)] bottom->top. Creates a true-walled open bowl with a closed lip.
    verts = []
    faces = []
    n = len(profile)
    inner = [(z, max(0.04, r - thickness)) for z, r in profile]
    for ring_profile in (profile, inner):
        for z, r in ring_profile:
            for s in range(segments):
                a = 2 * math.pi * s / segments
                verts.append((r * math.cos(a), r * math.sin(a), z))
    def idx(layer, ring, s):
        return layer * n * segments + ring * segments + (s % segments)
    for layer in (0, 1):
        for r in range(n - 1):
            for s in range(segments):
                a = idx(layer, r, s)
                b = idx(layer, r, s + 1)
                c = idx(layer, r + 1, s + 1)
                d = idx(layer, r + 1, s)
                faces.append((a, b, c, d) if layer == 0 else (d, c, b, a))
    # bottom annulus and top lip annulus
    for ring in (0, n - 1):
        for s in range(segments):
            o0 = idx(0, ring, s)
            o1 = idx(0, ring, s + 1)
            i1 = idx(1, ring, s + 1)
            i0 = idx(1, ring, s)
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


def lathe_solid(name, profile, mat, parent=None, segments=128):
    # closed axisymmetric volume with bottom/top caps.
    verts = []
    faces = []
    n = len(profile)
    for z, r in profile:
        for s in range(segments):
            a = 2 * math.pi * s / segments
            verts.append((r * math.cos(a), r * math.sin(a), z))
    bottom_center = len(verts)
    verts.append((0, 0, profile[0][0]))
    top_center = len(verts)
    verts.append((0, 0, profile[-1][0]))
    def idx(ring, s):
        return ring * segments + (s % segments)
    for r in range(n - 1):
        for s in range(segments):
            faces.append((idx(r, s), idx(r, s + 1), idx(r + 1, s + 1), idx(r + 1, s)))
    for s in range(segments):
        faces.append((bottom_center, idx(0, s + 1), idx(0, s)))
        faces.append((top_center, idx(n - 1, s), idx(n - 1, s + 1)))
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


def curve_tube(name, points, radius, mat, parent=None, resolution=5):
    curve = bpy.data.curves.new(name + '_Curve', 'CURVE')
    curve.dimensions = '3D'
    curve.resolution_u = 2
    curve.bevel_depth = radius
    curve.bevel_resolution = resolution
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


def sector_prism(name, r_inner, r_outer, angle_start, angle_end, depth, mat, parent=None, segments=24):
    # Sector in local X/Z plane, extruded along Y.
    verts, faces = [], []
    angles = [math.radians(angle_start + (angle_end - angle_start) * i / segments) for i in range(segments + 1)]
    radii = [r_inner, r_outer]
    for y in (-depth / 2, depth / 2):
        for r in radii:
            for a in angles:
                verts.append((r * math.cos(a), y, r * math.sin(a)))
    stride = segments + 1
    def vid(side, ring, i):
        return side * 2 * stride + ring * stride + i
    # front/back sector strips
    for side in (0, 1):
        for i in range(segments):
            a, b = vid(side, 0, i), vid(side, 0, i+1)
            c, d = vid(side, 1, i+1), vid(side, 1, i)
            faces.append((a,b,c,d) if side == 1 else (d,c,b,a))
    # outer/inner curved surfaces
    for ring in (0,1):
        for i in range(segments):
            a=vid(0,ring,i); b=vid(0,ring,i+1); c=vid(1,ring,i+1); d=vid(1,ring,i)
            faces.append((a,d,c,b) if ring==1 else (a,b,c,d))
    # radial sides
    for i in (0, segments):
        faces.append((vid(0,0,i), vid(1,0,i), vid(1,1,i), vid(0,1,i)))
    mesh = bpy.data.meshes.new(name + '_Mesh')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    smooth(obj)
    bevel(obj, 0.018, 3)
    obj.data.materials.append(mat)
    if parent:
        obj.parent = parent
    return obj


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def add_area(name, loc, energy, size, color, target=(0,0,2.1), shape='DISK'):
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

# ---------- scene ----------
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
    pass

scene = bpy.context.scene
try:
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
except Exception:
    scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 720
scene.render.resolution_y = 960
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.film_transparent = False
scene.render.resolution_percentage = 100
try:
    scene.view_settings.look = 'AgX - Medium High Contrast'
except Exception:
    pass
scene.world.color = (0.003, 0.005, 0.012)

# ---------- materials ----------
glass_mat = material('M_Glass', srgb('#eaf7ff'), roughness=0.055, transmission=1.0, ior=1.45, coat=0.12, alpha=0.22)
ice_mat = material('M_Ice', srgb('#d9f5ff'), roughness=0.13, transmission=0.9, ior=1.31, coat=0.08, alpha=0.38)
water_mat = material('M_Condensation', srgb('#e5f9ff'), roughness=0.08, transmission=0.95, ior=1.333, coat=0.08, alpha=0.34)
liquid_mat = material('M_PinaLiquid', srgb('#f3d995'), roughness=0.31, metallic=0.0, coat=0.18)
foam_mat = material('M_Foam', srgb('#fff2cf'), roughness=0.57, coat=0.06)
straw_mat = material('M_Straw', srgb('#151317'), roughness=0.22, metallic=0.72, coat=0.25)
straw_tip_mat = material('M_StrawAccent', srgb('#d2a45a'), roughness=0.22, metallic=0.82, coat=0.3)
pine_mat = material('M_PineappleFlesh', srgb('#ffc23c'), roughness=0.46, coat=0.05)
add_noise_to_material(pine_mat, scale=8.0, detail=5.0, strength=0.16, dark=srgb('#d98a18'), light=srgb('#ffd85a'))
rind_mat = material('M_PineappleRind', srgb('#6a7c26'), roughness=0.62)
add_noise_to_material(rind_mat, scale=10.0, detail=4.0, strength=0.28, dark=srgb('#344815'), light=srgb('#9b8b35'))
fiber_mat = material('M_PineappleFiber', srgb('#d8891f'), roughness=0.5)
cherry_mat = material('M_Cherry', srgb('#780d18'), roughness=0.18, coat=0.48)
stem_mat = material('M_CherryStem', srgb('#4b3f19'), roughness=0.55)

# ---------- product hierarchy ----------
root = empty('PinaColada_Hero_v4')
glass = empty('Glass', root)
liquid = empty('Liquid', root)
foam = empty('Foam', root)
straw = empty('Straw', root)
pineapple = empty('Pineapple', root)
cherry = empty('Cherry', root)
condensation = empty('Condensation', root)

# ---------- glass ----------
profile = [
    (1.16, 0.31),
    (1.30, 0.48),
    (1.54, 0.78),
    (1.88, 0.99),
    (2.25, 1.10),
    (2.60, 1.06),
    (2.92, 0.96),
    (3.25, 0.98),
    (3.48, 1.055),
    (3.54, 1.075),
]
lathe_shell('Glass_Bowl', profile, 0.055, glass_mat, glass)
add_cylinder('Glass_Stem', 0.135, 0.86, (0,0,0.68), glass_mat, glass, bevel_width=0.025)
add_uv_sphere('Glass_Knuckle', (0,0,1.10), (0.245,0.245,0.20), glass_mat, glass, segments=64, rings=32)
foot = add_cylinder('Glass_Foot', 0.72, 0.11, (0,0,0.095), glass_mat, glass, bevel_width=0.055)
foot.scale.z = 0.78

# ---------- liquid ----------
liq_profile = [
    (1.25, 0.27),
    (1.38, 0.43),
    (1.59, 0.72),
    (1.91, 0.93),
    (2.25, 1.035),
    (2.58, 1.00),
    (2.90, 0.90),
    (3.16, 0.91),
]
lathe_solid('Liquid_Body', liq_profile, liquid_mat, liquid)
add_uv_sphere('Liquid_Meniscus', (0,0,3.165), (0.905,0.905,0.055), liquid_mat, liquid, segments=96, rings=24)

# ---------- ice ----------
ice_positions = [
    (-0.38,-0.12,2.34, (0.50,0.43,0.44)),
    (0.33,0.10,2.46, (0.47,0.41,0.48)),
    (-0.13,0.35,2.72, (0.43,0.48,0.40)),
    (0.43,-0.28,2.84, (0.41,0.47,0.43)),
    (-0.47,-0.23,2.96, (0.38,0.44,0.39)),
    (0.05,-0.02,3.03, (0.44,0.40,0.42)),
]
for idx, (x,y,z,scale) in enumerate(ice_positions, 1):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x,y,z), rotation=(random.uniform(-.7,.7),random.uniform(-.7,.7),random.uniform(-.7,.7)))
    obj = bpy.context.object
    obj.name = f'Ice_{idx:02d}'
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    # organic imperfection
    for v in obj.data.vertices:
        v.co += Vector((random.uniform(-.035,.035), random.uniform(-.035,.035), random.uniform(-.035,.035)))
    bevel(obj, 0.10, 5)
    smooth(obj)
    obj.data.materials.append(ice_mat)
    obj.parent = root

# ---------- foam ----------
add_uv_sphere('Foam_Cap', (0,0,3.22), (0.94,0.94,0.13), foam_mat, foam, segments=96, rings=28)
for i in range(22):
    a = random.uniform(0, math.tau)
    r = random.uniform(0.10, 0.82)
    z = 3.25 + random.uniform(-0.015,0.07)
    s = random.uniform(0.035,0.075)
    add_uv_sphere(f'Foam_Bubble_{i+1:02d}', (math.cos(a)*r,math.sin(a)*r,z), (s,s,s*0.62), foam_mat, foam, segments=24, rings=12)

# ---------- straw ----------
curve_tube('Straw_Main', [(0.34,0.10,2.25),(0.40,0.08,3.30),(0.54,0.02,4.16)], 0.058, straw_mat, straw, resolution=6)
curve_tube('Straw_Accent', [(0.52,0.02,3.94),(0.55,0.02,4.17)], 0.0615, straw_tip_mat, straw, resolution=6)

# ---------- pineapple garnish ----------
# Build as a dimensional sector wedge and a separate rind, then place as a group on the rim.
pine_geo = sector_prism('Pineapple_Flesh', 0.04, 0.67, 18, 102, 0.19, pine_mat, pineapple, 30)
rind_geo = sector_prism('Pineapple_Rind', 0.67, 0.79, 18, 102, 0.205, rind_mat, pineapple, 30)
# Local fibers as thin tubes across the wedge.
for i, ang in enumerate((36,55,75),1):
    a = math.radians(ang)
    p0 = (0.12*math.cos(a), -0.105, 0.12*math.sin(a))
    p1 = (0.62*math.cos(a), -0.105, 0.62*math.sin(a))
    curve_tube(f'Pineapple_Fiber_{i:02d}', [p0,p1], 0.009, fiber_mat, pineapple, resolution=2)
# Transform the entire garnish so all child geometry stays coherent.
pineapple.location = (0.78, 0.02, 3.50)
pineapple.rotation_euler = (math.radians(78), math.radians(-11), math.radians(25))

# ---------- cherry ----------
add_uv_sphere('Cherry_Fruit', (0.54,-0.38,3.45), (0.205,0.195,0.19), cherry_mat, cherry, segments=64, rings=32)
curve_tube('Cherry_Stem', [(0.55,-0.38,3.59),(0.60,-0.35,3.82),(0.72,-0.30,3.95)], 0.017, stem_mat, cherry, resolution=4)

# ---------- condensation ----------
# Separate hierarchy, joined geometry to keep runtime draw cost sane.
drops = []
for i in range(34):
    z = random.uniform(1.55,3.35)
    # approximate outer radius by interpolation from nearest profile point
    nearest = min(profile, key=lambda p: abs(p[0]-z))
    rr = nearest[1] + 0.025
    a = random.uniform(math.radians(-76), math.radians(76))
    x, y = rr*math.sin(a), -rr*math.cos(a)
    s = random.uniform(0.018,0.055)
    obj = add_uv_sphere(f'_drop_{i:02d}', (x,y,z), (s,s*0.42,s*1.35), water_mat, None, segments=20, rings=10)
    # orient approximately to tangent/front surface
    obj.rotation_euler.z = -a
    drops.append(obj)
for o in drops:
    o.select_set(True)
bpy.context.view_layer.objects.active = drops[0]
bpy.ops.object.join()
drop_obj = bpy.context.object
drop_obj.name = 'Condensation_Droplets'
drop_obj.parent = condensation

# ---------- studio ----------
# Dark premium table surface.
table_mat = material('M_Table', srgb('#141318'), roughness=0.22, metallic=0.05, coat=0.16)
bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=4.6, depth=0.18, location=(0,0,-0.07))
table = bpy.context.object
table.name = 'Studio_Table'
bevel(table,0.10,5)
table.data.materials.append(table_mat)

# Backdrop plane for controlled reflections and contrast.
back_mat = material('M_Backdrop', srgb('#05070d'), roughness=0.68)
bpy.ops.mesh.primitive_plane_add(size=22, location=(0,3.6,5.4), rotation=(math.radians(90),0,0))
back = bpy.context.object
back.name = 'Studio_Backdrop'
back.data.materials.append(back_mat)

# Product photography lighting: broad soft sources, warm/cool separation.
add_area('Key_Softbox', (-4.4,-5.0,5.4), 920, 4.0, srgb('#ffd6a0'), (0,0,2.2), 'RECTANGLE')
add_area('Rim_Cool', (4.8,1.1,5.2), 1180, 3.2, srgb('#a8c8ff'), (0,0,2.35), 'RECTANGLE')
add_area('Top_Strip', (-0.5,0.4,7.5), 1050, 3.0, srgb('#fff1d5'), (0,0,2.2), 'RECTANGLE')
add_area('Front_Fill', (1.8,-5.8,2.3), 390, 2.8, srgb('#b6c7ff'), (0,0,2.15), 'RECTANGLE')
add_area('Garnish_Kicker', (3.0,-1.2,4.7), 420, 1.6, srgb('#ffc874'), (0.65,0,3.55), 'RECTANGLE')

# Camera
cam_data = bpy.data.cameras.new('HeroCamera')
cam = bpy.data.objects.new('HeroCamera', cam_data)
bpy.context.collection.objects.link(cam)
scene.camera = cam
cam.data.lens = 68
cam.data.sensor_width = 36

# ---------- render QA ----------
def render_view(filename, location, target=(0,0,2.05), lens=68):
    cam.location = location
    cam.data.lens = lens
    look_at(cam,target)
    scene.render.filepath = os.path.join(QA_DIR, filename)
    bpy.ops.render.render(write_still=True)

render_view('hero_front.png', (4.65,-7.2,3.55), (0,0,2.05), 72)
render_view('hero_left45.png', (-4.85,-6.7,3.55), (0,0,2.08), 72)
render_view('hero_right45.png', (5.0,-6.5,3.65), (0,0,2.10), 72)
render_view('hero_side.png', (7.5,-0.25,3.6), (0,0,2.10), 76)
render_view('hero_top.png', (0,-0.15,9.0), (0,0,2.45), 74)

# ---------- export ----------
# Hide studio-only objects for GLB export.
table.hide_viewport = True
table.hide_render = True
back.hide_viewport = True
back.hide_render = True
for obj in [o for o in bpy.context.scene.objects if o.type in {'LIGHT','CAMERA'}]:
    obj.hide_viewport = True
    obj.hide_render = True

# Export selected product hierarchy only.
bpy.ops.object.select_all(action='DESELECT')
for obj in bpy.context.scene.objects:
    if obj == root or obj.parent == root or (obj.parent and obj.parent.parent == root):
        obj.select_set(True)
root.select_set(True)
bpy.context.view_layer.objects.active = root

out_glb = os.path.join(OUT_DIR, 'pina-colada-hero-v4.glb')
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    use_selection=True,
    export_yup=True,
    export_apply=True,
    export_materials='EXPORT',
    export_normals=True,
    export_tangents=True,
    export_cameras=False,
    export_lights=False,
)

# Save native authoring file for future non-destructive editing.
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT_DIR, 'pina-colada-hero-v4.blend'))

print('V4_DONE', out_glb)
print('GLB_BYTES', os.path.getsize(out_glb))
print('QA_DIR', QA_DIR)
