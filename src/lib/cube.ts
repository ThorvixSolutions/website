/*
 * Hero object: eight glossy rounded blocks forming a cube, raymarched in a single fragment shader.
 * Every 7.5s one block flies out, flashes orange and snaps back in ("module incoming → merging → shipped").
 * Drag to spin, hover to spread the blocks, click for a burst; scrolling the hero spreads them too.
 */

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `precision highp float;
uniform vec2 uRes;uniform vec3 uP[8];uniform mat3 uR[8];uniform float uS[8];uniform vec3 uAcc;uniform float uFlash;uniform float uBound;uniform float uShip;
float sdRB(vec3 p,vec3 b,float r){vec3 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
vec2 map(vec3 p){float d=1e5;float id=-1.;for(int i=0;i<8;i++){if(uS[i]<0.01)continue;vec3 q=uR[i]*(p-uP[i]);float s=uS[i];float di=sdRB(q/s,vec3(.5),.1)*s;if(di<d){d=di;id=float(i);}}return vec2(d,id);}
vec3 nrm(vec3 p){vec2 e=vec2(.0015,-.0015);return normalize(e.xyy*map(p+e.xyy).x+e.yyx*map(p+e.yyx).x+e.yxy*map(p+e.yxy).x+e.xxx*map(p+e.xxx).x);}
vec3 env(vec3 r){vec3 c=mix(vec3(.006,.006,.008),vec3(.03,.028,.027),smoothstep(-.4,.9,r.y));
c+=vec3(1.)*2.2*smoothstep(.88,.985,dot(r,normalize(vec3(-.55,.75,.4))));
c+=vec3(1.,.96,.92)*1.1*exp(-pow((r.x-.78)*16.,2.))*smoothstep(-.1,.6,r.y);
c+=vec3(1.)*.5*exp(-pow((r.y-.32)*22.,2.))*smoothstep(-.6,.2,-r.x);
c+=uAcc*1.6*smoothstep(.6,.98,dot(r,normalize(vec3(.55,-.55,-.35))));
c+=uAcc*.18*smoothstep(.5,1.,-r.y);return c;}
void main(){vec2 uv=(gl_FragCoord.xy*2.-uRes)/uRes.y;vec3 ro=vec3(0.,0.,6.4);vec3 rd=normalize(vec3(uv,-2.35));
float b=dot(ro,rd);float c=dot(ro,ro)-uBound*uBound;float h=b*b-c;if(h<0.){gl_FragColor=vec4(0.);return;}
float t=max(0.,-b-sqrt(h));float tmax=-b+sqrt(h);vec2 m=vec2(1.,-1.);bool hit=false;
for(int i=0;i<72;i++){m=map(ro+rd*t);if(m.x<.0012){hit=true;break;}t+=m.x;if(t>tmax)break;}
if(!hit){gl_FragColor=vec4(0.);return;}
vec3 p=ro+rd*t;vec3 n=nrm(p);vec3 v=-rd;float ndv=max(dot(n,v),0.);float f=.04+.96*pow(1.-ndv,5.);vec3 r=reflect(rd,n);
vec3 L=normalize(vec3(-.45,.7,.6));float dif=max(dot(n,L),0.);float ao=.55+.45*clamp(map(p+n*.16).x/.16,0.,1.);
bool ship=abs(m.y-uShip)<.5;vec3 base=ship?uAcc*.62:vec3(.006);
vec3 col=base*(.25+.9*dif)+env(r)*mix(ship?.12:.045,1.,f)+vec3(1.)*pow(max(dot(r,L),0.),60.)*(ship?.6:.9);
if(ship)col+=uAcc*(.18+uFlash*1.1)*(.55+.45*dif);
col+=uAcc*.22*pow(1.-ndv,4.)*smoothstep(-.3,.7,n.x-n.y*.4);
col*=ao;col=1.-exp(-col*1.25);col=pow(col,vec3(.4545));gl_FragColor=vec4(col,1.);}`;

type M3 = number[];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const mul = (a: M3, b: M3): M3 => {
  const o = Array(9).fill(0);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
  return o;
};
const rotX = (a: number): M3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [1, 0, 0, 0, c, -s, 0, s, c];
};
const rotY = (a: number): M3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [c, 0, s, 0, 1, 0, -s, 0, c];
};
const rotZ = (a: number): M3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [c, -s, 0, s, c, 0, 0, 0, 1];
};
const apply = (m: M3, v: number[]) => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
];
const axisAngle = ([x, y, z]: number[], a: number): M3 => {
  const c = Math.cos(a), s = Math.sin(a), t = 1 - c;
  return [t * x * x + c, t * x * y - s * z, t * x * z + s * y, t * x * y + s * z, t * y * y + c, t * y * z - s * x, t * x * z - s * y, t * y * z + s * x, t * z * z + c];
};
const easeOutBack = (n: number) => {
  const t = clamp01(n);
  return 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
};
const easeInCubic = (n: number) => {
  const t = clamp01(n);
  return t * t * t;
};

