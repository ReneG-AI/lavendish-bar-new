import json, math, struct
from pathlib import Path
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/3d/pina-colada-v3.glb'
OUT.parent.mkdir(parents=True, exist_ok=True)
RNG = np.random.default_rng(2709)

def pbr(name, hexcolor, rough=.5, metal=0., alpha=1.):
    h=hexcolor.lstrip('#'); rgb=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    return PBRMaterial(name=name, baseColorFactor=rgb+[alpha], metallicFactor=metal,
                       roughnessFactor=rough, alphaMode='BLEND' if alpha<.999 else 'OPAQUE', doubleSided=True)

def assign(mesh, mat):
    mesh.visual=trimesh.visual.TextureVisuals(material=mat); return mesh

def rx(a): return trimesh.transformations.rotation_matrix(a,[1,0,0])
def ry(a): return trimesh.transformations.rotation_matrix(a,[0,1,0])
def rz(a): return trimesh.transformations.rotation_matrix(a,[0,0,1])
def T(x,y,z):
    m=np.eye(4);m[:3,3]=[x,y,z];return m

def revolve_y(profile, sections=160):
    m=trimesh.creation.revolve(np.asarray(profile,float),sections=sections)
    m.apply_transform(rx(-math.pi/2)); return m

def add_mesh(scene, mesh, node, parent='world'):
    scene.add_geometry(mesh, geom_name=node, node_name=node, parent_node_name=parent)

def add_group(scene, name, transform=None, parent='world'):
    scene.graph.update(frame_from=parent, frame_to=name, matrix=np.eye(4) if transform is None else transform)

def cylinder_between(p0,p1,radius,sections=48,mat=None):
    p0=np.asarray(p0,float);p1=np.asarray(p1,float);v=p1-p0;L=np.linalg.norm(v)
    m=trimesh.creation.cylinder(radius=radius,height=L,sections=sections)
    A=trimesh.geometry.align_vectors([0,0,1],v/L)
    if A is None: A=np.eye(4)
    m.apply_transform(A);m.apply_translation((p0+p1)/2)
    if mat: assign(m,mat)
    return m

def sector_prism_xy(r0,r1,a0,a1,depth,segments=28):
    ang=np.linspace(a0,a1,segments+1); poly=[]
    for a in ang: poly.append([r1*math.cos(a),r1*math.sin(a)])
    for a in ang[::-1]: poly.append([r0*math.cos(a),r0*math.sin(a)])
    n=len(poly); verts=[]
    for z in (-depth/2, depth/2): verts += [[x,y,z] for x,y in poly]
    faces=[]; count=segments+1
    for j in range(segments):
        o0=j;o1=j+1;i0=(2*count-1)-j;i1=(2*count-2)-j
        faces += [[o0,i1,o1],[o0,i0,i1]]
        faces += [[o0+n,o1+n,i1+n],[o0+n,i1+n,i0+n]]
    for j in range(n):
        k=(j+1)%n
        faces += [[j,k,k+n],[j,k+n,j+n]]
    return trimesh.Trimesh(vertices=np.asarray(verts,float),faces=np.asarray(faces,int),process=True)

def superellipsoid(a,b,c,eps=.42,nu=18,nv=28):
    us=np.linspace(-math.pi/2,math.pi/2,nu)
    vs=np.linspace(0,2*math.pi,nv,endpoint=False)
    verts=[]
    sp=lambda x,e: math.copysign(abs(x)**e,x) if abs(x)>1e-10 else 0.0
    for u in us:
        cu,su=math.cos(u),math.sin(u)
        for v in vs:
            cv,sv=math.cos(v),math.sin(v)
            verts.append([a*sp(cu,eps)*sp(cv,eps), b*sp(su,eps), c*sp(cu,eps)*sp(sv,eps)])
    faces=[]
    for i in range(nu-1):
        for j in range(nv):
            j2=(j+1)%nv
            a0=i*nv+j;b0=i*nv+j2;c0=(i+1)*nv+j;d0=(i+1)*nv+j2
            faces += [[a0,c0,d0],[a0,d0,b0]]
    return trimesh.Trimesh(vertices=np.asarray(verts,float),faces=np.asarray(faces,int),process=True)

M_GLASS=pbr('M_Glass','#f5fbff',.055,0,.16)
M_LIQ=pbr('M_Liquid','#f2dfb4',.30,0,1)
M_FOAM=pbr('M_Foam','#fff7e5',.72,0,1)
M_ICE=pbr('M_Ice','#dff5ff',.14,0,.38)
M_STRAW=pbr('M_Straw','#241626',.24,0,1)
M_GOLD=pbr('M_StrawAccent','#c99f55',.22,.65,1)
M_PIN=pbr('M_Pineapple','#efbe55',.50,0,1)
M_RIND=pbr('M_PineappleRind','#7c5526',.68,0,1)
M_CHERRY=pbr('M_Cherry','#9e1025',.18,0,1)
M_STEM=pbr('M_CherryStem','#355129',.60,0,1)
M_COND=pbr('M_Condensation','#f6fcff',.04,0,.24)

