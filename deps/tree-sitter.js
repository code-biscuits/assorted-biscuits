var Module = void 0 !== Module ? Module : {};
!(function (e, t) {
  "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (module.exports = t())
    : (window.TreeSitter = t());
})(0, function () {
  var e,
    t = {};
  for (e in Module) Module.hasOwnProperty(e) && (t[e] = Module[e]);
  var r,
    n,
    s = [],
    o = function (e, t) {
      throw t;
    },
    _ = !1,
    a = !1;
  (_ = "object" == typeof window),
    (a = "function" == typeof importScripts),
    (r =
      "object" == typeof process &&
      "object" == typeof process.versions &&
      "string" == typeof process.versions.node),
    (n = !_ && !r && !a);
  var i,
    u,
    l,
    d,
    c = "";
  r
    ? ((c = a ? require("path").dirname(c) + "/" : __dirname + "/"),
      (i = function (e, t) {
        return (
          l || (l = require("fs")),
          d || (d = require("path")),
          (e = d.normalize(e)),
          l.readFileSync(e, t ? null : "utf8")
        );
      }),
      (u = function (e) {
        var t = i(e, !0);
        return t.buffer || (t = new Uint8Array(t)), L(t.buffer), t;
      }),
      process.argv.length > 1 && process.argv[1].replace(/\\/g, "/"),
      (s = process.argv.slice(2)),
      "undefined" != typeof module && (module.exports = Module),
      process.on("uncaughtException", function (e) {
        if (!(e instanceof Ue)) throw e;
      }),
      process.on("unhandledRejection", fe),
      (o = function (e) {
        process.exit(e);
      }),
      (Module.inspect = function () {
        return "[Emscripten Module object]";
      }))
    : n
    ? ("undefined" != typeof read &&
        (i = function (e) {
          return read(e);
        }),
      (u = function (e) {
        var t;
        return "function" == typeof readbuffer
          ? new Uint8Array(readbuffer(e))
          : (L("object" == typeof (t = read(e, "binary"))), t);
      }),
      "undefined" != typeof scriptArgs
        ? (s = scriptArgs)
        : void 0 !== arguments && (s = arguments),
      "function" == typeof quit &&
        (o = function (e) {
          quit(e);
        }),
      "undefined" != typeof print &&
        ("undefined" == typeof console && (console = {}),
        (console.log = print),
        (console.warn = console.error =
          "undefined" != typeof printErr ? printErr : print)))
    : (_ || a) &&
      (a
        ? (c = self.location.href)
        : document.currentScript && (c = document.currentScript.src),
      (c = 0 !== c.indexOf("blob:") ? c.substr(0, c.lastIndexOf("/") + 1) : ""),
      (i = function (e) {
        var t = new XMLHttpRequest();
        return t.open("GET", e, !1), t.send(null), t.responseText;
      }),
      a &&
        (u = function (e) {
          var t = new XMLHttpRequest();
          return (
            t.open("GET", e, !1),
            (t.responseType = "arraybuffer"),
            t.send(null),
            new Uint8Array(t.response)
          );
        }),
      function (e, t, r) {
        var n = new XMLHttpRequest();
        n.open("GET", e, !0),
          (n.responseType = "arraybuffer"),
          (n.onload = function () {
            200 == n.status || (0 == n.status && n.response)
              ? t(n.response)
              : r();
          }),
          (n.onerror = r),
          n.send(null);
      });
  Module.print || console.log.bind(console);
  var m = Module.printErr || console.warn.bind(console);
  for (e in t) t.hasOwnProperty(e) && (Module[e] = t[e]);
  (t = null),
    Module.arguments && (s = Module.arguments),
    Module.thisProgram && Module.thisProgram,
    Module.quit && (o = Module.quit);
  var f = 16;
  function p(e) {
    var t = z[Q >> 2],
      r = (t + e + 15) & -16;
    return (z[Q >> 2] = r), t;
  }
  function h(e, t) {
    return t || (t = f), Math.ceil(e / t) * t;
  }
  function M(e) {
    switch (e) {
      case "i1":
      case "i8":
        return 1;
      case "i16":
        return 2;
      case "i32":
        return 4;
      case "i64":
        return 8;
      case "float":
        return 4;
      case "double":
        return 8;
      default:
        if ("*" === e[e.length - 1]) return 4;
        if ("i" === e[0]) {
          var t = Number(e.substr(1));
          return (
            L(
              t % 8 == 0,
              "getNativeTypeSize invalid bits " + t + ", type " + e
            ),
            t / 8
          );
        }
        return 0;
    }
  }
  var g = {
    nextHandle: 1,
    loadedLibs: {
      "-1": { refcount: 1 / 0, name: "__self__", module: Module, global: !0 },
    },
    loadedLibNames: { __self__: -1 },
  };
  function w(e) {
    return 0 == e.indexOf("dynCall_") ||
      -1 !=
        [
          "setTempRet0",
          "getTempRet0",
          "stackAlloc",
          "stackSave",
          "stackRestore",
          "__growWasmMemory",
          "__heap_base",
          "__data_end",
        ].indexOf(e)
      ? e
      : "_" + e;
  }
  function y(e, t) {
    t = t || { global: !0, nodelete: !0 };
    var r,
      n = g.loadedLibNames[e];
    if (n)
      return (
        (r = g.loadedLibs[n]),
        t.global &&
          !r.global &&
          ((r.global = !0), "loading" !== r.module && a(r.module)),
        t.nodelete && r.refcount !== 1 / 0 && (r.refcount = 1 / 0),
        r.refcount++,
        t.loadAsync ? Promise.resolve(n) : n
      );
    function s(e) {
      if (t.fs) {
        var r = t.fs.readFile(e, { encoding: "binary" });
        return (
          r instanceof Uint8Array || (r = new Uint8Array(lib_data)),
          t.loadAsync ? Promise.resolve(r) : r
        );
      }
      return t.loadAsync
        ? ((n = e),
          fetch(n, { credentials: "same-origin" })
            .then(function (e) {
              if (!e.ok) throw "failed to load binary file at '" + n + "'";
              return e.arrayBuffer();
            })
            .then(function (e) {
              return new Uint8Array(e);
            }))
        : u(e);
      var n;
    }
    function o(e) {
      return E(e, t);
    }
    function _() {
      if (
        void 0 !== Module.preloadedWasm &&
        void 0 !== Module.preloadedWasm[e]
      ) {
        var r = Module.preloadedWasm[e];
        return t.loadAsync ? Promise.resolve(r) : r;
      }
      return t.loadAsync
        ? s(e).then(function (e) {
            return o(e);
          })
        : o(s(e));
    }
    function a(e) {
      for (var t in e)
        if (e.hasOwnProperty(t)) {
          var r = w(t);
          Module.hasOwnProperty(r) || (Module[r] = e[t]);
        }
    }
    function i(e) {
      r.global && a(e), (r.module = e);
    }
    return (
      (n = g.nextHandle++),
      (r = {
        refcount: t.nodelete ? 1 / 0 : 1,
        name: e,
        module: "loading",
        global: t.global,
      }),
      (g.loadedLibNames[e] = n),
      (g.loadedLibs[n] = r),
      t.loadAsync
        ? _().then(function (e) {
            return i(e), n;
          })
        : (i(_()), n)
    );
  }
  function b(e, t, r, n) {
    var s = {};
    for (var o in e) {
      var _ = e[o];
      "object" == typeof _ && (_ = _.value),
        "number" == typeof _ && (_ += t),
        (s[o] = _),
        n && (n["_" + o] = _);
    }
    return s;
  }
  function E(e, t) {
    L(
      1836278016 ==
        new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer)[0],
      "need to see wasm magic number"
    ),
      L(0 === e[8], "need the dylink section to be first");
    var r = 9;
    function n() {
      for (var t = 0, n = 1; ; ) {
        var s = e[r++];
        if (((t += (127 & s) * n), (n *= 128), !(128 & s))) break;
      }
      return t;
    }
    n();
    L(6 === e[r]),
      L(e[++r] === "d".charCodeAt(0)),
      L(e[++r] === "y".charCodeAt(0)),
      L(e[++r] === "l".charCodeAt(0)),
      L(e[++r] === "i".charCodeAt(0)),
      L(e[++r] === "n".charCodeAt(0)),
      L(e[++r] === "k".charCodeAt(0)),
      r++;
    for (
      var s = n(), o = n(), _ = n(), a = n(), i = n(), u = [], l = 0;
      l < i;
      ++l
    ) {
      var d = n(),
        c = e.subarray(r, r + d);
      r += d;
      var m = O(c, 0);
      u.push(m);
    }
    function p() {
      (o = Math.pow(2, o)), (a = Math.pow(2, a)), (o = Math.max(o, f));
      var r = h(Z(s + o), o),
        n = Re,
        i = T,
        u = i.length,
        l = i;
      i.grow(_), L(i === l);
      for (var d = r; d < r + s; d++) D[d] = 0;
      for (d = u; d < u + _; d++) i.set(d, null);
      var c = {},
        m = function (e, t, r) {
          r && (e = "orig$" + e);
          var n,
            s = Module.asm[e];
          if (!s) {
            var o = w(e);
            (s = Module[o]) || (s = c[o]),
              !s &&
                e.startsWith("invoke_") &&
                ((n = e.split("_")[1]),
                (s = function () {
                  var e = Le();
                  try {
                    return Module["dynCall_" + n].apply(null, arguments);
                  } catch (t) {
                    if ((We(e), t !== t + 0 && "longjmp" !== t)) throw t;
                    _setThrew(1, 0);
                  }
                }));
          }
          return s;
        };
      for (var p in Module) p in n || (n[p] = Module[p]);
      var M = new Proxy(n, {
          get: function (e, t) {
            switch (t) {
              case "__memory_base":
              case "gb":
                return r;
              case "__table_base":
              case "fb":
                return u;
            }
            if (t in e) return e[t];
            if (t.startsWith("g$")) {
              var n = t.substr(2);
              return (e[t] = function () {
                return m(n);
              });
            }
            if (t.startsWith("fp$")) {
              var s = t.split("$");
              L(3 == s.length);
              n = s[1];
              var o = s[2],
                _ = o.indexOf("j") >= 0,
                a = 0;
              return (e[t] = function () {
                if (!a) {
                  var e = m(n, 0, _);
                  a = N(e, o);
                }
                return a;
              });
            }
            return (e[t] = function () {
              return m(t).apply(null, arguments);
            });
          },
        }),
        g = {
          global: { NaN: NaN, Infinity: 1 / 0 },
          "global.Math": Math,
          env: M,
          wasi_snapshot_preview1: M,
        };
      function y(e, t) {
        var n = b(e.exports, r, 0, t),
          s = n.__post_instantiate;
        return s && (ne ? s() : ee.push(s)), n;
      }
      return t.loadAsync
        ? WebAssembly.instantiate(e, g).then(function (e) {
            return y(e.instance, c);
          })
        : y(new WebAssembly.Instance(new WebAssembly.Module(e), g), c);
    }
    return t.loadAsync
      ? Promise.all(
          u.map(function (e) {
            return y(e, t);
          })
        ).then(function () {
          return p();
        })
      : (u.forEach(function (e) {
          y(e, t);
        }),
        p());
  }
  Module.loadWebAssemblyModule = E;
  var v,
    I = [];
  function S(e, t) {
    var r,
      n = T;
    if (!v) {
      v = new WeakMap();
      for (var s = 0; s < n.length; s++) {
        var o = n.get(s);
        o && v.set(o, s);
      }
    }
    if (v.has(e)) return v.get(e);
    if (I.length) r = I.pop();
    else {
      r = n.length;
      try {
        n.grow(1);
      } catch (e) {
        if (!(e instanceof RangeError)) throw e;
        throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
      }
    }
    try {
      n.set(r, e);
    } catch (s) {
      if (!(s instanceof TypeError)) throw s;
      var _ = (function (e, t) {
        if ("function" == typeof WebAssembly.Function) {
          for (
            var r = { i: "i32", j: "i64", f: "f32", d: "f64" },
              n = { parameters: [], results: "v" == t[0] ? [] : [r[t[0]]] },
              s = 1;
            s < t.length;
            ++s
          )
            n.parameters.push(r[t[s]]);
          return new WebAssembly.Function(n, e);
        }
        var o = [1, 0, 1, 96],
          _ = t.slice(0, 1),
          a = t.slice(1),
          i = { i: 127, j: 126, f: 125, d: 124 };
        for (o.push(a.length), s = 0; s < a.length; ++s) o.push(i[a[s]]);
        "v" == _ ? o.push(0) : (o = o.concat([1, i[_]])), (o[1] = o.length - 2);
        var u = new Uint8Array(
            [0, 97, 115, 109, 1, 0, 0, 0].concat(o, [
              2,
              7,
              1,
              1,
              101,
              1,
              102,
              0,
              0,
              7,
              5,
              1,
              1,
              102,
              0,
              0,
            ])
          ),
          l = new WebAssembly.Module(u);
        return new WebAssembly.Instance(l, { e: { f: e } }).exports.f;
      })(e, t);
      n.set(r, _);
    }
    return v.set(e, r), r;
  }
  function N(e, t) {
    return S(e, t);
  }
  var x,
    A,
    C,
    k = function (e) {
      e;
    },
    P = 1024;
  function R(e, t, r, n) {
    switch (("*" === (r = r || "i8").charAt(r.length - 1) && (r = "i32"), r)) {
      case "i1":
      case "i8":
        D[e >> 0] = t;
        break;
      case "i16":
        H[e >> 1] = t;
        break;
      case "i32":
        z[e >> 2] = t;
        break;
      case "i64":
        (Ee = [
          t >>> 0,
          ((be = t),
          +oe(be) >= 1
            ? be > 0
              ? (0 | ie(+ae(be / 4294967296), 4294967295)) >>> 0
              : ~~+_e((be - +(~~be >>> 0)) / 4294967296) >>> 0
            : 0),
        ]),
          (z[e >> 2] = Ee[0]),
          (z[(e + 4) >> 2] = Ee[1]);
        break;
      case "float":
        K[e >> 2] = t;
        break;
      case "double":
        G[e >> 3] = t;
        break;
      default:
        fe("invalid type for setValue: " + r);
    }
  }
  function q(e, t, r) {
    switch (("*" === (t = t || "i8").charAt(t.length - 1) && (t = "i32"), t)) {
      case "i1":
      case "i8":
        return D[e >> 0];
      case "i16":
        return H[e >> 1];
      case "i32":
      case "i64":
        return z[e >> 2];
      case "float":
        return K[e >> 2];
      case "double":
        return G[e >> 3];
      default:
        fe("invalid type for getValue: " + t);
    }
    return null;
  }
  (P = h(P, 1)),
    Module.wasmBinary && (x = Module.wasmBinary),
    Module.noExitRuntime && (A = Module.noExitRuntime),
    "object" != typeof WebAssembly && fe("no native wasm support detected");
  var T = new WebAssembly.Table({ initial: 12, element: "anyfunc" }),
    $ = !1;
  function L(e, t) {
    e || fe("Assertion failed: " + t);
  }
  var W = 3;
  function Z(e) {
    return ne ? Te(e) : p(e);
  }
  var F = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
  function O(e, t, r) {
    for (var n = t + r, s = t; e[s] && !(s >= n); ) ++s;
    if (s - t > 16 && e.subarray && F) return F.decode(e.subarray(t, s));
    for (var o = ""; t < s; ) {
      var _ = e[t++];
      if (128 & _) {
        var a = 63 & e[t++];
        if (192 != (224 & _)) {
          var i = 63 & e[t++];
          if (
            (_ =
              224 == (240 & _)
                ? ((15 & _) << 12) | (a << 6) | i
                : ((7 & _) << 18) | (a << 12) | (i << 6) | (63 & e[t++])) <
            65536
          )
            o += String.fromCharCode(_);
          else {
            var u = _ - 65536;
            o += String.fromCharCode(55296 | (u >> 10), 56320 | (1023 & u));
          }
        } else o += String.fromCharCode(((31 & _) << 6) | a);
      } else o += String.fromCharCode(_);
    }
    return o;
  }
  function j(e, t) {
    return e ? O(B, e, t) : "";
  }
  var U, D, B, H, z, K, G;
  function X(e) {
    (U = e),
      (Module.HEAP8 = D = new Int8Array(e)),
      (Module.HEAP16 = H = new Int16Array(e)),
      (Module.HEAP32 = z = new Int32Array(e)),
      (Module.HEAPU8 = B = new Uint8Array(e)),
      (Module.HEAPU16 = new Uint16Array(e)),
      (Module.HEAPU32 = new Uint32Array(e)),
      (Module.HEAPF32 = K = new Float32Array(e)),
      (Module.HEAPF64 = G = new Float64Array(e));
  }
  var Q = 8016,
    V = Module.INITIAL_MEMORY || 33554432;
  function Y(e) {
    for (; e.length > 0; ) {
      var t = e.shift();
      if ("function" != typeof t) {
        var r = t.func;
        "number" == typeof r
          ? void 0 === t.arg
            ? Module.dynCall_v(r)
            : Module.dynCall_vi(r, t.arg)
          : r(void 0 === t.arg ? null : t.arg);
      } else t(Module);
    }
  }
  (C = Module.wasmMemory
    ? Module.wasmMemory
    : new WebAssembly.Memory({ initial: V / 65536, maximum: 32768 })) &&
    (U = C.buffer),
    (V = U.byteLength),
    X(U),
    (z[Q >> 2] = 5251056);
  var J = [],
    ee = [],
    te = [],
    re = [],
    ne = !1;
  function se(e) {
    J.unshift(e);
  }
  var oe = Math.abs,
    _e = Math.ceil,
    ae = Math.floor,
    ie = Math.min,
    ue = 0,
    le = null,
    de = null;
  function ce(e) {
    ue++, Module.monitorRunDependencies && Module.monitorRunDependencies(ue);
  }
  function me(e) {
    if (
      (ue--,
      Module.monitorRunDependencies && Module.monitorRunDependencies(ue),
      0 == ue && (null !== le && (clearInterval(le), (le = null)), de))
    ) {
      var t = de;
      (de = null), t();
    }
  }
  function fe(e) {
    // throw (
    //   (Module.onAbort && Module.onAbort(e),
    //   m((e += "")),
    //   ($ = !0),
    //   1,
    //   (e = "abort(" + e + "). Build with -s ASSERTIONS=1 for more info."),
    //   new WebAssembly.RuntimeError(e))
    // );
  }
  function pe(e, t) {
    return String.prototype.startsWith ? e.startsWith(t) : 0 === e.indexOf(t);
  }
  (Module.preloadedImages = {}),
    (Module.preloadedAudios = {}),
    (Module.preloadedWasm = {}),
    se(function () {
      if (Module.dynamicLibraries && Module.dynamicLibraries.length > 0 && !u)
        return (
          ce(),
          void Promise.all(
            Module.dynamicLibraries.map(function (e) {
              return y(e, { loadAsync: !0, global: !0, nodelete: !0 });
            })
          ).then(function () {
            me();
          })
        );
      var e;
      (e = Module.dynamicLibraries) &&
        e.forEach(function (e) {
          y(e, { global: !0, nodelete: !0 });
        });
    });
  var he = "data:application/octet-stream;base64,";
  function Me(e) {
    return pe(e, he);
  }
  var ge = "file://";
  function we(e) {
    return pe(e, ge);
  }
  var ye,
    be,
    Ee,
    ve,
    Ie = "tree-sitter.wasm";
  function Se() {
    try {
      if (x) return new Uint8Array(x);
      if (u) return u(Ie);
      throw "both async and sync fetching of the wasm failed";
    } catch (e) {
      fe(e);
    }
  }
  function Ne() {
    fe();
  }
  Me(Ie) ||
    ((ye = Ie), (Ie = Module.locateFile ? Module.locateFile(ye, c) : c + ye)),
    ee.push(
      {
        func: function () {
          Fe();
        },
      },
      {
        func: function () {
          qe();
        },
      }
    ),
    (Module._abort = Ne),
    (ve = r
      ? function () {
          var e = process.hrtime();
          return 1e3 * e[0] + e[1] / 1e6;
        }
      : "undefined" != typeof dateNow
      ? dateNow
      : function () {
          return performance.now();
        });
  var xe = !0;
  function Ae(e) {
    try {
      return C.grow((e - U.byteLength + 65535) >>> 16), X(C.buffer), 1;
    } catch (e) {}
  }
  function Ce(e, t, r) {
    if (at) {
      const e = j(r);
      at(e, 0 !== t);
    }
  }
  var ke,
    Pe = P,
    Re = {
      __memory_base: 1024,
      __stack_pointer: 5251056,
      __table_base: 1,
      abort: Ne,
      clock_gettime: function (e, t) {
        var r, n;
        if (0 === e) r = Date.now();
        else {
          if ((1 !== e && 4 !== e) || !xe)
            return (n = 28), (z[$e() >> 2] = n), -1;
          r = ve();
        }
        return (
          (z[t >> 2] = (r / 1e3) | 0),
          (z[(t + 4) >> 2] = ((r % 1e3) * 1e3 * 1e3) | 0),
          0
        );
      },
      emscripten_memcpy_big: function (e, t, r) {
        B.copyWithin(e, t, t + r);
      },
      emscripten_resize_heap: function (e) {
        e >>>= 0;
        var t = B.length;
        if (e > 2147483648) return !1;
        for (var r, n, s = 1; s <= 4; s *= 2) {
          var o = t * (1 + 0.2 / s);
          if (
            ((o = Math.min(o, e + 100663296)),
            Ae(
              Math.min(
                2147483648,
                ((r = Math.max(16777216, e, o)) % (n = 65536) > 0 &&
                  (r += n - (r % n)),
                r)
              )
            ))
          )
            return !0;
        }
        return !1;
      },
      exit: function (e) {
        Be(e);
      },
      fp$tree_sitter_log_callback$viii: function () {
        return Module._fp$tree_sitter_log_callback$viii.apply(null, arguments);
      },
      memory: C,
      setTempRet0: function (e) {
        k(0 | e);
      },
      table: T,
      tree_sitter_parse_callback: function (e, t, r, n, s) {
        var o = _t(t, { row: r, column: n });
        "string" == typeof o
          ? (R(s, o.length, "i32"),
            (function (e, t, r) {
              if ((void 0 === r && (r = 2147483647), r < 2)) return 0;
              for (
                var n = (r -= 2) < 2 * e.length ? r / 2 : e.length, s = 0;
                s < n;
                ++s
              ) {
                var o = e.charCodeAt(s);
                (H[t >> 1] = o), (t += 2);
              }
              H[t >> 1] = 0;
            })(o, e, 10240))
          : R(s, 0, "i32");
      },
    },
    qe =
      ((function () {
        var e = { env: Re, wasi_snapshot_preview1: Re };
        function t(e, t) {
          var r = e.exports;
          (r = b(r, P)), (Module.asm = r), me();
        }
        function r(e) {
          t(e.instance);
        }
        function n(t) {
          return (x || (!_ && !a) || "function" != typeof fetch || we(Ie)
            ? new Promise(function (e, t) {
                e(Se());
              })
            : fetch(Ie, { credentials: "same-origin" })
                .then(function (e) {
                  if (!e.ok)
                    throw "failed to load wasm binary file at '" + Ie + "'";
                  return e.arrayBuffer();
                })
                .catch(function () {
                  return Se();
                })
          )
            .then(function (t) {
              return WebAssembly.instantiate(t, e);
            })
            .then(t, function (e) {
              m("failed to asynchronously prepare wasm: " + e), fe(e);
            });
        }
        if ((ce(), Module.instantiateWasm))
          try {
            return Module.instantiateWasm(e, t);
          } catch (e) {
            return (
              m("Module.instantiateWasm callback failed with error: " + e), !1
            );
          }
        (function () {
          if (
            x ||
            "function" != typeof WebAssembly.instantiateStreaming ||
            Me(Ie) ||
            we(Ie) ||
            "function" != typeof fetch
          )
            return n(r);
          fetch(Ie, { credentials: "same-origin" }).then(function (t) {
            return WebAssembly.instantiateStreaming(t, e).then(r, function (e) {
              return (
                m("wasm streaming compile failed: " + e),
                m("falling back to ArrayBuffer instantiation"),
                n(r)
              );
            });
          });
        })();
      })(),
      (Module.___wasm_call_ctors = function () {
        return (qe = Module.___wasm_call_ctors =
          Module.asm.__wasm_call_ctors).apply(null, arguments);
      })),
    Te =
      ((Module._calloc = function () {
        return (Module._calloc = Module.asm.calloc).apply(null, arguments);
      }),
      (Module._ts_language_symbol_count = function () {
        return (Module._ts_language_symbol_count =
          Module.asm.ts_language_symbol_count).apply(null, arguments);
      }),
      (Module._ts_language_version = function () {
        return (Module._ts_language_version =
          Module.asm.ts_language_version).apply(null, arguments);
      }),
      (Module._ts_language_field_count = function () {
        return (Module._ts_language_field_count =
          Module.asm.ts_language_field_count).apply(null, arguments);
      }),
      (Module._ts_language_symbol_name = function () {
        return (Module._ts_language_symbol_name =
          Module.asm.ts_language_symbol_name).apply(null, arguments);
      }),
      (Module._ts_language_symbol_type = function () {
        return (Module._ts_language_symbol_type =
          Module.asm.ts_language_symbol_type).apply(null, arguments);
      }),
      (Module._ts_language_field_name_for_id = function () {
        return (Module._ts_language_field_name_for_id =
          Module.asm.ts_language_field_name_for_id).apply(null, arguments);
      }),
      (Module._memcpy = function () {
        return (Module._memcpy = Module.asm.memcpy).apply(null, arguments);
      }),
      (Module._free = function () {
        return (Module._free = Module.asm.free).apply(null, arguments);
      }),
      (Module._malloc = function () {
        return (Te = Module._malloc = Module.asm.malloc).apply(null, arguments);
      })),
    $e =
      ((Module._ts_parser_delete = function () {
        return (Module._ts_parser_delete = Module.asm.ts_parser_delete).apply(
          null,
          arguments
        );
      }),
      (Module._ts_parser_set_language = function () {
        return (Module._ts_parser_set_language =
          Module.asm.ts_parser_set_language).apply(null, arguments);
      }),
      (Module._ts_parser_timeout_micros = function () {
        return (Module._ts_parser_timeout_micros =
          Module.asm.ts_parser_timeout_micros).apply(null, arguments);
      }),
      (Module._ts_parser_set_timeout_micros = function () {
        return (Module._ts_parser_set_timeout_micros =
          Module.asm.ts_parser_set_timeout_micros).apply(null, arguments);
      }),
      (Module._memcmp = function () {
        return (Module._memcmp = Module.asm.memcmp).apply(null, arguments);
      }),
      (Module._ts_query_new = function () {
        return (Module._ts_query_new = Module.asm.ts_query_new).apply(
          null,
          arguments
        );
      }),
      (Module._iswspace = function () {
        return (Module._iswspace = Module.asm.iswspace).apply(null, arguments);
      }),
      (Module._ts_query_delete = function () {
        return (Module._ts_query_delete = Module.asm.ts_query_delete).apply(
          null,
          arguments
        );
      }),
      (Module._iswalnum = function () {
        return (Module._iswalnum = Module.asm.iswalnum).apply(null, arguments);
      }),
      (Module._ts_query_pattern_count = function () {
        return (Module._ts_query_pattern_count =
          Module.asm.ts_query_pattern_count).apply(null, arguments);
      }),
      (Module._ts_query_capture_count = function () {
        return (Module._ts_query_capture_count =
          Module.asm.ts_query_capture_count).apply(null, arguments);
      }),
      (Module._ts_query_string_count = function () {
        return (Module._ts_query_string_count =
          Module.asm.ts_query_string_count).apply(null, arguments);
      }),
      (Module._ts_query_capture_name_for_id = function () {
        return (Module._ts_query_capture_name_for_id =
          Module.asm.ts_query_capture_name_for_id).apply(null, arguments);
      }),
      (Module._ts_query_string_value_for_id = function () {
        return (Module._ts_query_string_value_for_id =
          Module.asm.ts_query_string_value_for_id).apply(null, arguments);
      }),
      (Module._ts_query_predicates_for_pattern = function () {
        return (Module._ts_query_predicates_for_pattern =
          Module.asm.ts_query_predicates_for_pattern).apply(null, arguments);
      }),
      (Module._ts_tree_delete = function () {
        return (Module._ts_tree_delete = Module.asm.ts_tree_delete).apply(
          null,
          arguments
        );
      }),
      (Module._ts_init = function () {
        return (Module._ts_init = Module.asm.ts_init).apply(null, arguments);
      }),
      (Module._ts_parser_new_wasm = function () {
        return (Module._ts_parser_new_wasm =
          Module.asm.ts_parser_new_wasm).apply(null, arguments);
      }),
      (Module._ts_parser_enable_logger_wasm = function () {
        return (Module._ts_parser_enable_logger_wasm =
          Module.asm.ts_parser_enable_logger_wasm).apply(null, arguments);
      }),
      (Module._ts_parser_parse_wasm = function () {
        return (Module._ts_parser_parse_wasm =
          Module.asm.ts_parser_parse_wasm).apply(null, arguments);
      }),
      (Module._ts_tree_root_node_wasm = function () {
        return (Module._ts_tree_root_node_wasm =
          Module.asm.ts_tree_root_node_wasm).apply(null, arguments);
      }),
      (Module._ts_tree_edit_wasm = function () {
        return (Module._ts_tree_edit_wasm = Module.asm.ts_tree_edit_wasm).apply(
          null,
          arguments
        );
      }),
      (Module._ts_tree_get_changed_ranges_wasm = function () {
        return (Module._ts_tree_get_changed_ranges_wasm =
          Module.asm.ts_tree_get_changed_ranges_wasm).apply(null, arguments);
      }),
      (Module._ts_tree_cursor_new_wasm = function () {
        return (Module._ts_tree_cursor_new_wasm =
          Module.asm.ts_tree_cursor_new_wasm).apply(null, arguments);
      }),
      (Module._ts_tree_cursor_delete_wasm = function () {
        return (Module._ts_tree_cursor_delete_wasm =
          Module.asm.ts_tree_cursor_delete_wasm).apply(null, arguments);
      }),
      (Module._ts_tree_cursor_reset_wasm = function () {
        return (Module._ts_tree_cursor_reset_wasm =
          Module.asm.ts_tree_cursor_reset_wasm).apply(null, arguments);
      }),
      (Module._ts_tree_cursor_goto_first_child_wasm = function () {
        return (Module._ts_tree_cursor_goto_first_child_wasm =
          Module.asm.ts_tree_cursor_goto_first_child_wasm).apply(
          null,
          arguments
        );
      }),
      (Module._ts_tree_cursor_goto_next_sibling_wasm = function () {
        return (Module._ts_tree_cursor_goto_next_sibling_wasm =
          Module.asm.ts_tree_cursor_goto_next_sibling_wasm).apply(
          null,
          arguments
        );
      }),
      (Module._ts_tree_cursor_goto_parent_wasm = function () {
        return (Module._ts_tree_cursor_goto_parent_wasm =
          Module.asm.ts_tree_cursor_goto_parent_wasm).apply(null, arguments);
      }),
      (Module._ts_tree_cursor_current_node_type_id_wasm = function () {
        return (Module._ts_tree_cursor_current_node_type_id_wasm =
          Module.asm.ts_tree_cursor_current_node_type_id_wasm).apply(
          null,
          arguments
        );
      }),
      (Module._ts_tree_cursor_current_node_is_named_wasm = function () {
        return (Module._ts_tree_cursor_current_node_is_named_wasm =
          Module.asm.ts_tree_cursor_current_node_is_named_wasm).apply(
          null,
          arguments
        );
      }),
      (Module._ts_tree_cursor_current_node_is_missing_wasm = function () {
        return (Module._ts_tree_cursor_current_node_is_missing_wasm =
          Module.asm.ts_tree_cursor_current_node_is_missing_wasm).apply(
          null,
          arguments
        );
      }),
      (Module._ts_tree_cursor_current_node_id_wasm = function () {
        return (Module._ts_tree_cursor_current_node_id_wasm =
          Module.asm.ts_tree_cursor_current_node_id_wasm).apply(
          null,
          arguments
        );
      }),
      (Module._ts_tree_cursor_start_position_wasm = function () {
        return (Module._ts_tree_cursor_start_position_wasm =
          Module.asm.ts_tree_cursor_start_position_wasm).apply(null, arguments);
      }),
      (Module._ts_tree_cursor_end_position_wasm = function () {
        return (Module._ts_tree_cursor_end_position_wasm =
          Module.asm.ts_tree_cursor_end_position_wasm).apply(null, arguments);
      }),
      (Module._ts_tree_cursor_start_index_wasm = function () {
        return (Module._ts_tree_cursor_start_index_wasm =
          Module.asm.ts_tree_cursor_start_index_wasm).apply(null, arguments);
      }),
      (Module._ts_tree_cursor_end_index_wasm = function () {
        return (Module._ts_tree_cursor_end_index_wasm =
          Module.asm.ts_tree_cursor_end_index_wasm).apply(null, arguments);
      }),
      (Module._ts_tree_cursor_current_field_id_wasm = function () {
        return (Module._ts_tree_cursor_current_field_id_wasm =
          Module.asm.ts_tree_cursor_current_field_id_wasm).apply(
          null,
          arguments
        );
      }),
      (Module._ts_tree_cursor_current_node_wasm = function () {
        return (Module._ts_tree_cursor_current_node_wasm =
          Module.asm.ts_tree_cursor_current_node_wasm).apply(null, arguments);
      }),
      (Module._ts_node_symbol_wasm = function () {
        return (Module._ts_node_symbol_wasm =
          Module.asm.ts_node_symbol_wasm).apply(null, arguments);
      }),
      (Module._ts_node_child_count_wasm = function () {
        return (Module._ts_node_child_count_wasm =
          Module.asm.ts_node_child_count_wasm).apply(null, arguments);
      }),
      (Module._ts_node_named_child_count_wasm = function () {
        return (Module._ts_node_named_child_count_wasm =
          Module.asm.ts_node_named_child_count_wasm).apply(null, arguments);
      }),
      (Module._ts_node_child_wasm = function () {
        return (Module._ts_node_child_wasm =
          Module.asm.ts_node_child_wasm).apply(null, arguments);
      }),
      (Module._ts_node_named_child_wasm = function () {
        return (Module._ts_node_named_child_wasm =
          Module.asm.ts_node_named_child_wasm).apply(null, arguments);
      }),
      (Module._ts_node_child_by_field_id_wasm = function () {
        return (Module._ts_node_child_by_field_id_wasm =
          Module.asm.ts_node_child_by_field_id_wasm).apply(null, arguments);
      }),
      (Module._ts_node_next_sibling_wasm = function () {
        return (Module._ts_node_next_sibling_wasm =
          Module.asm.ts_node_next_sibling_wasm).apply(null, arguments);
      }),
      (Module._ts_node_prev_sibling_wasm = function () {
        return (Module._ts_node_prev_sibling_wasm =
          Module.asm.ts_node_prev_sibling_wasm).apply(null, arguments);
      }),
      (Module._ts_node_next_named_sibling_wasm = function () {
        return (Module._ts_node_next_named_sibling_wasm =
          Module.asm.ts_node_next_named_sibling_wasm).apply(null, arguments);
      }),
      (Module._ts_node_prev_named_sibling_wasm = function () {
        return (Module._ts_node_prev_named_sibling_wasm =
          Module.asm.ts_node_prev_named_sibling_wasm).apply(null, arguments);
      }),
      (Module._ts_node_parent_wasm = function () {
        return (Module._ts_node_parent_wasm =
          Module.asm.ts_node_parent_wasm).apply(null, arguments);
      }),
      (Module._ts_node_descendant_for_index_wasm = function () {
        return (Module._ts_node_descendant_for_index_wasm =
          Module.asm.ts_node_descendant_for_index_wasm).apply(null, arguments);
      }),
      (Module._ts_node_named_descendant_for_index_wasm = function () {
        return (Module._ts_node_named_descendant_for_index_wasm =
          Module.asm.ts_node_named_descendant_for_index_wasm).apply(
          null,
          arguments
        );
      }),
      (Module._ts_node_descendant_for_position_wasm = function () {
        return (Module._ts_node_descendant_for_position_wasm =
          Module.asm.ts_node_descendant_for_position_wasm).apply(
          null,
          arguments
        );
      }),
      (Module._ts_node_named_descendant_for_position_wasm = function () {
        return (Module._ts_node_named_descendant_for_position_wasm =
          Module.asm.ts_node_named_descendant_for_position_wasm).apply(
          null,
          arguments
        );
      }),
      (Module._ts_node_start_point_wasm = function () {
        return (Module._ts_node_start_point_wasm =
          Module.asm.ts_node_start_point_wasm).apply(null, arguments);
      }),
      (Module._ts_node_end_point_wasm = function () {
        return (Module._ts_node_end_point_wasm =
          Module.asm.ts_node_end_point_wasm).apply(null, arguments);
      }),
      (Module._ts_node_start_index_wasm = function () {
        return (Module._ts_node_start_index_wasm =
          Module.asm.ts_node_start_index_wasm).apply(null, arguments);
      }),
      (Module._ts_node_end_index_wasm = function () {
        return (Module._ts_node_end_index_wasm =
          Module.asm.ts_node_end_index_wasm).apply(null, arguments);
      }),
      (Module._ts_node_to_string_wasm = function () {
        return (Module._ts_node_to_string_wasm =
          Module.asm.ts_node_to_string_wasm).apply(null, arguments);
      }),
      (Module._ts_node_children_wasm = function () {
        return (Module._ts_node_children_wasm =
          Module.asm.ts_node_children_wasm).apply(null, arguments);
      }),
      (Module._ts_node_named_children_wasm = function () {
        return (Module._ts_node_named_children_wasm =
          Module.asm.ts_node_named_children_wasm).apply(null, arguments);
      }),
      (Module._ts_node_descendants_of_type_wasm = function () {
        return (Module._ts_node_descendants_of_type_wasm =
          Module.asm.ts_node_descendants_of_type_wasm).apply(null, arguments);
      }),
      (Module._ts_node_is_named_wasm = function () {
        return (Module._ts_node_is_named_wasm =
          Module.asm.ts_node_is_named_wasm).apply(null, arguments);
      }),
      (Module._ts_node_has_changes_wasm = function () {
        return (Module._ts_node_has_changes_wasm =
          Module.asm.ts_node_has_changes_wasm).apply(null, arguments);
      }),
      (Module._ts_node_has_error_wasm = function () {
        return (Module._ts_node_has_error_wasm =
          Module.asm.ts_node_has_error_wasm).apply(null, arguments);
      }),
      (Module._ts_node_is_missing_wasm = function () {
        return (Module._ts_node_is_missing_wasm =
          Module.asm.ts_node_is_missing_wasm).apply(null, arguments);
      }),
      (Module._ts_query_matches_wasm = function () {
        return (Module._ts_query_matches_wasm =
          Module.asm.ts_query_matches_wasm).apply(null, arguments);
      }),
      (Module._ts_query_captures_wasm = function () {
        return (Module._ts_query_captures_wasm =
          Module.asm.ts_query_captures_wasm).apply(null, arguments);
      }),
      (Module._iswdigit = function () {
        return (Module._iswdigit = Module.asm.iswdigit).apply(null, arguments);
      }),
      (Module._iswalpha = function () {
        return (Module._iswalpha = Module.asm.iswalpha).apply(null, arguments);
      }),
      (Module._iswlower = function () {
        return (Module._iswlower = Module.asm.iswlower).apply(null, arguments);
      }),
      (Module._towupper = function () {
        return (Module._towupper = Module.asm.towupper).apply(null, arguments);
      }),
      (Module.___errno_location = function () {
        return ($e = Module.___errno_location =
          Module.asm.__errno_location).apply(null, arguments);
      })),
    Le =
      ((Module._memchr = function () {
        return (Module._memchr = Module.asm.memchr).apply(null, arguments);
      }),
      (Module._strlen = function () {
        return (Module._strlen = Module.asm.strlen).apply(null, arguments);
      }),
      (Module.stackSave = function () {
        return (Le = Module.stackSave = Module.asm.stackSave).apply(
          null,
          arguments
        );
      })),
    We = (Module.stackRestore = function () {
      return (We = Module.stackRestore = Module.asm.stackRestore).apply(
        null,
        arguments
      );
    }),
    Ze = (Module.stackAlloc = function () {
      return (Ze = Module.stackAlloc = Module.asm.stackAlloc).apply(
        null,
        arguments
      );
    }),
    Fe =
      ((Module.__Znwm = function () {
        return (Module.__Znwm = Module.asm._Znwm).apply(null, arguments);
      }),
      (Module.__ZdlPv = function () {
        return (Module.__ZdlPv = Module.asm._ZdlPv).apply(null, arguments);
      }),
      (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = function () {
        return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm =
          Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm).apply(
          null,
          arguments
        );
      }),
      (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = function () {
        return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev =
          Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev).apply(
          null,
          arguments
        );
      }),
      (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = function () {
        return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm =
          Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm).apply(
          null,
          arguments
        );
      }),
      (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = function () {
        return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm =
          Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm).apply(
          null,
          arguments
        );
      }),
      (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = function () {
        return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc =
          Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc).apply(
          null,
          arguments
        );
      }),
      (Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = function () {
        return (Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm =
          Module.asm._ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm).apply(
          null,
          arguments
        );
      }),
      (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = function () {
        return (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev =
          Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev).apply(
          null,
          arguments
        );
      }),
      (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = function () {
        return (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw =
          Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw).apply(
          null,
          arguments
        );
      }),
      (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ = function () {
        return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ =
          Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_).apply(
          null,
          arguments
        );
      }),
      (Module.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = function () {
        return (Module.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv =
          Module.asm._ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv).apply(
          null,
          arguments
        );
      }),
      (Module.dynCall_iiii = function () {
        return (Module.dynCall_iiii = Module.asm.dynCall_iiii).apply(
          null,
          arguments
        );
      }),
      (Module.dynCall_ii = function () {
        return (Module.dynCall_ii = Module.asm.dynCall_ii).apply(
          null,
          arguments
        );
      }),
      (Module.dynCall_vi = function () {
        return (Module.dynCall_vi = Module.asm.dynCall_vi).apply(
          null,
          arguments
        );
      }),
      (Module.dynCall_vii = function () {
        return (Module.dynCall_vii = Module.asm.dynCall_vii).apply(
          null,
          arguments
        );
      }),
      (Module.dynCall_iiiii = function () {
        return (Module.dynCall_iiiii = Module.asm.dynCall_iiiii).apply(
          null,
          arguments
        );
      }),
      (Module.dynCall_iidiiii = function () {
        return (Module.dynCall_iidiiii = Module.asm.dynCall_iidiiii).apply(
          null,
          arguments
        );
      }),
      (Module._orig$ts_parser_timeout_micros = function () {
        return (Module._orig$ts_parser_timeout_micros =
          Module.asm.orig$ts_parser_timeout_micros).apply(null, arguments);
      }),
      (Module._orig$ts_parser_set_timeout_micros = function () {
        return (Module._orig$ts_parser_set_timeout_micros =
          Module.asm.orig$ts_parser_set_timeout_micros).apply(null, arguments);
      }),
      (Module.___assign_got_enties = function () {
        return (Fe = Module.___assign_got_enties =
          Module.asm.__assign_got_enties).apply(null, arguments);
      })),
    Oe = { TRANSFER_BUFFER: 1504, __cxa_new_handler: 6144, __data_end: 6984 };
  for (var je in Oe) Module["_" + je] = Pe + Oe[je];
  for (var je in ((Module.NAMED_GLOBALS = Oe), Oe))
    !(function (e) {
      var t = Module["_" + e];
      Module["g$_" + e] = function () {
        return t;
      };
    })(je);
  function Ue(e) {
    (this.name = "ExitStatus"),
      (this.message = "Program terminated with exit(" + e + ")"),
      (this.status = e);
  }
  (Module._fp$tree_sitter_log_callback$viii = function () {
    L(
      Module._tree_sitter_log_callback || !0,
      "external function `tree_sitter_log_callback` is missing.perhaps a side module was not linked in? if this symbol was expected to arrive from a system library, try to build the MAIN_MODULE with EMCC_FORCE_STDLIBS=XX in the environment"
    );
    var e = Module.asm.tree_sitter_log_callback;
    e || (e = Module._tree_sitter_log_callback),
      e || (e = Module._tree_sitter_log_callback),
      e || (e = Ce);
    var t = N(e, "viii");
    return (
      (Module._fp$tree_sitter_log_callback$viii = function () {
        return t;
      }),
      t
    );
  }),
    (Module.allocate = function (e, t, r, n) {
      var s, o;
      "number" == typeof e ? ((s = !0), (o = e)) : ((s = !1), (o = e.length));
      var _,
        a = "string" == typeof t ? t : null;
      if (
        ((_ = r == W ? n : [Te, Ze, p][r](Math.max(o, a ? 1 : t.length))), s)
      ) {
        var i;
        for (n = _, L(0 == (3 & _)), i = _ + (-4 & o); n < i; n += 4)
          z[n >> 2] = 0;
        for (i = _ + o; n < i; ) D[n++ >> 0] = 0;
        return _;
      }
      if ("i8" === a)
        return (
          e.subarray || e.slice ? B.set(e, _) : B.set(new Uint8Array(e), _), _
        );
      for (var u, l, d, c = 0; c < o; ) {
        var m = e[c];
        0 !== (u = a || t[c])
          ? ("i64" == u && (u = "i32"),
            R(_ + c, m, u),
            d !== u && ((l = M(u)), (d = u)),
            (c += l))
          : c++;
      }
      return _;
    }),
    (Module.getMemory = Z);
  function De(e) {
    function t() {
      ke ||
        ((ke = !0),
        (Module.calledRun = !0),
        $ ||
          ((ne = !0),
          Y(ee),
          Y(te),
          Module.onRuntimeInitialized && Module.onRuntimeInitialized(),
          He &&
            (function (e) {
              var t = Module._main;
              if (t)
                try {
                  Be(t(0, 0), !0);
                } catch (e) {
                  if (e instanceof Ue) return;
                  if ("unwind" == e) return void (A = !0);
                  var r = e;
                  e && "object" == typeof e && e.stack && (r = [e, e.stack]),
                    m("exception thrown: " + r),
                    o(1, e);
                } finally {
                  !0;
                }
            })(),
          (function () {
            if (Module.postRun)
              for (
                "function" == typeof Module.postRun &&
                (Module.postRun = [Module.postRun]);
                Module.postRun.length;

              )
                (e = Module.postRun.shift()), re.unshift(e);
            var e;
            Y(re);
          })()));
    }
    (e = e || s),
      ue > 0 ||
        (!(function () {
          if (Module.preRun)
            for (
              "function" == typeof Module.preRun &&
              (Module.preRun = [Module.preRun]);
              Module.preRun.length;

            )
              se(Module.preRun.shift());
          Y(J);
        })(),
        ue > 0 ||
          (Module.setStatus
            ? (Module.setStatus("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  Module.setStatus("");
                }, 1),
                  t();
              }, 1))
            : t()));
  }
  function Be(e, t) {
    (t && A && 0 === e) ||
      (A || (($ = !0), e, !0, Module.onExit && Module.onExit(e)),
      o(e, new Ue(e)));
  }
  if (
    ((de = function e() {
      ke || De(), ke || (de = e);
    }),
    (Module.run = De),
    Module.preInit)
  )
    for (
      "function" == typeof Module.preInit &&
      (Module.preInit = [Module.preInit]);
      Module.preInit.length > 0;

    )
      Module.preInit.pop()();
  var He = !0;
  Module.noInitialRun && (He = !1), (A = !0), De();
  const ze = Module,
    Ke = {},
    Ge = 4,
    Xe = 5 * Ge,
    Qe = 2 * Ge,
    Ve = 2 * Ge + 2 * Qe,
    Ye = { row: 0, column: 0 },
    Je = /[\w-.]*/g,
    et = 1,
    tt = 2,
    rt = /^_?tree_sitter_\w+/;
  var nt,
    st,
    ot,
    _t,
    at,
    it = new Promise((e) => {
      Module.onRuntimeInitialized = e;
    }).then(() => {
      (ot = ze._ts_init()), (nt = q(ot, "i32")), (st = q(ot + Ge, "i32"));
    });
  class Parser {
    static init() {
      return it;
    }
    constructor() {
      if (null == ot)
        throw new Error(
          "You must first call Parser.init() and wait for it to resolve."
        );
      ze._ts_parser_new_wasm(),
        (this[0] = q(ot, "i32")),
        (this[1] = q(ot + Ge, "i32"));
    }
    delete() {
      ze._ts_parser_delete(this[0]),
        ze._free(this[1]),
        (this[0] = 0),
        (this[1] = 0);
    }
    setLanguage(e) {
      let t;
      if (e) {
        if (e.constructor !== Language)
          throw new Error("Argument must be a Language");
        {
          t = e[0];
          const r = ze._ts_language_version(t);
          if (r < st || nt < r)
            throw new Error(
              `Incompatible language version ${r}. ` +
                `Compatibility range ${st} through ${nt}.`
            );
        }
      } else (t = 0), (e = null);
      return (this.language = e), ze._ts_parser_set_language(this[0], t), this;
    }
    getLanguage() {
      return this.language;
    }
    parse(e, t, r) {
      if ("string" == typeof e) _t = (t, r, n) => e.slice(t, n);
      else {
        if ("function" != typeof e)
          throw new Error("Argument must be a string or a function");
        _t = e;
      }
      this.logCallback
        ? ((at = this.logCallback),
          ze._ts_parser_enable_logger_wasm(this[0], 1))
        : ((at = null), ze._ts_parser_enable_logger_wasm(this[0], 0));
      let n = 0,
        s = 0;
      if (r && r.includedRanges) {
        n = r.includedRanges.length;
        let e = (s = ze._calloc(n, Ve));
        for (let t = 0; t < n; t++) wt(e, r.includedRanges[t]), (e += Ve);
      }
      const o = ze._ts_parser_parse_wasm(this[0], this[1], t ? t[0] : 0, s, n);
      if (!o) throw ((_t = null), (at = null), new Error("Parsing failed"));
      const _ = new Tree(Ke, o, this.language, _t);
      return (_t = null), (at = null), _;
    }
    reset() {
      ze._ts_parser_parse_wasm(this[0]);
    }
    setTimeoutMicros(e) {
      ze._ts_parser_set_timeout_micros(this[0], e);
    }
    getTimeoutMicros() {
      return ze._ts_parser_timeout_micros(this[0]);
    }
    setLogger(e) {
      if (e) {
        if ("function" != typeof e)
          throw new Error("Logger callback must be a function");
      } else e = null;
      return (this.logCallback = e), this;
    }
    getLogger() {
      return this.logCallback;
    }
  }
  class Tree {
    constructor(e, t, r, n) {
      dt(e), (this[0] = t), (this.language = r), (this.textCallback = n);
    }
    copy() {
      const e = ze._ts_tree_copy(this[0]);
      return new Tree(Ke, e, this.language, this.textCallback);
    }
    delete() {
      ze._ts_tree_delete(this[0]), (this[0] = 0);
    }
    edit(e) {
      !(function (e) {
        let t = ot;
        Mt(t, e.startPosition),
          Mt((t += Qe), e.oldEndPosition),
          Mt((t += Qe), e.newEndPosition),
          R((t += Qe), e.startIndex, "i32"),
          R((t += Ge), e.oldEndIndex, "i32"),
          R((t += Ge), e.newEndIndex, "i32"),
          (t += Ge);
      })(e),
        ze._ts_tree_edit_wasm(this[0]);
    }
    get rootNode() {
      return ze._ts_tree_root_node_wasm(this[0]), ft(this);
    }
    getLanguage() {
      return this.language;
    }
    walk() {
      return this.rootNode.walk();
    }
    getChangedRanges(e) {
      if (e.constructor !== Tree)
        throw new TypeError("Argument must be a Tree");
      ze._ts_tree_get_changed_ranges_wasm(this[0], e[0]);
      const t = q(ot, "i32"),
        r = q(ot + Ge, "i32"),
        n = new Array(t);
      if (t > 0) {
        let e = r;
        for (let r = 0; r < t; r++) (n[r] = yt(e)), (e += Ve);
        ze._free(r);
      }
      return n;
    }
  }
  class Node {
    constructor(e, t) {
      dt(e), (this.tree = t);
    }
    get typeId() {
      return mt(this), ze._ts_node_symbol_wasm(this.tree[0]);
    }
    get type() {
      return this.tree.language.types[this.typeId] || "ERROR";
    }
    get endPosition() {
      return mt(this), ze._ts_node_end_point_wasm(this.tree[0]), gt(ot);
    }
    get endIndex() {
      return mt(this), ze._ts_node_end_index_wasm(this.tree[0]);
    }
    get text() {
      return ut(this.tree, this.startIndex, this.endIndex);
    }
    isNamed() {
      return mt(this), 1 === ze._ts_node_is_named_wasm(this.tree[0]);
    }
    hasError() {
      return mt(this), 1 === ze._ts_node_has_error_wasm(this.tree[0]);
    }
    hasChanges() {
      return mt(this), 1 === ze._ts_node_has_changes_wasm(this.tree[0]);
    }
    isMissing() {
      return mt(this), 1 === ze._ts_node_is_missing_wasm(this.tree[0]);
    }
    equals(e) {
      if (this === e) return !0;
      for (let t = 0; t < 5; t++) if (this[t] !== e[t]) return !1;
      return !0;
    }
    child(e) {
      return mt(this), ze._ts_node_child_wasm(this.tree[0], e), ft(this.tree);
    }
    namedChild(e) {
      return (
        mt(this), ze._ts_node_named_child_wasm(this.tree[0], e), ft(this.tree)
      );
    }
    childForFieldId(e) {
      return (
        mt(this),
        ze._ts_node_child_by_field_id_wasm(this.tree[0], e),
        ft(this.tree)
      );
    }
    childForFieldName(e) {
      const t = this.tree.language.fields.indexOf(e);
      if (-1 !== t) return this.childForFieldId(t);
    }
    get childCount() {
      return mt(this), ze._ts_node_child_count_wasm(this.tree[0]);
    }
    get namedChildCount() {
      return mt(this), ze._ts_node_named_child_count_wasm(this.tree[0]);
    }
    get firstChild() {
      return this.child(0);
    }
    get firstNamedChild() {
      return this.namedChild(0);
    }
    get lastChild() {
      return this.child(this.childCount - 1);
    }
    get lastNamedChild() {
      return this.namedChild(this.namedChildCount - 1);
    }
    get children() {
      if (!this._children) {
        mt(this), ze._ts_node_children_wasm(this.tree[0]);
        const e = q(ot, "i32"),
          t = q(ot + Ge, "i32");
        if (((this._children = new Array(e)), e > 0)) {
          let r = t;
          for (let t = 0; t < e; t++)
            (this._children[t] = ft(this.tree, r)), (r += Xe);
          ze._free(t);
        }
      }
      return this._children;
    }
    get namedChildren() {
      if (!this._namedChildren) {
        mt(this), ze._ts_node_named_children_wasm(this.tree[0]);
        const e = q(ot, "i32"),
          t = q(ot + Ge, "i32");
        if (((this._namedChildren = new Array(e)), e > 0)) {
          let r = t;
          for (let t = 0; t < e; t++)
            (this._namedChildren[t] = ft(this.tree, r)), (r += Xe);
          ze._free(t);
        }
      }
      return this._namedChildren;
    }
    descendantsOfType(e, t, r) {
      Array.isArray(e) || (e = [e]), t || (t = Ye), r || (r = Ye);
      const n = [],
        s = this.tree.language.types;
      for (let t = 0, r = s.length; t < r; t++) e.includes(s[t]) && n.push(t);
      const o = ze._malloc(Ge * n.count);
      for (let e = 0, t = n.length; e < t; e++) R(o + e * Ge, n[e], "i32");
      mt(this),
        ze._ts_node_descendants_of_type_wasm(
          this.tree[0],
          o,
          n.length,
          t.row,
          t.column,
          r.row,
          r.column
        );
      const _ = q(ot, "i32"),
        a = q(ot + Ge, "i32"),
        i = new Array(_);
      if (_ > 0) {
        let e = a;
        for (let t = 0; t < _; t++) (i[t] = ft(this.tree, e)), (e += Xe);
      }
      return ze._free(a), ze._free(o), i;
    }
    get nextSibling() {
      return (
        mt(this), ze._ts_node_next_sibling_wasm(this.tree[0]), ft(this.tree)
      );
    }
    get previousSibling() {
      return (
        mt(this), ze._ts_node_prev_sibling_wasm(this.tree[0]), ft(this.tree)
      );
    }
    get nextNamedSibling() {
      return (
        mt(this),
        ze._ts_node_next_named_sibling_wasm(this.tree[0]),
        ft(this.tree)
      );
    }
    get previousNamedSibling() {
      return (
        mt(this),
        ze._ts_node_prev_named_sibling_wasm(this.tree[0]),
        ft(this.tree)
      );
    }
    get parent() {
      return mt(this), ze._ts_node_parent_wasm(this.tree[0]), ft(this.tree);
    }
    descendantForIndex(e, t = e) {
      if ("number" != typeof e || "number" != typeof t)
        throw new Error("Arguments must be numbers");
      mt(this);
      let r = ot + Xe;
      return (
        R(r, e, "i32"),
        R(r + Ge, t, "i32"),
        ze._ts_node_descendant_for_index_wasm(this.tree[0]),
        ft(this.tree)
      );
    }
    namedDescendantForIndex(e, t = e) {
      if ("number" != typeof e || "number" != typeof t)
        throw new Error("Arguments must be numbers");
      mt(this);
      let r = ot + Xe;
      return (
        R(r, e, "i32"),
        R(r + Ge, t, "i32"),
        ze._ts_node_named_descendant_for_index_wasm(this.tree[0]),
        ft(this.tree)
      );
    }
    descendantForPosition(e, t = e) {
      if (!ct(e) || !ct(t))
        throw new Error("Arguments must be {row, column} objects");
      mt(this);
      let r = ot + Xe;
      return (
        Mt(r, e),
        Mt(r + Qe, t),
        ze._ts_node_descendant_for_position_wasm(this.tree[0]),
        ft(this.tree)
      );
    }
    namedDescendantForPosition(e, t = e) {
      if (!ct(e) || !ct(t))
        throw new Error("Arguments must be {row, column} objects");
      mt(this);
      let r = ot + Xe;
      return (
        Mt(r, e),
        Mt(r + Qe, t),
        ze._ts_node_named_descendant_for_position_wasm(this.tree[0]),
        ft(this.tree)
      );
    }
    walk() {
      return (
        mt(this),
        ze._ts_tree_cursor_new_wasm(this.tree[0]),
        new TreeCursor(Ke, this.tree)
      );
    }
    toString() {
      mt(this);
      const e = ze._ts_node_to_string_wasm(this.tree[0]),
        t = (function (e) {
          for (var t = ""; ; ) {
            var r = B[e++ >> 0];
            if (!r) return t;
            t += String.fromCharCode(r);
          }
        })(e);
      return ze._free(e), t;
    }
  }
  class TreeCursor {
    constructor(e, t) {
      dt(e), (this.tree = t), ht(this);
    }
    delete() {
      pt(this),
        ze._ts_tree_cursor_delete_wasm(this.tree[0]),
        (this[0] = this[1] = this[2] = 0);
    }
    reset(e) {
      mt(e),
        pt(this, ot + Xe),
        ze._ts_tree_cursor_reset_wasm(this.tree[0]),
        ht(this);
    }
    get nodeType() {
      return this.tree.language.types[this.nodeTypeId] || "ERROR";
    }
    get nodeTypeId() {
      return (
        pt(this), ze._ts_tree_cursor_current_node_type_id_wasm(this.tree[0])
      );
    }
    get nodeId() {
      return pt(this), ze._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
    }
    get nodeIsNamed() {
      return (
        pt(this),
        1 === ze._ts_tree_cursor_current_node_is_named_wasm(this.tree[0])
      );
    }
    get nodeIsMissing() {
      return (
        pt(this),
        1 === ze._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0])
      );
    }
    get nodeText() {
      pt(this);
      const e = ze._ts_tree_cursor_start_index_wasm(this.tree[0]),
        t = ze._ts_tree_cursor_end_index_wasm(this.tree[0]);
      return ut(this.tree, e, t);
    }
    get startPosition() {
      return (
        pt(this), ze._ts_tree_cursor_start_position_wasm(this.tree[0]), gt(ot)
      );
    }
    get endPosition() {
      return (
        pt(this), ze._ts_tree_cursor_end_position_wasm(this.tree[0]), gt(ot)
      );
    }
    get startIndex() {
      return pt(this), ze._ts_tree_cursor_start_index_wasm(this.tree[0]);
    }
    get endIndex() {
      return pt(this), ze._ts_tree_cursor_end_index_wasm(this.tree[0]);
    }
    currentNode() {
      return (
        pt(this),
        ze._ts_tree_cursor_current_node_wasm(this.tree[0]),
        ft(this.tree)
      );
    }
    currentFieldId() {
      return pt(this), ze._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
    }
    currentFieldName() {
      return this.tree.language.fields[this.currentFieldId()];
    }
    gotoFirstChild() {
      pt(this);
      const e = ze._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
      return ht(this), 1 === e;
    }
    gotoNextSibling() {
      pt(this);
      const e = ze._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
      return ht(this), 1 === e;
    }
    gotoParent() {
      pt(this);
      const e = ze._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
      return ht(this), 1 === e;
    }
  }
  class Language {
    constructor(e, t) {
      dt(e),
        (this[0] = t),
        (this.types = new Array(ze._ts_language_symbol_count(this[0])));
      for (let e = 0, t = this.types.length; e < t; e++)
        ze._ts_language_symbol_type(this[0], e) < 2 &&
          (this.types[e] = j(ze._ts_language_symbol_name(this[0], e)));
      this.fields = new Array(ze._ts_language_field_count(this[0]) + 1);
      for (let e = 0, t = this.fields.length; e < t; e++) {
        const t = ze._ts_language_field_name_for_id(this[0], e);
        this.fields[e] = 0 !== t ? j(t) : null;
      }
    }
    get version() {
      return ze._ts_language_version(this[0]);
    }
    get fieldCount() {
      return this.fields.length - 1;
    }
    fieldIdForName(e) {
      const t = this.fields.indexOf(e);
      return -1 !== t ? t : null;
    }
    fieldNameForId(e) {
      return this.fields[e] || null;
    }
    query(e) {
      const t = (function (e) {
          for (var t = 0, r = 0; r < e.length; ++r) {
            var n = e.charCodeAt(r);
            n >= 55296 &&
              n <= 57343 &&
              (n = (65536 + ((1023 & n) << 10)) | (1023 & e.charCodeAt(++r))),
              n <= 127 ? ++t : (t += n <= 2047 ? 2 : n <= 65535 ? 3 : 4);
          }
          return t;
        })(e),
        r = ze._malloc(t + 1);
      (function (e, t, r, n) {
        if (!(n > 0)) return 0;
        for (var s = r, o = r + n - 1, _ = 0; _ < e.length; ++_) {
          var a = e.charCodeAt(_);
          if (
            (a >= 55296 &&
              a <= 57343 &&
              (a = (65536 + ((1023 & a) << 10)) | (1023 & e.charCodeAt(++_))),
            a <= 127)
          ) {
            if (r >= o) break;
            t[r++] = a;
          } else if (a <= 2047) {
            if (r + 1 >= o) break;
            (t[r++] = 192 | (a >> 6)), (t[r++] = 128 | (63 & a));
          } else if (a <= 65535) {
            if (r + 2 >= o) break;
            (t[r++] = 224 | (a >> 12)),
              (t[r++] = 128 | ((a >> 6) & 63)),
              (t[r++] = 128 | (63 & a));
          } else {
            if (r + 3 >= o) break;
            (t[r++] = 240 | (a >> 18)),
              (t[r++] = 128 | ((a >> 12) & 63)),
              (t[r++] = 128 | ((a >> 6) & 63)),
              (t[r++] = 128 | (63 & a));
          }
        }
        t[r] = 0;
      })(e, B, r, t + 1);
      const n = ze._ts_query_new(this[0], r, t, ot, ot + Ge);
      if (!n) {
        const t = q(ot + Ge, "i32"),
          n = j(r, q(ot, "i32")).length,
          s = e.substr(n, 100).split("\n")[0];
        let o,
          _ = s.match(Je)[0];
        switch (t) {
          case 2:
            o = new RangeError(`Bad node name '${_}'`);
            break;
          case 3:
            o = new RangeError(`Bad field name '${_}'`);
            break;
          case 4:
            o = new RangeError(`Bad capture name @${_}`);
            break;
          case 5:
            (o = new TypeError(
              `Bad pattern structure at offset ${n}: '${s}'...`
            )),
              (_ = "");
            break;
          default:
            (o = new SyntaxError(`Bad syntax at offset ${n}: '${s}'...`)),
              (_ = "");
        }
        throw ((o.index = n), (o.length = _.length), ze._free(r), o);
      }
      const s = ze._ts_query_string_count(n),
        o = ze._ts_query_capture_count(n),
        _ = ze._ts_query_pattern_count(n),
        a = new Array(o),
        i = new Array(s);
      for (let e = 0; e < o; e++) {
        const t = ze._ts_query_capture_name_for_id(n, e, ot),
          r = q(ot, "i32");
        a[e] = j(t, r);
      }
      for (let e = 0; e < s; e++) {
        const t = ze._ts_query_string_value_for_id(n, e, ot),
          r = q(ot, "i32");
        i[e] = j(t, r);
      }
      const u = new Array(_),
        l = new Array(_),
        d = new Array(_),
        c = new Array(_),
        m = new Array(_);
      for (let e = 0; e < _; e++) {
        const t = ze._ts_query_predicates_for_pattern(n, e, ot),
          r = q(ot, "i32");
        (c[e] = []), (m[e] = []);
        const s = [];
        let o = t;
        for (let t = 0; t < r; t++) {
          const t = q(o, "i32"),
            r = q((o += Ge), "i32");
          if (((o += Ge), t === et)) s.push({ type: "capture", name: a[r] });
          else if (t === tt) s.push({ type: "string", value: i[r] });
          else if (s.length > 0) {
            if ("string" !== s[0].type)
              throw new Error("Predicates must begin with a literal value");
            const t = s[0].value;
            let r = !0;
            switch (t) {
              case "not-eq?":
                r = !1;
              case "eq?":
                if (3 !== s.length)
                  throw new Error(
                    `Wrong number of arguments to \`#eq?\` predicate. Expected 2, got ${
                      s.length - 1
                    }`
                  );
                if ("capture" !== s[1].type)
                  throw new Error(
                    `First argument of \`#eq?\` predicate must be a capture. Got "${s[1].value}"`
                  );
                if ("capture" === s[2].type) {
                  const t = s[1].name,
                    n = s[2].name;
                  m[e].push(function (e) {
                    let s, o;
                    for (const r of e)
                      r.name === t && (s = r.node),
                        r.name === n && (o = r.node);
                    return (s.text === o.text) === r;
                  });
                } else {
                  const t = s[1].name,
                    n = s[2].value;
                  m[e].push(function (e) {
                    for (const s of e)
                      if (s.name === t) return (s.node.text === n) === r;
                    return !1;
                  });
                }
                break;
              case "not-match?":
                r = !1;
              case "match?":
                if (3 !== s.length)
                  throw new Error(
                    `Wrong number of arguments to \`#match?\` predicate. Expected 2, got ${
                      s.length - 1
                    }.`
                  );
                if ("capture" !== s[1].type)
                  throw new Error(
                    `First argument of \`#match?\` predicate must be a capture. Got "${s[1].value}".`
                  );
                if ("string" !== s[2].type)
                  throw new Error(
                    `Second argument of \`#match?\` predicate must be a string. Got @${s[2].value}.`
                  );
                const n = s[1].name,
                  o = new RegExp(s[2].value);
                m[e].push(function (e) {
                  for (const t of e)
                    if (t.name === n) return o.test(t.node.text) === r;
                  return !1;
                });
                break;
              case "set!":
                if (s.length < 2 || s.length > 3)
                  throw new Error(
                    `Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${
                      s.length - 1
                    }.`
                  );
                if (s.some((e) => "string" !== e.type))
                  throw new Error(
                    'Arguments to `#set!` predicate must be a strings.".'
                  );
                u[e] || (u[e] = {}),
                  (u[e][s[1].value] = s[2] ? s[2].value : null);
                break;
              case "is?":
              case "is-not?":
                if (s.length < 2 || s.length > 3)
                  throw new Error(
                    `Wrong number of arguments to \`#${t}\` predicate. Expected 1 or 2. Got ${
                      s.length - 1
                    }.`
                  );
                if (s.some((e) => "string" !== e.type))
                  throw new Error(
                    `Arguments to \`#${t}\` predicate must be a strings.".`
                  );
                const _ = "is?" === t ? l : d;
                _[e] || (_[e] = {}),
                  (_[e][s[1].value] = s[2] ? s[2].value : null);
                break;
              default:
                c[e].push({ operator: t, operands: s.slice(1) });
            }
            s.length = 0;
          }
        }
        Object.freeze(u[e]), Object.freeze(l[e]), Object.freeze(d[e]);
      }
      return (
        ze._free(r),
        new Query(
          Ke,
          n,
          a,
          m,
          c,
          Object.freeze(u),
          Object.freeze(l),
          Object.freeze(d)
        )
      );
    }
    static load(e) {
      let t;
      if (
        "undefined" != typeof process &&
        process.versions &&
        process.versions.node
      ) {
        const r = require("fs");
        t = Promise.resolve(r.readFileSync(__dirname + "/" + e));
      } else
        t = fetch(e).then((e) =>
          e.arrayBuffer().then((t) => {
            if (e.ok) return new Uint8Array(t);
            {
              const r = new TextDecoder("utf-8").decode(t);
              throw new Error(
                `Language.load failed with status ${e.status}.\n\n${r}`
              );
            }
          })
        );
      return t
        .then((e) => E(e, { loadAsync: !0 }))
        .then((e) => {
          const t = Object.keys(e),
            r = t.find((e) => rt.test(e) && !e.includes("external_scanner_"));
          r ||
            console.log(
              `Couldn't find language function in WASM file. Symbols:\n${JSON.stringify(
                t,
                null,
                2
              )}`
            );
          // console.log("parsed module", JSON.stringify(Object.keys(e)));
          let n = e[r];
          try {
            n = n();
          } catch (error) {
            // console.log("loading error:", error);
            return n;
          }
          // console.log("language", JSON.stringify(n));
          return new Language(Ke, n);
        });
    }
  }
  class Query {
    constructor(e, t, r, n, s, o, _, a) {
      dt(e),
        (this[0] = t),
        (this.captureNames = r),
        (this.textPredicates = n),
        (this.predicates = s),
        (this.setProperties = o),
        (this.assertedProperties = _),
        (this.refutedProperties = a);
    }
    delete() {
      ze._ts_query_delete(this[0]), (this[0] = 0);
    }
    matches(e, t, r) {
      t || (t = Ye),
        r || (r = Ye),
        mt(e),
        ze._ts_query_matches_wasm(
          this[0],
          e.tree[0],
          t.row,
          t.column,
          r.row,
          r.column
        );
      const n = q(ot, "i32"),
        s = q(ot + Ge, "i32"),
        o = new Array(n);
      let _ = s;
      for (let t = 0; t < n; t++) {
        const r = q(_, "i32"),
          n = q((_ += Ge), "i32");
        _ += Ge;
        const s = new Array(n);
        if (
          ((_ = lt(this, e.tree, _, s)),
          this.textPredicates[r].every((e) => e(s)))
        ) {
          o[t] = { pattern: r, captures: s };
          const e = this.setProperties[r];
          e && (o[t].setProperties = e);
          const n = this.assertedProperties[r];
          n && (o[t].assertedProperties = n);
          const _ = this.refutedProperties[r];
          _ && (o[t].refutedProperties = _);
        }
      }
      return ze._free(s), o;
    }
    captures(e, t, r) {
      t || (t = Ye),
        r || (r = Ye),
        mt(e),
        ze._ts_query_captures_wasm(
          this[0],
          e.tree[0],
          t.row,
          t.column,
          r.row,
          r.column
        );
      const n = q(ot, "i32"),
        s = q(ot + Ge, "i32"),
        o = [],
        _ = [];
      let a = s;
      for (let t = 0; t < n; t++) {
        const t = q(a, "i32"),
          r = q((a += Ge), "i32"),
          n = q((a += Ge), "i32");
        if (
          ((a += Ge),
          (_.length = r),
          (a = lt(this, e.tree, a, _)),
          this.textPredicates[t].every((e) => e(_)))
        ) {
          const e = _[n],
            r = this.setProperties[t];
          r && (e.setProperties = r);
          const s = this.assertedProperties[t];
          s && (e.assertedProperties = s);
          const a = this.refutedProperties[t];
          a && (e.refutedProperties = a), o.push(e);
        }
      }
      return ze._free(s), o;
    }
    predicatesForPattern(e) {
      return this.predicates[e];
    }
  }
  function ut(e, t, r) {
    const n = r - t;
    let s = e.textCallback(t, null, r);
    for (t += s.length; t < r; ) {
      const n = e.textCallback(t, null, r);
      if (!(n && n.length > 0)) break;
      (t += n.length), (s += n);
    }
    return t > r && (s = s.slice(0, n)), s;
  }
  function lt(e, t, r, n) {
    for (let s = 0, o = n.length; s < o; s++) {
      const o = q(r, "i32"),
        _ = ft(t, (r += Ge));
      (r += Xe), (n[s] = { name: e.captureNames[o], node: _ });
    }
    return r;
  }
  function dt(e) {
    if (e !== Ke) throw new Error("Illegal constructor");
  }
  function ct(e) {
    return e && "number" == typeof e.row && "number" == typeof e.column;
  }
  function mt(e) {
    let t = ot;
    R(t, e.id, "i32"),
      R((t += Ge), e.startIndex, "i32"),
      R((t += Ge), e.startPosition.row, "i32"),
      R((t += Ge), e.startPosition.column, "i32"),
      R((t += Ge), e[0], "i32");
  }
  function ft(e, t = ot) {
    const r = q(t, "i32");
    if (0 === r) return null;
    const n = q((t += Ge), "i32"),
      s = q((t += Ge), "i32"),
      o = q((t += Ge), "i32"),
      _ = q((t += Ge), "i32"),
      a = new Node(Ke, e);
    return (
      (a.id = r),
      (a.startIndex = n),
      (a.startPosition = { row: s, column: o }),
      (a[0] = _),
      a
    );
  }
  function pt(e, t = ot) {
    R(t + 0 * Ge, e[0], "i32"),
      R(t + 1 * Ge, e[1], "i32"),
      R(t + 2 * Ge, e[2], "i32");
  }
  function ht(e) {
    (e[0] = q(ot + 0 * Ge, "i32")),
      (e[1] = q(ot + 1 * Ge, "i32")),
      (e[2] = q(ot + 2 * Ge, "i32"));
  }
  function Mt(e, t) {
    R(e, t.row, "i32"), R(e + Ge, t.column, "i32");
  }
  function gt(e) {
    return { row: q(e, "i32"), column: q(e + Ge, "i32") };
  }
  function wt(e, t) {
    Mt(e, t.startPosition),
      Mt((e += Qe), t.endPosition),
      R((e += Qe), t.startIndex, "i32"),
      R((e += Ge), t.endIndex, "i32"),
      (e += Ge);
  }
  function yt(e) {
    const t = {};
    return (
      (t.startPosition = gt(e)),
      (e += Qe),
      (t.endPosition = gt(e)),
      (e += Qe),
      (t.startIndex = q(e, "i32")),
      (e += Ge),
      (t.endIndex = q(e, "i32")),
      t
    );
  }
  return (Parser.Language = Language), Parser;
});
