// Polyfill code to support modulepreload for older browsers
(function() {
    const relList = document.createElement("link").relList;
    if (relList && relList.supports && relList.supports("modulepreload")) return;

    for (const linkElement of document.querySelectorAll('link[rel="modulepreload"]'))
        preloadModule(linkElement);

    // Watch for new <link rel="modulepreload"> elements being added
    new MutationObserver(mutations=>{
        for (const mutation of mutations)
            if (mutation.type === "childList")
                for (const node of mutation.addedNodes)
                    node.tagName === "LINK" && noe.rel === "modulepreload" && preloadModule(node)
    }
    ).observe(document, {
        childList: true,
        subtree: true
    });
    function createFetchOptions(linkElement) {
        const options = {};
        return linkElement.integrity && (options.integrity = linkElement.integrity),
        linkElement.referrerPolicy && (options.referrerPolicy = linkElement.referrerPolicy),
        linkElement.crossOrigin === "use-credentials" ? options.credentials = "include" : linkElement.crossOrigin === "anonymous" ? options.credentials = "omit" : options.credentials = "same-origin",
        options
    }
    function preloadModule(linkElement) {
        if (linkElement.ep) return; // Prevents re-fetching
        linkElement.ep = true;

        const fetchOptions = createFetchOptions(linkElement);
        fetch(linkElement.href, fetchOptions);
    }
}
)();

// X
class Vector3D { 
    constructor(e=0, n=0, l=0) {
        this.x = e,
        this.y = n,
        this.z = l
    }
    equals(other) {
        return this.x === other.x && this.y === other.y && this.z === other.z
    }
    add(other) {
        return typeof other == "number" ? new Vector3D(this.x + other,this.y + other,this.z + other) : new Vector3D(this.x + other.x,this.y + other.y,this.z + other.z)
    }
    subtract(other) {
        return typeof other == "number" ? new Vector3D(this.x - other,this.y - other,this.z - other) : new Vector3D(this.x - other.x,this.y - other.y,this.z - other.z)
    }
    multiply(other) {
        return typeof other == "number" ? new Vector3D(this.x * other,this.y * other,this.z * other) : new Vector3D(this.x * other.x,this.y * other.y,this.z * other.z)
    }
    lerp(other, n) {
        return new Vector3D(this.x + (other.x - this.x) * n,this.y + (other.y - this.y) * n,this.z + (other.z - this.z) * n)
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    distanceTo(other) {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2 + (this.z - other.z) ** 2)
    }
    normalize() {
        const other = this.length();
        return new Vector3D(this.x / other,this.y / other,this.z / other)
    }
    flat() {
        return [this.x, this.y, this.z]
    }
    clone() {
        return new Vector3D(this.x,this.y,this.z)
    }
}

// I
class Quaternion { 
    constructor(e=0, n=0, l=0, t=1) {
        this.x = e,
        this.y = n,
        this.z = l,
        this.w = t
    }
    equals(other) {
        return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w
    }
    normalize() {
        const norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        return new Quaternion(this.x / norm, this.y / norm, this.z / norm, this.w / norm)
    }
    multiply(other) {
        const n = this.w
          , l = this.x
          , t = this.y
          , a = this.z
          , d = other.w
          , U = other.x
          , F = other.y
          , s = other.z;
        return new Quaternion(n * U + l * d + t * s - a * F,n * F - l * s + t * d + a * U,n * s + l * F - t * U + a * d,n * d - l * U - t * F - a * s)
    }
    flat() {
        return [this.x, this.y, this.z, this.w]
    }
    clone() {
        return new Quaternion(this.x,this.y,this.z,this.w)
    }
    static FromEuler(other) {
        const n = other.x / 2
          , l = other.y / 2
          , t = other.z / 2
          , a = Math.cos(l)
          , d = Math.sin(l)
          , U = Math.cos(n)
          , F = Math.sin(n)
          , s = Math.cos(t)
          , o = Math.sin(t);
        return new Quaternion(a * F * s + d * U * o,d * U * s - a * F * o,a * U * o - d * F * s,a * U * s + d * F * o)
    }
    toEuler() {
        const other = 2 * (this.w * this.x + this.y * this.z)
          , n = 1 - 2 * (this.x * this.x + this.y * this.y)
          , l = Math.atan2(other, n);
        let t;
        const a = 2 * (this.w * this.y - this.z * this.x);
        t = Math.abs(a) >= 1 ? Math.sign(a) * Math.PI / 2 : Math.asin(a);
        const d = 2 * (this.w * this.z + this.x * this.y)
          , U = 1 - 2 * (this.y * this.y + this.z * this.z)
          , F = Math.atan2(d, U);
        return new X(l,t,F)
    }
    static FromMatrix3(other) {
        const n = other.buffer
          , l = n[0] + n[4] + n[8];
        let t, a, d, U;
        if (l > 0) {
            const F = .5 / Math.sqrt(l + 1);
            U = .25 / F,
            t = (n[7] - n[5]) * F,
            a = (n[2] - n[6]) * F,
            d = (n[3] - n[1]) * F
        } else if (n[0] > n[4] && n[0] > n[8]) {
            const F = 2 * Math.sqrt(1 + n[0] - n[4] - n[8]);
            U = (n[7] - n[5]) / F,
            t = .25 * F,
            a = (n[1] + n[3]) / F,
            d = (n[2] + n[6]) / F
        } else if (n[4] > n[8]) {
            const F = 2 * Math.sqrt(1 + n[4] - n[0] - n[8]);
            U = (n[2] - n[6]) / F,
            t = (n[1] + n[3]) / F,
            a = .25 * F,
            d = (n[5] + n[7]) / F
        } else {
            const F = 2 * Math.sqrt(1 + n[8] - n[0] - n[4]);
            U = (n[3] - n[1]) / F,
            t = (n[2] + n[6]) / F,
            a = (n[5] + n[7]) / F,
            d = .25 * F
        }
        return new Quaternion(t,a,d,U)
    }
}

// xt
class eventManager { 
    constructor() {
        const events = new Map;
        this.addEventListener = (event, func)=>{
            events.has(event) || events.set(event, new Set),
            events.get(event).add(func)
        }
        ,
        this.removeEventListener = (event, func)=>{
            events.has(event) && events.get(event).delete(func)
        }
        ,
        this.hasEventListener = (event, func)=>!!events.has(event) && events.get(event).has(func),
        this.dispatchEvent = event=>{
            if (events.has(event.type))
                for (const func of events.get(event.type))
                    func(event)
        }
    }
}

// Dt
class TransformNode extends eventManager { 
    constructor() {
        super(),
        this._position = new Vector3D,
        this._rotation = new Quaternion,
        this._changeEvent = {
            type: "change"
        }
    }
    get position() {
        return this._position
    }
    set position(v) {
        this._position.equals(v) || (this._position = v,
        this.dispatchEvent(this._changeEvent))
    }
    get rotation() {
        return this._rotation
    }
    set rotation(q) {
        this._rotation.equals(q) || (this._rotation = q,
        this.dispatchEvent(this._changeEvent))
    }
}

// Y
class Matrix3x3 { 
    constructor(e=1, n=0, l=0, t=0, a=1, d=0, U=0, F=0, s=1) {
        this.buffer = [e, n, l, t, a, d, U, F, s]
    }
    equals(m) {
        if (this.buffer.length !== m.buffer.length)
            return false;
        if (this.buffer === m.buffer)
            return true;
        for (let n = 0; n < this.buffer.length; n++)
            if (this.buffer[n] !== m.buffer[n])
                return false;
        return true;
    }
    multiply(m) {
        const n = this.buffer
          , l = m.buffer;
        return new Matrix3x3(l[0] * n[0] + l[3] * n[1] + l[6] * n[2],l[1] * n[0] + l[4] * n[1] + l[7] * n[2],l[2] * n[0] + l[5] * n[1] + l[8] * n[2],l[0] * n[3] + l[3] * n[4] + l[6] * n[5],l[1] * n[3] + l[4] * n[4] + l[7] * n[5],l[2] * n[3] + l[5] * n[4] + l[8] * n[5],l[0] * n[6] + l[3] * n[7] + l[6] * n[8],l[1] * n[6] + l[4] * n[7] + l[7] * n[8],l[2] * n[6] + l[5] * n[7] + l[8] * n[8])
    }
    clone() {
        const e = this.buffer;
        return new Matrix3x3(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8])
    }
    static Eye(e=1) {
        return new Matrix3x3(e,0,0,0,e,0,0,0,e)
    }
    static Diagonal(e) {
        return new Matrix3x3(e.x,0,0,0,e.y,0,0,0,e.z)
    }
    static RotationFromQuaternion(q) {
        return new Matrix3x3(1 - 2 * q.y * q.y - 2 * q.z * q.z,2 * q.x * q.y - 2 * q.z * q.w,2 * q.x * q.z + 2 * q.y * q.w,2 * q.x * q.y + 2 * q.z * q.w,1 - 2 * q.x * q.x - 2 * q.z * q.z,2 * q.y * q.z - 2 * q.x * q.w,2 * q.x * q.z - 2 * q.y * q.w,2 * q.y * q.z + 2 * q.x * q.w,1 - 2 * q.x * q.x - 2 * q.y * q.y)
    }
    static RotationFromEuler(e) {
        const n = Math.cos(e.x)
          , l = Math.sin(e.x)
          , t = Math.cos(e.y)
          , a = Math.sin(e.y)
          , d = Math.cos(e.z)
          , U = Math.sin(e.z);
        return new Matrix3x3(t * d + a * l * U,-t * U + a * l * d,a * n,n * U,n * d,-l,-a * d + t * l * U,a * U + t * l * d,t * n)
    }
}

// $
class Matrix4x4 { 
    constructor(e=1, n=0, l=0, t=0, a=0, d=1, U=0, F=0, s=0, o=0, i=1, V=0, r=0, c=0, J=0, u=1) {
        this.buffer = [e, n, l, t, a, d, U, F, s, o, i, V, r, c, J, u]
    }
    equals(m) {
        if (this.buffer.length !== m.buffer.length)
            return false;
        if (this.buffer === m.buffer)
            return true;
        for (let n = 0; n < this.buffer.length; n++)
            if (this.buffer[n] !== m.buffer[n])
                return false;
        return true
    }
    multiply(m) {
        const n = this.buffer
          , l = m.buffer;
        return new Matrix4x4(l[0] * n[0] + l[1] * n[4] + l[2] * n[8] + l[3] * n[12],l[0] * n[1] + l[1] * n[5] + l[2] * n[9] + l[3] * n[13],l[0] * n[2] + l[1] * n[6] + l[2] * n[10] + l[3] * n[14],l[0] * n[3] + l[1] * n[7] + l[2] * n[11] + l[3] * n[15],l[4] * n[0] + l[5] * n[4] + l[6] * n[8] + l[7] * n[12],l[4] * n[1] + l[5] * n[5] + l[6] * n[9] + l[7] * n[13],l[4] * n[2] + l[5] * n[6] + l[6] * n[10] + l[7] * n[14],l[4] * n[3] + l[5] * n[7] + l[6] * n[11] + l[7] * n[15],l[8] * n[0] + l[9] * n[4] + l[10] * n[8] + l[11] * n[12],l[8] * n[1] + l[9] * n[5] + l[10] * n[9] + l[11] * n[13],l[8] * n[2] + l[9] * n[6] + l[10] * n[10] + l[11] * n[14],l[8] * n[3] + l[9] * n[7] + l[10] * n[11] + l[11] * n[15],l[12] * n[0] + l[13] * n[4] + l[14] * n[8] + l[15] * n[12],l[12] * n[1] + l[13] * n[5] + l[14] * n[9] + l[15] * n[13],l[12] * n[2] + l[13] * n[6] + l[14] * n[10] + l[15] * n[14],l[12] * n[3] + l[13] * n[7] + l[14] * n[11] + l[15] * n[15])
    }
    clone() {
        const e = this.buffer;
        return new Matrix4x4(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8],e[9],e[10],e[11],e[12],e[13],e[14],e[15])
    }
}

// Zt
class Camera extends TransformNode {
    constructor(p=new Vector3D(0,0,0), q=new Quaternion, fx=1132, fy=1132, near=.01, far=1e3) {
        super();
        const computeTransformationMatrices = ()=>{ // U
            const F = Matrix3x3.RotationFromQuaternion(this.rotation).buffer
              , s = this.position.flat()
              , worldToView = [[F[0], F[1], F[2], 0], [F[3], F[4], F[5], 0], [F[6], F[7], F[8], 0], [-s[0] * F[0] - s[1] * F[3] - s[2] * F[6], -s[0] * F[1] - s[1] * F[4] - s[2] * F[7], -s[0] * F[2] - s[1] * F[5] - s[2] * F[8], 1]].flat()
              , vtw = [[F[0], F[3], F[6], s[0]], [F[1], F[4], F[7], s[1]], [F[2], F[5], F[8], s[2]], [0, 0, 0, 1]].flat();
            return this.viewToWorld = new Matrix4x4(...vtw),
            new Matrix4x4(...worldToView)
        }
        ;
        this.position = p,
        this.rotation = q,
        this.fx = fx,
        this.fy = fy,
        this.near = near,
        this.far = far,
        this.projectionMatrix = new Matrix4x4,
        this.viewMatrix = new Matrix4x4,
        this.viewProj = new Matrix4x4,
        this.viewToWorld = new Matrix4x4,
        this.update = (width, height)=>{
            this.projectionMatrix = new Matrix4x4(2 * this.fx / width,0,0,0,0,-2 * this.fy / height,0,0,0,0,this.far / (this.far - this.near),1,0,0,-this.far * this.near / (this.far - this.near),0),
            this.viewMatrix = computeTransformationMatrices(), // WorldToView
            this.viewProj = this.projectionMatrix.multiply(this.viewMatrix)
        }
    }
    setFromData(e) {
        if (e.rotation.x != null) // It's a quaternion
            this.rotation = new Quaternion(e.rotation.x,e.rotation.y,e.rotation.z,e.rotation.w);
        else {
            let a = e.rotation.flat()
              , d = new Matrix3x3(...a);
            this.rotation = Quaternion.FromMatrix3(d)
        }
        if (e.position.x != null)
            this.position = new Vector3D(e.position.x,e.position.y,e.position.z);
        else {
            let a = e.position;
            this.position = new Vector3D(...a)
        }
        console.log(`camera loaded settings: pos ${this.position.x}, ${this.position.y}, ${this.position.z}`),
        console.log("rotation: "),
        console.log(Matrix3x3.RotationFromQuaternion(this.rotation).buffer),
        this.fx = e.fx,
        this.fy = e.fy,
        new Camera;
        let n = Matrix3x3.RotationFromEuler(new Vector3D(0,0,Math.PI / 2));
        console.log(n.buffer);
        let l = Matrix3x3.RotationFromEuler(new Vector3D(Math.PI / 2,0,0));
        console.log(l.buffer);
        let t = Matrix3x3.RotationFromEuler(new Vector3D(0,Math.PI / 2,0));
        console.log(t.buffer),
        this.update(e.width, e.height)
    }
    static fromData(e) {
        let n = new Vector3D
          , l = new Quaternion;
        if (e.position.x != null)
            n = new Vector3D(e.position.x,e.position.y,e.position.z);
        else {
            let a = e.position;
            n = new Vector3D(...a)
        }
        if (e.rotation.x != null)
            l = new Quaternion(e.rotation.x,e.rotation.y,e.rotation.z,e.rotation.w);
        else {
            let a = e.rotation.flat()
              , d = new Matrix3x3(...a);
            l = Quaternion.FromMatrix3(d)
        }
        console.log(`camera created with settings: pos ${n.x}, ${n.y}, ${n.z}`),
        console.log("rotation: "),
        console.log(Y.RotationFromQuaternion(l).buffer);
        let t = new Camera(n,l,e.fx,e.fy);
        return t.update(e.width, e.height),
        t
    }
    dumpSettings(width, height) {
        const l = {
            id: 0,
            img_name: "NONE",
            width: width,
            height: height,
            position: this.position,
            rotation: this.rotation,
            fy: this.fy,
            fx: this.fx
        };
        console.log(JSON.stringify(l)),
        console.log("CAM POSITION[" + this.position.x + ", " + this.position.y + ", " + this.position.z + "]"),
        console.log(Y.RotationFromQuaternion(this.rotation).buffer),
        console.log("actual cam viewmatrix: "),
        console.log(this.viewMatrix.buffer)
    }
}

// Et
const Et = new Float32Array(1)
  , jt = new Int32Array(Et.buffer)
  , Gt = b=>{
    Et[0] = b;
    const e = jt[0]
      , n = e >> 23 & 255;
    let l, t = 8388607 & e;
    return n == 0 ? l = 0 : n < 113 ? (l = 0,
    t |= 8388608,
    t >>= 113 - n,
    16777216 & t && (l = 1,
    t = 0)) : n < 142 ? l = n - 112 : (l = 31,
    t = 0),
    (e >> 31 & 1) << 15 | l << 10 | t >> 13
}
  , z = (b,e)=>(Gt(b) | Gt(e) << 16) >>> 0;
var Kt = Math.pow;
function ht(b, e, n) {
    let l = new Float32Array(b.length - e);
    for (let d = e; d < n; d++) {
        var t = (31744 & b[d]) >> 10
          , a = 1023 & b[d];
        l[d] = (b[d] >> 15 ? -1 : 1) * (t ? t === 31 ? a ? NaN : 1 / 0 : Kt(2, t - 15) * (1 + a / 1024) : a / 1024 * 6103515625e-14)
    }
    return l
}
class g extends eventManager {
    constructor() {
        super();
        const e = {
            type: "change"
        };
        this._data = new Uint32Array(0),
        this._vertexCount = 0,
        this._width = 2048,
        this._height = 0,
        this._shHeight = 0,
        this._positions = new Float32Array(0),
        this._rotations = new Float32Array(0),
        this._scales = new Float32Array(0),
        this._shs = new Uint32Array(0),
        this._shs_rgb = [new Uint32Array(0), new Uint32Array(0), new Uint32Array(0)],
        this._g0bands = 0,
        this._bandsIndices = new Int32Array([-1, -1, -1]),
        this.setData = (n,l)=>{
            l === void 0 && console.log("NO SHS"),
            this._vertexCount = n.length / g.RowLength;
            const t = this.vertexCount - (this.bandsIndices[0] + 1);
            this._height = Math.ceil(2 * this._vertexCount / this._width),
            this._data = new Uint32Array(this._width * this._height * 4),
            this._positions = new Float32Array(3 * this._vertexCount),
            this._rotations = new Float32Array(4 * this._vertexCount),
            this._scales = new Float32Array(3 * this._vertexCount),
            l !== void 0 && (this._shHeight = Math.ceil(2 * t / this._width),
            this._shs_rgb = [new Uint32Array(this._width * this._shHeight * 4), new Uint32Array(this._width * this._shHeight * 4), new Uint32Array(this._width * this._shHeight * 4)]);
            const a = new Float32Array(n.buffer)
              , d = new Uint8Array(n.buffer)
              , U = new Uint8Array(this._data.buffer)
              , F = new Float32Array(this._data.buffer);
            if (new Float32Array(this._shs.buffer),
            l !== void 0)
                for (let s = 0; s < t; s++) {
                    let o = 48 * s;
                    for (let i = 0; i < 8; i++)
                        this._shs_rgb[0][8 * s + i] = z(l[o], l[o + 3]),
                        this._shs_rgb[1][8 * s + i] = z(l[o + 1], l[o + 3 + 1]),
                        this._shs_rgb[2][8 * s + i] = z(l[o + 2], l[o + 3 + 2]),
                        o += 6
                }
            for (let s = 0; s < this._vertexCount; s++) {
                this._positions[3 * s + 0] = a[8 * s + 0],
                this._positions[3 * s + 1] = a[8 * s + 1],
                this._positions[3 * s + 2] = a[8 * s + 2],
                this._rotations[4 * s + 0] = (d[32 * s + 28 + 0] - 128) / 128,
                this._rotations[4 * s + 1] = (d[32 * s + 28 + 1] - 128) / 128,
                this._rotations[4 * s + 2] = (d[32 * s + 28 + 2] - 128) / 128,
                this._rotations[4 * s + 3] = (d[32 * s + 28 + 3] - 128) / 128,
                this._scales[3 * s + 0] = a[8 * s + 3 + 0],
                this._scales[3 * s + 1] = a[8 * s + 3 + 1],
                this._scales[3 * s + 2] = a[8 * s + 3 + 2],
                F[8 * s + 0] = this._positions[3 * s + 0],
                F[8 * s + 1] = this._positions[3 * s + 1],
                F[8 * s + 2] = this._positions[3 * s + 2],
                U[4 * (8 * s + 7) + 0] = d[32 * s + 24 + 0],
                U[4 * (8 * s + 7) + 1] = d[32 * s + 24 + 1],
                U[4 * (8 * s + 7) + 2] = d[32 * s + 24 + 2],
                U[4 * (8 * s + 7) + 3] = d[32 * s + 24 + 3];
                const o = Y.RotationFromQuaternion(new I(this._rotations[4 * s + 1],this._rotations[4 * s + 2],this._rotations[4 * s + 3],-this._rotations[4 * s + 0]))
                  , i = Y.Diagonal(new X(this._scales[3 * s + 0],this._scales[3 * s + 1],this._scales[3 * s + 2])).multiply(o).buffer
                  , V = [i[0] * i[0] + i[3] * i[3] + i[6] * i[6], i[0] * i[1] + i[3] * i[4] + i[6] * i[7], i[0] * i[2] + i[3] * i[5] + i[6] * i[8], i[1] * i[1] + i[4] * i[4] + i[7] * i[7], i[1] * i[2] + i[4] * i[5] + i[7] * i[8], i[2] * i[2] + i[5] * i[5] + i[8] * i[8]];
                this._data[8 * s + 4] = z(4 * V[0], 4 * V[1]),
                this._data[8 * s + 5] = z(4 * V[2], 4 * V[3]),
                this._data[8 * s + 6] = z(4 * V[4], 4 * V[5])
            }
            this.dispatchEvent(e)
        }
        ,
        this.translate = n=>{
            const l = new Float32Array(this._data.buffer);
            for (let t = 0; t < this._vertexCount; t++)
                this._positions[3 * t + 0] += n.x,
                this._positions[3 * t + 1] += n.y,
                this._positions[3 * t + 2] += n.z,
                l[8 * t + 0] = this._positions[3 * t + 0],
                l[8 * t + 1] = this._positions[3 * t + 1],
                l[8 * t + 2] = this._positions[3 * t + 2];
            this.dispatchEvent(e)
        }
        ,
        this.rotate = n=>{
            const l = Y.RotationFromQuaternion(n).buffer
              , t = new Float32Array(this._data.buffer);
            for (let a = 0; a < this._vertexCount; a++) {
                const d = this._positions[3 * a + 0]
                  , U = this._positions[3 * a + 1]
                  , F = this._positions[3 * a + 2];
                this._positions[3 * a + 0] = l[0] * d + l[1] * U + l[2] * F,
                this._positions[3 * a + 1] = l[3] * d + l[4] * U + l[5] * F,
                this._positions[3 * a + 2] = l[6] * d + l[7] * U + l[8] * F,
                t[8 * a + 0] = this._positions[3 * a + 0],
                t[8 * a + 1] = this._positions[3 * a + 1],
                t[8 * a + 2] = this._positions[3 * a + 2];
                const s = new I(this._rotations[4 * a + 1],this._rotations[4 * a + 2],this._rotations[4 * a + 3],this._rotations[4 * a + 0])
                  , o = n.multiply(s);
                this._rotations[4 * a + 1] = o.x,
                this._rotations[4 * a + 2] = o.y,
                this._rotations[4 * a + 3] = o.z,
                this._rotations[4 * a + 0] = o.w;
                const i = Y.RotationFromQuaternion(new I(this._rotations[4 * a + 1],this._rotations[4 * a + 2],this._rotations[4 * a + 3],-this._rotations[4 * a + 0]))
                  , V = Y.Diagonal(new X(this._scales[3 * a + 0],this._scales[3 * a + 1],this._scales[3 * a + 2])).multiply(i).buffer
                  , r = [V[0] * V[0] + V[3] * V[3] + V[6] * V[6], V[0] * V[1] + V[3] * V[4] + V[6] * V[7], V[0] * V[2] + V[3] * V[5] + V[6] * V[8], V[1] * V[1] + V[4] * V[4] + V[7] * V[7], V[1] * V[2] + V[4] * V[5] + V[7] * V[8], V[2] * V[2] + V[5] * V[5] + V[8] * V[8]];
                this._data[8 * a + 4] = z(4 * r[0], 4 * r[1]),
                this._data[8 * a + 5] = z(4 * r[2], 4 * r[3]),
                this._data[8 * a + 6] = z(4 * r[4], 4 * r[5])
            }
            this.dispatchEvent(e)
        }
        ,
        this.scale = n=>{
            const l = new Float32Array(this._data.buffer);
            for (let t = 0; t < this.vertexCount; t++) {
                this._positions[3 * t + 0] *= n.x,
                this._positions[3 * t + 1] *= n.y,
                this._positions[3 * t + 2] *= n.z,
                l[8 * t + 0] = this._positions[3 * t + 0],
                l[8 * t + 1] = this._positions[3 * t + 1],
                l[8 * t + 2] = this._positions[3 * t + 2],
                this._scales[3 * t + 0] *= n.x,
                this._scales[3 * t + 1] *= n.y,
                this._scales[3 * t + 2] *= n.z;
                const a = Y.RotationFromQuaternion(new I(this._rotations[4 * t + 1],this._rotations[4 * t + 2],this._rotations[4 * t + 3],-this._rotations[4 * t + 0]))
                  , d = Y.Diagonal(new X(this._scales[3 * t + 0],this._scales[3 * t + 1],this._scales[3 * t + 2])).multiply(a).buffer
                  , U = [d[0] * d[0] + d[3] * d[3] + d[6] * d[6], d[0] * d[1] + d[3] * d[4] + d[6] * d[7], d[0] * d[2] + d[3] * d[5] + d[6] * d[8], d[1] * d[1] + d[4] * d[4] + d[7] * d[7], d[1] * d[2] + d[4] * d[5] + d[7] * d[8], d[2] * d[2] + d[5] * d[5] + d[8] * d[8]];
                this._data[8 * t + 4] = z(4 * U[0], 4 * U[1]),
                this._data[8 * t + 5] = z(4 * U[2], 4 * U[3]),
                this._data[8 * t + 6] = z(4 * U[4], 4 * U[5])
            }
            this.dispatchEvent(e)
        }
        ,
        this.limitBox = (n,l,t,a,d,U)=>{
            if (n >= l)
                throw new Error(`xMin (${n}) must be smaller than xMax (${l})`);
            if (t >= a)
                throw new Error(`yMin (${t}) must be smaller than yMax (${a})`);
            if (d >= U)
                throw new Error(`zMin (${d}) must be smaller than zMax (${U})`);
            const F = new Uint8Array(this._vertexCount);
            for (let o = 0; o < this._vertexCount; o++) {
                const i = this._positions[3 * o + 0]
                  , V = this._positions[3 * o + 1]
                  , r = this._positions[3 * o + 2];
                i >= n && i <= l && V >= t && V <= a && r >= d && r <= U && (F[o] = 1)
            }
            let s = 0;
            for (let o = 0; o < this._vertexCount; o++)
                F[o] !== 0 && (this._data[8 * s + 0] = this._data[8 * o + 0],
                this._data[8 * s + 1] = this._data[8 * o + 1],
                this._data[8 * s + 2] = this._data[8 * o + 2],
                this._data[8 * s + 3] = this._data[8 * o + 3],
                this._data[8 * s + 4] = this._data[8 * o + 4],
                this._data[8 * s + 5] = this._data[8 * o + 5],
                this._data[8 * s + 6] = this._data[8 * o + 6],
                this._data[8 * s + 7] = this._data[8 * o + 7],
                this._positions[3 * s + 0] = this._positions[3 * o + 0],
                this._positions[3 * s + 1] = this._positions[3 * o + 1],
                this._positions[3 * s + 2] = this._positions[3 * o + 2],
                this._rotations[4 * s + 0] = this._rotations[4 * o + 0],
                this._rotations[4 * s + 1] = this._rotations[4 * o + 1],
                this._rotations[4 * s + 2] = this._rotations[4 * o + 2],
                this._rotations[4 * s + 3] = this._rotations[4 * o + 3],
                this._scales[3 * s + 0] = this._scales[3 * o + 0],
                this._scales[3 * s + 1] = this._scales[3 * o + 1],
                this._scales[3 * s + 2] = this._scales[3 * o + 2],
                s += 1);
            this._height = Math.ceil(2 * s / this._width),
            this._vertexCount = s,
            this._data = new Uint32Array(this._data.buffer,0,this._width * this._height * 4),
            this._positions = new Float32Array(this._positions.buffer,0,3 * s),
            this._rotations = new Float32Array(this._rotations.buffer,0,4 * s),
            this._scales = new Float32Array(this._scales.buffer,0,3 * s),
            this.dispatchEvent(e)
        }
        ,
        this.saveToFile = n=>{
            if (!document)
                return;
            const l = new Uint8Array(this._vertexCount * g.RowLength)
              , t = new Float32Array(l.buffer)
              , a = new Uint8Array(l.buffer)
              , d = new Uint8Array(this._data.buffer);
            for (let s = 0; s < this._vertexCount; s++)
                t[8 * s + 0] = this._positions[3 * s + 0],
                t[8 * s + 1] = this._positions[3 * s + 1],
                t[8 * s + 2] = this._positions[3 * s + 2],
                a[32 * s + 24 + 0] = d[4 * (8 * s + 7) + 0],
                a[32 * s + 24 + 1] = d[4 * (8 * s + 7) + 1],
                a[32 * s + 24 + 2] = d[4 * (8 * s + 7) + 2],
                a[32 * s + 24 + 3] = d[4 * (8 * s + 7) + 3],
                t[8 * s + 3 + 0] = this._scales[3 * s + 0],
                t[8 * s + 3 + 1] = this._scales[3 * s + 1],
                t[8 * s + 3 + 2] = this._scales[3 * s + 2],
                a[32 * s + 28 + 0] = 128 * this._rotations[4 * s + 0] + 128 & 255,
                a[32 * s + 28 + 1] = 128 * this._rotations[4 * s + 1] + 128 & 255,
                a[32 * s + 28 + 2] = 128 * this._rotations[4 * s + 2] + 128 & 255,
                a[32 * s + 28 + 3] = 128 * this._rotations[4 * s + 3] + 128 & 255;
            const U = new Blob([l.buffer],{
                type: "application/octet-stream"
            })
              , F = document.createElement("a");
            F.download = n,
            F.href = URL.createObjectURL(U),
            F.click()
        }
        ,
        this.updateColor = n=>{}
    }
    get data() {
        return this._data
    }
    get vertexCount() {
        return this._vertexCount
    }
    get width() {
        return this._width
    }
    get height() {
        return this._height
    }
    get positions() {
        return this._positions
    }
    get rotations() {
        return this._rotations
    }
    get scales() {
        return this._scales
    }
    get shs() {
        return this._shs
    }
    get shs_rgb() {
        return this._shs_rgb
    }
    get shHeight() {
        return this._shHeight
    }
    get g0bands() {
        return this._g0bands
    }
    set g0bands(e) {
        this._g0bands = e
    }
    get bandsIndices() {
        return this._bandsIndices
    }
    set bandsIndices(e) {
        this._bandsIndices = e
    }
    set height(e) {
        this._height = e
    }
    set data(e) {
        this._data = e
    }
    set vertexCount(e) {
        this._vertexCount = e
    }
    set width(e) {
        this._width = e
    }
    set positions(e) {
        this._positions = e
    }
    set rotations(e) {
        this._rotations = e
    }
    set scales(e) {
        this._scales = e
    }
    set shs(e) {
        this._shs = e
    }
    set shs_rgb(e) {
        this._shs_rgb = e
    }
    set shHeight(e) {
        this._shHeight = e
    }
}
g.RowLength = 32;