/** Reads a CSS color (e.g. var(--cg-brass)) as "r,g,b". */
export function resolveRgb(host: HTMLElement, color: string, fallback: string) {
  const probe = document.createElement("i");
  probe.style.display = "none";
  probe.style.color = color;
  host.appendChild(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  const m = c.match(/(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)/);
  return m ? `${Math.round(+m[1])},${Math.round(+m[2])},${Math.round(+m[3])}` : fallback;
}

type Options = {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  accent: string;
  reduced: boolean;
  phone: boolean;
  /**
   * hero – blocks spread apart as the page scrolls away from the top.
   * cta  – blocks start apart and assemble as the section scrolls into view; `focus` (0–1) spreads them again.
   */
  mode?: "hero" | "cta";
  /** hero: true once the entrance has played; before that the blocks sit spread apart */
  isIn?: () => boolean;
  /** cta: 1 while the email form is hovered or focused */
  focus?: () => number;
  /** hero: 0 incoming, 1 merging, 2 shipped */
  onPhase?: (phase: number) => void;
  onReady: () => void;
};

export function startCube({ canvas, host, accent, reduced, phone, mode = "hero", isIn = () => true, focus = () => 0, onPhase, onReady }: Options) {
  const cta = mode === "cta";
  const gl = (canvas.getContext("webgl", { antialias: false, premultipliedAlpha: true, alpha: true, powerPreference: "high-performance" }) ||
    canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  if (!gl) return () => {};

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s;
    console.warn(gl.getShaderInfoLog(s));
    return null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return () => {};
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => {};
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aLoc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(aLoc);
  gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = u("uRes"), uAcc = u("uAcc"), uFlash = u("uFlash"), uBound = u("uBound"), uShip = u("uShip"), uP = u("uP"), uR = u("uR"), uS = u("uS");
  const acc = accent.split(",").map((c) => (+c / 255) ** 2.2);
  gl.uniform3f(uAcc, acc[0], acc[1], acc[2]);

  // the eight corner blocks and a random spin axis for each
  const half = 0.56;
  const home = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [(i & 1 ? 1 : -1) * half, (i & 2 ? 1 : -1) * half, (i & 4 ? 1 : -1) * half]);
  const axes = home.map((_, i) => {
    const v = [Math.sin(i * 2.1 + 1), Math.cos(i * 1.7), Math.sin(i * 3.3 + 2)];
    const l = Math.hypot(v[0], v[1], v[2]);
    return v.map((x) => x / l);
  });

  let W = 0, H = 0, res = 0.8, visible = true, running = true, raf = 0, slow = 0, readySent = false;
  const resize = () => {
    const r = host.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width * res));
    H = Math.max(1, Math.round(r.height * res));
    canvas.width = W;
    canvas.height = H;
    gl.viewport(0, 0, W, H);
    gl.uniform2f(uRes, W, H);
  };
  const dpr = window.devicePixelRatio || 1;
  res = cta ? Math.min(1, (phone ? 1.2 : 1) / Math.max(1, dpr * 0.75)) : Math.min(1, (phone ? 1.3 : 1.05) / Math.max(1, dpr * 0.75));
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
  });
  io.observe(host);

  let ship = 7, lastCycle = 99, yaw = 0.7, pitch = -0.42, spin = 0, dragging = false;
  let px = 0, py = 0, hover = 0, hoverTarget = 0, burst = 0, mx = 0, my = 0, scroll = 0, spread = 0.9;
  const t0 = performance.now();
  let last = t0, phase = -1;

  const down = (e: PointerEvent) => {
    dragging = true;
    px = e.clientX;
    py = e.clientY;
    spin = 0;
    try {
      host.setPointerCapture(e.pointerId);
    } catch {}
  };
  const move = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
    hoverTarget = e.pointerType === "mouse" ? clamp01(1 - Math.hypot(mx, my) / 0.42) : 0;
    if (dragging) {
      const dx = e.clientX - px, dy = e.clientY - py;
      px = e.clientX;
      py = e.clientY;
      yaw += dx * 0.009;
      pitch = Math.max(-1.2, Math.min(0.6, pitch + dy * 0.006));
      spin = dx * 0.009;
    }
  };
  const up = () => {
    dragging = false;
  };
  const leave = () => {
    hoverTarget = 0;
    mx = 0;
    my = 0;
  };
  const click = () => {
    burst = 1;
  };
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("pointerleave", leave);
  host.addEventListener("click", click);
  // hero: 0 at the top → 1 after one viewport. cta: 0 below the fold → 1 once 90% of a viewport in.
  const onScroll = () => {
    if (cta) {
      const vh = window.innerHeight || 900;
      scroll = clamp01((vh - host.getBoundingClientRect().top) / (vh * 0.9));
    } else scroll = clamp01(window.scrollY / (window.innerHeight || 900));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const P = new Float32Array(24), R = new Float32Array(72), S = new Float32Array(8);
  const CYCLE = 7.5;
  const flyAxis = [0.3, 0.8, 0.5].map((x) => x / Math.hypot(0.3, 0.8, 0.5));

  const frame = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) {
      last = now;
      return;
    }
    // drop resolution if frames keep running long
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    slow = dt > 0.034 ? slow + 1 : Math.max(0, slow - 0.2);
    if (slow > 40 && res > 0.5) {
      res = Math.max(0.5, res * 0.8);
      resize();
      slow = 0;
    }

    const entered = cta || isIn();
    const t = (now - t0) / 1000;
    hover += (hoverTarget - hover) * 0.08;
    burst *= 0.94;
    const breathe = reduced ? 0 : 0.07 + 0.04 * Math.sin(t * 1.3);
    const target = cta
      ? Math.max(0, breathe + Math.max(hover * 0.55, focus() * 0.8) + burst * 1.1 + (1 - scroll) * 1.3)
      : entered
        ? Math.max(0, breathe + hover * 0.55 + burst * 1.1 - scroll * 0.3)
        : 0.9;
    spread += (target - spread) * (entered ? 0.07 : 0.2);
    if (!dragging) {
      spin *= 0.95;
      yaw += (reduced ? 0 : 0.0032 + (cta ? 1 - scroll : scroll) * 0.02) + spin * 0.5;
    }
    const view = mul(rotX(pitch + my * 0.35), mul(rotY(yaw + mx * 0.5), rotZ(0.08)));

    // fly-out (0–1.2s) → flash (1.2–2.1s) → hold → fly back in (5.6–6.6s)
    const c = reduced ? 3 : (((t - 1.2) % CYCLE) + CYCLE) % CYCLE;
    let out = 0, flash = 0, ph = 0;
    if (c < 1.2) {
      out = 1 - easeOutBack(c / 1.2);
      ph = 0;
    } else if (c < 5.6) {
      out = 0;
      flash = Math.max(0, 1 - (c - 1.2) / 0.9);
      ph = c < 2.2 ? 1 : 2;
    } else if (c < 6.6) {
      out = easeInCubic((c - 5.6) / 1);
      ph = 2;
    } else {
      out = 1;
      ph = 0;
    }
    // each new cycle picks the block nearest the viewer
    if (c < lastCycle) {
      let best = -9;
      for (let i = 0; i < 8; i++) {
        const v = apply(view, home[i]);
        const score = v[2] + v[1] * 0.3;
        if (score > best) {
          best = score;
          ship = i;
        }
      }
    }
    lastCycle = c;
    if (!entered) {
      out = 1;
      ph = 0;
    }
    if (ph !== phase) {
      phase = ph;
      onPhase?.(ph);
    }

    for (let i = 0; i < 8; i++) {
      const h = home[i];
      let pos = [
        h[0] * (1 + spread * 0.95) + axes[i][0] * spread * 0.35,
        h[1] * (1 + spread * 0.95) + axes[i][1] * spread * 0.35,
        h[2] * (1 + spread * 0.95) + axes[i][2] * spread * 0.35,
      ];
      let rot = axisAngle(axes[i], spread * (0.9 + i * 0.07));
      let scale = 1;
      if (i === ship) {
        pos = [pos[0] + out * 5.6 * Math.sign(h[0]), pos[1] + out * 4 * Math.sign(h[1]), pos[2] + out * 3];
        rot = mul(rot, axisAngle(flyAxis, out * 3.2));
        scale = out > 0.97 ? 0 : 1 - out * 0.2;
      }
      const wp = apply(view, pos);
      const wr = mul(view, rot);
      P[i * 3] = wp[0];
      P[i * 3 + 1] = wp[1];
      P[i * 3 + 2] = wp[2];
      for (let k = 0; k < 9; k++) R[i * 9 + k] = wr[k];
      S[i] = scale;
    }
    gl.uniform3fv(uP, P);
    gl.uniformMatrix3fv(uR, false, R);
    gl.uniform1fv(uS, S);
    gl.uniform1f(uFlash, flash);
    gl.uniform1f(uBound, 1.35 * (1 + spread * 1.1) + 0.6);
    gl.uniform1f(uShip, ship);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!readySent) {
      readySent = true;
      onReady();
    }
    host.style.setProperty("--fl", flash.toFixed(3));
  };
  raf = requestAnimationFrame(frame);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("scroll", onScroll);
    host.removeEventListener("pointerdown", down);
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerup", up);
    host.removeEventListener("pointercancel", up);
    host.removeEventListener("pointerleave", leave);
    host.removeEventListener("click", click);
  };
}