S=trimesh.Scene()
add_group(S,'Glass')
outer=[(.275,.58),(.34,.64),(.47,.78),(.61,1.02),(.70,1.36),(.72,1.68),(.68,1.98),(.66,2.24),(.72,2.55),(.79,2.82),(.82,2.91)]
inner=[(.765,2.875),(.70,2.57),(.635,2.25),(.65,1.98),(.685,1.68),(.66,1.38),(.58,1.06),(.44,.82),(.31,.68)]
body=assign(revolve_y(outer+inner[::-1],192),M_GLASS);add_mesh(S,body,'Glass_Bowl','Glass')
stem=assign(trimesh.creation.cylinder(radius=.085,height=.48,sections=64),M_GLASS);stem.apply_transform(rx(-math.pi/2));stem.apply_translation([0,.35,0]);add_mesh(S,stem,'Glass_Stem','Glass')
foot_profile=[(0,.02),(.62,.02),(.70,.055),(.63,.10),(0,.11)]
foot=assign(revolve_y(foot_profile,160),M_GLASS);add_mesh(S,foot,'Glass_Foot','Glass')
knob=assign(trimesh.creation.uv_sphere(radius=.15,count=[40,20]),M_GLASS);knob.apply_scale([1,.75,1]);knob.apply_translation([0,.59,0]);add_mesh(S,knob,'Glass_Knuckle','Glass')

add_group(S,'Liquid',T(0,.70,0))
liq_profile=[(0,0),(.30,0),(.43,.12),(.57,.36),(.64,.68),(.66,.98),(.62,1.28),(.61,1.52),(.665,1.75),(0,1.75)]
liq=assign(revolve_y(liq_profile,160),M_LIQ);add_mesh(S,liq,'Liquid_Body','Liquid')
men=assign(revolve_y([(0,1.73),(.66,1.73),(.64,1.80),(0,1.82)],128),M_LIQ);add_mesh(S,men,'Liquid_Meniscus','Liquid')

add_group(S,'Foam')
foam=assign(revolve_y([(0,2.42),(.66,2.42),(.67,2.47),(.61,2.53),(.42,2.57),(.20,2.59),(0,2.585)],160),M_FOAM);add_mesh(S,foam,'Foam_Cap','Foam')
for i,(x,z,r) in enumerate([(-.27,.03,.075),(-.03,.05,.058),(.22,-.01,.065),(.41,.02,.045)]):
    b=assign(trimesh.creation.icosphere(subdivisions=2,radius=r),M_FOAM);b.apply_translation([x,2.54,z]);add_mesh(S,b,f'Foam_Bubble_{i+1:02d}','Foam')

icepos=[(-.24,2.18,.08),(.22,2.15,-.11),(-.07,1.96,-.18),(.28,1.89,.14),(-.31,1.74,.13),(.07,1.62,-.13),(.27,1.52,.02)]
for i,pos in enumerate(icepos,1):
    m=superellipsoid(RNG.uniform(.21,.28),RNG.uniform(.16,.22),RNG.uniform(.19,.27),eps=RNG.uniform(.34,.48))
    m.vertices += m.vertex_normals * RNG.normal(0,.008,(len(m.vertices),1))
    m.apply_transform(rx(RNG.uniform(-.55,.55))@ry(RNG.uniform(-.65,.65))@rz(RNG.uniform(-.55,.55)))
    m.apply_translation(pos);assign(m,M_ICE);add_mesh(S,m,f'Ice_{i:02d}')

add_group(S,'Straw')
main=cylinder_between([.24,2.28,.10],[.54,3.66,.12],.032,56,M_STRAW);add_mesh(S,main,'Straw_Main','Straw')
ring=cylinder_between([.515,3.545,.12],[.535,3.635,.12],.038,56,M_GOLD);add_mesh(S,ring,'Straw_GoldTip','Straw')

add_group(S,'Pineapple',T(-.58,2.73,.16)@rz(math.radians(-5))@ry(math.radians(-5)))
fruit=assign(sector_prism_xy(.08,.49,math.radians(205),math.radians(300),.11,28),M_PIN);add_mesh(S,fruit,'Pineapple_Fruit','Pineapple')
rind=assign(sector_prism_xy(.49,.56,math.radians(205),math.radians(300),.12,28),M_RIND);add_mesh(S,rind,'Pineapple_Rind','Pineapple')
for j,a in enumerate(np.linspace(math.radians(222),math.radians(287),3)):
    p0=[.22*math.cos(a),.22*math.sin(a),-.071]; p1=[.45*math.cos(a),.45*math.sin(a),-.071]
    g=cylinder_between(p0,p1,.009,16,M_RIND);add_mesh(S,g,f'Pineapple_Groove_{j+1:02d}','Pineapple')