class Ot {
    static async LoadAsync(e, n, l) {
        const t = await fetch(e, {
            mode: "cors",
            credentials: "omit"
        });
        if (t.status != 200)
            throw new Error(t.status + " Unable to load " + t.url);
        const a = t.body.getReader()
          , d = parseInt(t.headers.get("content-length"))
          , U = new Uint8Array(d);
        let F = 0;
        for (; ; ) {
            const {done: s, value: o} = await a.read();
            if (s)
                break;
            U.set(o, F),
            F += o.length,
            l == null || l(F / d)
        }
        n.setData(U)
    }
    static async LoadFromFileAsync(e, n, l) {
        const t = new FileReader;
        t.onload = a=>{
            const d = new Uint8Array(a.target.result);
            n.setData(d)
        }
        ,
        t.onprogress = a=>{
            l == null || l(a.loaded / a.total)
        }
        ,
        t.readAsArrayBuffer(e),
        await new Promise(a=>{
            t.onloadend = ()=>{
                a()
            }
        }
        )
    }
}
const D = .28209479177387814;
class nt {
    static async LoadAsync(e, n, l, t="", a=false, d=false) {
        const U = await fetch(e, {
            mode: "no-cors",
            credentials: "omit"
        });
        if (U.status != 200)
            throw new Error(U.status + " Unable to load " + U.url);
        const F = U.body.getReader()
          , s = parseInt(U.headers.get("content-length"))
          , o = new Uint8Array(s);
        let i = 0;
        for (this.timestamp = performance.now(); ; ) {
            const {done: r, value: c} = await F.read();
            if (r)
                break;
            o.set(c, i),
            i += c.length,
            l == null || l(i / s)
        }
        const V = performance.now() - this.timestamp;
        if (console.log(`File loaded in ${V}ms.`),
        l == null || l(1, true),
        await new Promise(r=>setTimeout(r, 100)),
        o[0] !== 112 || o[1] !== 108 || o[2] !== 121 || o[3] !== 10)
            throw new Error("Invalid PLY file");
        if (a) {
            let r, c = performance.now();
            if (d)
                r = this._ParseQPLYBuffer(o.buffer, t),
                n.bandsIndices = r[2];
            else {
                const Q = this._parsePLYHeader(o.buffer, t);
                r = this._ParseFullPLYBufferFast(Q, o.buffer)
            }
            let J = performance.now();
            console.log("PLY file parsing loading took " + (J - c) + " ms.");
            const u = new Uint8Array(r[0])
              , h = new Float32Array(r[1]);
            c = performance.now(),
            n.setData(u, h),
            J = performance.now(),
            console.log("setting the data in textures took " + (J - c) + " ms.")
        } else {
            const r = new Uint8Array(this._ParsePLYBuffer(o.buffer, t));
            n.setData(r)
        }
    }
    static async loadFileDataAsync(e, n) {
        const l = new FileReader;
        l.onloadstart = a=>{
            nt.timestamp = performance.now()
        }
        ,
        l.onprogress = a=>{
            n == null || n(a.loaded / a.total, false)
        }
        ,
        l.readAsArrayBuffer(e);
        const t = await new Promise(a=>{
            l.onload = d=>{
                const U = performance.now() - nt.timestamp;
                console.log(`File loaded in ${U}ms.`),
                n == null || n(1, true),
                a(d.target.result)
            }
        }
        );
        return n == null || n(1, true),
        await new Promise(a=>setTimeout(a, 20)),
        t
    }
    static _ParsePLYAndFillData(e, n, l, t) {
        new DataView(l,n.size);
        const a = new Float32Array(l,n.size);
        new ArrayBuffer(g.RowLength * n.vertexCount),
        new ArrayBuffer(192 * n.vertexCount);
        const d = n.vertexCount
          , U = n.properties.reduce((h,Q)=>(h[Q.name] = Q,
        h), {})
          , F = n.properties[n.properties.length - 1].offset + 4;
        console.log("ROW OFFSET " + F);
        let s, o = 255, i = 0, V = 0, r = 0;
        e.vertexCount = n.vertexCount,
        e.height = Math.ceil(2 * e.vertexCount / e.width),
        e.data = new Uint32Array(e.width * e.height * 4),
        e.positions = new Float32Array(3 * e.vertexCount),
        e.rotations = new Float32Array(4 * e.vertexCount),
        e.scales = new Float32Array(3 * e.vertexCount),
        e.shHeight = Math.ceil(2 * d / e.width),
        e.shs_rgb = [new Uint32Array(e.width * e.shHeight * 4), new Uint32Array(e.width * e.shHeight * 4), new Uint32Array(e.width * e.shHeight * 4)];
        const c = new Float32Array(l,n.size);
        new Uint8Array(l,n.size);
        const J = new Uint8Array(e.data.buffer)
          , u = new Float32Array(e.data.buffer);
        new Float32Array(e.shs.buffer);
        for (let h = 0; h < n.vertexCount; h++) {
            const Q = h * (F / 4);
            u[8 * h + 0] = c[U.x.offset / 4 + Q],
            u[8 * h + 1] = c[U.y.offset / 4 + Q],
            u[8 * h + 2] = c[U.z.offset / 4 + Q],
            e.positions[3 * h + 0] = u[8 * h + 0],
            e.positions[3 * h + 1] = u[8 * h + 1],
            e.positions[3 * h + 2] = u[8 * h + 2],
            e.scales[3 * h + 0] = Math.exp(a[U.scale_0.offset / 4 + Q]),
            e.scales[3 * h + 1] = Math.exp(a[U.scale_1.offset / 4 + Q]),
            e.scales[3 * h + 2] = Math.exp(a[U.scale_2.offset / 4 + Q]),
            J[4 * (8 * h + 7) + 0] = .5 + D * a[U.f_dc_0.offset / 4 + Q] * 255,
            J[4 * (8 * h + 7) + 1] = .5 + D * a[U.f_dc_1.offset / 4 + Q] * 255,
            J[4 * (8 * h + 7) + 2] = .5 + D * a[U.f_dc_2.offset / 4 + Q] * 255,
            J[4 * (8 * h + 7) + 3] = .5 + D * a[U.opacity.offset / 4 + Q] * 255,
            o = a[U.rot_0.offset / 4 + Q],
            i = a[U.rot_1.offset / 4 + Q],
            V = a[U.rot_2.offset / 4 + Q],
            r = a[U.rot_3.offset / 4 + Q],
            s = new I(i,V,r,o),
            s = s.normalize(),
            e.rotations[4 * h + 0] = s.w,
            e.rotations[4 * h + 1] = s.x,
            e.rotations[4 * h + 2] = s.y,
            e.rotations[4 * h + 3] = s.z;
            const R = Y.RotationFromQuaternion(new I(e.rotations[4 * h + 1],e.rotations[4 * h + 2],e.rotations[4 * h + 3],-e.rotations[4 * h + 0]))
              , W = Y.Diagonal(new X(e.scales[3 * h + 0],e.scales[3 * h + 1],e.scales[3 * h + 2])).multiply(R).buffer
              , T = [W[0] * W[0] + W[3] * W[3] + W[6] * W[6], W[0] * W[1] + W[3] * W[4] + W[6] * W[7], W[0] * W[2] + W[3] * W[5] + W[6] * W[8], W[1] * W[1] + W[4] * W[4] + W[7] * W[7], W[1] * W[2] + W[4] * W[5] + W[7] * W[8], W[2] * W[2] + W[5] * W[5] + W[8] * W[8]];
            e.data[8 * h + 4] = z(4 * T[0], 4 * T[1]),
            e.data[8 * h + 5] = z(4 * T[2], 4 * T[3]),
            e.data[8 * h + 6] = z(4 * T[4], 4 * T[5]),
            e.shs_rgb[0][8 * h] = z(a[U.f_dc_0.offset / 4 + Q], a[U.f_rest_0.offset / 4 + Q]),
            e.shs_rgb[1][8 * h] = z(a[U.f_dc_1.offset / 4 + Q], a[U.f_rest_15.offset / 4 + Q]),
            e.shs_rgb[2][8 * h] = z(a[U.f_dc_2.offset / 4 + Q], a[U.f_rest_30.offset / 4 + Q]);
            let E = 1;
            for (let p = 1; p < 8; p++)
                e.shs_rgb[0][8 * h + p] = z(a[U[`f_rest_${E}`].offset / 4 + Q], a[U[`f_rest_${E + 1}`].offset / 4 + Q]),
                e.shs_rgb[1][8 * h + p] = z(a[U[`f_rest_${E + 15}`].offset / 4 + Q], a[U[`f_rest_${E + 16}`].offset / 4 + Q]),
                e.shs_rgb[2][8 * h + p] = z(a[U[`f_rest_${E + 30}`].offset / 4 + Q], a[U[`f_rest_${E + 31}`].offset / 4 + Q]),
                E += 2
        }
        e.dispatchEvent(nt.changeEvent)
    }
    static async LoadFromFileAsync(e, n, l, t="", a=false, d=false) {
        await nt.loadFileDataAsync(e, l).then(U=>{
            if (a) {
                let F, s = performance.now();
                if (d)
                    F = this._ParseQPLYBuffer(U, t),
                    n.bandsIndices = F[2];
                else {
                    const r = this._parsePLYHeader(U, t);
                    console.log("PLY HEADER parsed: "),
                    console.log(r),
                    F = this._ParseFullPLYBufferFast(r, U)
                }
                let o = performance.now();
                console.log("PLY file parsing took " + (o - s) + " ms.");
                const i = new Uint8Array(F[0])
                  , V = new Float32Array(F[1]);
                s = performance.now(),
                n.setData(i, V),
                o = performance.now(),
                console.log("setting the data in textures took " + (o - s) + " ms.")
            } else {
                const F = new Uint8Array(this._ParsePLYBuffer(U, t));
                n.setData(F)
            }
        }
        )
    }
    static _ParsePLYBuffer(e, n) {
        const l = new Uint8Array(e)
          , t = new TextDecoder().decode(l.slice(0, 10240))
          , a = `end_header
`
          , d = t.indexOf(a);
        if (d < 0)
            throw new Error("Unable to read .ply file header");
        const U = parseInt(/element vertex (\d+)\n/.exec(t)[1]);
        let F = 0;
        const s = {
            double: 8,
            int: 4,
            uint: 4,
            float: 4,
            short: 2,
            ushort: 2,
            uchar: 1
        }
          , o = [];
        for (const c of t.slice(0, d).split(`
`).filter(J=>J.startsWith("property "))) {
            const [J,u,h] = c.split(" ");
            if (o.push({
                name: h,
                type: u,
                offset: F
            }),
            !s[u])
                throw new Error(`Unsupported property type: ${u}`);
            F += s[u]
        }
        const i = new DataView(e,d + 11)
          , V = new ArrayBuffer(g.RowLength * U)
          , r = I.FromEuler(new X(Math.PI / 2,0,0));
        for (let c = 0; c < U; c++) {
            const J = new Float32Array(V,c * g.RowLength,3)
              , u = new Float32Array(V,c * g.RowLength + 12,3)
              , h = new Uint8ClampedArray(V,c * g.RowLength + 24,4)
              , Q = new Uint8ClampedArray(V,c * g.RowLength + 28,4);
            let R = 255
              , W = 0
              , T = 0
              , E = 0;
            o.forEach(w=>{
                let G;
                switch (w.type) {
                case "float":
                    G = i.getFloat32(w.offset + c * F, true);
                    break;
                case "int":
                    G = i.getInt32(w.offset + c * F, true);
                    break;
                default:
                    throw new Error(`Unsupported property type: ${w.type}`)
                }
                switch (w.name) {
                case "x":
                    J[0] = G;
                    break;
                case "y":
                    J[1] = G;
                    break;
                case "z":
                    J[2] = G;
                    break;
                case "scale_0":
                    u[0] = Math.exp(G);
                    break;
                case "scale_1":
                    u[1] = Math.exp(G);
                    break;
                case "scale_2":
                    u[2] = Math.exp(G);
                    break;
                case "red":
                    h[0] = G;
                    break;
                case "green":
                    h[1] = G;
                    break;
                case "blue":
                    h[2] = G;
                    break;
                case "f_dc_0":
                    h[0] = 255 * (.5 + D * G);
                    break;
                case "f_dc_1":
                    h[1] = 255 * (.5 + D * G);
                    break;
                case "f_dc_2":
                    h[2] = 255 * (.5 + D * G);
                    break;
                case "f_dc_3":
                    h[3] = 255 * (.5 + D * G);
                    break;
                case "opacity":
                    h[3] = 1 / (1 + Math.exp(-G)) * 255;
                    break;
                case "rot_0":
                    R = G;
                    break;
                case "rot_1":
                    W = G;
                    break;
                case "rot_2":
                    T = G;
                    break;
                case "rot_3":
                    E = G
                }
            }
            );
            let p = new I(W,T,E,R);
            switch (n) {
            case "polycam":
                {
                    const w = J[1];
                    J[1] = -J[2],
                    J[2] = w,
                    p = r.multiply(p);
                    break
                }
            case "":
                break;
            default:
                throw new Error(`Unsupported format: ${n}`)
            }
            p = p.normalize(),
            Q[0] = 128 * p.w + 128,
            Q[1] = 128 * p.x + 128,
            Q[2] = 128 * p.y + 128,
            Q[3] = 128 * p.z + 128
        }
        return V
    }
    static _parsePLYHeader(e, n) {
        const l = new Uint8Array(e)
          , t = new TextDecoder().decode(l.slice(0, 10240))
          , a = `end_header
`
          , d = t.indexOf(a);
        if (d < 0)
            throw new Error("Unable to read .ply file header");
        const U = parseInt(/element vertex (\d+)\n/.exec(t)[1]);
        let F = 0;
        const s = {
            double: 8,
            int: 4,
            uint: 4,
            float: 4,
            short: 2,
            ushort: 2,
            uchar: 1
        }
          , o = [];
        for (const i of t.slice(0, d).split(`
`).filter(V=>V.startsWith("property "))) {
            const [V,r,c] = i.split(" ");
            if (o.push({
                name: c,
                type: r,
                offset: F
            }),
            !s[r])
                throw new Error(`Unsupported property type: ${r}`);
            F += s[r]
        }
        return {
            properties: o,
            size: d + 11,
            vertexCount: U
        }
    }
    static _ParseFullPLYBufferFast(e, n, l) {
        const t = new DataView(n,e.size)
          , a = new ArrayBuffer(g.RowLength * e.vertexCount)
          , d = new ArrayBuffer(192 * e.vertexCount)
          , U = e.properties.reduce((c,J)=>(c[J.name] = J,
        c), {})
          , F = e.properties[e.properties.length - 1].offset + 4;
        let s, o = 255, i = 0, V = 0, r = 0;
        for (let c = 0; c < e.vertexCount; c++) {
            const J = new Float32Array(a,c * g.RowLength,3)
              , u = new Float32Array(a,c * g.RowLength + 12,3)
              , h = new Uint8ClampedArray(a,c * g.RowLength + 24,4)
              , Q = new Uint8ClampedArray(a,c * g.RowLength + 28,4)
              , R = new Float32Array(d,192 * c,48);
            J.set([t.getFloat32(U.x.offset + c * F, true), t.getFloat32(U.y.offset + c * F, true), t.getFloat32(U.z.offset + c * F, true)], 0),
            u.set([Math.exp(t.getFloat32(U.scale_0.offset + c * F, true)), Math.exp(t.getFloat32(U.scale_1.offset + c * F, true)), Math.exp(t.getFloat32(U.scale_2.offset + c * F, true))], 0),
            h.set([.5 + D * t.getFloat32(U.f_dc_0.offset + c * F, true) * 255, .5 + D * t.getFloat32(U.f_dc_1.offset + c * F, true) * 255, .5 + D * t.getFloat32(U.f_dc_2.offset + c * F, true) * 255, 1 / (1 + Math.exp(-t.getFloat32(U.opacity.offset + c * F, true))) * 255], 0),
            o = t.getFloat32(U.rot_0.offset + c * F, true),
            i = t.getFloat32(U.rot_1.offset + c * F, true),
            V = t.getFloat32(U.rot_2.offset + c * F, true),
            r = t.getFloat32(U.rot_3.offset + c * F, true),
            s = new I(i,V,r,o),
            s = s.normalize(),
            Q.set([128 * s.w + 128, 128 * s.x + 128, 128 * s.y + 128, 128 * s.z + 128], 0),
            R.set([t.getFloat32(U.f_dc_0.offset + c * F, true), t.getFloat32(U.f_dc_1.offset + c * F, true), t.getFloat32(U.f_dc_2.offset + c * F, true)], 0),
            R.set([t.getFloat32(U.f_rest_0.offset + c * F, true), t.getFloat32(U.f_rest_15.offset + c * F, true), t.getFloat32(U.f_rest_30.offset + c * F, true), t.getFloat32(U.f_rest_1.offset + c * F, true), t.getFloat32(U.f_rest_16.offset + c * F, true), t.getFloat32(U.f_rest_31.offset + c * F, true), t.getFloat32(U.f_rest_2.offset + c * F, true), t.getFloat32(U.f_rest_17.offset + c * F, true), t.getFloat32(U.f_rest_32.offset + c * F, true), t.getFloat32(U.f_rest_3.offset + c * F, true), t.getFloat32(U.f_rest_18.offset + c * F, true), t.getFloat32(U.f_rest_33.offset + c * F, true), t.getFloat32(U.f_rest_4.offset + c * F, true), t.getFloat32(U.f_rest_19.offset + c * F, true), t.getFloat32(U.f_rest_34.offset + c * F, true), t.getFloat32(U.f_rest_5.offset + c * F, true), t.getFloat32(U.f_rest_20.offset + c * F, true), t.getFloat32(U.f_rest_35.offset + c * F, true), t.getFloat32(U.f_rest_6.offset + c * F, true), t.getFloat32(U.f_rest_21.offset + c * F, true), t.getFloat32(U.f_rest_36.offset + c * F, true), t.getFloat32(U.f_rest_7.offset + c * F, true), t.getFloat32(U.f_rest_22.offset + c * F, true), t.getFloat32(U.f_rest_37.offset + c * F, true), t.getFloat32(U.f_rest_8.offset + c * F, true), t.getFloat32(U.f_rest_23.offset + c * F, true), t.getFloat32(U.f_rest_38.offset + c * F, true), t.getFloat32(U.f_rest_9.offset + c * F, true), t.getFloat32(U.f_rest_24.offset + c * F, true), t.getFloat32(U.f_rest_38.offset + c * F, true), t.getFloat32(U.f_rest_10.offset + c * F, true), t.getFloat32(U.f_rest_25.offset + c * F, true), t.getFloat32(U.f_rest_40.offset + c * F, true), t.getFloat32(U.f_rest_11.offset + c * F, true), t.getFloat32(U.f_rest_26.offset + c * F, true), t.getFloat32(U.f_rest_41.offset + c * F, true), t.getFloat32(U.f_rest_12.offset + c * F, true), t.getFloat32(U.f_rest_27.offset + c * F, true), t.getFloat32(U.f_rest_42.offset + c * F, true), t.getFloat32(U.f_rest_13.offset + c * F, true), t.getFloat32(U.f_rest_28.offset + c * F, true), t.getFloat32(U.f_rest_43.offset + c * F, true), t.getFloat32(U.f_rest_14.offset + c * F, true), t.getFloat32(U.f_rest_29.offset + c * F, true), t.getFloat32(U.f_rest_44.offset + c * F, true)], 3)
        }
        return [a, d]
    }
    static _ParseFullPLYBuffer(e, n) {
        let l = new Float32Array(3)
          , t = new Float32Array(3);
        const a = new Uint8Array(e)
          , d = new TextDecoder().decode(a.slice(0, 10240))
          , U = `end_header
`
          , F = d.indexOf(U);
        if (F < 0)
            throw new Error("Unable to read .ply file header");
        const s = parseInt(/element vertex (\d+)\n/.exec(d)[1]);
        let o = 0;
        const i = {
            double: 8,
            int: 4,
            uint: 4,
            float: 4,
            short: 2,
            ushort: 2,
            uchar: 1
        }
          , V = [];
        for (const h of d.slice(0, F).split(`
`).filter(Q=>Q.startsWith("property "))) {
            const [Q,R,W] = h.split(" ");
            if (V.push({
                name: W,
                type: R,
                offset: o
            }),
            !i[R])
                throw new Error(`Unsupported property type: ${R}`);
            o += i[R]
        }
        const r = new DataView(e,F + 11)
          , c = new ArrayBuffer(g.RowLength * s)
          , J = new ArrayBuffer(192 * s)
          , u = I.FromEuler(new X(Math.PI / 2,0,0));
        console.log("ROW OFFSET " + o);
        for (let h = 0; h < s; h++) {
            const Q = new Float32Array(c,h * g.RowLength,3)
              , R = new Float32Array(c,h * g.RowLength + 12,3)
              , W = new Uint8ClampedArray(c,h * g.RowLength + 24,4)
              , T = new Uint8ClampedArray(c,h * g.RowLength + 28,4)
              , E = new Float32Array(J,192 * h,48);
            let p = 255
              , w = 0
              , G = 0
              , j = 0;
            V.forEach(H=>{
                let B;
                switch (H.type) {
                case "float":
                    B = r.getFloat32(H.offset + h * o, true);
                    break;
                case "int":
                    B = r.getInt32(H.offset + h * o, true);
                    break;
                default:
                    throw new Error(`Unsupported property type: ${H.type}`)
                }
                if (H.name.startsWith("f_rest")) {
                    let N = parseInt(H.name.split("_").slice(-1)[0]);
                    const v = 3 + (N % 15 * 3 + Math.floor(N / 15));
                    E[v] = B
                } else
                    switch (H.name) {
                    case "x":
                        Q[0] = B;
                        break;
                    case "y":
                        Q[1] = B;
                        break;
                    case "z":
                        Q[2] = B;
                        break;
                    case "scale_0":
                        R[0] = Math.exp(B);
                        break;
                    case "scale_1":
                        R[1] = Math.exp(B);
                        break;
                    case "scale_2":
                        R[2] = Math.exp(B);
                        break;
                    case "red":
                        W[0] = B;
                        break;
                    case "green":
                        W[1] = B;
                        break;
                    case "blue":
                        W[2] = B;
                        break;
                    case "f_dc_0":
                        W[0] = 255 * (.5 + D * B),
                        E[0] = B,
                        l[0] = B < l[0] ? B : l[0],
                        t[0] = B > t[0] ? B : t[0];
                        break;
                    case "f_dc_1":
                        W[1] = 255 * (.5 + D * B),
                        E[1] = B,
                        l[1] = B < l[1] ? B : l[1],
                        t[1] = B > t[1] ? B : t[1];
                        break;
                    case "f_dc_2":
                        W[2] = 255 * (.5 + D * B),
                        E[2] = B,
                        l[2] = B < l[2] ? B : l[2],
                        t[2] = B > t[2] ? B : t[2];
                        break;
                    case "f_dc_3":
                        W[3] = 255 * (.5 + D * B);
                        break;
                    case "opacity":
                        W[3] = 1 / (1 + Math.exp(-B)) * 255;
                        break;
                    case "rot_0":
                        p = B;
                        break;
                    case "rot_1":
                        w = B;
                        break;
                    case "rot_2":
                        G = B;
                        break;
                    case "rot_3":
                        j = B
                    }
            }
            );
            let M = new I(w,G,j,p);
            switch (n) {
            case "polycam":
                {
                    const H = Q[1];
                    Q[1] = -Q[2],
                    Q[2] = H,
                    M = u.multiply(M);
                    break
                }
            case "":
                break;
            default:
                throw new Error(`Unsupported format: ${n}`)
            }
            M = M.normalize(),
            T[0] = 128 * M.w + 128,
            T[1] = 128 * M.x + 128,
            T[2] = 128 * M.y + 128,
            T[3] = 128 * M.z + 128
        }
        return [c, J]
    }
    static _ParseQPLYBuffer(e, n) {
        var l;
        console.log("parsing ...");
        let t = performance.now();
        const a = new Uint8Array(e)
          , d = new TextDecoder().decode(a.slice(0, 10240))
          , U = `end_header
`
          , F = d.indexOf(U)
          , s = d.indexOf(`element codebook_centers 256
`);
        if (F < 0)
            throw new Error("Unable to read .ply file header");
        let o = []
          , i = [];
        (l = d.match(/element vertex_(\d+) (\d+)/g)) === null || l === void 0 || l.forEach(m=>{
            o.push(parseInt(m.split(" ")[2])),
            i.push(d.indexOf(m))
        }
        );
        let V = [[0, i[1]], [i[1], i[2]], [i[2], i[3]], [i[3], s]];
        const r = {
            double: 8,
            int: 4,
            uint: 4,
            float: 4,
            short: 2,
            ushort: 2,
            uchar: 1
        };
        let c = 0;
        const J = [];
        let u = []
          , h = 0;
        for (let m = 0; m < 4; m++) {
            const x = o[m]
              , S = V[m][0]
              , f = V[m][1];
            h += x;
            let K = 0;
            const y = [];
            for (const L of d.slice(S, f).split(`
`).filter(tt=>tt.startsWith("property "))) {
                const [tt,lt,Wt] = L.split(" ");
                if (y.push({
                    name: Wt,
                    type: lt,
                    offset: K
                }),
                !r[lt])
                    throw new Error(`Unsupported property type: ${lt}`);
                K += r[lt]
            }
            J.push(y),
            u.push(K),
            c += x * K
        }
        let Q = {};
        const R = [];
        let W = 0;
        for (const m of d.slice(s, F).split(`
`).filter(x=>x.startsWith("property "))) {
            const [x,S,f] = m.split(" ");
            R.push({
                name: f,
                data: new Float32Array(256)
            }),
            Q[f] = W,
            W++
        }
        const T = R.length
          , E = new DataView(e,c + F + 11,2 * T * 256);
        for (let m = 0; m < T; m++)
            for (let x = 0; x < 256; x++) {
                const S = E.getInt16(x * T * 2 + 2 * m, true);
                R[m].data[x] = ht(new Int16Array([S]), 0, 1)[0]
            }
        const p = new DataView(e,F + 11,c)
          , w = new ArrayBuffer(g.RowLength * h)
          , G = new ArrayBuffer(192 * (o[1] + o[2] + o[3]));
        let j = performance.now();
        console.log(`setting codebook, preparing for data fetching took ${j - t}ms.`);
        const M = [];
        for (let m = 0; m < 4; m++) {
            const x = J[m].reduce((S,f)=>(S[f.name] = f,
            S), {});
            M.push(x)
        }
        let H = 0
          , B = 0
          , N = 0
          , v = 0;
        const P = [3, 8, 15];
        let A = 0;
        const _ = M[1].f_rest_0.offset;
        for (let m = 0; m < 4; m++) {
            t = performance.now();
            const x = o[m]
              , S = M[m]
              , f = u[m];
            m > 0 && (H = 192,
            A = P[m - 1]);
            const K = J[m].filter(y=>y.name.startsWith("f_rest"));
            for (let y = 0; y < x; y++) {
                const L = new Float32Array(w,B + y * g.RowLength,3)
                  , tt = new Float32Array(w,B + y * g.RowLength + 12,3)
                  , lt = new Uint8ClampedArray(w,B + y * g.RowLength + 24,4)
                  , Wt = new Uint8ClampedArray(w,B + y * g.RowLength + 28,4)
                  , Xt = new Float32Array(G,v + y * H,H / 4);
                let q, st, ct, Ft = [255, 0, 0, 0];
                L.set([ht(new Int16Array([p.getInt16(N + S.x.offset + y * f, true)]), 0, 1)[0], ht(new Int16Array([p.getInt16(N + S.y.offset + y * f, true)]), 0, 1)[0], ht(new Int16Array([p.getInt16(N + S.z.offset + y * f, true)]), 0, 1)[0]], 0),
                q = Q.scaling,
                tt.set([Math.exp(R[q].data[p.getUint8(N + S.scale_0.offset + y * f)]), Math.exp(R[q].data[p.getUint8(N + S.scale_1.offset + y * f)]), Math.exp(R[q].data[p.getUint8(N + S.scale_2.offset + y * f)])], 0);
                const _t = S.rot_0;
                q = p.getUint8(N + _t.offset + y * f),
                st = Q.rotation_re,
                ct = R[st].data[q],
                Ft[0] = ct;
                for (let it = 1; it < 4; it++) {
                    const Vt = S[`rot_${it}`];
                    q = p.getUint8(N + Vt.offset + y * f),
                    st = Q.rotation_im,
                    ct = R[st].data[q],
                    Ft[it] = ct
                }
                let Ut = new I(Ft[1],Ft[2],Ft[3],Ft[0]);
                Ut = Ut.normalize(),
                Wt.set([128 * Ut.w + 128, 128 * Ut.x + 128, 128 * Ut.y + 128, 128 * Ut.z + 128], 0),
                lt.set([255 * (.5 + D * R[Q.features_dc].data[p.getUint8(N + S.f_dc_0.offset + y * f)]), 255 * (.5 + D * R[Q.features_dc].data[p.getUint8(N + S.f_dc_1.offset + y * f)]), 255 * (.5 + D * R[Q.features_dc].data[p.getUint8(N + S.f_dc_2.offset + y * f)]), 1 / (1 + Math.exp(-R[Q.opacity].data[p.getUint8(N + S.opacity.offset + y * f)])) * 255], 0),
                m > 0 && (Xt.set([R[Q.features_dc].data[p.getUint8(N + S.f_dc_0.offset + y * f)], R[Q.features_dc].data[p.getUint8(N + S.f_dc_1.offset + y * f)], R[Q.features_dc].data[p.getUint8(N + S.f_dc_2.offset + y * f)]], 0),
                Xt.set(K.map((it,Vt)=>{
                    const Nt = Math.floor(Vt / 3)
                      , Mt = _ + (Nt + A * (Vt % 3));
                    return q = p.getUint8(N + Mt + y * f),
                    st = Q[`features_rest_${Nt}`],
                    R[st].data[q]
                }
                ), 3))
            }
            j = performance.now(),
            console.log(`parsing ${x} vertices took ${j - t}ms.`),
            B += x * g.RowLength,
            N += x * f,
            m > 0 && (v += x * H)
        }
        const Z = o[0] - 1
          , k = Z + o[1]
          , C = k + o[2];
        return [w, G, new Int32Array([Z, k, C])]
    }
}
function At(b, e, n) {
    var l = e === void 0 ? null : e
      , t = function(F, s) {
        var o = atob(F);
        if (s) {
            for (var i = new Uint8Array(o.length), V = 0, r = o.length; V < r; ++V)
                i[V] = o.charCodeAt(V);
            return String.fromCharCode.apply(null, new Uint16Array(i.buffer))
        }
        return o
    }(b, n !== void 0 && n)
      , a = t.indexOf(`
`, 10) + 1
      , d = t.substring(a) + (l ? "//# sourceMappingURL=" + l : "")
      , U = new Blob([d],{
        type: "application/javascript"
    });
    return URL.createObjectURL(U)
}
nt.timestamp = 0,
nt.changeEvent = {
    type: "change"
};
var St, kt, Yt, Bt, Lt = (St = "Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICd1c2Ugc3RyaWN0JzsKCiAgdmFyIGxvYWRXYXNtID0gKCgpID0+IHsKICAgIAogICAgcmV0dXJuICgKICBmdW5jdGlvbihtb2R1bGVBcmcgPSB7fSkgewoKICB2YXIgTW9kdWxlPW1vZHVsZUFyZzt2YXIgcmVhZHlQcm9taXNlUmVzb2x2ZSxyZWFkeVByb21pc2VSZWplY3Q7TW9kdWxlWyJyZWFkeSJdPW5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9PntyZWFkeVByb21pc2VSZXNvbHZlPXJlc29sdmU7cmVhZHlQcm9taXNlUmVqZWN0PXJlamVjdDt9KTt2YXIgbW9kdWxlT3ZlcnJpZGVzPU9iamVjdC5hc3NpZ24oe30sTW9kdWxlKTt2YXIgc2NyaXB0RGlyZWN0b3J5PSIiO2Z1bmN0aW9uIGxvY2F0ZUZpbGUocGF0aCl7aWYoTW9kdWxlWyJsb2NhdGVGaWxlIl0pe3JldHVybiBNb2R1bGVbImxvY2F0ZUZpbGUiXShwYXRoLHNjcmlwdERpcmVjdG9yeSl9cmV0dXJuIHNjcmlwdERpcmVjdG9yeStwYXRofXZhciByZWFkQmluYXJ5O3t7c2NyaXB0RGlyZWN0b3J5PXNlbGYubG9jYXRpb24uaHJlZjt9aWYoc2NyaXB0RGlyZWN0b3J5LmluZGV4T2YoImJsb2I6IikhPT0wKXtzY3JpcHREaXJlY3Rvcnk9c2NyaXB0RGlyZWN0b3J5LnN1YnN0cigwLHNjcmlwdERpcmVjdG9yeS5yZXBsYWNlKC9bPyNdLiovLCIiKS5sYXN0SW5kZXhPZigiLyIpKzEpO31lbHNlIHtzY3JpcHREaXJlY3Rvcnk9IiI7fXt7cmVhZEJpbmFyeT11cmw9Pnt2YXIgeGhyPW5ldyBYTUxIdHRwUmVxdWVzdDt4aHIub3BlbigiR0VUIix1cmwsZmFsc2UpO3hoci5yZXNwb25zZVR5cGU9ImFycmF5YnVmZmVyIjt4aHIuc2VuZChudWxsKTtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoeGhyLnJlc3BvbnNlKX07fX19TW9kdWxlWyJwcmludCJdfHxjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO3ZhciBlcnI9TW9kdWxlWyJwcmludEVyciJdfHxjb25zb2xlLmVycm9yLmJpbmQoY29uc29sZSk7T2JqZWN0LmFzc2lnbihNb2R1bGUsbW9kdWxlT3ZlcnJpZGVzKTttb2R1bGVPdmVycmlkZXM9bnVsbDtpZihNb2R1bGVbImFyZ3VtZW50cyJdKU1vZHVsZVsiYXJndW1lbnRzIl07aWYoTW9kdWxlWyJ0aGlzUHJvZ3JhbSJdKU1vZHVsZVsidGhpc1Byb2dyYW0iXTtpZihNb2R1bGVbInF1aXQiXSlNb2R1bGVbInF1aXQiXTt2YXIgd2FzbUJpbmFyeTtpZihNb2R1bGVbIndhc21CaW5hcnkiXSl3YXNtQmluYXJ5PU1vZHVsZVsid2FzbUJpbmFyeSJdO2lmKHR5cGVvZiBXZWJBc3NlbWJseSE9Im9iamVjdCIpe2Fib3J0KCJubyBuYXRpdmUgd2FzbSBzdXBwb3J0IGRldGVjdGVkIik7fXZhciB3YXNtTWVtb3J5O3ZhciBBQk9SVD1mYWxzZTt2YXIgSEVBUDgsSEVBUFU4LEhFQVAxNixIRUFQVTE2LEhFQVAzMixIRUFQVTMyLEhFQVBGMzIsSEVBUEY2NDtmdW5jdGlvbiB1cGRhdGVNZW1vcnlWaWV3cygpe3ZhciBiPXdhc21NZW1vcnkuYnVmZmVyO01vZHVsZVsiSEVBUDgiXT1IRUFQOD1uZXcgSW50OEFycmF5KGIpO01vZHVsZVsiSEVBUDE2Il09SEVBUDE2PW5ldyBJbnQxNkFycmF5KGIpO01vZHVsZVsiSEVBUFU4Il09SEVBUFU4PW5ldyBVaW50OEFycmF5KGIpO01vZHVsZVsiSEVBUFUxNiJdPUhFQVBVMTY9bmV3IFVpbnQxNkFycmF5KGIpO01vZHVsZVsiSEVBUDMyIl09SEVBUDMyPW5ldyBJbnQzMkFycmF5KGIpO01vZHVsZVsiSEVBUFUzMiJdPUhFQVBVMzI9bmV3IFVpbnQzMkFycmF5KGIpO01vZHVsZVsiSEVBUEYzMiJdPUhFQVBGMzI9bmV3IEZsb2F0MzJBcnJheShiKTtNb2R1bGVbIkhFQVBGNjQiXT1IRUFQRjY0PW5ldyBGbG9hdDY0QXJyYXkoYik7fXZhciBfX0FUUFJFUlVOX189W107dmFyIF9fQVRJTklUX189W107dmFyIF9fQVRQT1NUUlVOX189W107ZnVuY3Rpb24gcHJlUnVuKCl7aWYoTW9kdWxlWyJwcmVSdW4iXSl7aWYodHlwZW9mIE1vZHVsZVsicHJlUnVuIl09PSJmdW5jdGlvbiIpTW9kdWxlWyJwcmVSdW4iXT1bTW9kdWxlWyJwcmVSdW4iXV07d2hpbGUoTW9kdWxlWyJwcmVSdW4iXS5sZW5ndGgpe2FkZE9uUHJlUnVuKE1vZHVsZVsicHJlUnVuIl0uc2hpZnQoKSk7fX1jYWxsUnVudGltZUNhbGxiYWNrcyhfX0FUUFJFUlVOX18pO31mdW5jdGlvbiBpbml0UnVudGltZSgpe2NhbGxSdW50aW1lQ2FsbGJhY2tzKF9fQVRJTklUX18pO31mdW5jdGlvbiBwb3N0UnVuKCl7aWYoTW9kdWxlWyJwb3N0UnVuIl0pe2lmKHR5cGVvZiBNb2R1bGVbInBvc3RSdW4iXT09ImZ1bmN0aW9uIilNb2R1bGVbInBvc3RSdW4iXT1bTW9kdWxlWyJwb3N0UnVuIl1dO3doaWxlKE1vZHVsZVsicG9zdFJ1biJdLmxlbmd0aCl7YWRkT25Qb3N0UnVuKE1vZHVsZVsicG9zdFJ1biJdLnNoaWZ0KCkpO319Y2FsbFJ1bnRpbWVDYWxsYmFja3MoX19BVFBPU1RSVU5fXyk7fWZ1bmN0aW9uIGFkZE9uUHJlUnVuKGNiKXtfX0FUUFJFUlVOX18udW5zaGlmdChjYik7fWZ1bmN0aW9uIGFkZE9uSW5pdChjYil7X19BVElOSVRfXy51bnNoaWZ0KGNiKTt9ZnVuY3Rpb24gYWRkT25Qb3N0UnVuKGNiKXtfX0FUUE9TVFJVTl9fLnVuc2hpZnQoY2IpO312YXIgcnVuRGVwZW5kZW5jaWVzPTA7dmFyIGRlcGVuZGVuY2llc0Z1bGZpbGxlZD1udWxsO2Z1bmN0aW9uIGFkZFJ1bkRlcGVuZGVuY3koaWQpe3J1bkRlcGVuZGVuY2llcysrO2lmKE1vZHVsZVsibW9uaXRvclJ1bkRlcGVuZGVuY2llcyJdKXtNb2R1bGVbIm1vbml0b3JSdW5EZXBlbmRlbmNpZXMiXShydW5EZXBlbmRlbmNpZXMpO319ZnVuY3Rpb24gcmVtb3ZlUnVuRGVwZW5kZW5jeShpZCl7cnVuRGVwZW5kZW5jaWVzLS07aWYoTW9kdWxlWyJtb25pdG9yUnVuRGVwZW5kZW5jaWVzIl0pe01vZHVsZVsibW9uaXRvclJ1bkRlcGVuZGVuY2llcyJdKHJ1bkRlcGVuZGVuY2llcyk7fWlmKHJ1bkRlcGVuZGVuY2llcz09MCl7aWYoZGVwZW5kZW5jaWVzRnVsZmlsbGVkKXt2YXIgY2FsbGJhY2s9ZGVwZW5kZW5jaWVzRnVsZmlsbGVkO2RlcGVuZGVuY2llc0Z1bGZpbGxlZD1udWxsO2NhbGxiYWNrKCk7fX19ZnVuY3Rpb24gYWJvcnQod2hhdCl7aWYoTW9kdWxlWyJvbkFib3J0Il0pe01vZHVsZVsib25BYm9ydCJdKHdoYXQpO313aGF0PSJBYm9ydGVkKCIrd2hhdCsiKSI7ZXJyKHdoYXQpO0FCT1JUPXRydWU7d2hhdCs9Ii4gQnVpbGQgd2l0aCAtc0FTU0VSVElPTlMgZm9yIG1vcmUgaW5mby4iO3ZhciBlPW5ldyBXZWJBc3NlbWJseS5SdW50aW1lRXJyb3Iod2hhdCk7cmVhZHlQcm9taXNlUmVqZWN0KGUpO3Rocm93IGV9dmFyIGRhdGFVUklQcmVmaXg9ImRhdGE6YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtO2Jhc2U2NCwiO3ZhciBpc0RhdGFVUkk9ZmlsZW5hbWU9PmZpbGVuYW1lLnN0YXJ0c1dpdGgoZGF0YVVSSVByZWZpeCk7dmFyIHdhc21CaW5hcnlGaWxlO3dhc21CaW5hcnlGaWxlPSJkYXRhOmFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbTtiYXNlNjQsQUdGemJRRUFBQUFCVGd4Z0JIOS9mMzhBWUFOL2YzOEFZQVYvZjM5L2Z3QmdCbjkvZjM5L2Z3QmdBWDhCZjJBQUFHQUNmMzhBWUFOL2YzOEJmMkFCZndCZ0IzOS9mMzkvZjM4QVlBSi9md0YvWUFSL2YzNStBQUk5Q2dGaEFXRUFBUUZoQVdJQUFnRmhBV01BQVFGaEFXUUFCZ0ZoQVdVQUFRRmhBV1lBQ1FGaEFXY0FCQUZoQVdnQUJnRmhBV2tBQUFGaEFXb0FCZ01aR0FjRUNBVUlDZ1VMQVFBQkNBUUZBd01DQWdBQUJ3Y0VDUVFGQVhBQkVCQUZCd0VCZ0FLQWdBSUdDQUYvQVVIZ25RUUxCeDBIQVdzQ0FBRnNBQTBCYlFBaEFXNEFGd0Z2QVFBQmNBQVdBWEVBRGdrVkFRQkJBUXNQRUNBTUZSVWZEQjRZR2gwTUdSc2NDcDlIR0hFQkFYOGdBa1VFUUNBQUtBSUVJQUVvQWdSR0R3c2dBQ0FCUmdSQVFRRVBDd0pBSUFBb0FnUWlBaTBBQUNJQVJTQUFJQUVvQWdRaUFTMEFBQ0lEUjNJTkFBTkFJQUV0QUFFaEF5QUNMUUFCSWdCRkRRRWdBVUVCYWlFQklBSkJBV29oQWlBQUlBTkdEUUFMQ3lBQUlBTkdDMDhCQW45QjJCa29BZ0FpQVNBQVFRZHFRWGh4SWdKcUlRQUNRQ0FDUVFBZ0FDQUJUUnNOQUNBQVB3QkJFSFJMQkVBZ0FCQUdSUTBCQzBIWUdTQUFOZ0lBSUFFUEMwSG9HVUV3TmdJQVFYOExCZ0FnQUJBT0N5a0FRZUFaUVFFMkFnQkI1QmxCQURZQ0FCQVFRZVFaUWR3WktBSUFOZ0lBUWR3WlFlQVpOZ0lBQzlJTEFRZC9Ba0FnQUVVTkFDQUFRUWhySWdJZ0FFRUVheWdDQUNJQlFYaHhJZ0JxSVFVQ1FDQUJRUUZ4RFFBZ0FVRURjVVVOQVNBQ0lBSW9BZ0FpQVdzaUFrSDhHU2dDQUVrTkFTQUFJQUZxSVFBQ1FBSkFRWUFhS0FJQUlBSkhCRUFnQVVIL0FVMEVRQ0FCUVFOMklRUWdBaWdDRENJQklBSW9BZ2dpQTBZRVFFSHNHVUhzR1NnQ0FFRitJQVIzY1RZQ0FBd0ZDeUFESUFFMkFnd2dBU0FETmdJSURBUUxJQUlvQWhnaEJpQUNJQUlvQWd3aUFVY0VRQ0FDS0FJSUlnTWdBVFlDRENBQklBTTJBZ2dNQXdzZ0FrRVVhaUlFS0FJQUlnTkZCRUFnQWlnQ0VDSURSUTBDSUFKQkVHb2hCQXNEUUNBRUlRY2dBeUlCUVJScUlnUW9BZ0FpQXcwQUlBRkJFR29oQkNBQktBSVFJZ01OQUFzZ0IwRUFOZ0lBREFJTElBVW9BZ1FpQVVFRGNVRURSdzBDUWZRWklBQTJBZ0FnQlNBQlFYNXhOZ0lFSUFJZ0FFRUJjallDQkNBRklBQTJBZ0FQQzBFQUlRRUxJQVpGRFFBQ1FDQUNLQUljSWdOQkFuUkJuQnhxSWdRb0FnQWdBa1lFUUNBRUlBRTJBZ0FnQVEwQlFmQVpRZkFaS0FJQVFYNGdBM2R4TmdJQURBSUxJQVpCRUVFVUlBWW9BaEFnQWtZYmFpQUJOZ0lBSUFGRkRRRUxJQUVnQmpZQ0dDQUNLQUlRSWdNRVFDQUJJQU0yQWhBZ0F5QUJOZ0lZQ3lBQ0tBSVVJZ05GRFFBZ0FTQUROZ0lVSUFNZ0FUWUNHQXNnQWlBRlR3MEFJQVVvQWdRaUFVRUJjVVVOQUFKQUFrQUNRQUpBSUFGQkFuRkZCRUJCaEJvb0FnQWdCVVlFUUVHRUdpQUNOZ0lBUWZnWlFmZ1pLQUlBSUFCcUlnQTJBZ0FnQWlBQVFRRnlOZ0lFSUFKQmdCb29BZ0JIRFFaQjlCbEJBRFlDQUVHQUdrRUFOZ0lBRHd0QmdCb29BZ0FnQlVZRVFFR0FHaUFDTmdJQVFmUVpRZlFaS0FJQUlBQnFJZ0EyQWdBZ0FpQUFRUUZ5TmdJRUlBQWdBbW9nQURZQ0FBOExJQUZCZUhFZ0FHb2hBQ0FCUWY4QlRRUkFJQUZCQTNZaEJDQUZLQUlNSWdFZ0JTZ0NDQ0lEUmdSQVFld1pRZXdaS0FJQVFYNGdCSGR4TmdJQURBVUxJQU1nQVRZQ0RDQUJJQU0yQWdnTUJBc2dCU2dDR0NFR0lBVWdCU2dDRENJQlJ3UkFRZndaS0FJQUdpQUZLQUlJSWdNZ0FUWUNEQ0FCSUFNMkFnZ01Bd3NnQlVFVWFpSUVLQUlBSWdORkJFQWdCU2dDRUNJRFJRMENJQVZCRUdvaEJBc0RRQ0FFSVFjZ0F5SUJRUlJxSWdRb0FnQWlBdzBBSUFGQkVHb2hCQ0FCS0FJUUlnTU5BQXNnQjBFQU5nSUFEQUlMSUFVZ0FVRitjVFlDQkNBQ0lBQkJBWEkyQWdRZ0FDQUNhaUFBTmdJQURBTUxRUUFoQVFzZ0JrVU5BQUpBSUFVb0Fod2lBMEVDZEVHY0hHb2lCQ2dDQUNBRlJnUkFJQVFnQVRZQ0FDQUJEUUZCOEJsQjhCa29BZ0JCZmlBRGQzRTJBZ0FNQWdzZ0JrRVFRUlFnQmlnQ0VDQUZSaHRxSUFFMkFnQWdBVVVOQVFzZ0FTQUdOZ0lZSUFVb0FoQWlBd1JBSUFFZ0F6WUNFQ0FESUFFMkFoZ0xJQVVvQWhRaUEwVU5BQ0FCSUFNMkFoUWdBeUFCTmdJWUN5QUNJQUJCQVhJMkFnUWdBQ0FDYWlBQU5nSUFJQUpCZ0Jvb0FnQkhEUUJCOUJrZ0FEWUNBQThMSUFCQi93Rk5CRUFnQUVGNGNVR1VHbW9oQVFKL1Fld1pLQUlBSWdOQkFTQUFRUU4yZENJQWNVVUVRRUhzR1NBQUlBTnlOZ0lBSUFFTUFRc2dBU2dDQ0FzaEFDQUJJQUkyQWdnZ0FDQUNOZ0lNSUFJZ0FUWUNEQ0FDSUFBMkFnZ1BDMEVmSVFNZ0FFSC8vLzhIVFFSQUlBQkJKaUFBUVFoMlp5SUJhM1pCQVhFZ0FVRUJkR3RCUG1vaEF3c2dBaUFETmdJY0lBSkNBRGNDRUNBRFFRSjBRWndjYWlFQkFrQUNRQUpBUWZBWktBSUFJZ1JCQVNBRGRDSUhjVVVFUUVId0dTQUVJQWR5TmdJQUlBRWdBallDQUNBQ0lBRTJBaGdNQVFzZ0FFRVpJQU5CQVhaclFRQWdBMEVmUnh0MElRTWdBU2dDQUNFQkEwQWdBU0lFS0FJRVFYaHhJQUJHRFFJZ0EwRWRkaUVCSUFOQkFYUWhBeUFFSUFGQkJIRnFJZ2RCRUdvb0FnQWlBUTBBQ3lBSElBSTJBaEFnQWlBRU5nSVlDeUFDSUFJMkFnd2dBaUFDTmdJSURBRUxJQVFvQWdnaUFDQUNOZ0lNSUFRZ0FqWUNDQ0FDUVFBMkFoZ2dBaUFFTmdJTUlBSWdBRFlDQ0F0QmpCcEJqQm9vQWdCQkFXc2lBRUYvSUFBYk5nSUFDd3NwQVFGL0lBRUVRQ0FBSVFJRFFDQUNRUUE2QUFBZ0FrRUJhaUVDSUFGQkFXc2lBUTBBQ3dzZ0FBdmhBd0JCakJkQm1na1FDVUdZRjBHNUNFRUJRUUFRQ0VHa0YwRzBDRUVCUVlCL1FmOEFFQUZCdkJkQnJRaEJBVUdBZjBIL0FCQUJRYkFYUWFzSVFRRkJBRUgvQVJBQlFjZ1hRWWtJUVFKQmdJQitRZi8vQVJBQlFkUVhRWUFJUVFKQkFFSC8vd01RQVVIZ0YwR1lDRUVFUVlDQWdJQjRRZi8vLy84SEVBRkI3QmRCandoQkJFRUFRWDhRQVVINEYwSFhDRUVFUVlDQWdJQjRRZi8vLy84SEVBRkJoQmhCemdoQkJFRUFRWDhRQVVHUUdFR2pDRUtBZ0lDQWdJQ0FnSUIvUXYvLy8vLy8vLy8vL3dBUUVVR2NHRUdpQ0VJQVFuOFFFVUdvR0VHY0NFRUVFQVJCdEJoQmt3bEJDQkFFUVlRUFFla0lFQU5CekE5Qmx3MFFBMEdVRUVFRVFkd0lFQUpCNEJCQkFrSDFDQkFDUWF3UlFRUkJoQWtRQWtISUVVRytDQkFIUWZBUlFRQkIwZ3dRQUVHWUVrRUFRYmdORUFCQndCSkJBVUh3REJBQVFlZ1NRUUpCbndrUUFFR1FFMEVEUWI0SkVBQkJ1Qk5CQkVIbUNSQUFRZUFUUVFWQmd3b1FBRUdJRkVFRVFkME5FQUJCc0JSQkJVSDdEUkFBUVpnU1FRQkI2UW9RQUVIQUVrRUJRY2dLRUFCQjZCSkJBa0dyQ3hBQVFaQVRRUU5CaVFzUUFFRzRFMEVFUWJFTUVBQkI0Qk5CQlVHUERCQUFRZGdVUVFoQjdnc1FBRUdBRlVFSlFjd0xFQUJCcUJWQkJrR3BDaEFBUWRBVlFRZEJvZzRRQUFzY0FDQUFJQUZCQ0NBQ3B5QUNRaUNJcHlBRHB5QURRaUNJcHhBRkN5QUFBa0FnQUNnQ0JDQUJSdzBBSUFBb0FoeEJBVVlOQUNBQUlBSTJBaHdMQzVvQkFDQUFRUUU2QURVQ1FDQUFLQUlFSUFKSERRQWdBRUVCT2dBMEFrQWdBQ2dDRUNJQ1JRUkFJQUJCQVRZQ0pDQUFJQU0yQWhnZ0FDQUJOZ0lRSUFOQkFVY05BaUFBS0FJd1FRRkdEUUVNQWdzZ0FTQUNSZ1JBSUFBb0FoZ2lBa0VDUmdSQUlBQWdBellDR0NBRElRSUxJQUFvQWpCQkFVY05BaUFDUVFGR0RRRU1BZ3NnQUNBQUtBSWtRUUZxTmdJa0N5QUFRUUU2QURZTEMxMEJBWDhnQUNnQ0VDSURSUVJBSUFCQkFUWUNKQ0FBSUFJMkFoZ2dBQ0FCTmdJUUR3c0NRQ0FCSUFOR0JFQWdBQ2dDR0VFQ1J3MEJJQUFnQWpZQ0dBOExJQUJCQVRvQU5pQUFRUUkyQWhnZ0FDQUFLQUlrUVFGcU5nSWtDd3NDQUF1OUp3RU1meU1BUVJCcklnb2tBQUpBQWtBQ1FBSkFBa0FDUUFKQUFrQUNRQUpBQWtBQ1FBSkFBa0FnQUVIMEFVMEVRRUhzR1NnQ0FDSUdRUkFnQUVFTGFrRjRjU0FBUVF0Skd5SUZRUU4ySWdCMklnRkJBM0VFUUFKQUlBRkJmM05CQVhFZ0FHb2lBa0VEZENJQlFaUWFhaUlBSUFGQm5CcHFLQUlBSWdFb0FnZ2lCRVlFUUVIc0dTQUdRWDRnQW5keE5nSUFEQUVMSUFRZ0FEWUNEQ0FBSUFRMkFnZ0xJQUZCQ0dvaEFDQUJJQUpCQTNRaUFrRURjallDQkNBQklBSnFJZ0VnQVNnQ0JFRUJjallDQkF3UEN5QUZRZlFaS0FJQUlnZE5EUUVnQVFSQUFrQkJBaUFBZENJQ1FRQWdBbXR5SUFFZ0FIUnhhQ0lCUVFOMElnQkJsQnBxSWdJZ0FFR2NHbW9vQWdBaUFDZ0NDQ0lFUmdSQVFld1pJQVpCZmlBQmQzRWlCallDQUF3QkN5QUVJQUkyQWd3Z0FpQUVOZ0lJQ3lBQUlBVkJBM0kyQWdRZ0FDQUZhaUlJSUFGQkEzUWlBU0FGYXlJRVFRRnlOZ0lFSUFBZ0FXb2dCRFlDQUNBSEJFQWdCMEY0Y1VHVUdtb2hBVUdBR2lnQ0FDRUNBbjhnQmtFQklBZEJBM1owSWdOeFJRUkFRZXdaSUFNZ0JuSTJBZ0FnQVF3QkN5QUJLQUlJQ3lFRElBRWdBallDQ0NBRElBSTJBZ3dnQWlBQk5nSU1JQUlnQXpZQ0NBc2dBRUVJYWlFQVFZQWFJQWcyQWdCQjlCa2dCRFlDQUF3UEMwSHdHU2dDQUNJTFJRMEJJQXRvUVFKMFFad2NhaWdDQUNJQ0tBSUVRWGh4SUFWcklRTWdBaUVCQTBBQ1FDQUJLQUlRSWdCRkJFQWdBU2dDRkNJQVJRMEJDeUFBS0FJRVFYaHhJQVZySWdFZ0F5QUJJQU5KSWdFYklRTWdBQ0FDSUFFYklRSWdBQ0VCREFFTEN5QUNLQUlZSVFrZ0FpQUNLQUlNSWdSSEJFQkIvQmtvQWdBYUlBSW9BZ2dpQUNBRU5nSU1JQVFnQURZQ0NBd09DeUFDUVJScUlnRW9BZ0FpQUVVRVFDQUNLQUlRSWdCRkRRTWdBa0VRYWlFQkN3TkFJQUVoQ0NBQUlnUkJGR29pQVNnQ0FDSUFEUUFnQkVFUWFpRUJJQVFvQWhBaUFBMEFDeUFJUVFBMkFnQU1EUXRCZnlFRklBQkJ2MzlMRFFBZ0FFRUxhaUlBUVhoeElRVkI4QmtvQWdBaUNFVU5BRUVBSUFWcklRTUNRQUpBQWtBQ2YwRUFJQVZCZ0FKSkRRQWFRUjhnQlVILy8vOEhTdzBBR2lBRlFTWWdBRUVJZG1jaUFHdDJRUUZ4SUFCQkFYUnJRVDVxQ3lJSFFRSjBRWndjYWlnQ0FDSUJSUVJBUVFBaEFBd0JDMEVBSVFBZ0JVRVpJQWRCQVhaclFRQWdCMEVmUnh0MElRSURRQUpBSUFFb0FnUkJlSEVnQldzaUJpQURUdzBBSUFFaEJDQUdJZ01OQUVFQUlRTWdBU0VBREFNTElBQWdBU2dDRkNJR0lBWWdBU0FDUVIxMlFRUnhhaWdDRUNJQlJoc2dBQ0FHR3lFQUlBSkJBWFFoQWlBQkRRQUxDeUFBSUFSeVJRUkFRUUFoQkVFQ0lBZDBJZ0JCQUNBQWEzSWdDSEVpQUVVTkF5QUFhRUVDZEVHY0hHb29BZ0FoQUFzZ0FFVU5BUXNEUUNBQUtBSUVRWGh4SUFWcklnSWdBMGtoQVNBQ0lBTWdBUnNoQXlBQUlBUWdBUnNoQkNBQUtBSVFJZ0VFZnlBQkJTQUFLQUlVQ3lJQURRQUxDeUFFUlEwQUlBTkI5QmtvQWdBZ0JXdFBEUUFnQkNnQ0dDRUhJQVFnQkNnQ0RDSUNSd1JBUWZ3WktBSUFHaUFFS0FJSUlnQWdBallDRENBQ0lBQTJBZ2dNREFzZ0JFRVVhaUlCS0FJQUlnQkZCRUFnQkNnQ0VDSUFSUTBESUFSQkVHb2hBUXNEUUNBQklRWWdBQ0lDUVJScUlnRW9BZ0FpQUEwQUlBSkJFR29oQVNBQ0tBSVFJZ0FOQUFzZ0JrRUFOZ0lBREFzTElBVkI5QmtvQWdBaUJFMEVRRUdBR2lnQ0FDRUFBa0FnQkNBRmF5SUJRUkJQQkVBZ0FDQUZhaUlDSUFGQkFYSTJBZ1FnQUNBRWFpQUJOZ0lBSUFBZ0JVRURjallDQkF3QkN5QUFJQVJCQTNJMkFnUWdBQ0FFYWlJQklBRW9BZ1JCQVhJMkFnUkJBQ0VDUVFBaEFRdEI5QmtnQVRZQ0FFR0FHaUFDTmdJQUlBQkJDR29oQUF3TkN5QUZRZmdaS0FJQUlnSkpCRUJCK0JrZ0FpQUZheUlCTmdJQVFZUWFRWVFhS0FJQUlnQWdCV29pQWpZQ0FDQUNJQUZCQVhJMkFnUWdBQ0FGUVFOeU5nSUVJQUJCQ0dvaEFBd05DMEVBSVFBZ0JVRXZhaUlEQW45QnhCMG9BZ0FFUUVITUhTZ0NBQXdCQzBIUUhVSi9Od0lBUWNnZFFvQ2dnSUNBZ0FRM0FnQkJ4QjBnQ2tFTWFrRndjVUhZcXRXcUJYTTJBZ0JCMkIxQkFEWUNBRUdvSFVFQU5nSUFRWUFnQ3lJQmFpSUdRUUFnQVdzaUNIRWlBU0FGVFEwTVFhUWRLQUlBSWdRRVFFR2NIU2dDQUNJSElBRnFJZ2tnQjAwZ0JDQUpTWElORFFzQ1FFR29IUzBBQUVFRWNVVUVRQUpBQWtBQ1FBSkFRWVFhS0FJQUlnUUVRRUdzSFNFQUEwQWdCQ0FBS0FJQUlnZFBCRUFnQnlBQUtBSUVhaUFFU3cwREN5QUFLQUlJSWdBTkFBc0xRUUFRQ3lJQ1FYOUdEUU1nQVNFR1FjZ2RLQUlBSWdCQkFXc2lCQ0FDY1FSQUlBRWdBbXNnQWlBRWFrRUFJQUJyY1dvaEJnc2dCU0FHVHcwRFFhUWRLQUlBSWdBRVFFR2NIU2dDQUNJRUlBWnFJZ2dnQkUwZ0FDQUlTWElOQkFzZ0JoQUxJZ0FnQWtjTkFRd0ZDeUFHSUFKcklBaHhJZ1lRQ3lJQ0lBQW9BZ0FnQUNnQ0JHcEdEUUVnQWlFQUN5QUFRWDlHRFFFZ0JVRXdhaUFHVFFSQUlBQWhBZ3dFQzBITUhTZ0NBQ0lDSUFNZ0JtdHFRUUFnQW10eElnSVFDMEYvUmcwQklBSWdCbW9oQmlBQUlRSU1Bd3NnQWtGL1J3MENDMEdvSFVHb0hTZ0NBRUVFY2pZQ0FBc2dBUkFMSWdKQmYwWkJBQkFMSWdCQmYwWnlJQUFnQWsxeURRVWdBQ0FDYXlJR0lBVkJLR3BORFFVTFFad2RRWndkS0FJQUlBWnFJZ0EyQWdCQm9CMG9BZ0FnQUVrRVFFR2dIU0FBTmdJQUN3SkFRWVFhS0FJQUlnTUVRRUdzSFNFQUEwQWdBaUFBS0FJQUlnRWdBQ2dDQkNJRWFrWU5BaUFBS0FJSUlnQU5BQXNNQkF0Qi9Ca29BZ0FpQUVFQUlBQWdBazBiUlFSQVFmd1pJQUkyQWdBTFFRQWhBRUd3SFNBR05nSUFRYXdkSUFJMkFnQkJqQnBCZnpZQ0FFR1FHa0hFSFNnQ0FEWUNBRUc0SFVFQU5nSUFBMEFnQUVFRGRDSUJRWndhYWlBQlFaUWFhaUlFTmdJQUlBRkJvQnBxSUFRMkFnQWdBRUVCYWlJQVFTQkhEUUFMUWZnWklBWkJLR3NpQUVGNElBSnJRUWR4SWdGcklnUTJBZ0JCaEJvZ0FTQUNhaUlCTmdJQUlBRWdCRUVCY2pZQ0JDQUFJQUpxUVNnMkFnUkJpQnBCMUIwb0FnQTJBZ0FNQkFzZ0FpQURUU0FCSUFOTGNnMENJQUFvQWd4QkNIRU5BaUFBSUFRZ0JtbzJBZ1JCaEJvZ0EwRjRJQU5yUVFkeElnQnFJZ0UyQWdCQitCbEIrQmtvQWdBZ0Jtb2lBaUFBYXlJQU5nSUFJQUVnQUVFQmNqWUNCQ0FDSUFOcVFTZzJBZ1JCaUJwQjFCMG9BZ0EyQWdBTUF3dEJBQ0VFREFvTFFRQWhBZ3dJQzBIOEdTZ0NBQ0FDU3dSQVFmd1pJQUkyQWdBTElBSWdCbW9oQVVHc0hTRUFBa0FDUUFKQUEwQWdBU0FBS0FJQVJ3UkFJQUFvQWdnaUFBMEJEQUlMQ3lBQUxRQU1RUWh4UlEwQkMwR3NIU0VBQTBBZ0F5QUFLQUlBSWdGUEJFQWdBU0FBS0FJRWFpSUVJQU5MRFFNTElBQW9BZ2doQUF3QUN3QUxJQUFnQWpZQ0FDQUFJQUFvQWdRZ0JtbzJBZ1FnQWtGNElBSnJRUWR4YWlJSElBVkJBM0kyQWdRZ0FVRjRJQUZyUVFkeGFpSUdJQVVnQjJvaUJXc2hBQ0FESUFaR0JFQkJoQm9nQlRZQ0FFSDRHVUg0R1NnQ0FDQUFhaUlBTmdJQUlBVWdBRUVCY2pZQ0JBd0lDMEdBR2lnQ0FDQUdSZ1JBUVlBYUlBVTJBZ0JCOUJsQjlCa29BZ0FnQUdvaUFEWUNBQ0FGSUFCQkFYSTJBZ1FnQUNBRmFpQUFOZ0lBREFnTElBWW9BZ1FpQTBFRGNVRUJSdzBHSUFOQmVIRWhDU0FEUWY4QlRRUkFJQVlvQWd3aUFTQUdLQUlJSWdKR0JFQkI3QmxCN0Jrb0FnQkJmaUFEUVFOMmQzRTJBZ0FNQndzZ0FpQUJOZ0lNSUFFZ0FqWUNDQXdHQ3lBR0tBSVlJUWdnQmlBR0tBSU1JZ0pIQkVBZ0JpZ0NDQ0lCSUFJMkFnd2dBaUFCTmdJSURBVUxJQVpCRkdvaUFTZ0NBQ0lEUlFSQUlBWW9BaEFpQTBVTkJDQUdRUkJxSVFFTEEwQWdBU0VFSUFNaUFrRVVhaUlCS0FJQUlnTU5BQ0FDUVJCcUlRRWdBaWdDRUNJRERRQUxJQVJCQURZQ0FBd0VDMEg0R1NBR1FTaHJJZ0JCZUNBQ2EwRUhjU0lCYXlJSU5nSUFRWVFhSUFFZ0Ftb2lBVFlDQUNBQklBaEJBWEkyQWdRZ0FDQUNha0VvTmdJRVFZZ2FRZFFkS0FJQU5nSUFJQU1nQkVFbklBUnJRUWR4YWtFdmF5SUFJQUFnQTBFUWFra2JJZ0ZCR3pZQ0JDQUJRYlFkS1FJQU53SVFJQUZCckIwcEFnQTNBZ2hCdEIwZ0FVRUlhallDQUVHd0hTQUdOZ0lBUWF3ZElBSTJBZ0JCdUIxQkFEWUNBQ0FCUVJocUlRQURRQ0FBUVFjMkFnUWdBRUVJYWlFTUlBQkJCR29oQUNBTUlBUkpEUUFMSUFFZ0EwWU5BQ0FCSUFFb0FnUkJmbkUyQWdRZ0F5QUJJQU5ySWdKQkFYSTJBZ1FnQVNBQ05nSUFJQUpCL3dGTkJFQWdBa0Y0Y1VHVUdtb2hBQUovUWV3WktBSUFJZ0ZCQVNBQ1FRTjJkQ0lDY1VVRVFFSHNHU0FCSUFKeU5nSUFJQUFNQVFzZ0FDZ0NDQXNoQVNBQUlBTTJBZ2dnQVNBRE5nSU1JQU1nQURZQ0RDQURJQUUyQWdnTUFRdEJIeUVBSUFKQi8vLy9CMDBFUUNBQ1FTWWdBa0VJZG1jaUFHdDJRUUZ4SUFCQkFYUnJRVDVxSVFBTElBTWdBRFlDSENBRFFnQTNBaEFnQUVFQ2RFR2NIR29oQVFKQUFrQkI4QmtvQWdBaUJFRUJJQUIwSWdaeFJRUkFRZkFaSUFRZ0JuSTJBZ0FnQVNBRE5nSUFEQUVMSUFKQkdTQUFRUUYyYTBFQUlBQkJIMGNiZENFQUlBRW9BZ0FoQkFOQUlBUWlBU2dDQkVGNGNTQUNSZzBDSUFCQkhYWWhCQ0FBUVFGMElRQWdBU0FFUVFSeGFpSUdLQUlRSWdRTkFBc2dCaUFETmdJUUN5QURJQUUyQWhnZ0F5QUROZ0lNSUFNZ0F6WUNDQXdCQ3lBQktBSUlJZ0FnQXpZQ0RDQUJJQU0yQWdnZ0EwRUFOZ0lZSUFNZ0FUWUNEQ0FESUFBMkFnZ0xRZmdaS0FJQUlnQWdCVTBOQUVINEdTQUFJQVZySWdFMkFnQkJoQnBCaEJvb0FnQWlBQ0FGYWlJQ05nSUFJQUlnQVVFQmNqWUNCQ0FBSUFWQkEzSTJBZ1FnQUVFSWFpRUFEQWdMUWVnWlFUQTJBZ0JCQUNFQURBY0xRUUFoQWdzZ0NFVU5BQUpBSUFZb0Fod2lBVUVDZEVHY0hHb2lCQ2dDQUNBR1JnUkFJQVFnQWpZQ0FDQUNEUUZCOEJsQjhCa29BZ0JCZmlBQmQzRTJBZ0FNQWdzZ0NFRVFRUlFnQ0NnQ0VDQUdSaHRxSUFJMkFnQWdBa1VOQVFzZ0FpQUlOZ0lZSUFZb0FoQWlBUVJBSUFJZ0FUWUNFQ0FCSUFJMkFoZ0xJQVlvQWhRaUFVVU5BQ0FDSUFFMkFoUWdBU0FDTmdJWUN5QUFJQWxxSVFBZ0JpQUphaUlHS0FJRUlRTUxJQVlnQTBGK2NUWUNCQ0FGSUFCQkFYSTJBZ1FnQUNBRmFpQUFOZ0lBSUFCQi93Rk5CRUFnQUVGNGNVR1VHbW9oQVFKL1Fld1pLQUlBSWdKQkFTQUFRUU4yZENJQWNVVUVRRUhzR1NBQUlBSnlOZ0lBSUFFTUFRc2dBU2dDQ0FzaEFDQUJJQVUyQWdnZ0FDQUZOZ0lNSUFVZ0FUWUNEQ0FGSUFBMkFnZ01BUXRCSHlFRElBQkIvLy8vQjAwRVFDQUFRU1lnQUVFSWRtY2lBV3QyUVFGeElBRkJBWFJyUVQ1cUlRTUxJQVVnQXpZQ0hDQUZRZ0EzQWhBZ0EwRUNkRUdjSEdvaEFRSkFBa0JCOEJrb0FnQWlBa0VCSUFOMElnUnhSUVJBUWZBWklBSWdCSEkyQWdBZ0FTQUZOZ0lBREFFTElBQkJHU0FEUVFGMmEwRUFJQU5CSDBjYmRDRURJQUVvQWdBaEFnTkFJQUlpQVNnQ0JFRjRjU0FBUmcwQ0lBTkJIWFloQWlBRFFRRjBJUU1nQVNBQ1FRUnhhaUlFS0FJUUlnSU5BQXNnQkNBRk5nSVFDeUFGSUFFMkFoZ2dCU0FGTmdJTUlBVWdCVFlDQ0F3QkN5QUJLQUlJSWdBZ0JUWUNEQ0FCSUFVMkFnZ2dCVUVBTmdJWUlBVWdBVFlDRENBRklBQTJBZ2dMSUFkQkNHb2hBQXdDQ3dKQUlBZEZEUUFDUUNBRUtBSWNJZ0JCQW5SQm5CeHFJZ0VvQWdBZ0JFWUVRQ0FCSUFJMkFnQWdBZzBCUWZBWklBaEJmaUFBZDNFaUNEWUNBQXdDQ3lBSFFSQkJGQ0FIS0FJUUlBUkdHMm9nQWpZQ0FDQUNSUTBCQ3lBQ0lBYzJBaGdnQkNnQ0VDSUFCRUFnQWlBQU5nSVFJQUFnQWpZQ0dBc2dCQ2dDRkNJQVJRMEFJQUlnQURZQ0ZDQUFJQUkyQWhnTEFrQWdBMEVQVFFSQUlBUWdBeUFGYWlJQVFRTnlOZ0lFSUFBZ0JHb2lBQ0FBS0FJRVFRRnlOZ0lFREFFTElBUWdCVUVEY2pZQ0JDQUVJQVZxSWdJZ0EwRUJjallDQkNBQ0lBTnFJQU0yQWdBZ0EwSC9BVTBFUUNBRFFYaHhRWlFhYWlFQUFuOUI3QmtvQWdBaUFVRUJJQU5CQTNaMElnTnhSUVJBUWV3WklBRWdBM0kyQWdBZ0FBd0JDeUFBS0FJSUN5RUJJQUFnQWpZQ0NDQUJJQUkyQWd3Z0FpQUFOZ0lNSUFJZ0FUWUNDQXdCQzBFZklRQWdBMEgvLy84SFRRUkFJQU5CSmlBRFFRaDJaeUlBYTNaQkFYRWdBRUVCZEd0QlBtb2hBQXNnQWlBQU5nSWNJQUpDQURjQ0VDQUFRUUowUVp3Y2FpRUJBa0FDUUNBSVFRRWdBSFFpQm5GRkJFQkI4QmtnQmlBSWNqWUNBQ0FCSUFJMkFnQU1BUXNnQTBFWklBQkJBWFpyUVFBZ0FFRWZSeHQwSVFBZ0FTZ0NBQ0VGQTBBZ0JTSUJLQUlFUVhoeElBTkdEUUlnQUVFZGRpRUdJQUJCQVhRaEFDQUJJQVpCQkhGcUlnWW9BaEFpQlEwQUN5QUdJQUkyQWhBTElBSWdBVFlDR0NBQ0lBSTJBZ3dnQWlBQ05nSUlEQUVMSUFFb0FnZ2lBQ0FDTmdJTUlBRWdBallDQ0NBQ1FRQTJBaGdnQWlBQk5nSU1JQUlnQURZQ0NBc2dCRUVJYWlFQURBRUxBa0FnQ1VVTkFBSkFJQUlvQWh3aUFFRUNkRUdjSEdvaUFTZ0NBQ0FDUmdSQUlBRWdCRFlDQUNBRURRRkI4QmtnQzBGK0lBQjNjVFlDQUF3Q0N5QUpRUkJCRkNBSktBSVFJQUpHRzJvZ0JEWUNBQ0FFUlEwQkN5QUVJQWsyQWhnZ0FpZ0NFQ0lBQkVBZ0JDQUFOZ0lRSUFBZ0JEWUNHQXNnQWlnQ0ZDSUFSUTBBSUFRZ0FEWUNGQ0FBSUFRMkFoZ0xBa0FnQTBFUFRRUkFJQUlnQXlBRmFpSUFRUU55TmdJRUlBQWdBbW9pQUNBQUtBSUVRUUZ5TmdJRURBRUxJQUlnQlVFRGNqWUNCQ0FDSUFWcUlnUWdBMEVCY2pZQ0JDQURJQVJxSUFNMkFnQWdCd1JBSUFkQmVIRkJsQnBxSVFCQmdCb29BZ0FoQVFKL1FRRWdCMEVEZG5RaUJTQUdjVVVFUUVIc0dTQUZJQVp5TmdJQUlBQU1BUXNnQUNnQ0NBc2hCaUFBSUFFMkFnZ2dCaUFCTmdJTUlBRWdBRFlDRENBQklBWTJBZ2dMUVlBYUlBUTJBZ0JCOUJrZ0F6WUNBQXNnQWtFSWFpRUFDeUFLUVJCcUpBQWdBQXNqQVFGL1Fkd1pLQUlBSWdBRVFBTkFJQUFvQWdBUkJRQWdBQ2dDQkNJQURRQUxDd3NhQUNBQUlBRW9BZ2dnQlJBS0JFQWdBU0FDSUFNZ0JCQVRDd3MzQUNBQUlBRW9BZ2dnQlJBS0JFQWdBU0FDSUFNZ0JCQVREd3NnQUNnQ0NDSUFJQUVnQWlBRElBUWdCU0FBS0FJQUtBSVVFUU1BQzVFQkFDQUFJQUVvQWdnZ0JCQUtCRUFnQVNBQ0lBTVFFZzhMQWtBZ0FDQUJLQUlBSUFRUUNrVU5BQUpBSUFJZ0FTZ0NFRWNFUUNBQktBSVVJQUpIRFFFTElBTkJBVWNOQVNBQlFRRTJBaUFQQ3lBQklBSTJBaFFnQVNBRE5nSWdJQUVnQVNnQ0tFRUJhallDS0FKQUlBRW9BaVJCQVVjTkFDQUJLQUlZUVFKSERRQWdBVUVCT2dBMkN5QUJRUVEyQWl3TEMvSUJBQ0FBSUFFb0FnZ2dCQkFLQkVBZ0FTQUNJQU1RRWc4TEFrQWdBQ0FCS0FJQUlBUVFDZ1JBQWtBZ0FpQUJLQUlRUndSQUlBRW9BaFFnQWtjTkFRc2dBMEVCUncwQ0lBRkJBVFlDSUE4TElBRWdBellDSUFKQUlBRW9BaXhCQkVZTkFDQUJRUUE3QVRRZ0FDZ0NDQ0lBSUFFZ0FpQUNRUUVnQkNBQUtBSUFLQUlVRVFNQUlBRXRBRFVFUUNBQlFRTTJBaXdnQVMwQU5FVU5BUXdEQ3lBQlFRUTJBaXdMSUFFZ0FqWUNGQ0FCSUFFb0FpaEJBV28yQWlnZ0FTZ0NKRUVCUncwQklBRW9BaGhCQWtjTkFTQUJRUUU2QURZUEN5QUFLQUlJSWdBZ0FTQUNJQU1nQkNBQUtBSUFLQUlZRVFJQUN3c3hBQ0FBSUFFb0FnaEJBQkFLQkVBZ0FTQUNJQU1RRkE4TElBQW9BZ2dpQUNBQklBSWdBeUFBS0FJQUtBSWNFUUFBQ3hnQUlBQWdBU2dDQ0VFQUVBb0VRQ0FCSUFJZ0F4QVVDd3ZLQXdFRmZ5TUFRVUJxSWdRa0FBSi9RUUVnQUNBQlFRQVFDZzBBR2tFQUlBRkZEUUFhSXdCQlFHb2lBeVFBSUFFb0FnQWlCVUVFYXlnQ0FDRUdJQVZCQ0dzb0FnQWhCU0FEUWdBM0FpQWdBMElBTndJb0lBTkNBRGNDTUNBRFFnQTNBRGNnQTBJQU53SVlJQU5CQURZQ0ZDQURRZndWTmdJUUlBTWdBVFlDRENBRFFhd1dOZ0lJSUFFZ0JXb2hBVUVBSVFVQ1FDQUdRYXdXUVFBUUNnUkFJQU5CQVRZQ09DQUdJQU5CQ0dvZ0FTQUJRUUZCQUNBR0tBSUFLQUlVRVFNQUlBRkJBQ0FES0FJZ1FRRkdHeUVGREFFTElBWWdBMEVJYWlBQlFRRkJBQ0FHS0FJQUtBSVlFUUlBQWtBQ1FDQURLQUlzRGdJQUFRSUxJQU1vQWh4QkFDQURLQUlvUVFGR0cwRUFJQU1vQWlSQkFVWWJRUUFnQXlnQ01FRUJSaHNoQlF3QkN5QURLQUlnUVFGSEJFQWdBeWdDTUEwQklBTW9BaVJCQVVjTkFTQURLQUlvUVFGSERRRUxJQU1vQWhnaEJRc2dBMEZBYXlRQVFRQWdCU0lCUlEwQUdpQUVRUXhxUVRRUUR4b2dCRUVCTmdJNElBUkJmellDRkNBRUlBQTJBaEFnQkNBQk5nSUlJQUVnQkVFSWFpQUNLQUlBUVFFZ0FTZ0NBQ2dDSEJFQUFDQUVLQUlnSWdCQkFVWUVRQ0FDSUFRb0FoZzJBZ0FMSUFCQkFVWUxJUWNnQkVGQWF5UUFJQWNMQ2dBZ0FDQUJRUUFRQ2dzRUFDQUFDNmtEQWdSL0FuMUIvLy8vL3djaENVR0FnSUNBZUNFS0EwQWdBU0FJUmdSQVFRQWhCeUFHUVlDQUVCQVBJUUJEQUFDQVJ5QUtJQWxyc3BVaERBTkFJQUVnQjBZRVFFRUFJUWNnQlVFQU5nSUFJQUJCQkdzaEFFRUFJUWxCQVNFSUEwQWdDRUdBZ0FSR1JRUkFJQVVnQ0VFQ2RDSUNhaUFBSUFKcUtBSUFJQWxxSWdrMkFnQWdDRUVCYWlFSURBRUxDd05BSUFFZ0IwWkZCRUFnQlNBRElBZEJBblJxS0FJQVFRSjBhaUlBSUFBb0FnQWlBRUVCYWpZQ0FDQUVJQUJCQW5ScUlBYzJBZ0FnQjBFQmFpRUhEQUVMQ3dVQ2Z5QU1JQU1nQjBFQ2RHb2lBaWdDQUNBSmE3T1VJZ3REQUFDQVQxMGdDME1BQUFBQVlIRUVRQ0FMcVF3QkMwRUFDeUVJSUFJZ0NEWUNBQ0FBSUFoQkFuUnFJZ0lnQWlnQ0FFRUJhallDQUNBSFFRRnFJUWNNQVFzTEJTQURJQWhCQW5ScUFuOGdBQ29DQ0NBQ0lBaEJER3hxSWdjcUFnQ1VJQUFxQWhnZ0J5b0NCSlNTSUFBcUFpZ2dCeW9DQ0pTU1F3QUFnRVdVSWd1TFF3QUFBRTlkQkVBZ0M2Z01BUXRCZ0lDQWdIZ0xJZ2MyQWdBZ0NTQUhJQWNnQ1VvYklRa2dDaUFISUFjZ0NrZ2JJUW9nQ0VFQmFpRUlEQUVMQ3dzTDV4RUNBRUdBQ0F2V0VYVnVjMmxuYm1Wa0lITm9iM0owQUhWdWMybG5ibVZrSUdsdWRBQm1iRzloZEFCMWFXNTBOalJmZEFCMWJuTnBaMjVsWkNCamFHRnlBR0p2YjJ3QVpXMXpZM0pwY0hSbGJqbzZkbUZzQUhWdWMybG5ibVZrSUd4dmJtY0FjM1JrT2pwM2MzUnlhVzVuQUhOMFpEbzZjM1J5YVc1bkFITjBaRG82ZFRFMmMzUnlhVzVuQUhOMFpEbzZkVE15YzNSeWFXNW5BR1J2ZFdKc1pRQjJiMmxrQUdWdGMyTnlhWEIwWlc0Nk9tMWxiVzl5ZVY5MmFXVjNQSE5vYjNKMFBnQmxiWE5qY21sd2RHVnVPanB0WlcxdmNubGZkbWxsZHp4MWJuTnBaMjVsWkNCemFHOXlkRDRBWlcxelkzSnBjSFJsYmpvNmJXVnRiM0o1WDNacFpYYzhhVzUwUGdCbGJYTmpjbWx3ZEdWdU9qcHRaVzF2Y25sZmRtbGxkengxYm5OcFoyNWxaQ0JwYm5RK0FHVnRjMk55YVhCMFpXNDZPbTFsYlc5eWVWOTJhV1YzUEdac2IyRjBQZ0JsYlhOamNtbHdkR1Z1T2pwdFpXMXZjbmxmZG1sbGR6eDFhVzUwT0Y5MFBnQmxiWE5qY21sd2RHVnVPanB0WlcxdmNubGZkbWxsZHp4cGJuUTRYM1ErQUdWdGMyTnlhWEIwWlc0Nk9tMWxiVzl5ZVY5MmFXVjNQSFZwYm5ReE5sOTBQZ0JsYlhOamNtbHdkR1Z1T2pwdFpXMXZjbmxmZG1sbGR6eHBiblF4Tmw5MFBnQmxiWE5qY21sd2RHVnVPanB0WlcxdmNubGZkbWxsZHp4MWFXNTBOalJmZEQ0QVpXMXpZM0pwY0hSbGJqbzZiV1Z0YjNKNVgzWnBaWGM4YVc1ME5qUmZkRDRBWlcxelkzSnBjSFJsYmpvNmJXVnRiM0o1WDNacFpYYzhkV2x1ZERNeVgzUStBR1Z0YzJOeWFYQjBaVzQ2T20xbGJXOXllVjkyYVdWM1BHbHVkRE15WDNRK0FHVnRjMk55YVhCMFpXNDZPbTFsYlc5eWVWOTJhV1YzUEdOb1lYSStBR1Z0YzJOeWFYQjBaVzQ2T20xbGJXOXllVjkyYVdWM1BIVnVjMmxuYm1Wa0lHTm9ZWEkrQUhOMFpEbzZZbUZ6YVdOZmMzUnlhVzVuUEhWdWMybG5ibVZrSUdOb1lYSStBR1Z0YzJOeWFYQjBaVzQ2T20xbGJXOXllVjkyYVdWM1BITnBaMjVsWkNCamFHRnlQZ0JsYlhOamNtbHdkR1Z1T2pwdFpXMXZjbmxmZG1sbGR6eHNiMjVuUGdCbGJYTmpjbWx3ZEdWdU9qcHRaVzF2Y25sZmRtbGxkengxYm5OcFoyNWxaQ0JzYjI1blBnQmxiWE5qY21sd2RHVnVPanB0WlcxdmNubGZkbWxsZHp4a2IzVmliR1UrQUU1VGRETmZYekl4TW1KaGMybGpYM04wY21sdVowbGpUbE5mTVRGamFHRnlYM1J5WVdsMGMwbGpSVVZPVTE4NVlXeHNiMk5oZEc5eVNXTkZSVVZGQUFBQUFFUU1BQUJDQndBQVRsTjBNMTlmTWpFeVltRnphV05mYzNSeWFXNW5TV2hPVTE4eE1XTm9ZWEpmZEhKaGFYUnpTV2hGUlU1VFh6bGhiR3h2WTJGMGIzSkphRVZGUlVVQUFFUU1BQUNNQndBQVRsTjBNMTlmTWpFeVltRnphV05mYzNSeWFXNW5TWGRPVTE4eE1XTm9ZWEpmZEhKaGFYUnpTWGRGUlU1VFh6bGhiR3h2WTJGMGIzSkpkMFZGUlVVQUFFUU1BQURVQndBQVRsTjBNMTlmTWpFeVltRnphV05mYzNSeWFXNW5TVVJ6VGxOZk1URmphR0Z5WDNSeVlXbDBjMGxFYzBWRlRsTmZPV0ZzYkc5allYUnZja2xFYzBWRlJVVUFBQUJFREFBQUhBZ0FBRTVUZEROZlh6SXhNbUpoYzJsalgzTjBjbWx1WjBsRWFVNVRYekV4WTJoaGNsOTBjbUZwZEhOSlJHbEZSVTVUWHpsaGJHeHZZMkYwYjNKSlJHbEZSVVZGQUFBQVJBd0FBR2dJQUFCT01UQmxiWE5qY21sd2RHVnVNM1poYkVVQUFFUU1BQUMwQ0FBQVRqRXdaVzF6WTNKcGNIUmxiakV4YldWdGIzSjVYM1pwWlhkSlkwVkZBQUJFREFBQTBBZ0FBRTR4TUdWdGMyTnlhWEIwWlc0eE1XMWxiVzl5ZVY5MmFXVjNTV0ZGUlFBQVJBd0FBUGdJQUFCT01UQmxiWE5qY21sd2RHVnVNVEZ0WlcxdmNubGZkbWxsZDBsb1JVVUFBRVFNQUFBZ0NRQUFUakV3WlcxelkzSnBjSFJsYmpFeGJXVnRiM0o1WDNacFpYZEpjMFZGQUFCRURBQUFTQWtBQUU0eE1HVnRjMk55YVhCMFpXNHhNVzFsYlc5eWVWOTJhV1YzU1hSRlJRQUFSQXdBQUhBSkFBQk9NVEJsYlhOamNtbHdkR1Z1TVRGdFpXMXZjbmxmZG1sbGQwbHBSVVVBQUVRTUFBQ1lDUUFBVGpFd1pXMXpZM0pwY0hSbGJqRXhiV1Z0YjNKNVgzWnBaWGRKYWtWRkFBQkVEQUFBd0FrQUFFNHhNR1Z0YzJOeWFYQjBaVzR4TVcxbGJXOXllVjkyYVdWM1NXeEZSUUFBUkF3QUFPZ0pBQUJPTVRCbGJYTmpjbWx3ZEdWdU1URnRaVzF2Y25sZmRtbGxkMGx0UlVVQUFFUU1BQUFRQ2dBQVRqRXdaVzF6WTNKcGNIUmxiakV4YldWdGIzSjVYM1pwWlhkSmVFVkZBQUJFREFBQU9Bb0FBRTR4TUdWdGMyTnlhWEIwWlc0eE1XMWxiVzl5ZVY5MmFXVjNTWGxGUlFBQVJBd0FBR0FLQUFCT01UQmxiWE5qY21sd2RHVnVNVEZ0WlcxdmNubGZkbWxsZDBsbVJVVUFBRVFNQUFDSUNnQUFUakV3WlcxelkzSnBjSFJsYmpFeGJXVnRiM0o1WDNacFpYZEpaRVZGQUFCRURBQUFzQW9BQUU0eE1GOWZZM2g0WVdKcGRqRXhObDlmYzJocGJWOTBlWEJsWDJsdVptOUZBQUFBQUd3TUFBRFlDZ0FBMEF3QUFFNHhNRjlmWTNoNFlXSnBkakV4TjE5ZlkyeGhjM05mZEhsd1pWOXBibVp2UlFBQUFHd01BQUFJQ3dBQS9Bb0FBQUFBQUFCOEN3QUFBZ0FBQUFNQUFBQUVBQUFBQlFBQUFBWUFBQUJPTVRCZlgyTjRlR0ZpYVhZeE1qTmZYMloxYm1SaGJXVnVkR0ZzWDNSNWNHVmZhVzVtYjBVQWJBd0FBRlFMQUFEOENnQUFkZ0FBQUVBTEFBQ0lDd0FBWWdBQUFFQUxBQUNVQ3dBQVl3QUFBRUFMQUFDZ0N3QUFhQUFBQUVBTEFBQ3NDd0FBWVFBQUFFQUxBQUM0Q3dBQWN3QUFBRUFMQUFERUN3QUFkQUFBQUVBTEFBRFFDd0FBYVFBQUFFQUxBQURjQ3dBQWFnQUFBRUFMQUFEb0N3QUFiQUFBQUVBTEFBRDBDd0FBYlFBQUFFQUxBQUFBREFBQWVBQUFBRUFMQUFBTURBQUFlUUFBQUVBTEFBQVlEQUFBWmdBQUFFQUxBQUFrREFBQVpBQUFBRUFMQUFBd0RBQUFBQUFBQUN3TEFBQUNBQUFBQndBQUFBUUFBQUFGQUFBQUNBQUFBQWtBQUFBS0FBQUFDd0FBQUFBQUFBQzBEQUFBQWdBQUFBd0FBQUFFQUFBQUJRQUFBQWdBQUFBTkFBQUFEZ0FBQUE4QUFBQk9NVEJmWDJONGVHRmlhWFl4TWpCZlgzTnBYMk5zWVhOelgzUjVjR1ZmYVc1bWIwVUFBQUFBYkF3QUFJd01BQUFzQ3dBQVUzUTVkSGx3WlY5cGJtWnZBQUFBQUVRTUFBREFEQUJCMkJrTEErQU9BUT09IjtpZighaXNEYXRhVVJJKHdhc21CaW5hcnlGaWxlKSl7d2FzbUJpbmFyeUZpbGU9bG9jYXRlRmlsZSh3YXNtQmluYXJ5RmlsZSk7fWZ1bmN0aW9uIGdldEJpbmFyeVN5bmMoZmlsZSl7aWYoZmlsZT09d2FzbUJpbmFyeUZpbGUmJndhc21CaW5hcnkpe3JldHVybiBuZXcgVWludDhBcnJheSh3YXNtQmluYXJ5KX12YXIgYmluYXJ5PXRyeVBhcnNlQXNEYXRhVVJJKGZpbGUpO2lmKGJpbmFyeSl7cmV0dXJuIGJpbmFyeX1pZihyZWFkQmluYXJ5KXtyZXR1cm4gcmVhZEJpbmFyeShmaWxlKX10aHJvdyAiYm90aCBhc3luYyBhbmQgc3luYyBmZXRjaGluZyBvZiB0aGUgd2FzbSBmYWlsZWQifWZ1bmN0aW9uIGdldEJpbmFyeVByb21pc2UoYmluYXJ5RmlsZSl7cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCk9PmdldEJpbmFyeVN5bmMoYmluYXJ5RmlsZSkpfWZ1bmN0aW9uIGluc3RhbnRpYXRlQXJyYXlCdWZmZXIoYmluYXJ5RmlsZSxpbXBvcnRzLHJlY2VpdmVyKXtyZXR1cm4gZ2V0QmluYXJ5UHJvbWlzZShiaW5hcnlGaWxlKS50aGVuKGJpbmFyeT0+V2ViQXNzZW1ibHkuaW5zdGFudGlhdGUoYmluYXJ5LGltcG9ydHMpKS50aGVuKGluc3RhbmNlPT5pbnN0YW5jZSkudGhlbihyZWNlaXZlcixyZWFzb249PntlcnIoYGZhaWxlZCB0byBhc3luY2hyb25vdXNseSBwcmVwYXJlIHdhc206ICR7cmVhc29ufWApO2Fib3J0KHJlYXNvbik7fSl9ZnVuY3Rpb24gaW5zdGFudGlhdGVBc3luYyhiaW5hcnksYmluYXJ5RmlsZSxpbXBvcnRzLGNhbGxiYWNrKXtyZXR1cm4gaW5zdGFudGlhdGVBcnJheUJ1ZmZlcihiaW5hcnlGaWxlLGltcG9ydHMsY2FsbGJhY2spfWZ1bmN0aW9uIGNyZWF0ZVdhc20oKXt2YXIgaW5mbz17ImEiOndhc21JbXBvcnRzfTtmdW5jdGlvbiByZWNlaXZlSW5zdGFuY2UoaW5zdGFuY2UsbW9kdWxlKXt3YXNtRXhwb3J0cz1pbnN0YW5jZS5leHBvcnRzO3dhc21NZW1vcnk9d2FzbUV4cG9ydHNbImsiXTt1cGRhdGVNZW1vcnlWaWV3cygpO2FkZE9uSW5pdCh3YXNtRXhwb3J0c1sibCJdKTtyZW1vdmVSdW5EZXBlbmRlbmN5KCk7cmV0dXJuIHdhc21FeHBvcnRzfWFkZFJ1bkRlcGVuZGVuY3koKTtmdW5jdGlvbiByZWNlaXZlSW5zdGFudGlhdGlvblJlc3VsdChyZXN1bHQpe3JlY2VpdmVJbnN0YW5jZShyZXN1bHRbImluc3RhbmNlIl0pO31pZihNb2R1bGVbImluc3RhbnRpYXRlV2FzbSJdKXt0cnl7cmV0dXJuIE1vZHVsZVsiaW5zdGFudGlhdGVXYXNtIl0oaW5mbyxyZWNlaXZlSW5zdGFuY2UpfWNhdGNoKGUpe2VycihgTW9kdWxlLmluc3RhbnRpYXRlV2FzbSBjYWxsYmFjayBmYWlsZWQgd2l0aCBlcnJvcjogJHtlfWApO3JlYWR5UHJvbWlzZVJlamVjdChlKTt9fWluc3RhbnRpYXRlQXN5bmMod2FzbUJpbmFyeSx3YXNtQmluYXJ5RmlsZSxpbmZvLHJlY2VpdmVJbnN0YW50aWF0aW9uUmVzdWx0KS5jYXRjaChyZWFkeVByb21pc2VSZWplY3QpO3JldHVybiB7fX12YXIgY2FsbFJ1bnRpbWVDYWxsYmFja3M9Y2FsbGJhY2tzPT57d2hpbGUoY2FsbGJhY2tzLmxlbmd0aD4wKXtjYWxsYmFja3Muc2hpZnQoKShNb2R1bGUpO319O01vZHVsZVsibm9FeGl0UnVudGltZSJdfHx0cnVlO3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9iaWdpbnQ9KHByaW1pdGl2ZVR5cGUsbmFtZSxzaXplLG1pblJhbmdlLG1heFJhbmdlKT0+e307dmFyIGVtYmluZF9pbml0X2NoYXJDb2Rlcz0oKT0+e3ZhciBjb2Rlcz1uZXcgQXJyYXkoMjU2KTtmb3IodmFyIGk9MDtpPDI1NjsrK2kpe2NvZGVzW2ldPVN0cmluZy5mcm9tQ2hhckNvZGUoaSk7fWVtYmluZF9jaGFyQ29kZXM9Y29kZXM7fTt2YXIgZW1iaW5kX2NoYXJDb2Rlczt2YXIgcmVhZExhdGluMVN0cmluZz1wdHI9Pnt2YXIgcmV0PSIiO3ZhciBjPXB0cjt3aGlsZShIRUFQVThbY10pe3JldCs9ZW1iaW5kX2NoYXJDb2Rlc1tIRUFQVThbYysrXV07fXJldHVybiByZXR9O3ZhciBhd2FpdGluZ0RlcGVuZGVuY2llcz17fTt2YXIgcmVnaXN0ZXJlZFR5cGVzPXt9O3ZhciBCaW5kaW5nRXJyb3I7dmFyIHRocm93QmluZGluZ0Vycm9yPW1lc3NhZ2U9Pnt0aHJvdyBuZXcgQmluZGluZ0Vycm9yKG1lc3NhZ2UpfTtmdW5jdGlvbiBzaGFyZWRSZWdpc3RlclR5cGUocmF3VHlwZSxyZWdpc3RlcmVkSW5zdGFuY2Usb3B0aW9ucz17fSl7dmFyIG5hbWU9cmVnaXN0ZXJlZEluc3RhbmNlLm5hbWU7aWYoIXJhd1R5cGUpe3Rocm93QmluZGluZ0Vycm9yKGB0eXBlICIke25hbWV9IiBtdXN0IGhhdmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIHR5cGVpZCBwb2ludGVyYCk7fWlmKHJlZ2lzdGVyZWRUeXBlcy5oYXNPd25Qcm9wZXJ0eShyYXdUeXBlKSl7aWYob3B0aW9ucy5pZ25vcmVEdXBsaWNhdGVSZWdpc3RyYXRpb25zKXtyZXR1cm59ZWxzZSB7dGhyb3dCaW5kaW5nRXJyb3IoYENhbm5vdCByZWdpc3RlciB0eXBlICcke25hbWV9JyB0d2ljZWApO319cmVnaXN0ZXJlZFR5cGVzW3Jhd1R5cGVdPXJlZ2lzdGVyZWRJbnN0YW5jZTtpZihhd2FpdGluZ0RlcGVuZGVuY2llcy5oYXNPd25Qcm9wZXJ0eShyYXdUeXBlKSl7dmFyIGNhbGxiYWNrcz1hd2FpdGluZ0RlcGVuZGVuY2llc1tyYXdUeXBlXTtkZWxldGUgYXdhaXRpbmdEZXBlbmRlbmNpZXNbcmF3VHlwZV07Y2FsbGJhY2tzLmZvckVhY2goY2I9PmNiKCkpO319ZnVuY3Rpb24gcmVnaXN0ZXJUeXBlKHJhd1R5cGUscmVnaXN0ZXJlZEluc3RhbmNlLG9wdGlvbnM9e30pe2lmKCEoImFyZ1BhY2tBZHZhbmNlImluIHJlZ2lzdGVyZWRJbnN0YW5jZSkpe3Rocm93IG5ldyBUeXBlRXJyb3IoInJlZ2lzdGVyVHlwZSByZWdpc3RlcmVkSW5zdGFuY2UgcmVxdWlyZXMgYXJnUGFja0FkdmFuY2UiKX1yZXR1cm4gc2hhcmVkUmVnaXN0ZXJUeXBlKHJhd1R5cGUscmVnaXN0ZXJlZEluc3RhbmNlLG9wdGlvbnMpfXZhciBHZW5lcmljV2lyZVR5cGVTaXplPTg7dmFyIF9fZW1iaW5kX3JlZ2lzdGVyX2Jvb2w9KHJhd1R5cGUsbmFtZSx0cnVlVmFsdWUsZmFsc2VWYWx1ZSk9PntuYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7cmVnaXN0ZXJUeXBlKHJhd1R5cGUse25hbWU6bmFtZSwiZnJvbVdpcmVUeXBlIjpmdW5jdGlvbih3dCl7cmV0dXJuICEhd3R9LCJ0b1dpcmVUeXBlIjpmdW5jdGlvbihkZXN0cnVjdG9ycyxvKXtyZXR1cm4gbz90cnVlVmFsdWU6ZmFsc2VWYWx1ZX0sImFyZ1BhY2tBZHZhbmNlIjpHZW5lcmljV2lyZVR5cGVTaXplLCJyZWFkVmFsdWVGcm9tUG9pbnRlciI6ZnVuY3Rpb24ocG9pbnRlcil7cmV0dXJuIHRoaXNbImZyb21XaXJlVHlwZSJdKEhFQVBVOFtwb2ludGVyXSl9LGRlc3RydWN0b3JGdW5jdGlvbjpudWxsfSk7fTtmdW5jdGlvbiBoYW5kbGVBbGxvY2F0b3JJbml0KCl7T2JqZWN0LmFzc2lnbihIYW5kbGVBbGxvY2F0b3IucHJvdG90eXBlLHtnZXQoaWQpe3JldHVybiB0aGlzLmFsbG9jYXRlZFtpZF19LGhhcyhpZCl7cmV0dXJuIHRoaXMuYWxsb2NhdGVkW2lkXSE9PXVuZGVmaW5lZH0sYWxsb2NhdGUoaGFuZGxlKXt2YXIgaWQ9dGhpcy5mcmVlbGlzdC5wb3AoKXx8dGhpcy5hbGxvY2F0ZWQubGVuZ3RoO3RoaXMuYWxsb2NhdGVkW2lkXT1oYW5kbGU7cmV0dXJuIGlkfSxmcmVlKGlkKXt0aGlzLmFsbG9jYXRlZFtpZF09dW5kZWZpbmVkO3RoaXMuZnJlZWxpc3QucHVzaChpZCk7fX0pO31mdW5jdGlvbiBIYW5kbGVBbGxvY2F0b3IoKXt0aGlzLmFsbG9jYXRlZD1bdW5kZWZpbmVkXTt0aGlzLmZyZWVsaXN0PVtdO312YXIgZW12YWxfaGFuZGxlcz1uZXcgSGFuZGxlQWxsb2NhdG9yO3ZhciBfX2VtdmFsX2RlY3JlZj1oYW5kbGU9PntpZihoYW5kbGU+PWVtdmFsX2hhbmRsZXMucmVzZXJ2ZWQmJjA9PT0tLWVtdmFsX2hhbmRsZXMuZ2V0KGhhbmRsZSkucmVmY291bnQpe2VtdmFsX2hhbmRsZXMuZnJlZShoYW5kbGUpO319O3ZhciBjb3VudF9lbXZhbF9oYW5kbGVzPSgpPT57dmFyIGNvdW50PTA7Zm9yKHZhciBpPWVtdmFsX2hhbmRsZXMucmVzZXJ2ZWQ7aTxlbXZhbF9oYW5kbGVzLmFsbG9jYXRlZC5sZW5ndGg7KytpKXtpZihlbXZhbF9oYW5kbGVzLmFsbG9jYXRlZFtpXSE9PXVuZGVmaW5lZCl7Kytjb3VudDt9fXJldHVybiBjb3VudH07dmFyIGluaXRfZW12YWw9KCk9PntlbXZhbF9oYW5kbGVzLmFsbG9jYXRlZC5wdXNoKHt2YWx1ZTp1bmRlZmluZWR9LHt2YWx1ZTpudWxsfSx7dmFsdWU6dHJ1ZX0se3ZhbHVlOmZhbHNlfSk7ZW12YWxfaGFuZGxlcy5yZXNlcnZlZD1lbXZhbF9oYW5kbGVzLmFsbG9jYXRlZC5sZW5ndGg7TW9kdWxlWyJjb3VudF9lbXZhbF9oYW5kbGVzIl09Y291bnRfZW12YWxfaGFuZGxlczt9O3ZhciBFbXZhbD17dG9WYWx1ZTpoYW5kbGU9PntpZighaGFuZGxlKXt0aHJvd0JpbmRpbmdFcnJvcigiQ2Fubm90IHVzZSBkZWxldGVkIHZhbC4gaGFuZGxlID0gIitoYW5kbGUpO31yZXR1cm4gZW12YWxfaGFuZGxlcy5nZXQoaGFuZGxlKS52YWx1ZX0sdG9IYW5kbGU6dmFsdWU9Pntzd2l0Y2godmFsdWUpe2Nhc2UgdW5kZWZpbmVkOnJldHVybiAxO2Nhc2UgbnVsbDpyZXR1cm4gMjtjYXNlIHRydWU6cmV0dXJuIDM7Y2FzZSBmYWxzZTpyZXR1cm4gNDtkZWZhdWx0OntyZXR1cm4gZW12YWxfaGFuZGxlcy5hbGxvY2F0ZSh7cmVmY291bnQ6MSx2YWx1ZTp2YWx1ZX0pfX19fTtmdW5jdGlvbiBzaW1wbGVSZWFkVmFsdWVGcm9tUG9pbnRlcihwb2ludGVyKXtyZXR1cm4gdGhpc1siZnJvbVdpcmVUeXBlIl0oSEVBUDMyW3BvaW50ZXI+PjJdKX12YXIgX19lbWJpbmRfcmVnaXN0ZXJfZW12YWw9KHJhd1R5cGUsbmFtZSk9PntuYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7cmVnaXN0ZXJUeXBlKHJhd1R5cGUse25hbWU6bmFtZSwiZnJvbVdpcmVUeXBlIjpoYW5kbGU9Pnt2YXIgcnY9RW12YWwudG9WYWx1ZShoYW5kbGUpO19fZW12YWxfZGVjcmVmKGhhbmRsZSk7cmV0dXJuIHJ2fSwidG9XaXJlVHlwZSI6KGRlc3RydWN0b3JzLHZhbHVlKT0+RW12YWwudG9IYW5kbGUodmFsdWUpLCJhcmdQYWNrQWR2YW5jZSI6R2VuZXJpY1dpcmVUeXBlU2l6ZSwicmVhZFZhbHVlRnJvbVBvaW50ZXIiOnNpbXBsZVJlYWRWYWx1ZUZyb21Qb2ludGVyLGRlc3RydWN0b3JGdW5jdGlvbjpudWxsfSk7fTt2YXIgZmxvYXRSZWFkVmFsdWVGcm9tUG9pbnRlcj0obmFtZSx3aWR0aCk9Pntzd2l0Y2god2lkdGgpe2Nhc2UgNDpyZXR1cm4gZnVuY3Rpb24ocG9pbnRlcil7cmV0dXJuIHRoaXNbImZyb21XaXJlVHlwZSJdKEhFQVBGMzJbcG9pbnRlcj4+Ml0pfTtjYXNlIDg6cmV0dXJuIGZ1bmN0aW9uKHBvaW50ZXIpe3JldHVybiB0aGlzWyJmcm9tV2lyZVR5cGUiXShIRUFQRjY0W3BvaW50ZXI+PjNdKX07ZGVmYXVsdDp0aHJvdyBuZXcgVHlwZUVycm9yKGBpbnZhbGlkIGZsb2F0IHdpZHRoICgke3dpZHRofSk6ICR7bmFtZX1gKX19O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9mbG9hdD0ocmF3VHlwZSxuYW1lLHNpemUpPT57bmFtZT1yZWFkTGF0aW4xU3RyaW5nKG5hbWUpO3JlZ2lzdGVyVHlwZShyYXdUeXBlLHtuYW1lOm5hbWUsImZyb21XaXJlVHlwZSI6dmFsdWU9PnZhbHVlLCJ0b1dpcmVUeXBlIjooZGVzdHJ1Y3RvcnMsdmFsdWUpPT52YWx1ZSwiYXJnUGFja0FkdmFuY2UiOkdlbmVyaWNXaXJlVHlwZVNpemUsInJlYWRWYWx1ZUZyb21Qb2ludGVyIjpmbG9hdFJlYWRWYWx1ZUZyb21Qb2ludGVyKG5hbWUsc2l6ZSksZGVzdHJ1Y3RvckZ1bmN0aW9uOm51bGx9KTt9O3ZhciBpbnRlZ2VyUmVhZFZhbHVlRnJvbVBvaW50ZXI9KG5hbWUsd2lkdGgsc2lnbmVkKT0+e3N3aXRjaCh3aWR0aCl7Y2FzZSAxOnJldHVybiBzaWduZWQ/cG9pbnRlcj0+SEVBUDhbcG9pbnRlcj4+MF06cG9pbnRlcj0+SEVBUFU4W3BvaW50ZXI+PjBdO2Nhc2UgMjpyZXR1cm4gc2lnbmVkP3BvaW50ZXI9PkhFQVAxNltwb2ludGVyPj4xXTpwb2ludGVyPT5IRUFQVTE2W3BvaW50ZXI+PjFdO2Nhc2UgNDpyZXR1cm4gc2lnbmVkP3BvaW50ZXI9PkhFQVAzMltwb2ludGVyPj4yXTpwb2ludGVyPT5IRUFQVTMyW3BvaW50ZXI+PjJdO2RlZmF1bHQ6dGhyb3cgbmV3IFR5cGVFcnJvcihgaW52YWxpZCBpbnRlZ2VyIHdpZHRoICgke3dpZHRofSk6ICR7bmFtZX1gKX19O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9pbnRlZ2VyPShwcmltaXRpdmVUeXBlLG5hbWUsc2l6ZSxtaW5SYW5nZSxtYXhSYW5nZSk9PntuYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7dmFyIGZyb21XaXJlVHlwZT12YWx1ZT0+dmFsdWU7aWYobWluUmFuZ2U9PT0wKXt2YXIgYml0c2hpZnQ9MzItOCpzaXplO2Zyb21XaXJlVHlwZT12YWx1ZT0+dmFsdWU8PGJpdHNoaWZ0Pj4+Yml0c2hpZnQ7fXZhciBpc1Vuc2lnbmVkVHlwZT1uYW1lLmluY2x1ZGVzKCJ1bnNpZ25lZCIpO3ZhciBjaGVja0Fzc2VydGlvbnM9KHZhbHVlLHRvVHlwZU5hbWUpPT57fTt2YXIgdG9XaXJlVHlwZTtpZihpc1Vuc2lnbmVkVHlwZSl7dG9XaXJlVHlwZT1mdW5jdGlvbihkZXN0cnVjdG9ycyx2YWx1ZSl7Y2hlY2tBc3NlcnRpb25zKHZhbHVlLHRoaXMubmFtZSk7cmV0dXJuIHZhbHVlPj4+MH07fWVsc2Uge3RvV2lyZVR5cGU9ZnVuY3Rpb24oZGVzdHJ1Y3RvcnMsdmFsdWUpe2NoZWNrQXNzZXJ0aW9ucyh2YWx1ZSx0aGlzLm5hbWUpO3JldHVybiB2YWx1ZX07fXJlZ2lzdGVyVHlwZShwcmltaXRpdmVUeXBlLHtuYW1lOm5hbWUsImZyb21XaXJlVHlwZSI6ZnJvbVdpcmVUeXBlLCJ0b1dpcmVUeXBlIjp0b1dpcmVUeXBlLCJhcmdQYWNrQWR2YW5jZSI6R2VuZXJpY1dpcmVUeXBlU2l6ZSwicmVhZFZhbHVlRnJvbVBvaW50ZXIiOmludGVnZXJSZWFkVmFsdWVGcm9tUG9pbnRlcihuYW1lLHNpemUsbWluUmFuZ2UhPT0wKSxkZXN0cnVjdG9yRnVuY3Rpb246bnVsbH0pO307dmFyIF9fZW1iaW5kX3JlZ2lzdGVyX21lbW9yeV92aWV3PShyYXdUeXBlLGRhdGFUeXBlSW5kZXgsbmFtZSk9Pnt2YXIgdHlwZU1hcHBpbmc9W0ludDhBcnJheSxVaW50OEFycmF5LEludDE2QXJyYXksVWludDE2QXJyYXksSW50MzJBcnJheSxVaW50MzJBcnJheSxGbG9hdDMyQXJyYXksRmxvYXQ2NEFycmF5XTt2YXIgVEE9dHlwZU1hcHBpbmdbZGF0YVR5cGVJbmRleF07ZnVuY3Rpb24gZGVjb2RlTWVtb3J5VmlldyhoYW5kbGUpe3ZhciBzaXplPUhFQVBVMzJbaGFuZGxlPj4yXTt2YXIgZGF0YT1IRUFQVTMyW2hhbmRsZSs0Pj4yXTtyZXR1cm4gbmV3IFRBKEhFQVA4LmJ1ZmZlcixkYXRhLHNpemUpfW5hbWU9cmVhZExhdGluMVN0cmluZyhuYW1lKTtyZWdpc3RlclR5cGUocmF3VHlwZSx7bmFtZTpuYW1lLCJmcm9tV2lyZVR5cGUiOmRlY29kZU1lbW9yeVZpZXcsImFyZ1BhY2tBZHZhbmNlIjpHZW5lcmljV2lyZVR5cGVTaXplLCJyZWFkVmFsdWVGcm9tUG9pbnRlciI6ZGVjb2RlTWVtb3J5Vmlld30se2lnbm9yZUR1cGxpY2F0ZVJlZ2lzdHJhdGlvbnM6dHJ1ZX0pO307ZnVuY3Rpb24gcmVhZFBvaW50ZXIocG9pbnRlcil7cmV0dXJuIHRoaXNbImZyb21XaXJlVHlwZSJdKEhFQVBVMzJbcG9pbnRlcj4+Ml0pfXZhciBzdHJpbmdUb1VURjhBcnJheT0oc3RyLGhlYXAsb3V0SWR4LG1heEJ5dGVzVG9Xcml0ZSk9PntpZighKG1heEJ5dGVzVG9Xcml0ZT4wKSlyZXR1cm4gMDt2YXIgc3RhcnRJZHg9b3V0SWR4O3ZhciBlbmRJZHg9b3V0SWR4K21heEJ5dGVzVG9Xcml0ZS0xO2Zvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDsrK2kpe3ZhciB1PXN0ci5jaGFyQ29kZUF0KGkpO2lmKHU+PTU1Mjk2JiZ1PD01NzM0Myl7dmFyIHUxPXN0ci5jaGFyQ29kZUF0KCsraSk7dT02NTUzNisoKHUmMTAyMyk8PDEwKXx1MSYxMDIzO31pZih1PD0xMjcpe2lmKG91dElkeD49ZW5kSWR4KWJyZWFrO2hlYXBbb3V0SWR4KytdPXU7fWVsc2UgaWYodTw9MjA0Nyl7aWYob3V0SWR4KzE+PWVuZElkeClicmVhaztoZWFwW291dElkeCsrXT0xOTJ8dT4+NjtoZWFwW291dElkeCsrXT0xMjh8dSY2Mzt9ZWxzZSBpZih1PD02NTUzNSl7aWYob3V0SWR4KzI+PWVuZElkeClicmVhaztoZWFwW291dElkeCsrXT0yMjR8dT4+MTI7aGVhcFtvdXRJZHgrK109MTI4fHU+PjYmNjM7aGVhcFtvdXRJZHgrK109MTI4fHUmNjM7fWVsc2Uge2lmKG91dElkeCszPj1lbmRJZHgpYnJlYWs7aGVhcFtvdXRJZHgrK109MjQwfHU+PjE4O2hlYXBbb3V0SWR4KytdPTEyOHx1Pj4xMiY2MztoZWFwW291dElkeCsrXT0xMjh8dT4+NiY2MztoZWFwW291dElkeCsrXT0xMjh8dSY2Mzt9fWhlYXBbb3V0SWR4XT0wO3JldHVybiBvdXRJZHgtc3RhcnRJZHh9O3ZhciBzdHJpbmdUb1VURjg9KHN0cixvdXRQdHIsbWF4Qnl0ZXNUb1dyaXRlKT0+c3RyaW5nVG9VVEY4QXJyYXkoc3RyLEhFQVBVOCxvdXRQdHIsbWF4Qnl0ZXNUb1dyaXRlKTt2YXIgbGVuZ3RoQnl0ZXNVVEY4PXN0cj0+e3ZhciBsZW49MDtmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7KytpKXt2YXIgYz1zdHIuY2hhckNvZGVBdChpKTtpZihjPD0xMjcpe2xlbisrO31lbHNlIGlmKGM8PTIwNDcpe2xlbis9Mjt9ZWxzZSBpZihjPj01NTI5NiYmYzw9NTczNDMpe2xlbis9NDsrK2k7fWVsc2Uge2xlbis9Mzt9fXJldHVybiBsZW59O3ZhciBVVEY4RGVjb2Rlcj10eXBlb2YgVGV4dERlY29kZXIhPSJ1bmRlZmluZWQiP25ldyBUZXh0RGVjb2RlcigidXRmOCIpOnVuZGVmaW5lZDt2YXIgVVRGOEFycmF5VG9TdHJpbmc9KGhlYXBPckFycmF5LGlkeCxtYXhCeXRlc1RvUmVhZCk9Pnt2YXIgZW5kSWR4PWlkeCttYXhCeXRlc1RvUmVhZDt2YXIgZW5kUHRyPWlkeDt3aGlsZShoZWFwT3JBcnJheVtlbmRQdHJdJiYhKGVuZFB0cj49ZW5kSWR4KSkrK2VuZFB0cjtpZihlbmRQdHItaWR4PjE2JiZoZWFwT3JBcnJheS5idWZmZXImJlVURjhEZWNvZGVyKXtyZXR1cm4gVVRGOERlY29kZXIuZGVjb2RlKGhlYXBPckFycmF5LnN1YmFycmF5KGlkeCxlbmRQdHIpKX12YXIgc3RyPSIiO3doaWxlKGlkeDxlbmRQdHIpe3ZhciB1MD1oZWFwT3JBcnJheVtpZHgrK107aWYoISh1MCYxMjgpKXtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUodTApO2NvbnRpbnVlfXZhciB1MT1oZWFwT3JBcnJheVtpZHgrK10mNjM7aWYoKHUwJjIyNCk9PTE5Mil7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKCh1MCYzMSk8PDZ8dTEpO2NvbnRpbnVlfXZhciB1Mj1oZWFwT3JBcnJheVtpZHgrK10mNjM7aWYoKHUwJjI0MCk9PTIyNCl7dTA9KHUwJjE1KTw8MTJ8dTE8PDZ8dTI7fWVsc2Uge3UwPSh1MCY3KTw8MTh8dTE8PDEyfHUyPDw2fGhlYXBPckFycmF5W2lkeCsrXSY2Mzt9aWYodTA8NjU1MzYpe3N0cis9U3RyaW5nLmZyb21DaGFyQ29kZSh1MCk7fWVsc2Uge3ZhciBjaD11MC02NTUzNjtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUoNTUyOTZ8Y2g+PjEwLDU2MzIwfGNoJjEwMjMpO319cmV0dXJuIHN0cn07dmFyIFVURjhUb1N0cmluZz0ocHRyLG1heEJ5dGVzVG9SZWFkKT0+cHRyP1VURjhBcnJheVRvU3RyaW5nKEhFQVBVOCxwdHIsbWF4Qnl0ZXNUb1JlYWQpOiIiO3ZhciBfX2VtYmluZF9yZWdpc3Rlcl9zdGRfc3RyaW5nPShyYXdUeXBlLG5hbWUpPT57bmFtZT1yZWFkTGF0aW4xU3RyaW5nKG5hbWUpO3ZhciBzdGRTdHJpbmdJc1VURjg9bmFtZT09PSJzdGQ6OnN0cmluZyI7cmVnaXN0ZXJUeXBlKHJhd1R5cGUse25hbWU6bmFtZSwiZnJvbVdpcmVUeXBlIih2YWx1ZSl7dmFyIGxlbmd0aD1IRUFQVTMyW3ZhbHVlPj4yXTt2YXIgcGF5bG9hZD12YWx1ZSs0O3ZhciBzdHI7aWYoc3RkU3RyaW5nSXNVVEY4KXt2YXIgZGVjb2RlU3RhcnRQdHI9cGF5bG9hZDtmb3IodmFyIGk9MDtpPD1sZW5ndGg7KytpKXt2YXIgY3VycmVudEJ5dGVQdHI9cGF5bG9hZCtpO2lmKGk9PWxlbmd0aHx8SEVBUFU4W2N1cnJlbnRCeXRlUHRyXT09MCl7dmFyIG1heFJlYWQ9Y3VycmVudEJ5dGVQdHItZGVjb2RlU3RhcnRQdHI7dmFyIHN0cmluZ1NlZ21lbnQ9VVRGOFRvU3RyaW5nKGRlY29kZVN0YXJ0UHRyLG1heFJlYWQpO2lmKHN0cj09PXVuZGVmaW5lZCl7c3RyPXN0cmluZ1NlZ21lbnQ7fWVsc2Uge3N0cis9U3RyaW5nLmZyb21DaGFyQ29kZSgwKTtzdHIrPXN0cmluZ1NlZ21lbnQ7fWRlY29kZVN0YXJ0UHRyPWN1cnJlbnRCeXRlUHRyKzE7fX19ZWxzZSB7dmFyIGE9bmV3IEFycmF5KGxlbmd0aCk7Zm9yKHZhciBpPTA7aTxsZW5ndGg7KytpKXthW2ldPVN0cmluZy5mcm9tQ2hhckNvZGUoSEVBUFU4W3BheWxvYWQraV0pO31zdHI9YS5qb2luKCIiKTt9X2ZyZWUodmFsdWUpO3JldHVybiBzdHJ9LCJ0b1dpcmVUeXBlIihkZXN0cnVjdG9ycyx2YWx1ZSl7aWYodmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcil7dmFsdWU9bmV3IFVpbnQ4QXJyYXkodmFsdWUpO312YXIgbGVuZ3RoO3ZhciB2YWx1ZUlzT2ZUeXBlU3RyaW5nPXR5cGVvZiB2YWx1ZT09InN0cmluZyI7aWYoISh2YWx1ZUlzT2ZUeXBlU3RyaW5nfHx2YWx1ZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXl8fHZhbHVlIGluc3RhbmNlb2YgVWludDhDbGFtcGVkQXJyYXl8fHZhbHVlIGluc3RhbmNlb2YgSW50OEFycmF5KSl7dGhyb3dCaW5kaW5nRXJyb3IoIkNhbm5vdCBwYXNzIG5vbi1zdHJpbmcgdG8gc3RkOjpzdHJpbmciKTt9aWYoc3RkU3RyaW5nSXNVVEY4JiZ2YWx1ZUlzT2ZUeXBlU3RyaW5nKXtsZW5ndGg9bGVuZ3RoQnl0ZXNVVEY4KHZhbHVlKTt9ZWxzZSB7bGVuZ3RoPXZhbHVlLmxlbmd0aDt9dmFyIGJhc2U9X21hbGxvYyg0K2xlbmd0aCsxKTt2YXIgcHRyPWJhc2UrNDtIRUFQVTMyW2Jhc2U+PjJdPWxlbmd0aDtpZihzdGRTdHJpbmdJc1VURjgmJnZhbHVlSXNPZlR5cGVTdHJpbmcpe3N0cmluZ1RvVVRGOCh2YWx1ZSxwdHIsbGVuZ3RoKzEpO31lbHNlIHtpZih2YWx1ZUlzT2ZUeXBlU3RyaW5nKXtmb3IodmFyIGk9MDtpPGxlbmd0aDsrK2kpe3ZhciBjaGFyQ29kZT12YWx1ZS5jaGFyQ29kZUF0KGkpO2lmKGNoYXJDb2RlPjI1NSl7X2ZyZWUocHRyKTt0aHJvd0JpbmRpbmdFcnJvcigiU3RyaW5nIGhhcyBVVEYtMTYgY29kZSB1bml0cyB0aGF0IGRvIG5vdCBmaXQgaW4gOCBiaXRzIik7fUhFQVBVOFtwdHIraV09Y2hhckNvZGU7fX1lbHNlIHtmb3IodmFyIGk9MDtpPGxlbmd0aDsrK2kpe0hFQVBVOFtwdHIraV09dmFsdWVbaV07fX19aWYoZGVzdHJ1Y3RvcnMhPT1udWxsKXtkZXN0cnVjdG9ycy5wdXNoKF9mcmVlLGJhc2UpO31yZXR1cm4gYmFzZX0sImFyZ1BhY2tBZHZhbmNlIjpHZW5lcmljV2lyZVR5cGVTaXplLCJyZWFkVmFsdWVGcm9tUG9pbnRlciI6cmVhZFBvaW50ZXIsZGVzdHJ1Y3RvckZ1bmN0aW9uKHB0cil7X2ZyZWUocHRyKTt9fSk7fTt2YXIgVVRGMTZEZWNvZGVyPXR5cGVvZiBUZXh0RGVjb2RlciE9InVuZGVmaW5lZCI/bmV3IFRleHREZWNvZGVyKCJ1dGYtMTZsZSIpOnVuZGVmaW5lZDt2YXIgVVRGMTZUb1N0cmluZz0ocHRyLG1heEJ5dGVzVG9SZWFkKT0+e3ZhciBlbmRQdHI9cHRyO3ZhciBpZHg9ZW5kUHRyPj4xO3ZhciBtYXhJZHg9aWR4K21heEJ5dGVzVG9SZWFkLzI7d2hpbGUoIShpZHg+PW1heElkeCkmJkhFQVBVMTZbaWR4XSkrK2lkeDtlbmRQdHI9aWR4PDwxO2lmKGVuZFB0ci1wdHI+MzImJlVURjE2RGVjb2RlcilyZXR1cm4gVVRGMTZEZWNvZGVyLmRlY29kZShIRUFQVTguc3ViYXJyYXkocHRyLGVuZFB0cikpO3ZhciBzdHI9IiI7Zm9yKHZhciBpPTA7IShpPj1tYXhCeXRlc1RvUmVhZC8yKTsrK2kpe3ZhciBjb2RlVW5pdD1IRUFQMTZbcHRyK2kqMj4+MV07aWYoY29kZVVuaXQ9PTApYnJlYWs7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGVVbml0KTt9cmV0dXJuIHN0cn07dmFyIHN0cmluZ1RvVVRGMTY9KHN0cixvdXRQdHIsbWF4Qnl0ZXNUb1dyaXRlKT0+e2lmKG1heEJ5dGVzVG9Xcml0ZT09PXVuZGVmaW5lZCl7bWF4Qnl0ZXNUb1dyaXRlPTIxNDc0ODM2NDc7fWlmKG1heEJ5dGVzVG9Xcml0ZTwyKXJldHVybiAwO21heEJ5dGVzVG9Xcml0ZS09Mjt2YXIgc3RhcnRQdHI9b3V0UHRyO3ZhciBudW1DaGFyc1RvV3JpdGU9bWF4Qnl0ZXNUb1dyaXRlPHN0ci5sZW5ndGgqMj9tYXhCeXRlc1RvV3JpdGUvMjpzdHIubGVuZ3RoO2Zvcih2YXIgaT0wO2k8bnVtQ2hhcnNUb1dyaXRlOysraSl7dmFyIGNvZGVVbml0PXN0ci5jaGFyQ29kZUF0KGkpO0hFQVAxNltvdXRQdHI+PjFdPWNvZGVVbml0O291dFB0cis9Mjt9SEVBUDE2W291dFB0cj4+MV09MDtyZXR1cm4gb3V0UHRyLXN0YXJ0UHRyfTt2YXIgbGVuZ3RoQnl0ZXNVVEYxNj1zdHI9PnN0ci5sZW5ndGgqMjt2YXIgVVRGMzJUb1N0cmluZz0ocHRyLG1heEJ5dGVzVG9SZWFkKT0+e3ZhciBpPTA7dmFyIHN0cj0iIjt3aGlsZSghKGk+PW1heEJ5dGVzVG9SZWFkLzQpKXt2YXIgdXRmMzI9SEVBUDMyW3B0citpKjQ+PjJdO2lmKHV0ZjMyPT0wKWJyZWFrOysraTtpZih1dGYzMj49NjU1MzYpe3ZhciBjaD11dGYzMi02NTUzNjtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUoNTUyOTZ8Y2g+PjEwLDU2MzIwfGNoJjEwMjMpO31lbHNlIHtzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUodXRmMzIpO319cmV0dXJuIHN0cn07dmFyIHN0cmluZ1RvVVRGMzI9KHN0cixvdXRQdHIsbWF4Qnl0ZXNUb1dyaXRlKT0+e2lmKG1heEJ5dGVzVG9Xcml0ZT09PXVuZGVmaW5lZCl7bWF4Qnl0ZXNUb1dyaXRlPTIxNDc0ODM2NDc7fWlmKG1heEJ5dGVzVG9Xcml0ZTw0KXJldHVybiAwO3ZhciBzdGFydFB0cj1vdXRQdHI7dmFyIGVuZFB0cj1zdGFydFB0cittYXhCeXRlc1RvV3JpdGUtNDtmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7KytpKXt2YXIgY29kZVVuaXQ9c3RyLmNoYXJDb2RlQXQoaSk7aWYoY29kZVVuaXQ+PTU1Mjk2JiZjb2RlVW5pdDw9NTczNDMpe3ZhciB0cmFpbFN1cnJvZ2F0ZT1zdHIuY2hhckNvZGVBdCgrK2kpO2NvZGVVbml0PTY1NTM2KygoY29kZVVuaXQmMTAyMyk8PDEwKXx0cmFpbFN1cnJvZ2F0ZSYxMDIzO31IRUFQMzJbb3V0UHRyPj4yXT1jb2RlVW5pdDtvdXRQdHIrPTQ7aWYob3V0UHRyKzQ+ZW5kUHRyKWJyZWFrfUhFQVAzMltvdXRQdHI+PjJdPTA7cmV0dXJuIG91dFB0ci1zdGFydFB0cn07dmFyIGxlbmd0aEJ5dGVzVVRGMzI9c3RyPT57dmFyIGxlbj0wO2Zvcih2YXIgaT0wO2k8c3RyLmxlbmd0aDsrK2kpe3ZhciBjb2RlVW5pdD1zdHIuY2hhckNvZGVBdChpKTtpZihjb2RlVW5pdD49NTUyOTYmJmNvZGVVbml0PD01NzM0MykrK2k7bGVuKz00O31yZXR1cm4gbGVufTt2YXIgX19lbWJpbmRfcmVnaXN0ZXJfc3RkX3dzdHJpbmc9KHJhd1R5cGUsY2hhclNpemUsbmFtZSk9PntuYW1lPXJlYWRMYXRpbjFTdHJpbmcobmFtZSk7dmFyIGRlY29kZVN0cmluZyxlbmNvZGVTdHJpbmcsZ2V0SGVhcCxsZW5ndGhCeXRlc1VURixzaGlmdDtpZihjaGFyU2l6ZT09PTIpe2RlY29kZVN0cmluZz1VVEYxNlRvU3RyaW5nO2VuY29kZVN0cmluZz1zdHJpbmdUb1VURjE2O2xlbmd0aEJ5dGVzVVRGPWxlbmd0aEJ5dGVzVVRGMTY7Z2V0SGVhcD0oKT0+SEVBUFUxNjtzaGlmdD0xO31lbHNlIGlmKGNoYXJTaXplPT09NCl7ZGVjb2RlU3RyaW5nPVVURjMyVG9TdHJpbmc7ZW5jb2RlU3RyaW5nPXN0cmluZ1RvVVRGMzI7bGVuZ3RoQnl0ZXNVVEY9bGVuZ3RoQnl0ZXNVVEYzMjtnZXRIZWFwPSgpPT5IRUFQVTMyO3NoaWZ0PTI7fXJlZ2lzdGVyVHlwZShyYXdUeXBlLHtuYW1lOm5hbWUsImZyb21XaXJlVHlwZSI6dmFsdWU9Pnt2YXIgbGVuZ3RoPUhFQVBVMzJbdmFsdWU+PjJdO3ZhciBIRUFQPWdldEhlYXAoKTt2YXIgc3RyO3ZhciBkZWNvZGVTdGFydFB0cj12YWx1ZSs0O2Zvcih2YXIgaT0wO2k8PWxlbmd0aDsrK2kpe3ZhciBjdXJyZW50Qnl0ZVB0cj12YWx1ZSs0K2kqY2hhclNpemU7aWYoaT09bGVuZ3RofHxIRUFQW2N1cnJlbnRCeXRlUHRyPj5zaGlmdF09PTApe3ZhciBtYXhSZWFkQnl0ZXM9Y3VycmVudEJ5dGVQdHItZGVjb2RlU3RhcnRQdHI7dmFyIHN0cmluZ1NlZ21lbnQ9ZGVjb2RlU3RyaW5nKGRlY29kZVN0YXJ0UHRyLG1heFJlYWRCeXRlcyk7aWYoc3RyPT09dW5kZWZpbmVkKXtzdHI9c3RyaW5nU2VnbWVudDt9ZWxzZSB7c3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDApO3N0cis9c3RyaW5nU2VnbWVudDt9ZGVjb2RlU3RhcnRQdHI9Y3VycmVudEJ5dGVQdHIrY2hhclNpemU7fX1fZnJlZSh2YWx1ZSk7cmV0dXJuIHN0cn0sInRvV2lyZVR5cGUiOihkZXN0cnVjdG9ycyx2YWx1ZSk9PntpZighKHR5cGVvZiB2YWx1ZT09InN0cmluZyIpKXt0aHJvd0JpbmRpbmdFcnJvcihgQ2Fubm90IHBhc3Mgbm9uLXN0cmluZyB0byBDKysgc3RyaW5nIHR5cGUgJHtuYW1lfWApO312YXIgbGVuZ3RoPWxlbmd0aEJ5dGVzVVRGKHZhbHVlKTt2YXIgcHRyPV9tYWxsb2MoNCtsZW5ndGgrY2hhclNpemUpO0hFQVBVMzJbcHRyPj4yXT1sZW5ndGg+PnNoaWZ0O2VuY29kZVN0cmluZyh2YWx1ZSxwdHIrNCxsZW5ndGgrY2hhclNpemUpO2lmKGRlc3RydWN0b3JzIT09bnVsbCl7ZGVzdHJ1Y3RvcnMucHVzaChfZnJlZSxwdHIpO31yZXR1cm4gcHRyfSwiYXJnUGFja0FkdmFuY2UiOkdlbmVyaWNXaXJlVHlwZVNpemUsInJlYWRWYWx1ZUZyb21Qb2ludGVyIjpzaW1wbGVSZWFkVmFsdWVGcm9tUG9pbnRlcixkZXN0cnVjdG9yRnVuY3Rpb24ocHRyKXtfZnJlZShwdHIpO319KTt9O3ZhciBfX2VtYmluZF9yZWdpc3Rlcl92b2lkPShyYXdUeXBlLG5hbWUpPT57bmFtZT1yZWFkTGF0aW4xU3RyaW5nKG5hbWUpO3JlZ2lzdGVyVHlwZShyYXdUeXBlLHtpc1ZvaWQ6dHJ1ZSxuYW1lOm5hbWUsImFyZ1BhY2tBZHZhbmNlIjowLCJmcm9tV2lyZVR5cGUiOigpPT51bmRlZmluZWQsInRvV2lyZVR5cGUiOihkZXN0cnVjdG9ycyxvKT0+dW5kZWZpbmVkfSk7fTt2YXIgZ2V0SGVhcE1heD0oKT0+MjE0NzQ4MzY0ODt2YXIgZ3Jvd01lbW9yeT1zaXplPT57dmFyIGI9d2FzbU1lbW9yeS5idWZmZXI7dmFyIHBhZ2VzPShzaXplLWIuYnl0ZUxlbmd0aCs2NTUzNSkvNjU1MzY7dHJ5e3dhc21NZW1vcnkuZ3JvdyhwYWdlcyk7dXBkYXRlTWVtb3J5Vmlld3MoKTtyZXR1cm4gMX1jYXRjaChlKXt9fTt2YXIgX2Vtc2NyaXB0ZW5fcmVzaXplX2hlYXA9cmVxdWVzdGVkU2l6ZT0+e3ZhciBvbGRTaXplPUhFQVBVOC5sZW5ndGg7cmVxdWVzdGVkU2l6ZT4+Pj0wO3ZhciBtYXhIZWFwU2l6ZT1nZXRIZWFwTWF4KCk7aWYocmVxdWVzdGVkU2l6ZT5tYXhIZWFwU2l6ZSl7cmV0dXJuIGZhbHNlfXZhciBhbGlnblVwPSh4LG11bHRpcGxlKT0+eCsobXVsdGlwbGUteCVtdWx0aXBsZSklbXVsdGlwbGU7Zm9yKHZhciBjdXREb3duPTE7Y3V0RG93bjw9NDtjdXREb3duKj0yKXt2YXIgb3Zlckdyb3duSGVhcFNpemU9b2xkU2l6ZSooMSsuMi9jdXREb3duKTtvdmVyR3Jvd25IZWFwU2l6ZT1NYXRoLm1pbihvdmVyR3Jvd25IZWFwU2l6ZSxyZXF1ZXN0ZWRTaXplKzEwMDY2MzI5Nik7dmFyIG5ld1NpemU9TWF0aC5taW4obWF4SGVhcFNpemUsYWxpZ25VcChNYXRoLm1heChyZXF1ZXN0ZWRTaXplLG92ZXJHcm93bkhlYXBTaXplKSw2NTUzNikpO3ZhciByZXBsYWNlbWVudD1ncm93TWVtb3J5KG5ld1NpemUpO2lmKHJlcGxhY2VtZW50KXtyZXR1cm4gdHJ1ZX19cmV0dXJuIGZhbHNlfTtlbWJpbmRfaW5pdF9jaGFyQ29kZXMoKTtCaW5kaW5nRXJyb3I9TW9kdWxlWyJCaW5kaW5nRXJyb3IiXT1jbGFzcyBCaW5kaW5nRXJyb3IgZXh0ZW5kcyBFcnJvcntjb25zdHJ1Y3RvcihtZXNzYWdlKXtzdXBlcihtZXNzYWdlKTt0aGlzLm5hbWU9IkJpbmRpbmdFcnJvciI7fX07TW9kdWxlWyJJbnRlcm5hbEVycm9yIl09Y2xhc3MgSW50ZXJuYWxFcnJvciBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKG1lc3NhZ2Upe3N1cGVyKG1lc3NhZ2UpO3RoaXMubmFtZT0iSW50ZXJuYWxFcnJvciI7fX07aGFuZGxlQWxsb2NhdG9ySW5pdCgpO2luaXRfZW12YWwoKTt2YXIgd2FzbUltcG9ydHM9e2Y6X19lbWJpbmRfcmVnaXN0ZXJfYmlnaW50LGk6X19lbWJpbmRfcmVnaXN0ZXJfYm9vbCxoOl9fZW1iaW5kX3JlZ2lzdGVyX2VtdmFsLGU6X19lbWJpbmRfcmVnaXN0ZXJfZmxvYXQsYjpfX2VtYmluZF9yZWdpc3Rlcl9pbnRlZ2VyLGE6X19lbWJpbmRfcmVnaXN0ZXJfbWVtb3J5X3ZpZXcsZDpfX2VtYmluZF9yZWdpc3Rlcl9zdGRfc3RyaW5nLGM6X19lbWJpbmRfcmVnaXN0ZXJfc3RkX3dzdHJpbmcsajpfX2VtYmluZF9yZWdpc3Rlcl92b2lkLGc6X2Vtc2NyaXB0ZW5fcmVzaXplX2hlYXB9O3ZhciB3YXNtRXhwb3J0cz1jcmVhdGVXYXNtKCk7TW9kdWxlWyJfc29ydCJdPShhMCxhMSxhMixhMyxhNCxhNSxhNik9PihNb2R1bGVbIl9zb3J0Il09d2FzbUV4cG9ydHNbIm0iXSkoYTAsYTEsYTIsYTMsYTQsYTUsYTYpO01vZHVsZVsiX19lbWJpbmRfaW5pdGlhbGl6ZV9iaW5kaW5ncyJdPSgpPT4oTW9kdWxlWyJfX2VtYmluZF9pbml0aWFsaXplX2JpbmRpbmdzIl09d2FzbUV4cG9ydHNbIm4iXSkoKTt2YXIgX21hbGxvYz1Nb2R1bGVbIl9tYWxsb2MiXT1hMD0+KF9tYWxsb2M9TW9kdWxlWyJfbWFsbG9jIl09d2FzbUV4cG9ydHNbInAiXSkoYTApO3ZhciBfZnJlZT1Nb2R1bGVbIl9mcmVlIl09YTA9PihfZnJlZT1Nb2R1bGVbIl9mcmVlIl09d2FzbUV4cG9ydHNbInEiXSkoYTApO2Z1bmN0aW9uIGludEFycmF5RnJvbUJhc2U2NChzKXt2YXIgZGVjb2RlZD1hdG9iKHMpO3ZhciBieXRlcz1uZXcgVWludDhBcnJheShkZWNvZGVkLmxlbmd0aCk7Zm9yKHZhciBpPTA7aTxkZWNvZGVkLmxlbmd0aDsrK2kpe2J5dGVzW2ldPWRlY29kZWQuY2hhckNvZGVBdChpKTt9cmV0dXJuIGJ5dGVzfWZ1bmN0aW9uIHRyeVBhcnNlQXNEYXRhVVJJKGZpbGVuYW1lKXtpZighaXNEYXRhVVJJKGZpbGVuYW1lKSl7cmV0dXJufXJldHVybiBpbnRBcnJheUZyb21CYXNlNjQoZmlsZW5hbWUuc2xpY2UoZGF0YVVSSVByZWZpeC5sZW5ndGgpKX12YXIgY2FsbGVkUnVuO2RlcGVuZGVuY2llc0Z1bGZpbGxlZD1mdW5jdGlvbiBydW5DYWxsZXIoKXtpZighY2FsbGVkUnVuKXJ1bigpO2lmKCFjYWxsZWRSdW4pZGVwZW5kZW5jaWVzRnVsZmlsbGVkPXJ1bkNhbGxlcjt9O2Z1bmN0aW9uIHJ1bigpe2lmKHJ1bkRlcGVuZGVuY2llcz4wKXtyZXR1cm59cHJlUnVuKCk7aWYocnVuRGVwZW5kZW5jaWVzPjApe3JldHVybn1mdW5jdGlvbiBkb1J1bigpe2lmKGNhbGxlZFJ1bilyZXR1cm47Y2FsbGVkUnVuPXRydWU7TW9kdWxlWyJjYWxsZWRSdW4iXT10cnVlO2lmKEFCT1JUKXJldHVybjtpbml0UnVudGltZSgpO3JlYWR5UHJvbWlzZVJlc29sdmUoTW9kdWxlKTtpZihNb2R1bGVbIm9uUnVudGltZUluaXRpYWxpemVkIl0pTW9kdWxlWyJvblJ1bnRpbWVJbml0aWFsaXplZCJdKCk7cG9zdFJ1bigpO31pZihNb2R1bGVbInNldFN0YXR1cyJdKXtNb2R1bGVbInNldFN0YXR1cyJdKCJSdW5uaW5nLi4uIik7c2V0VGltZW91dChmdW5jdGlvbigpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXtNb2R1bGVbInNldFN0YXR1cyJdKCIiKTt9LDEpO2RvUnVuKCk7fSwxKTt9ZWxzZSB7ZG9SdW4oKTt9fWlmKE1vZHVsZVsicHJlSW5pdCJdKXtpZih0eXBlb2YgTW9kdWxlWyJwcmVJbml0Il09PSJmdW5jdGlvbiIpTW9kdWxlWyJwcmVJbml0Il09W01vZHVsZVsicHJlSW5pdCJdXTt3aGlsZShNb2R1bGVbInByZUluaXQiXS5sZW5ndGg+MCl7TW9kdWxlWyJwcmVJbml0Il0ucG9wKCkoKTt9fXJ1bigpOwoKCiAgICByZXR1cm4gbW9kdWxlQXJnLnJlYWR5CiAgfQoKICApOwogIH0pKCk7CgogIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55CiAgbGV0IHdhc21Nb2R1bGU7CiAgYXN5bmMgZnVuY3Rpb24gaW5pdFdhc20oKSB7CiAgICAgIHdhc21Nb2R1bGUgPSBhd2FpdCBsb2FkV2FzbSgpOwogIH0KICBsZXQgc2NlbmU7CiAgbGV0IHZpZXdQcm9qOwogIGxldCBzb3J0UnVubmluZyA9IGZhbHNlOwogIGxldCB2aWV3UHJvalB0cjsKICBsZXQgZkJ1ZmZlclB0cjsKICBsZXQgZGVwdGhCdWZmZXJQdHI7CiAgbGV0IGRlcHRoSW5kZXhQdHI7CiAgbGV0IHN0YXJ0c1B0cjsKICBsZXQgY291bnRzUHRyOwogIGNvbnN0IGluaXRTY2VuZSA9IGFzeW5jICgpID0+IHsKICAgICAgaWYgKCF3YXNtTW9kdWxlKQogICAgICAgICAgYXdhaXQgaW5pdFdhc20oKTsKICAgICAgZkJ1ZmZlclB0ciA9IHdhc21Nb2R1bGUuX21hbGxvYyhzY2VuZS5wb3NpdGlvbnMubGVuZ3RoICogc2NlbmUucG9zaXRpb25zLkJZVEVTX1BFUl9FTEVNRU5UKTsKICAgICAgd2FzbU1vZHVsZS5IRUFQRjMyLnNldChzY2VuZS5wb3NpdGlvbnMsIGZCdWZmZXJQdHIgLyA0KTsKICAgICAgdmlld1Byb2pQdHIgPSB3YXNtTW9kdWxlLl9tYWxsb2MoMTYgKiA0KTsKICAgICAgZGVwdGhCdWZmZXJQdHIgPSB3YXNtTW9kdWxlLl9tYWxsb2Moc2NlbmUudmVydGV4Q291bnQgKiA0KTsKICAgICAgZGVwdGhJbmRleFB0ciA9IHdhc21Nb2R1bGUuX21hbGxvYyhzY2VuZS52ZXJ0ZXhDb3VudCAqIDQpOwogICAgICBzdGFydHNQdHIgPSB3YXNtTW9kdWxlLl9tYWxsb2Moc2NlbmUudmVydGV4Q291bnQgKiA0KTsKICAgICAgY291bnRzUHRyID0gd2FzbU1vZHVsZS5fbWFsbG9jKHNjZW5lLnZlcnRleENvdW50ICogNCk7CiAgfTsKICBjb25zdCBydW5Tb3J0ID0gKHZpZXdQcm9qKSA9PiB7CiAgICAgIGNvbnN0IHZpZXdQcm9qQnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSh2aWV3UHJvai5idWZmZXIpOwogICAgICB3YXNtTW9kdWxlLkhFQVBGMzIuc2V0KHZpZXdQcm9qQnVmZmVyLCB2aWV3UHJvalB0ciAvIDQpOwogICAgICB3YXNtTW9kdWxlLl9zb3J0KHZpZXdQcm9qUHRyLCBzY2VuZS52ZXJ0ZXhDb3VudCwgZkJ1ZmZlclB0ciwgZGVwdGhCdWZmZXJQdHIsIGRlcHRoSW5kZXhQdHIsIHN0YXJ0c1B0ciwgY291bnRzUHRyKTsKICAgICAgY29uc3QgZGVwdGhJbmRleCA9IG5ldyBVaW50MzJBcnJheSh3YXNtTW9kdWxlLkhFQVBVMzIuYnVmZmVyLCBkZXB0aEluZGV4UHRyLCBzY2VuZS52ZXJ0ZXhDb3VudCk7CiAgICAgIGNvbnN0IHRyYW5zZmVyYWJsZURlcHRoSW5kZXggPSBuZXcgVWludDMyQXJyYXkoZGVwdGhJbmRleC5zbGljZSgpKTsKICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGRlcHRoSW5kZXg6IHRyYW5zZmVyYWJsZURlcHRoSW5kZXggfSwgW3RyYW5zZmVyYWJsZURlcHRoSW5kZXguYnVmZmVyXSk7CiAgfTsKICBjb25zdCB0aHJvdHRsZWRTb3J0ID0gKCkgPT4gewogICAgICBpZiAoIXNvcnRSdW5uaW5nKSB7CiAgICAgICAgICBzb3J0UnVubmluZyA9IHRydWU7CiAgICAgICAgICBjb25zdCBsYXN0VmlldyA9IHZpZXdQcm9qOwogICAgICAgICAgcnVuU29ydChsYXN0Vmlldyk7CiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsKICAgICAgICAgICAgICBzb3J0UnVubmluZyA9IGZhbHNlOwogICAgICAgICAgICAgIGlmIChsYXN0VmlldyAhPT0gdmlld1Byb2opIHsKICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkU29ydCgpOwogICAgICAgICAgICAgIH0KICAgICAgICAgIH0sIDApOwogICAgICB9CiAgfTsKICBzZWxmLm9ubWVzc2FnZSA9IChlKSA9PiB7CiAgICAgIGlmIChlLmRhdGEuc2NlbmUpIHsKICAgICAgICAgIHNjZW5lID0gZS5kYXRhLnNjZW5lOwogICAgICAgICAgaW5pdFNjZW5lKCk7CiAgICAgIH0KICAgICAgaWYgKCFzY2VuZSB8fCAhd2FzbU1vZHVsZSkKICAgICAgICAgIHJldHVybjsKICAgICAgaWYgKGUuZGF0YS52aWV3UHJvaikgewogICAgICAgICAgdmlld1Byb2ogPSBlLmRhdGEudmlld1Byb2o7CiAgICAgICAgICB0aHJvdHRsZWRTb3J0KCk7CiAgICAgIH0KICB9OwoKfSkoKTsKLy8jIHNvdXJjZU1hcHBpbmdVUkw9V29ya2VyLmpzLm1hcAoK",
kt = null,
Yt = false,
function(b) {
    return Bt = Bt || At(St, kt, Yt),
    new Worker(Bt,b)
}
);
class Pt {
    constructor(e=1) {
        let n, l, t, a = 0, d = false;
        this.init = (U,F)=>{
            a = 0,
            d = true,
            n = U,
            l = U.gl.getUniformLocation(F, "u_useDepthFade"),
            n.gl.uniform1i(l, 1),
            t = U.gl.getUniformLocation(F, "u_depthFade"),
            n.gl.uniform1f(t, a)
        }
        ,
        this.render = ()=>{
            d && (a = Math.min(a + .01 * e, 1),
            a >= 1 && (d = false,
            n.gl.uniform1i(l, 0)),
            n.gl.uniform1f(t, a))
        }
    }
}
class qt {
    constructor(e=null, n=null) {
        const l = e || document.createElement("canvas");
        e || (l.style.display = "block",
        l.style.boxSizing = "border-box",
        l.style.width = "100vw",
        l.style.height = "100vh",
        l.style.margin = "0",
        l.style.padding = "0",
        l.style.opacity = "1",
        document.body.appendChild(l)),
        l.style.background = "#000",
        this.domElement = l;
        const t = l.getContext("webgl2", {
            antialias: false
        });
        this.gl = t;
        const a = n || [];
        n || a.push(new Pt);
        let d, U, F, s, o, i, V, r, c, J, u, h, Q, R, W, T, E, p, w, G = false, j = false;
        this.resize = ()=>{
            const B = l.clientWidth
              , N = l.clientHeight;
            l.width === B && l.height === N || this.setSize(B, N)
        }
        ,
        this.setSize = (B,N)=>{
            l.width = B,
            l.height = N,
            U && (t.viewport(0, 0, l.width, l.height),
            U.update(l.width, l.height),
            V = t.getUniformLocation(i, "projection"),
            t.uniformMatrix4fv(V, false, U.projectionMatrix.buffer),
            h = t.getUniformLocation(i, "camPos"),
            t.uniform3fv(h, new Float32Array(U.position.flat())),
            r = t.getUniformLocation(i, "viewport"),
            t.uniform2fv(r, new Float32Array([l.width, l.height])))
        }
        ;
        const M = ()=>{
            F = new Lt;
            const B = {
                positions: d.positions,
                vertexCount: d.vertexCount
            };
            F.postMessage({
                scene: B
            }),
            t.viewport(0, 0, l.width, l.height),
            s = t.createShader(t.VERTEX_SHADER),
            t.shaderSource(s, `#version 300 es
precision highp float;
precision highp int;

const float SH_C0 = 0.28209479177387814;
const float SH_C1 = 0.4886025119029199;
const float SH_C2[5] = float[](
    1.0925484305920792,
    -1.0925484305920792,
    0.31539156525252005,
    -1.0925484305920792,
    0.5462742152960396
);

const float SH_C3[7] = float[](
    -0.5900435899266435,
    2.890611442640554,
    -0.4570457994644658,
    0.3731763325901154,
    -0.4570457994644658,
    1.445305721320277,
    -0.5900435899266435
);

// from the packed 8 + 8 floats (from one channel) fill in the shs (layout(rgb, rgb, ...., rgb))
void fill_sh_from_packed(in uvec4 packed0, in uvec4 packed1, in int offset, inout float shs[48]) {
    float sorted[16];

    int ind = 0;
    for(int i = 0; i < 4; i ++) {
        vec2 v = unpackHalf2x16(packed0[i]);
        sorted[ind] = v.x;
        sorted[ind+1] = v.y;

        ind += 2;
    }

    for(int i = 0; i < 4; i ++) {
        vec2 v = unpackHalf2x16(packed1[i]);
        sorted[ind] = v.x;
        sorted[ind+1] = v.y;

        ind += 2;
    }

    int stride = 3;
    for(int i = 0; i < 16; i ++) {
        shs[offset + (i*stride)] = sorted[i];
    }
}


vec3 eval_sh_rgb(highp usampler2D tex_r, highp usampler2D tex_g, highp usampler2D tex_b, int index, uint deg, vec3 dir) {
    float shs[48];

    uvec4 packed_r0 = texelFetch(tex_r, ivec2(((uint(index) & 0x3ffu) << 1), uint(index) >> 10), 0);
    uvec4 packed_r1 = texelFetch(tex_r, ivec2(((uint(index) & 0x3ffu) << 1) | 1u, uint(index) >> 10), 0);
    fill_sh_from_packed(packed_r0, packed_r1, 0, shs);

    uvec4 packed_g0 = texelFetch(tex_g, ivec2(((uint(index) & 0x3ffu) << 1), uint(index) >> 10), 0);
    uvec4 packed_g1 = texelFetch(tex_g, ivec2(((uint(index) & 0x3ffu) << 1) | 1u, uint(index) >> 10), 0);
    fill_sh_from_packed(packed_g0, packed_g1, 1, shs);

    uvec4 packed_b0 = texelFetch(tex_b, ivec2(((uint(index) & 0x3ffu) << 1), uint(index) >> 10), 0);
    uvec4 packed_b1 = texelFetch(tex_b, ivec2(((uint(index) & 0x3ffu) << 1) | 1u, uint(index) >> 10), 0);
    fill_sh_from_packed(packed_b0, packed_b1, 2, shs);
    
    vec3 result = SH_C0 * vec3(shs[0], shs[1], shs[2]);

    if(deg > 0u) {
        float x = dir.x, y = dir.y, z = dir.z;
        result -= (SH_C1 * y * vec3(shs[3], shs[4], shs[5])) + 
            (SH_C1 * z * vec3(shs[6], shs[7], shs[8])) - 
            (SH_C1 * x * vec3(shs[9], shs[10], shs[11]));

        if(deg > 1u) {
            float xx = x*x, yy = y*y, zz = z*z;
            float xy = x * y, yz = y * z, xz = x * z;

            result += (SH_C2[0] * xy * vec3(shs[12], shs[13], shs[14])) +
                (SH_C2[1] * yz * vec3(shs[15], shs[16], shs[17])) +
                (SH_C2[2] * (2.0 * zz - xx - yy) * vec3(shs[18], shs[19], shs[20])) +
                (SH_C2[3] * xz * vec3(shs[21], shs[22], shs[23])) +
                (SH_C2[4] * (xx - yy) * vec3(shs[24], shs[25], shs[26]));

            if(deg > 2u) {
                result += (SH_C3[0] * y * (3.0 * xx - yy) * vec3(shs[27], shs[28], shs[29])) +
                    (SH_C3[1] * xy * z * vec3(shs[30], shs[31], shs[32])) +
                    (SH_C3[2] * y * (4.0 * zz - xx - yy)* vec3(shs[33], shs[34], shs[35])) +
                    (SH_C3[3] * z * (2.0 * zz - 3.0 * xx - 3.0 * yy) * vec3(shs[36], shs[37], shs[38])) +
                    (SH_C3[4] * x * (4.0 * zz - xx - yy) * vec3(shs[39], shs[40], shs[41])) +
                    (SH_C3[5] * z * (xx - yy) * vec3(shs[42], shs[43], shs[44])) +
                    (SH_C3[6] * x * (xx - 3.0 * yy) * vec3(shs[45], shs[46], shs[47]));
            }
        }
    }

    result += 0.5;
    return vec3(max(result.x, 0.), max(result.y, 0.), max(result.z, 0.));
}

uniform highp usampler2D u_texture;
// uniform highp usampler2D u_shTexture;

uniform highp usampler2D u_sh_r;
uniform highp usampler2D u_sh_g;
uniform highp usampler2D u_sh_b;

uniform mat4 projection, view;
uniform vec2 focal;
uniform vec2 viewport;
uniform vec3 camPos;

uniform bool u_useDepthFade;
uniform float u_depthFade;

// uniform bool u_use_shs;
uniform ivec3 u_bandIndex;

in vec2 position;
in int index;

out vec4 vColor;
out vec2 vPosition;

void main () {
    bool use_shs = false;

    uvec4 cen = texelFetch(u_texture, ivec2((uint(index) & 0x3ffu) << 1, uint(index) >> 10), 0);
    vec3 p = uintBitsToFloat(cen.xyz);
    vec4 cam = view * vec4(p, 1);
    vec4 pos2d = projection * cam;

    float clip = 1.2 * pos2d.w;
    if (pos2d.z < -pos2d.w || pos2d.x < -clip || pos2d.x > clip || pos2d.y < -clip || pos2d.y > clip) {
        gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
        return;
    }

    uvec4 cov = texelFetch(u_texture, ivec2(((uint(index) & 0x3ffu) << 1) | 1u, uint(index) >> 10), 0);
    vec2 u1 = unpackHalf2x16(cov.x), u2 = unpackHalf2x16(cov.y), u3 = unpackHalf2x16(cov.z);
    mat3 Vrk = mat3(u1.x, u1.y, u2.x, u1.y, u2.y, u3.x, u2.x, u3.x, u3.y);

    mat3 J = mat3(
        focal.x / cam.z, 0., -(focal.x * cam.x) / (cam.z * cam.z), 
        0., -focal.y / cam.z, (focal.y * cam.y) / (cam.z * cam.z), 
        0., 0., 0.
    );

    mat3 T = transpose(mat3(view)) * J;
    mat3 cov2d = transpose(T) * Vrk * T;

    // LOW PASS FILTER should be applied
    cov2d[0][0] += 0.3f;
    cov2d[1][1] += 0.3f;    

    float det = (cov2d[0][0] * cov2d[1][1] - cov2d[0][1] * cov2d[0][1]);
	if (det == 0.0f)
		return;


    float mid = (cov2d[0][0] + cov2d[1][1]) / 2.0;
	float lambda1 = mid + sqrt(max(0.1f, mid * mid - det));
	float lambda2 = mid - sqrt(max(0.1f, mid * mid - det));
    float radius = ceil(3.f * sqrt(max(lambda1, lambda2)));

    if(lambda2 < 0.0) return;

    vec2 diagonalVector = normalize(vec2(cov2d[0][1], lambda1 - cov2d[0][0]));
    vec2 majorAxis = min(sqrt(2.0 * lambda1), 1024.0) * diagonalVector;
    vec2 minorAxis = min(sqrt(2.0 * lambda2), 1024.0) * vec2(diagonalVector.y, -diagonalVector.x);

    vec3 rgb;
    float opacity = float((cov.w >> 24) & 0xffu) / 255.0;
    
    if(index > u_bandIndex[0]) {
        use_shs = true;
    }

    // use_shs = false;

    //color based on spherical harmonics
    if(use_shs) {
        int tex_index = index - (u_bandIndex[0]+1);
        uint deg = index > u_bandIndex[1] ? index > u_bandIndex[2] ? 3u : 2u : 1u;    
        // uint deg = 1u;    

        // if(index > u_bandIndex.y) {
        //     deg ++;
        //     if(index > u_bandIndex.z) {
        //         deg ++;
        //     }
        // }

        mat4 inverted_view = inverse(view);
        vec3 dir = normalize(p - inverted_view[3].xyz);

        rgb = eval_sh_rgb(u_sh_r, u_sh_g, u_sh_b, tex_index, deg, dir);
        rgb = vec3(min(rgb.x, 1.), min(rgb.y, 1.), min(rgb.z, 1.));
        
    } else {

        rgb = vec3((cov.w) & 0xffu, (cov.w >> 8) & 0xffu, (cov.w >> 16) & 0xffu) / 255.0;
    }

    vColor = vec4(rgb, opacity);

    vPosition = position;

    float scalingFactor = 1.0;

    if(u_useDepthFade) {
        float depthNorm = (pos2d.z / pos2d.w + 1.0) / 2.0;
        float near = 0.1; float far = 100.0;
        float normalizedDepth = (2.0 * near) / (far + near - depthNorm * (far - near));
        float start = max(normalizedDepth - 0.1, 0.0);
        float end = min(normalizedDepth + 0.1, 1.0);
        scalingFactor = clamp((u_depthFade - start) / (end - start), 0.0, 1.0);
    }

    vec2 vCenter = vec2(pos2d) / pos2d.w;
    gl_Position = vec4(
        vCenter 
        + position.x * majorAxis * scalingFactor / viewport 
        + position.y * minorAxis * scalingFactor / viewport, 0.0, 1.0);

}
`),
            t.compileShader(s),
            t.getShaderParameter(s, t.COMPILE_STATUS) || console.error(t.getShaderInfoLog(s)),
            console.log("max texture size is: " + t.getParameter(t.MAX_TEXTURE_SIZE)),
            o = t.createShader(t.FRAGMENT_SHADER),
            t.shaderSource(o, `#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vPosition;

out vec4 fragColor;

void main () {
    float A = -dot(vPosition, vPosition);
    if (A < -4.0) discard;
    float B = exp(A) * vColor.a;

    B = min(B, 1.);
    B = max(B, 0.);
    fragColor = vec4(B * vColor.rgb, B);
}
`),
            t.compileShader(o),
            t.getShaderParameter(o, t.COMPILE_STATUS) || console.error(t.getShaderInfoLog(o)),
            i = t.createProgram(),
            t.attachShader(i, s),
            t.attachShader(i, o),
            t.linkProgram(i),
            t.useProgram(i),
            t.getProgramParameter(i, t.LINK_STATUS) || console.error(t.getProgramInfoLog(i)),
            t.disable(t.DEPTH_TEST),
            t.enable(t.BLEND),
            t.blendFuncSeparate(t.ONE_MINUS_DST_ALPHA, t.ONE, t.ONE_MINUS_DST_ALPHA, t.ONE),
            t.blendEquationSeparate(t.FUNC_ADD, t.FUNC_ADD),
            U.update(l.width, l.height),
            V = t.getUniformLocation(i, "projection"),
            t.uniformMatrix4fv(V, false, U.projectionMatrix.buffer),
            h = t.getUniformLocation(i, "camPos"),
            t.uniform3fv(h, new Float32Array(U.position.flat())),
            r = t.getUniformLocation(i, "viewport"),
            t.uniform2fv(r, new Float32Array([l.width, l.height])),
            c = t.getUniformLocation(i, "focal"),
            t.uniform2fv(c, new Float32Array([U.fx, U.fy])),
            J = t.getUniformLocation(i, "view"),
            t.uniformMatrix4fv(J, false, U.viewMatrix.buffer);
            const N = new Float32Array([-2, -2, 2, -2, 2, 2, -2, 2]);
            w = t.createBuffer(),
            t.bindBuffer(t.ARRAY_BUFFER, w),
            t.bufferData(t.ARRAY_BUFFER, N, t.STATIC_DRAW),
            E = t.getAttribLocation(i, "position"),
            t.enableVertexAttribArray(E),
            t.vertexAttribPointer(E, 2, t.FLOAT, false, 0, 0);
            const v = t.createBuffer();
            t.bindBuffer(t.ARRAY_BUFFER, v),
            p = t.getAttribLocation(i, "index"),
            t.enableVertexAttribArray(p),
            t.vertexAttribIPointer(p, 1, t.INT, 0, 0),
            t.vertexAttribDivisor(p, 1);
            const P = t.createTexture();
            t.bindTexture(t.TEXTURE_2D, P),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST),
            t.texImage2D(t.TEXTURE_2D, 0, t.RGBA32UI, d.width, d.height, 0, t.RGBA_INTEGER, t.UNSIGNED_INT, d.data),
            d.shHeight && (this.setShTextures(),
            Q = t.getUniformLocation(i, "u_bandIndex"),
            t.uniform3iv(Q, new Int32Array([d.bandsIndices[0], d.bandsIndices[1], d.bandsIndices[2]]))),
            u = t.getUniformLocation(i, "u_texture"),
            t.uniform1i(u, 0),
            t.activeTexture(t.TEXTURE0),
            t.bindTexture(t.TEXTURE_2D, P);
            for (const A of a)
                A.init(this, i);
            F.onmessage = A=>{
                if (A.data.depthIndex) {
                    const {depthIndex: _} = A.data;
                    t.bindBuffer(t.ARRAY_BUFFER, v),
                    t.bufferData(t.ARRAY_BUFFER, _, t.STATIC_DRAW)
                }
            }
            ,
            j = true
        }
          , H = ()=>{
            j && this.dispose(),
            M()
        }
        ;
        this.render = (B,N)=>{
            if (N !== U && (G = true),
            (B !== d || G) && (U = N,
            B !== d && (j && this.dispose(),
            d && d.removeEventListener("change", H),
            d = B,
            d.addEventListener("change", H),
            M()),
            G && (G = false,
            this.setCameraBuffers())),
            U.update(l.width, l.height),
            F.postMessage({
                viewProj: U.viewProj
            }),
            d.vertexCount > 0) {
                for (const v of a)
                    v.render();
                t.uniformMatrix4fv(J, false, U.viewMatrix.buffer),
                t.viewport(0, 0, l.width, l.height),
                t.clearColor(0, 0, 0, 0),
                t.clear(t.COLOR_BUFFER_BIT),
                t.disable(t.DEPTH_TEST),
                t.enable(t.BLEND),
                t.blendFuncSeparate(t.ONE_MINUS_DST_ALPHA, t.ONE, t.ONE_MINUS_DST_ALPHA, t.ONE),
                t.blendEquationSeparate(t.FUNC_ADD, t.FUNC_ADD),
                t.drawArraysInstanced(t.TRIANGLE_FAN, 0, 4, d.vertexCount)
            } else
                t.clearColor(0, 0, 0, 0),
                t.clear(t.COLOR_BUFFER_BIT)
        }
        ,
        this.dispose = ()=>{
            j && (F.terminate(),
            t.deleteShader(s),
            t.deleteShader(o),
            t.deleteProgram(i),
            t.deleteBuffer(w),
            j = false)
        }
        ,
        this.setCameraBuffers = ()=>{
            U.update(l.width, l.height),
            t.uniformMatrix4fv(J, false, U.viewMatrix.buffer)
        }
        ,
        this.setShTextures = ()=>{
            const B = ["r", "g", "b"];
            R = t.getUniformLocation(i, "u_sh_r"),
            W = t.getUniformLocation(i, "u_sh_g"),
            T = t.getUniformLocation(i, "u_sh_b");
            let N = [];
            for (let v = 0; v < 3; v++) {
                const P = t.createTexture();
                t.bindTexture(t.TEXTURE_2D, P),
                t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
                t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE),
                t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST),
                t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST),
                t.texImage2D(t.TEXTURE_2D, 0, t.RGBA32UI, d.width, d.shHeight, 0, t.RGBA_INTEGER, t.UNSIGNED_INT, d.shs_rgb[v]);
                const A = `u_sh_${B[v]}`;
                N.push(P),
                t.getUniformLocation(i, A)
            }
            t.uniform1i(R, 1),
            t.uniform1i(W, 2),
            t.uniform1i(T, 3);
            for (let v = 0; v < 3; v++)
                t.activeTexture(t.TEXTURE0 + (v + 1)),
                t.bindTexture(t.TEXTURE_2D, N[v])
        }
        ,
        this.resize()
    }
}
class $t {
    constructor(e, n, l=.5, t=.5, a=5, d=true, U=new X) {
        this.minAngle = -90,
        this.maxAngle = 90,
        this.minZoom = .1,
        this.maxZoom = 30,
        this.orbitSpeed = 1,
        this.panSpeed = 1,
        this.zoomSpeed = 1,
        this.dampening = .12,
        this.setCameraTarget = ()=>{}
        ,
        this.attach = ()=>{}
        ,
        this.detach = ()=>{}
        ;
        let F = U.clone()
          , s = F.clone()
          , o = l
          , i = t
          , V = a
          , r = false
          , c = false
          , J = 0
          , u = 0
          , h = 0;
        const Q = {};
        let R = null
          , W = false
          , T = false;
        const E = ()=>{
            if (!R || W)
                return;
            const Z = R.rotation.toEuler();
            o = -Z.y,
            i = -Z.x;
            const k = R.position.x - V * Math.sin(o) * Math.cos(i)
              , C = R.position.y + V * Math.sin(i)
              , m = R.position.z + V * Math.cos(o) * Math.cos(i);
            s = new X(k,C,m)
        }
        ;
        this.setCamera = Z=>{
            this.attach(Z),
            T = true,
            r = false,
            c = false,
            J = 0,
            u = 0,
            h = 0
        }
        ,
        this.attach = Z=>{
            R && this.detach(),
            R = Z,
            R.addEventListener("change", E)
        }
        ,
        this.detach = ()=>{
            R && (R.removeEventListener("change", E),
            R = null)
        }
        ,
        this.attach(e),
        this.setCameraTarget = Z=>{
            if (!R)
                return;
            const k = Z.x - R.position.x
              , C = Z.y - R.position.y
              , m = Z.z - R.position.z;
            V = Math.sqrt(k * k + C * C + m * m),
            i = Math.atan2(C, Math.sqrt(k * k + m * m)),
            o = -Math.atan2(k, m),
            s = new X(Z.x,Z.y,Z.z)
        }
        ;
        const p = ()=>.1 + .9 * (V - this.minZoom) / (this.maxZoom - this.minZoom)
          , w = Z=>{
            T = false,
            Q[Z.code] = true,
            Z.code === "ArrowUp" && (Q.KeyW = true),
            Z.code === "ArrowDown" && (Q.KeyS = true),
            Z.code === "ArrowLeft" && (Q.KeyA = true),
            Z.code === "ArrowRight" && (Q.KeyD = true)
        }
          , G = Z=>{
            Q[Z.code] = false,
            Z.code === "ArrowUp" && (Q.KeyW = false),
            Z.code === "ArrowDown" && (Q.KeyS = false),
            Z.code === "ArrowLeft" && (Q.KeyA = false),
            Z.code === "ArrowRight" && (Q.KeyD = false)
        }
          , j = Z=>{
            _(Z),
            r = true,
            c = Z.button === 2,
            u = Z.clientX,
            h = Z.clientY,
            window.addEventListener("mouseup", M)
        }
          , M = Z=>{
            _(Z),
            r = false,
            c = false,
            window.removeEventListener("mouseup", M)
        }
          , H = Z=>{
            if (_(Z),
            !r || !R)
                return;
            const k = Z.clientX - u
              , C = Z.clientY - h;
            if (c) {
                const m = p()
                  , x = -k * this.panSpeed * .01 * m
                  , S = -C * this.panSpeed * .01 * m
                  , f = Y.RotationFromQuaternion(R.rotation).buffer
                  , K = new X(f[0],f[3],f[6])
                  , y = new X(f[1],f[4],f[7]);
                s = s.add(K.multiply(x)),
                s = s.add(y.multiply(S))
            } else
                o -= k * this.orbitSpeed * .003,
                i += C * this.orbitSpeed * .003,
                i = Math.min(Math.max(i, this.minAngle * Math.PI / 180), this.maxAngle * Math.PI / 180);
            u = Z.clientX,
            h = Z.clientY,
            k === 0 && C === 0 || (T = false)
        }
          , B = Z=>{
            _(Z);
            const k = p();
            V += Z.deltaY * this.zoomSpeed * .025 * k,
            V = Math.min(Math.max(V, this.minZoom), this.maxZoom)
        }
          , N = Z=>{
            if (_(Z),
            Z.touches.length === 1)
                r = true,
                c = false,
                u = Z.touches[0].clientX,
                h = Z.touches[0].clientY,
                J = 0;
            else if (Z.touches.length === 2) {
                r = true,
                c = true,
                u = (Z.touches[0].clientX + Z.touches[1].clientX) / 2,
                h = (Z.touches[0].clientY + Z.touches[1].clientY) / 2;
                const k = Z.touches[0].clientX - Z.touches[1].clientX
                  , C = Z.touches[0].clientY - Z.touches[1].clientY;
                J = Math.sqrt(k * k + C * C)
            }
        }
          , v = Z=>{
            _(Z),
            r = false,
            c = false
        }
          , P = Z=>{
            if (_(Z),
            r && R)
                if (c) {
                    const k = p()
                      , C = Z.touches[0].clientX - Z.touches[1].clientX
                      , m = Z.touches[0].clientY - Z.touches[1].clientY
                      , x = Math.sqrt(C * C + m * m);
                    V += (J - x) * this.zoomSpeed * .1 * k,
                    V = Math.min(Math.max(V, this.minZoom), this.maxZoom),
                    J = x;
                    const S = (Z.touches[0].clientX + Z.touches[1].clientX) / 2
                      , f = (Z.touches[0].clientY + Z.touches[1].clientY) / 2
                      , K = S - u
                      , y = f - h
                      , L = Y.RotationFromQuaternion(R.rotation).buffer
                      , tt = new X(L[0],L[3],L[6])
                      , lt = new X(L[1],L[4],L[7]);
                    s = s.add(tt.multiply(-K * this.panSpeed * .025 * k)),
                    s = s.add(lt.multiply(-y * this.panSpeed * .025 * k)),
                    u = S,
                    h = f
                } else {
                    const k = Z.touches[0].clientX - u
                      , C = Z.touches[0].clientY - h;
                    o -= k * this.orbitSpeed * .003,
                    i += C * this.orbitSpeed * .003,
                    i = Math.min(Math.max(i, this.minAngle * Math.PI / 180), this.maxAngle * Math.PI / 180),
                    u = Z.touches[0].clientX,
                    h = Z.touches[0].clientY
                }
        }
          , A = (Z,k,C)=>(1 - C) * Z + C * k;
        this.update = ()=>{
            if (!R || T)
                return;
            W = true,
            l = A(l, o, this.dampening),
            t = A(t, i, this.dampening),
            a = A(a, V, this.dampening),
            F = F.lerp(s, this.dampening);
            const Z = F.x + a * Math.sin(l) * Math.cos(t)
              , k = F.y - a * Math.sin(t)
              , C = F.z - a * Math.cos(l) * Math.cos(t);
            R.position = new X(Z,k,C);
            const m = F.subtract(R.position).normalize()
              , x = Math.asin(-m.y)
              , S = Math.atan2(m.x, m.z);
            R.rotation = I.FromEuler(new X(x,S,0));
            const f = .025
              , K = .01
              , y = Y.RotationFromQuaternion(R.rotation).buffer
              , L = new X(-y[2],-y[5],-y[8])
              , tt = new X(y[0],y[3],y[6]);
            Q.KeyS && (s = s.add(L.multiply(f))),
            Q.KeyW && (s = s.subtract(L.multiply(f))),
            Q.KeyA && (s = s.subtract(tt.multiply(f))),
            Q.KeyD && (s = s.add(tt.multiply(f))),
            Q.KeyE && (o += K),
            Q.KeyQ && (o -= K),
            Q.KeyR && (i += K),
            Q.KeyF && (i -= K),
            W = false
        }
        ;
        const _ = Z=>{
            Z.preventDefault(),
            Z.stopPropagation()
        }
        ;
        this.dispose = ()=>{
            n.removeEventListener("dragenter", _),
            n.removeEventListener("dragover", _),
            n.removeEventListener("dragleave", _),
            n.removeEventListener("contextmenu", _),
            n.removeEventListener("mousedown", j),
            n.removeEventListener("mousemove", H),
            n.removeEventListener("wheel", B),
            n.removeEventListener("touchstart", N),
            n.removeEventListener("touchend", v),
            n.removeEventListener("touchmove", P),
            d && (window.removeEventListener("keydown", w),
            window.removeEventListener("keyup", G))
        }
        ,
        d && (window.addEventListener("keydown", w),
        window.addEventListener("keyup", G)),
        n.addEventListener("dragenter", _),
        n.addEventListener("dragover", _),
        n.addEventListener("dragleave", _),
        n.addEventListener("contextmenu", _),
        n.addEventListener("mousedown", j),
        n.addEventListener("mousemove", H),
        n.addEventListener("wheel", B),
        n.addEventListener("touchstart", N),
        n.addEventListener("touchend", v),
        n.addEventListener("touchmove", P),
        this.update()
    }
}
const rt = new g
  , Ct = new qt;
let wt = new Zt;
const te = new $t(wt,Ct.domElement)
  , Qt = document.getElementsByClassName("icon_wrap")[0]
  , et = document.querySelector("i")
  , at = document.querySelector(".panel");
let mt = document.getElementById("progress_bar")
  , O = document.getElementById("loading_bar")
  , ee = document.getElementById("loading_desc")
  , gt = document.getElementById("info_tab")
  , yt = document.querySelector("canvas");
const ot = document.createElement("img");
ot.src = "https://repo-sam.inria.fr/fungraph/reduced_3dgs/icons/spinner.png";
ot.classList.add("spinner");
ot.classList.add("rotate-icon");
let Rt = "Loading", bt = 0, Jt = false, pt = false, vt, Tt;
const ne = ["bicycle", "bonsai", "counter", "kitchen", "truck"];
function le() {
    ee.textContent = `${Rt} ${bt.toFixed(2)}`,
    Rt == "Parsing" && !Jt ? (O == null || O.removeChild(mt),
    O == null || O.appendChild(ot),
    Jt = true) : mt.value = 100 * bt
}
function zt() {
    at == null || at.classList.toggle("slide"),
    et == null || et.classList.toggle("fa-greater-than"),
    et == null || et.classList.toggle("fa-less-than"),
    Qt == null || Qt.classList.toggle("slide")
}
function se() {
    const b = document.createElement("div");
    b.id = "card_wrapper";
    for (const e of ne) {
        const n = e + ".png"
          , l = "quantized_" + e
          , t = "baseline_" + e;
        {
            const a = document.createElement("div");
            a.classList.add("image");
            const d = document.createElement("img");
            d.src = `https://repo-sam.inria.fr/fungraph/reduced_3dgs/icons/${n}`,
            a.appendChild(d);
            const U = document.createElement("div");
            U.classList.add("scene_card"),
            U.id = `${l}`;
            const F = document.createElement("div");
            F.classList.add("minia_wrap");
            const s = document.createElement("label");
            s.classList.add("desc"),
            s.textContent = `${e} light`,
            F.appendChild(a),
            F.appendChild(s),
            U.appendChild(F),
            b.appendChild(U)
        }
        {
            const a = document.createElement("div");
            a.classList.add("image");
            const d = document.createElement("img");
            d.src = `https://repo-sam.inria.fr/fungraph/reduced_3dgs/icons/${n}`,
            a.appendChild(d);
            const U = document.createElement("div");
            U.classList.add("scene_card"),
            U.id = `${t}`;
            const F = document.createElement("div");
            F.classList.add("minia_wrap");
            const s = document.createElement("label");
            s.classList.add("desc"),
            s.textContent = `${e} heavy`,
            F.appendChild(a),
            F.appendChild(s),
            U.appendChild(F),
            b.appendChild(U)
        }
    }
    at == null || at.insertBefore(b, Qt)
}
function Fe() {
    document.querySelectorAll(".scene_card").forEach(e=>{
        e.addEventListener("click", ()=>{
            zt();
            const n = e.offsetTop;
            window.scroll(n, 0);
            const l = e.id.split("_")[1];
            console.log("look for folder " + l);
            let t;
            e.id.split("_")[0] === "quantized" ? (t = `https://repo-sam.inria.fr/fungraph/reduced_3dgs/scenes/${l}/quantized_${l}.ply`,
            console.log("URL quantized: " + t),
            It(t).then(ft)) : (t = `https://repo-sam.inria.fr/fungraph/reduced_3dgs/scenes/${l}/baseline_${l}.ply`,
            console.log("URL baseline: " + t),
            It(t, false).then(ft))
        }
        )
    }
    )
}
const Ht = true;
let dt = false;
async function Ue(b) {
    if (dt)
        return;
    dt = true,
    O.style.opacity = "1",
    yt.style.opacity = "0.1";
    const e = "";
    await nt.LoadFromFileAsync(b, rt, ut, e, Ht, false).then(ft)
}
document.addEventListener("drop", b=>{
    b.preventDefault(),
    b.stopPropagation(),
    b.dataTransfer != null && Ue(b.dataTransfer.files[0])
}
);
function ut(b, e=false) {
    bt = b,
    e && (Rt = "Parsing")
}
function ft() {
    O.style.opacity = "0",
    yt.style.opacity = "1",
    Rt = "Loading",
    dt = false,
    Jt = false,
    O == null || O.appendChild(mt),
    O == null || O.removeChild(ot)
}
async function It(b, e=true) {
    if (O.style.opacity = "1",
    yt.style.opacity = "0.1",
    !dt) {
        if (dt = true,
        b.endsWith(".ply"))
            return console.log(".ply file loaded from url"),
            await nt.LoadAsync(b, rt, ut, void 0, Ht, e);
        if (b.endsWith(".splat"))
            return console.log(".splat file loaded from url"),
            await Ot.LoadAsync(b, rt, ut);
        console.log("input file is neither has .ply or .splat extension.")
    }
}
function ae(b) {
    const e = 16.666666666666668
      , n = e - b.timeRemaining();
    vt = e * 60 / n,
    pt = true
}
async function de() {
    et == null || et.addEventListener("click", ()=>{
        zt()
    }
    ),
    se(),
    Fe();
    let b = 0
      , e = 0;
    const n = l=>{
        if (te.update(),
        performance.now(),
        Ct.render(rt, wt),
        performance.now(),
        dt && le(),
        e % 100 == 0) {
            l *= .001;
            const t = l - b;
            b = l,
            Tt = e / t,
            e = 0
        }
        pt && e % 100 == 0 ? gt.textContent = `fps: ${vt.toFixed(1)}` : gt.textContent = `fps: ${Tt.toFixed(1)}`,
        pt = false,
        requestIdleCallback(ae),
        requestAnimationFrame(n),
        e++
    }
    ;
    requestAnimationFrame(n)
}
de();