add_group(S,'Cherry')
ch=assign(trimesh.creation.uv_sphere(radius=.145,count=[40,22]),M_CHERRY);ch.apply_scale([1.0,.96,1.0]);ch.apply_translation([-.22,2.59,.40]);add_mesh(S,ch,'Cherry_Fruit','Cherry')
st=cylinder_between([-.20,2.71,.40],[-.30,3.00,.39],.012,24,M_STEM);add_mesh(S,st,'Cherry_Stem','Cherry')

add_group(S,'Condensation')
for i in range(30):
    y=RNG.uniform(.82,2.48)
    ys=np.array([p[1] for p in outer]);rs=np.array([p[0] for p in outer]);order=np.argsort(ys)
    rr=np.interp(y,ys[order],rs[order])
    a=RNG.uniform(0,2*math.pi);r=RNG.uniform(.007,.020)
    d=assign(trimesh.creation.icosphere(subdivisions=1,radius=r),M_COND);d.apply_scale([.85,1.25,.85]);d.apply_translation([(rr+.012)*math.cos(a),y,(rr+.012)*math.sin(a)]);add_mesh(S,d,f'Condensation_{i+1:02d}','Condensation')

raw=S.export(file_type='glb')

def chunks(data):
    magic,ver,total=struct.unpack_from('<III',data,0);assert magic==0x46546C67 and ver==2
    o=12;out=[]
    while o<total:
        ln,typ=struct.unpack_from('<II',data,o);o+=8;out.append([typ,data[o:o+ln]]);o+=ln
    return out

def pack(cs):
    body=b''
    for typ,payload in cs:
        pad=(4-len(payload)%4)%4;payload += (b' '*pad if typ==0x4E4F534A else b'\0'*pad)
        body += struct.pack('<II',len(payload),typ)+payload
    return struct.pack('<III',0x46546C67,2,12+len(body))+body

cs=chunks(raw);ji=next(i for i,c in enumerate(cs) if c[0]==0x4E4F534A);doc=json.loads(cs[ji][1].decode().rstrip(' \0'))
used=set(doc.get('extensionsUsed',[]));used.update(['KHR_materials_transmission','KHR_materials_ior','KHR_materials_volume','KHR_materials_clearcoat']);doc['extensionsUsed']=sorted(used)
for m in doc.get('materials',[]):
    n=m.get('name','');e=m.setdefault('extensions',{})
    if n=='M_Glass':
        e['KHR_materials_transmission']={'transmissionFactor':.98};e['KHR_materials_ior']={'ior':1.45};e['KHR_materials_volume']={'thicknessFactor':.055,'attenuationDistance':8,'attenuationColor':[.97,.995,1]};m['alphaMode']='BLEND';m['doubleSided']=True
    elif n=='M_Ice':
        e['KHR_materials_transmission']={'transmissionFactor':.76};e['KHR_materials_ior']={'ior':1.31};e['KHR_materials_volume']={'thicknessFactor':.13,'attenuationDistance':1.4,'attenuationColor':[.82,.95,1]};m['alphaMode']='BLEND';m['doubleSided']=True
    elif n=='M_Condensation':
        e['KHR_materials_transmission']={'transmissionFactor':.92};e['KHR_materials_ior']={'ior':1.333};e['KHR_materials_volume']={'thicknessFactor':.015,'attenuationDistance':2,'attenuationColor':[.96,.99,1]};m['alphaMode']='BLEND';m['doubleSided']=True
    elif n=='M_Liquid': e['KHR_materials_clearcoat']={'clearcoatFactor':.20,'clearcoatRoughnessFactor':.20}
    elif n=='M_Cherry': e['KHR_materials_clearcoat']={'clearcoatFactor':.72,'clearcoatRoughnessFactor':.12}
    elif n=='M_StrawAccent': e['KHR_materials_clearcoat']={'clearcoatFactor':.55,'clearcoatRoughnessFactor':.18}
cs[ji][1]=json.dumps(doc,separators=(',',':')).encode();patched=pack(cs);OUT.write_bytes(patched)
print('GLB',len(patched),'bytes')
print('triangles',sum(len(g.faces) for g in S.geometry.values()))
print('semantic nodes',[n for n in S.graph.nodes if n in ['Glass','Liquid','Foam','Straw','Pineapple','Cherry','Condensation'] or n.startswith('Ice_')])
