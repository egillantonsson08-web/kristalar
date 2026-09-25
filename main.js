/* ═══════════════════════════════════════════════════════
   Kristalar.is — hreyfingar og kristalahringurinn
   ═══════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* Sofnin eru sott vid keyrslu, ekki afrituo inn i skrana. Bregdist sotturinn
     keyrir sidan samt: hun er ad fullu laesileg og virk an GSAP. */
  var SOFN = [
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
  ];

  function saekjaSofn(slodir, buid) {
    var i = 0;
    (function naest() {
      if (i >= slodir.length) { buid(); return; }
      var s = document.createElement("script");
      s.src = slodir[i++];
      s.async = false;
      s.onload = naest;
      s.onerror = naest;   /* eitt safn sem klikkar stodvar ekki hin */
      document.head.appendChild(s);
    })();
  }

  /* ═══════════ FERÐIN: ÚR JÖRÐU Í HÖND ═══════════
     Steinninn er ekki flatarmynd heldur sexstrendingur með oddi í báða enda,
     varpaður úr þrívídd flöt fyrir flöt. Hver flötur fær sinn lit eftir því
     hvernig hann snýr að ljósinu, og þeir sem snúa frá eru hafiðir hálfgegnsæir
     — það er það sem lætur stein líta út fyrir að vera kristall en ekki pappi.

     Myndavélin þysir að, dregur sig frá og færist til hliðar eftir því hvar
     í ferðinni lesandinn er staddur. Allt er hrein fall af skrunstöðu.
     ════════════════════════════════════════════ */
  /* ═══════════ AKKERI SEM BERAST MILLI SIDNA ═══════════
     "Boka radgjof" i lok ferdarinnar skiladi manni efst a forsiduna i stad
     bokunarinnar. Tvennt olli thvi:

       1. Vafrinn stekkur a #akkeri strax vid thattun, en sidan heldur afram
          ad hreyfast eftir thad -- letur kemur, myndir hladast, ScrollTrigger
          maelir upp a nytt -- og markid faerist undan stokkinu.
       2. history.scrollRestoration er "auto", svo Chrome endurheimtir fyrri
          skrunstodu thessarar slodar EFTIR hledslu og yfirskrifar stokkid.

     Thess vegna: slokkt a endurheimt thegar slodin ber akkeri, og skrunad
     aftur i hvert sinn sem sidan hefur getad jafnad sig.
     ═══════════════════════════════════════════════════ */
  function jafnaAkkeri() {
    if (!location.hash || location.hash.length < 2) { return; }
    var mark;
    try { mark = document.querySelector(location.hash); } catch (e) { return; }
    if (!mark) { return; }
    /* scrollIntoView virdir scroll-margin-top, svo fasti hausinn hylur ekki
       fyrirsognina eins og hratt reiknad offset myndi gera. */
    mark.scrollIntoView({ block: "start", behavior: "instant" });
  }

  if (location.hash && location.hash.length > 1) {
    if ("scrollRestoration" in history) { history.scrollRestoration = "manual"; }
    jafnaAkkeri();
    window.addEventListener("load", jafnaAkkeri);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(jafnaAkkeri).catch(function () {});
    }
  }

  /* Breytist akkerid an thess ad sidan hladist upp a nytt -- t.d. slod limd
     i veffangastikuna -- tha sér vafrinn stundum ekki um stokkid sjalfur. */
  window.addEventListener("hashchange", jafnaAkkeri);

  (function ferdin() {
    var ferd = document.getElementById("ferd");
    var teikn = document.getElementById("ferd-teikn");
    if (!ferd || !teikn || !window.ScrollCraft) { return; }

    var SVG = "http://www.w3.org/2000/svg";
    var minni = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var docEl = document.documentElement;

    var VIGT = [2.1, 3.9, 3.6, 3.0, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 4.5];
    var UPPHAF = [], HEILD = 0, i;
    for (i = 0; i < VIGT.length; i++) { UPPHAF.push(HEILD); HEILD += VIGT[i]; }
    var FYRSTI_STEINN = 4;            /* leggur þar sem steinarnir átta byrja */

    /* Hver steinn hefur sinn lit og sitt vaxtarlag: mjór og hár, eða breidur
       og stuttur. Þetta er það sem gerir átta steina að átta steinum. */
    var STEINAR = [
      { litur: "#D9899A", r: 116, h: 250, t: 128, hlidar: 6 },   /* Rósakvars   */
      { litur: "#E3A93E", r:  96, h: 300, t: 168, hlidar: 6 },   /* Sítrín      */
      { litur: "#4A9A5E", r: 132, h: 214, t: 104, hlidar: 6 },   /* Aventúrín   */
      { litur: "#6B6472", r:  86, h: 356, t:  84, hlidar: 6 },   /* Túrmalín    */
      { litur: "#9B65B4", r: 104, h: 268, t: 176, hlidar: 6 },   /* Ametýst     */
      { litur: "#4C74C4", r: 126, h: 228, t: 112, hlidar: 6 },   /* Sódalít     */
      { litur: "#DCE6EC", r:  92, h: 312, t: 190, hlidar: 6 },   /* Bergkristall*/
      { litur: "#D2502A", r: 136, h: 206, t:  96, hlidar: 6 }    /* Karneól     */
    ];
    var GULL = { litur: "#C9A96A", r: 106, h: 272, t: 150, hlidar: 6 };

    /* Myndavélin, einn lykilrammi á legg: [þysing, hliðrun x, hliðrun y, snúningur] */
    var VEL = [
      [1.70,    0,  110, 0.10],
      [1.16,    0,   34, 0.55],
      [0.94,    0,    0, 1.05],
      [0.80,    0,    0, 1.70],
      [0.74,  310,    0, 2.30],
      [0.74, -310,    0, 3.00],
      [0.74,  310,    0, 3.70],
      [0.74, -310,    0, 4.40],
      [0.74,  310,    0, 5.10],
      [0.74, -310,    0, 5.80],
      [0.74,  310,    0, 6.50],
      [0.74, -310,    0, 7.20],
      [0.54,    0,  -14, 7.95],
      [0.50,    0,  -24, 8.35]
    ];

    var velG     = document.getElementById("ferd-vel");
    var rykG     = document.getElementById("ferd-ryk");
    var kristalG = document.getElementById("ferd-kristall");
    var vollurG  = document.getElementById("ferd-vollur");
    var baugur   = document.getElementById("ferd-baugur");
    var glod1    = document.getElementById("ferd-glod-1");

    var MID = 450, PITCH = 0.34;
    var LJOS = (function () {
      var v = [-0.45, -0.78, 0.44], l = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
      return [v[0]/l, v[1]/l, v[2]/l];
    })();

    function klemma(x, a, b) { return x < a ? a : x > b ? b : x; }
    function mjukt(x) { return x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x); }
    function svid(x, a, b) { return x <= a ? 0 : x >= b ? 1 : (x - a) / (b - a); }
    function milli(a, b, h) { return a + (b - a) * h; }
    function tolur(hex) {
      return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
    }
    function litur(rgb) {
      return "rgb(" + Math.round(rgb[0]) + "," + Math.round(rgb[1]) + "," + Math.round(rgb[2]) + ")";
    }
    function blandaLit(a, b, h) {
      return [milli(a[0],b[0],h), milli(a[1],b[1],h), milli(a[2],b[2],h)];
    }

    /* ── Rúmfræði: sexstrendingur með oddi í báða enda ── */
    var N = 6;
    var FLETIR = [];        /* hver flötur: { p:[hnit], nx,ny,nz } */
    (function byggjaFleti() {
      var k;
      for (k = 0; k < N; k++) {
        var a0 = (k / N) * Math.PI * 2, a1 = ((k + 1) / N) * Math.PI * 2;
        var am = (a0 + a1) / 2;
        FLETIR.push({ gerd: "hlid", a0: a0, a1: a1, am: am });
      }
      for (k = 0; k < N; k++) {
        var b0 = (k / N) * Math.PI * 2, b1 = ((k + 1) / N) * Math.PI * 2;
        FLETIR.push({ gerd: "toppur", a0: b0, a1: b1, am: (b0 + b1) / 2 });
      }
      for (k = 0; k < N; k++) {
        var c0 = (k / N) * Math.PI * 2, c1 = ((k + 1) / N) * Math.PI * 2;
        FLETIR.push({ gerd: "botn", a0: c0, a1: c1, am: (c0 + c1) / 2 });
      }
    })();

    var flotEl = [];
    (function byggjaEl() {
      for (var k = 0; k < FLETIR.length; k++) {
        var pth = document.createElementNS(SVG, "path");
        pth.setAttribute("stroke-linejoin", "round");
        kristalG.appendChild(pth);
        flotEl.push(pth);
      }
    })();

    /* Innri sprungur: þrír strengir á milli horna sem gefa dýpt. */
    var sprungur = [];
    (function byggjaSprungur() {
      for (var k = 0; k < 3; k++) {
        var ln = document.createElementNS(SVG, "path");
        ln.setAttribute("fill", "none");
        ln.setAttribute("stroke", "rgba(255,255,255,.20)");
        ln.setAttribute("stroke-width", "1.1");
        kristalG.appendChild(ln);
        sprungur.push(ln);
      }
    })();

    function verpa(x, y, z, th) {
      var cx =  x * Math.cos(th) + z * Math.sin(th);
      var cz = -x * Math.sin(th) + z * Math.cos(th);
      return {
        x: cx,
        y: y * Math.cos(PITCH) + cz * Math.sin(PITCH),
        d: cz * Math.cos(PITCH) - y * Math.sin(PITCH)
      };
    }

    function teiknaKristal(f, hexA, hexB, hexH, th, birta, vaxtur) {
      var r = f.r * vaxtur, h = f.h * vaxtur, t = f.t * vaxtur;
      var grunn = blandaLit(tolur(hexA), tolur(hexB), hexH);
      var ljosLitur = blandaLit(grunn, [255, 252, 244], 0.52);
      var dokkLitur = blandaLit(grunn, [10, 9, 13], 0.62);

      var rod = [], k;
      for (k = 0; k < FLETIR.length; k++) {
        var F = FLETIR[k], p = [], nx, ny, nz;

        if (F.gerd === "hlid") {
          p.push(verpa(r*Math.cos(F.a0), -h/2, r*Math.sin(F.a0), th));
          p.push(verpa(r*Math.cos(F.a1), -h/2, r*Math.sin(F.a1), th));
          p.push(verpa(r*Math.cos(F.a1),  h/2, r*Math.sin(F.a1), th));
          p.push(verpa(r*Math.cos(F.a0),  h/2, r*Math.sin(F.a0), th));
          nx = Math.cos(F.am); ny = 0; nz = Math.sin(F.am);
        } else if (F.gerd === "toppur") {
          p.push(verpa(0, -h/2 - t, 0, th));
          p.push(verpa(r*Math.cos(F.a0), -h/2, r*Math.sin(F.a0), th));
          p.push(verpa(r*Math.cos(F.a1), -h/2, r*Math.sin(F.a1), th));
          nx = t*Math.cos(F.am); ny = -r; nz = t*Math.sin(F.am);
        } else {
          p.push(verpa(0, h/2 + t, 0, th));
          p.push(verpa(r*Math.cos(F.a1), h/2, r*Math.sin(F.a1), th));
          p.push(verpa(r*Math.cos(F.a0), h/2, r*Math.sin(F.a0), th));
          nx = t*Math.cos(F.am); ny = r; nz = t*Math.sin(F.am);
        }

        var nl = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
        var n = verpa(nx/nl, ny/nl, nz/nl, th);
        var skuggi = klemma(n.x*LJOS[0] + n.y*LJOS[1] + n.d*LJOS[2], 0, 1);
        var dypt = (p[0].d + p[1].d + p[2].d + (p[3] ? p[3].d : p[2].d)) / (p[3] ? 4 : 3);
        var framan = n.d < 0;

        var d = "M";
        for (var q = 0; q < p.length; q++) {
          d += (MID + p[q].x).toFixed(1) + " " + (MID + p[q].y).toFixed(1) + (q < p.length-1 ? "L" : "Z");
        }

        var blanda = 0.16 + 0.84 * skuggi;
        var fill = litur(blandaLit(dokkLitur, ljosLitur, blanda * birta));
        rod.push({ el: flotEl[k], d: d, fill: fill, dypt: dypt, framan: framan });
      }

      rod.sort(function (a, b) { return b.dypt - a.dypt; });
      for (k = 0; k < rod.length; k++) {
        var s = rod[k];
        s.el.setAttribute("d", s.d);
        s.el.setAttribute("fill", s.fill);
        s.el.setAttribute("fill-opacity", s.framan ? "0.94" : "0.30");
        s.el.setAttribute("stroke", s.framan ? "rgba(255,250,238,.30)" : "rgba(255,250,238,.12)");
        s.el.setAttribute("stroke-width", "0.9");
        kristalG.appendChild(s.el);
      }

      /* Sprungurnar fylgja sömu vörpun, milli efri og neðri hrings. */
      for (k = 0; k < 3; k++) {
        var i0 = k * 2, i1 = (k * 2 + 3) % N;
        var aa = (i0 / N) * Math.PI * 2, bb = (i1 / N) * Math.PI * 2;
        var pA = verpa(r*Math.cos(aa)*0.72, -h/2 + h*0.18, r*Math.sin(aa)*0.72, th);
        var pB = verpa(r*Math.cos(bb)*0.72,  h/2 - h*0.22, r*Math.sin(bb)*0.72, th);
        sprungur[k].setAttribute("d",
          "M" + (MID+pA.x).toFixed(1) + " " + (MID+pA.y).toFixed(1) +
          "L" + (MID+pB.x).toFixed(1) + " " + (MID+pB.y).toFixed(1));
        sprungur[k].setAttribute("opacity", (0.5 * birta * vaxtur).toFixed(3));
      }
    }

    /* ── Stjörnurnar sem safnast saman í steininn ──
       Hver þeirra er baugur og kjarni: baugurinn ber ljómann, kjarninn punktinn.
       Þær reika, tindra og kvikna undir bendlinum. */
    var RYK = 68, ryk = [];
    (function byggjaRyk() {
      var frae = 7;
      function slembi() { frae = (frae * 1103515245 + 12345) % 2147483648; return frae / 2147483648; }
      for (var k = 0; k < RYK; k++) {
        var g = document.createElementNS(SVG, "g");
        var baug = document.createElementNS(SVG, "circle");
        var kjarni = document.createElementNS(SVG, "circle");
        var r = 0.8 + slembi() * 1.9;
        baug.setAttribute("r", (r * 4.2).toFixed(2));
        baug.setAttribute("fill", "#F0DFB6");
        kjarni.setAttribute("r", r.toFixed(2));
        kjarni.setAttribute("fill", "#FCF4E2");
        g.appendChild(baug); g.appendChild(kjarni);
        rykG.appendChild(g);
        var horn = slembi() * Math.PI * 2, fj = 250 + slembi() * 330;
        ryk.push({
          el: g, baug: baug, kjarni: kjarni, r: r,
          x: Math.cos(horn) * fj,
          y: (slembi() - 0.5) * 640,
          taf: slembi(),
          hradi: 0.14 + slembi() * 0.46,
          fasi: slembi() * Math.PI * 2,
          vidd: 8 + slembi() * 24,
          blik: 0.45 + slembi() * 1.5
        });
      }
    })();

    /* Bendillinn geymdur í skjáhnitum og umreiknaður einu sinni á ramma:
       myndavélin færist til við skrun, svo vörpunin gildir ekki lengur en þann ramma. */
    var bendill = { x: null, y: null };
    if (!minni) {
      window.addEventListener("pointermove", function (e) {
        bendill.x = e.clientX; bendill.y = e.clientY;
      }, { passive: true });
      window.addEventListener("pointerleave", function () { bendill.x = null; });
      window.addEventListener("blur", function () { bendill.x = null; });
    }
    var rykSynilegt = true;

    /* ── Völlurinn: átta litlir steinar í lokin ── */
    var vollur = [];
    (function byggjaVoll() {
      for (var k = 0; k < 8; k++) {
        var g = document.createElementNS(SVG, "g");
        var pth = document.createElementNS(SVG, "path");
        pth.setAttribute("d", "M0 -46L26 -16L22 40L0 62L-22 40L-26 -16Z");
        pth.setAttribute("fill", STEINAR[k].litur);
        pth.setAttribute("stroke", "rgba(255,250,238,.30)");
        pth.setAttribute("stroke-width", "1");
        var inn = document.createElementNS(SVG, "path");
        inn.setAttribute("d", "M0 -46L0 62M-26 -16L0 -6L26 -16");
        inn.setAttribute("fill", "none");
        inn.setAttribute("stroke", "rgba(10,9,13,.34)");
        inn.setAttribute("stroke-width", "1");
        g.appendChild(pth); g.appendChild(inn);
        g.setAttribute("opacity", "0");
        vollurG.appendChild(g);
        var horn = (k / 8) * Math.PI * 2 - Math.PI / 2;
        vollur.push({ el: g, x: Math.cos(horn) * 300, y: Math.sin(horn) * 300 });
      }
    })();

    /* ── Hvaða steinn, og hvaða myndavélarstada, við tiltekna framvindu ── */
    function stadaVid(pr) {
      var t = pr * HEILD, k = 0;
      while (k < VIGT.length - 1 && t >= UPPHAF[k] + VIGT[k]) { k++; }
      var local = klemma((t - UPPHAF[k]) / VIGT[k], 0, 1);
      return { leggur: k, innan: local };
    }

    function velVid(k, local) {
      var a = VEL[k], b = VEL[k + 1] || VEL[k];
      var h = mjukt(local);
      return [milli(a[0],b[0],h), milli(a[1],b[1],h), milli(a[2],b[2],h), milli(a[3],b[3],h)];
    }

    var sidast = -1;
    function teikna(pr) {
      if (pr === sidast) { return; }
      sidast = pr;
      var s = stadaVid(pr), k = s.leggur, local = s.innan;

      /* Myndavélin */
      var v = velVid(k, local);
      /* Vid minni hreyfingu er myndavelin kyrr i thysingu og snuningi, en
         hlidfaerslan og voxturinn fylgja skruninu afram: hvorugt er hreyfing
         sem fer af stad sjalf, og an theirra lendir textinn ofan i steininum. */
      var zoom = minni ? 0.74 : v[0];
      velG.setAttribute("transform",
        "translate(" + (MID + v[1]).toFixed(1) + "," + (MID + v[2]).toFixed(1) + ") " +
        "scale(" + zoom.toFixed(4) + ") translate(" + (-MID) + "," + (-MID) + ")");
      var th = minni ? 0.6 : v[3];

      /* Vöxturinn: úr engu í fullan stein yfir fyrstu tvo leggina */
      var vaxtur = mjukt(svid(pr, UPPHAF[1] / HEILD, (UPPHAF[1] + VIGT[1] * 0.72) / HEILD));
      vaxtur = 0.06 + vaxtur * 0.94;

      /* Hvaða steinn: gull í upphafi, síðan einn af átta, með mjúkri skiptingu */
      var A = GULL, B = GULL, hh = 0;
      if (k >= FYRSTI_STEINN) {
        var si = klemma(k - FYRSTI_STEINN, 0, 7);
        A = STEINAR[si];
        B = STEINAR[Math.min(si + 1, 7)];
        hh = mjukt(svid(local, 0.80, 1.0));
        if (si === 7) { hh = 0; }
      } else if (k === FYRSTI_STEINN - 1) {
        A = GULL; B = STEINAR[0]; hh = mjukt(svid(local, 0.72, 1.0));
      }
      var form = {
        r: milli(A.r, B.r, hh), h: milli(A.h, B.h, hh), t: milli(A.t, B.t, hh)
      };

      var birta = 0.42 + 0.58 * mjukt(svid(pr, UPPHAF[3] / HEILD, (UPPHAF[3] + VIGT[3] * 0.6) / HEILD));
      teiknaKristal(form, A.litur, B.litur, hh, th, birta, vaxtur);

      /* Glóðin fylgir steininum */
      var lj = mjukt(svid(pr, UPPHAF[3] / HEILD, (UPPHAF[3] + VIGT[3] * 0.7) / HEILD));
      glod1.setAttribute("stop-opacity", (0.10 + lj * 0.26).toFixed(3));
      glod1.setAttribute("stop-color", A.litur);
      baugur.setAttribute("r", (220 + lj * 120).toFixed(0));
      baugur.setAttribute("cx", (MID + v[1] * 0.4).toFixed(0));
      baugur.setAttribute("cy", (MID + v[2] * 0.4).toFixed(0));

      /* Undir lokin dregur steinninn sig i hle fyrir textanum. Thad er baedi
         hreinni endir og eina leidin til ad lokaordin naist ad lesa: bjartur
         kristall beint undir theim gaf 1,7:1 birtuskil. */
      var hverfa = mjukt(svid(pr, 0.895, 0.985));
      velG.setAttribute("opacity", (1 - hverfa * 0.86).toFixed(3));

      /* Leidin a ekki ad hanga hálfsyn yfir lokakaflanum. Hun fylgir ferdinni
         og hverfur um leid og henni lykur. */
      if (leid) {
        var leidOp = 1 - mjukt(svid(pr, 0.94, 0.995));
        leid.style.opacity = leidOp.toFixed(3);
        leid.style.pointerEvents = leidOp > 0.05 ? "" : "none";
      }

      /* Völlurinn birtist i lokin og þ rengist saman */
      var lokPr = svid(pr, (UPPHAF[12] + VIGT[12] * 0.18) / HEILD, 1);
      var dreif = mjukt(svid(lokPr, 0, 0.45)) * (1 - mjukt(svid(lokPr, 0.62, 0.95)));
      var syna = mjukt(svid(lokPr, 0, 0.3)) * (1 - mjukt(svid(lokPr, 0.72, 0.98)));
      for (var w = 0; w < vollur.length; w++) {
        var o = vollur[w];
        o.el.setAttribute("transform",
          "translate(" + (MID + o.x * dreif).toFixed(1) + "," + (MID + o.y * dreif).toFixed(1) + ") " +
          "scale(" + (0.5 + dreif * 0.5).toFixed(3) + ")");
        o.el.setAttribute("opacity", syna.toFixed(3));
      }
    }

    /* Stjörnurnar eru ekki fall af skruni einu saman heldur líka af tíma, svo
       þær lifa áður en nokkur snertir músina. Keyrt hvern ramma meðan þær sjást,
       og sleppt alveg þegar þær eru horfnar. */
    function hreyfaRyk(pr, tid) {
      var safn = mjukt(svid(pr, 0, (UPPHAF[1] + VIGT[1] * 0.8) / HEILD));
      var rykOp = 1 - mjukt(svid(pr, (UPPHAF[1] + VIGT[1] * 0.55) / HEILD, UPPHAF[2] / HEILD));

      if (rykOp <= 0.004) {
        if (rykSynilegt) { rykG.setAttribute("opacity", "0"); rykSynilegt = false; }
        return;
      }
      if (!rykSynilegt) { rykG.setAttribute("opacity", "1"); rykSynilegt = true; }

      var t = minni ? 0 : tid / 1000;

      /* Skjáhnit bendilsins þrýdd yfir í hnitakerfi stjörnuhópsins. */
      var bx = null, by = null;
      if (bendill.x !== null && rykG.getScreenCTM) {
        var ctm = rykG.getScreenCTM();
        if (ctm) {
          var pt = teikn.createSVGPoint();
          pt.x = bendill.x; pt.y = bendill.y;
          var loc = pt.matrixTransform(ctm.inverse());
          bx = loc.x; by = loc.y;
        }
      }

      for (var q = 0; q < ryk.length; q++) {
        var d = ryk[q];
        var f = mjukt(klemma((safn - d.taf * 0.35) / 0.65, 0, 1));
        var eftir = 1 - f;

        var px = d.x * eftir + Math.cos(t * d.hradi + d.fasi) * d.vidd * eftir;
        var py = d.y * eftir + Math.sin(t * d.hradi * 0.78 + d.fasi * 1.7) * d.vidd * 0.66 * eftir;
        var sx = MID + px, sy = MID + py;

        var tindra = 0.56 + 0.44 * Math.sin(t * d.blik + d.fasi);
        var naerd = 0;
        if (bx !== null) {
          var ax = sx - bx, ay = sy - by;
          naerd = klemma(1 - Math.sqrt(ax * ax + ay * ay) / 110, 0, 1);
          naerd = naerd * naerd * naerd;
        }

        var grunn = rykOp * (0.16 + 0.44 * eftir) * tindra;
        d.el.setAttribute("transform", "translate(" + sx.toFixed(1) + "," + sy.toFixed(1) + ")");
        d.kjarni.setAttribute("opacity", klemma(grunn + naerd * 0.95, 0, 1).toFixed(3));
        d.baug.setAttribute("opacity", klemma(grunn * 0.30 + naerd * 0.42, 0, 1).toFixed(3));
        d.baug.setAttribute("r", (d.r * (4.2 + naerd * 6.5)).toFixed(2));
      }
    }

    function framvinda() {
      var k = parseInt(docEl.style.getPropertyValue("--sc-seg"), 10);
      var sp = parseFloat(docEl.style.getPropertyValue("--sc-segp"));
      if (isNaN(k)) { k = 0; }
      if (isNaN(sp)) { sp = 0; }
      k = klemma(k, 0, VIGT.length - 1);
      return (UPPHAF[k] + sp * VIGT[k]) / HEILD;
    }

    ScrollCraft.mount(document);

    function tikk(nu) {
      var pr = Math.round(framvinda() * 3000) / 3000;
      teikna(pr);
      hreyfaRyk(pr, nu || 0);
    }
    ferd.scFerd = { tikk: tikk, framvinda: framvinda };
    (function lykkja(nu) { tikk(nu); requestAnimationFrame(lykkja); })();

    /* ── Leiðin: kortid um heiminn ── */
    var leid = document.getElementById("ferd-leid");
    if (leid) {
      var merki = ferd.querySelectorAll("[data-sc-segment]");
      Array.prototype.forEach.call(merki, function (seg, idx) {
        var b = document.createElement("button");
        b.type = "button";
        b.innerHTML = '<span class="ferd-leid-nafn">' +
          (seg.getAttribute("data-sc-waypoint") || String(idx + 1)) + "</span>";
        b.setAttribute("aria-current", idx === 0 ? "true" : "false");
        b.addEventListener("click", function () {
          var topp = ferd.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: Math.round(topp + UPPHAF[idx] * window.innerHeight),
            behavior: minni ? "auto" : "smooth"
          });
        });
        leid.appendChild(b);
      });
      ferd.addEventListener("sc:waypoint", function (e) {
        var hnappar = leid.querySelectorAll("button");
        for (var j = 0; j < hnappar.length; j++) {
          hnappar[j].setAttribute("aria-current", j === e.detail.index ? "true" : "false");
        }
      });
    }
  })();

  function keyra() {

  var minniHreyfing = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Badi sofnin verda ad vera komin; ScrollTrigger eitt og ser dugar ekki. */
  var gsapTilbuid = typeof window.gsap !== "undefined" &&
                    typeof window.ScrollTrigger !== "undefined";

  /* ───────── Gögn: steinarnir átta ─────────
     "form" lýsir útlínu steinsins með sömu átta breytum fyrir alla steina.
     Því er hægt að tímastilla á milli þeirra og láta forminu breytast í raun,
     í stað þess að kross-deyfa tvær myndir. Skiptu "litur" og "form" út
     fyrir <img> hér ef þú vilt seinna nota ljósmyndir af eigin steinum. */
  var steinar = [
    {
      eiginleiki: "Ást",
      nafn: "Rósakvars",
      litur: "#D9899A",
      x: 50, y: 10,
      stutt: "Mildasti steinninn í hillunni okkar — tengdur við kærleika, ekki síst til sjálfs sín.",
      markmid: "meiri hlýju og mildi í eigin garð",
      merki: ["Kærleikur", "Sjálfsmildi", "Opið hjarta"],
      form: { w: 74, ty: 56, sy: 96, sr: .95, my: 152, br: .95, by: 212, bt: 248 }
    },
    {
      eiginleiki: "Velgengni",
      nafn: "Sítrín",
      litur: "#E3A93E",
      x: 78.3, y: 21.7,
      stutt: "Bjartur og gulur eins og síðdegissól — tengdur við sjálfstraust og framtakssemi.",
      markmid: "meira sjálfstraust og kjark til að stíga skrefið",
      merki: ["Sjálfstraust", "Gleði", "Framtakssemi"],
      form: { w: 54, ty: 20, sy: 84, sr: .90, my: 138, br: .90, by: 224, bt: 264 }
    },
    {
      eiginleiki: "Auður",
      nafn: "Grænn aventúrín",
      litur: "#4A9A5E",
      x: 90, y: 50,
      stutt: "Djúpgrænn og jarðbundinn — tengdur við vöxt, tækifæri og hugrekki.",
      markmid: "vöxt og tækifæri sem þú þorir að grípa",
      merki: ["Vöxtur", "Tækifæri", "Hugrekki"],
      form: { w: 80, ty: 66, sy: 102, sr: .93, my: 154, br: .88, by: 210, bt: 242 }
    },
    {
      eiginleiki: "Vernd",
      nafn: "Svartur túrmalín",
      litur: "#6B6472",
      x: 78.3, y: 78.3,
      stutt: "Þyngsti og dekksti steinninn okkar — tengdur við mörk og skjól.",
      markmid: "skýrari mörk og meira skjól í daglegu lífi",
      merki: ["Mörk", "Jarðtenging", "Skjól"],
      form: { w: 44, ty: 34, sy: 44, sr: .82, my: 142, br: .99, by: 240, bt: 272 }
    },
    {
      eiginleiki: "Persónulegur vöxtur",
      nafn: "Ametýst",
      litur: "#9B65B4",
      x: 50, y: 90,
      stutt: "Fjólublár og hlýr — tengdur við ró í huga, íhugun og góðan svefn.",
      markmid: "dýpri íhugun og persónulegan vöxt",
      merki: ["Svefn", "Ró", "Íhugun"],
      form: { w: 60, ty: 16, sy: 76, sr: .87, my: 132, br: .93, by: 226, bt: 266 }
    },
    {
      eiginleiki: "Einbeiting",
      nafn: "Sódalít",
      litur: "#4C74C4",
      x: 21.7, y: 78.3,
      stutt: "Djúpblár með hvítum æðum — tengdur við skýra hugsun og einbeitingu.",
      markmid: "skýrari hugsun og betri einbeitingu",
      merki: ["Skýr hugsun", "Ró í huga", "Einbeiting"],
      form: { w: 72, ty: 60, sy: 90, sr: .99, my: 146, br: .97, by: 208, bt: 244 }
    },
    {
      eiginleiki: "Ró",
      nafn: "Bergkristall",
      litur: "#DCE6EC",
      x: 10, y: 50,
      stutt: "Tær og glær — tengdur við jafnvægi og skýrleika. Góður fyrsti steinn.",
      markmid: "meira jafnvægi og ró í hversdeginum",
      merki: ["Jafnvægi", "Skýrleiki", "Fyrsti steinninn"],
      form: { w: 46, ty: 10, sy: 70, sr: .90, my: 126, br: .96, by: 230, bt: 268 }
    },
    {
      eiginleiki: "Orka",
      nafn: "Karneól",
      litur: "#D2502A",
      x: 21.7, y: 21.7,
      stutt: "Rauðappelsínugulur og lifandi — tengdur við drift og frumkvæði.",
      markmid: "meiri drift og kjark til að byrja",
      merki: ["Drift", "Kjarkur", "Frumkvæði"],
      form: { w: 78, ty: 74, sy: 106, sr: .90, my: 158, br: .85, by: 212, bt: 246 }
    }
  ];

  /* Hlutlausi steinninn sem sést áður en nokkuð er valid. */
  var SJALFGEFINN = {
    litur: "#C9A96A",
    form: { w: 58, ty: 38, sy: 86, sr: .92, my: 142, br: .92, by: 218, bt: 256 }
  };
  var UMBREYTING = .8;   /* 800ms — innan 600–1000ms rammans */

  /* ───────── Finndu kristalinn ───────── */
  var svid = document.getElementById("finna-svid");
  var markSvaedi = document.getElementById("finna-mork");
  var kjarni = document.getElementById("finna-kjarni");
  var flot = document.getElementById("finna-flot");
  var glod = document.getElementById("finna-glod");
  var finnaSvar = document.getElementById("finna-svar");
  var taug = document.getElementById("finna-taug");
  var taugLina = document.getElementById("finna-taug-lina");
  var utlina = document.getElementById("finna-utlina");
  var speglun = document.getElementById("finna-speglun");
  var oxlEl = document.getElementById("finna-oxl");
  var flotur1 = document.getElementById("finna-flotur-1");
  var flotur2 = document.getElementById("finna-flotur-2");
  var stopar = [
    document.getElementById("finna-stop-1"),
    document.getElementById("finna-stop-2"),
    document.getElementById("finna-stop-3")
  ];

  var bendingStudd = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var syndur = -1;   /* steinninn sem sést núna */
  var valinn = -1;   /* steinninn sem hefur verið stadfestur */
  var nuForm = {};

  function afrita(f, i) { for (var k in f) { i[k] = f[k]; } return i; }
  afrita(SJALFGEFINN.form, nuForm);

  /* ── Litablöndun ── */
  function tolur(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }
  function blanda(a, b, hlutfall) {
    var pa = tolur(a), pb = tolur(b), ut = "#";
    for (var i = 0; i < 3; i++) {
      var v = Math.round(pa[i] + (pb[i] - pa[i]) * hlutfall);
      ut += ("0" + v.toString(16)).slice(-2);
    }
    return ut;
  }

  /* ── Slóðir: allt leitt af sömu átta breytum ── */
  function n(v) { return Math.round(v * 10) / 10; }

  function sUtlina(f) {
    return "M" + n(100) + " " + n(f.ty) +
      "L" + n(100 + f.w * f.sr) + " " + n(f.sy) +
      "L" + n(100 + f.w) + " " + n(f.my) +
      "L" + n(100 + f.w * f.br) + " " + n(f.by) +
      "L" + n(100) + " " + n(f.bt) +
      "L" + n(100 - f.w * f.br) + " " + n(f.by) +
      "L" + n(100 - f.w) + " " + n(f.my) +
      "L" + n(100 - f.w * f.sr) + " " + n(f.sy) + "Z";
  }
  function innriBrun(f, att) {
    return "M100 " + n(f.ty) +
      "L" + n(100 + att * f.w * .34) + " " + n(f.sy + (f.my - f.sy) * .55) +
      "L" + n(100 + att * f.w * .24) + " " + n(f.bt - (f.bt - f.by) * .2);
  }
  function sSpeglun(f) {
    return innriBrun(f, -1) + "L100 " + n(f.bt) + "Z";
  }
  function sOxl(f) {
    return "M" + n(100 - f.w * f.sr) + " " + n(f.sy) +
      "L100 " + n(f.sy + (f.my - f.sy) * .34) +
      "L" + n(100 + f.w * f.sr) + " " + n(f.sy);
  }

  function teikna() {
    utlina.setAttribute("d", sUtlina(nuForm));
    speglun.setAttribute("d", sSpeglun(nuForm));
    oxlEl.setAttribute("d", sOxl(nuForm));
    flotur1.setAttribute("d", innriBrun(nuForm, -1));
    flotur2.setAttribute("d", innriBrun(nuForm, 1));
  }

  function setjaLiti(hex, hradi) {
    var ljos = blanda(hex, "#FFFFFF", .40);
    var dokkt = blanda(hex, "#0B0A0E", .60);
    var gildi = [ljos, hex, dokkt];
    if (!gsapTilbuid || minniHreyfing || !hradi) {
      for (var i = 0; i < 3; i++) { stopar[i].setAttribute("stop-color", gildi[i]); }
      glod.style.color = hex;
      return;
    }
    for (var j = 0; j < 3; j++) {
      gsap.to(stopar[j], { attr: { "stop-color": gildi[j] }, duration: hradi, ease: "power2.inOut", overwrite: "auto" });
    }
    gsap.to(glod, { color: hex, duration: hradi, ease: "power2.inOut", overwrite: "auto" });
  }

  /* Kjarninn í öllu: mjúk umbreyting úr einu formi í annað. */
  function umbreyta(form, hex) {
    if (!gsapTilbuid || minniHreyfing) {
      afrita(form, nuForm); teikna(); setjaLiti(hex, 0); return;
    }
    var stillingar = { duration: UMBREYTING, ease: "power2.inOut", overwrite: true, onUpdate: teikna };
    for (var k in form) { stillingar[k] = form[k]; }
    gsap.to(nuForm, stillingar);
    setjaLiti(hex, UMBREYTING);
  }

  function birtaTexta(html) {
    finnaSvar.innerHTML = html;
    if (gsapTilbuid && !minniHreyfing) {
      gsap.fromTo(finnaSvar.children,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: .45, stagger: .06, ease: "power2.out", overwrite: true });
    }
  }

  function visbending() {
    return '<p class="finna-vis">' +
      (bendingStudd
        ? "Renndu músinni yfir eiginleika og sjáðu steininn breytast."
        : "Snertu eiginleika og sjáðu steininn breytast.") +
      "</p>";
  }

  /* ── Gullnáðin milli eiginleika og steins ── */
  function draGull(hnappur) {
    if (!taugLina || !bendingStudd) { return; }
    var sr = svid.getBoundingClientRect();
    var hr = hnappur.getBoundingClientRect();
    var kr = kjarni.getBoundingClientRect();
    var x1 = hr.left + hr.width / 2 - sr.left, y1 = hr.top + hr.height / 2 - sr.top;
    var x2 = kr.left + kr.width / 2 - sr.left, y2 = kr.top + kr.height / 2 - sr.top;
    var dx = x2 - x1, dy = y2 - y1, lengd = Math.sqrt(dx * dx + dy * dy) || 1;
    x1 += dx / lengd * 28; y1 += dy / lengd * 28;
    x2 -= dx / lengd * (kr.width * .46); y2 -= dy / lengd * (kr.width * .46);
    taugLina.setAttribute("x1", x1); taugLina.setAttribute("y1", y1);
    taugLina.setAttribute("x2", x2); taugLina.setAttribute("y2", y2);
    svid.setAttribute("data-taug", "true");
    if (gsapTilbuid && !minniHreyfing) {
      var ny = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      gsap.fromTo(taugLina,
        { attr: { "stroke-dasharray": ny, "stroke-dashoffset": ny } },
        { attr: { "stroke-dashoffset": 0 }, duration: .55, ease: "power2.out", overwrite: true });
    }
  }
  function slokkvaGull() { svid.setAttribute("data-taug", "false"); }

  /* ── Óstaðfest forskoðun (bending eða lyklaborð) ── */
  function forskoda(i, hnappur) {
    if (valinn !== -1 || i === syndur) { return; }
    syndur = i;
    var s = steinar[i];
    merkjaVirkt(i);
    umbreyta(s.form, s.litur);
    if (gsapTilbuid && !minniHreyfing) {
      gsap.to(glod, { opacity: .42, duration: UMBREYTING, overwrite: "auto" });
    }
    finnaSvar.style.setProperty("--steinn-virkur", s.litur);
    birtaTexta(
      '<p class="finna-mark-heiti">' + s.eiginleiki + "</p>" +
      '<p class="finna-steinn-nafn">' + s.nafn + "</p>" +
      '<p class="finna-lysing">' + s.stutt + "</p>"
    );
    if (hnappur) { draGull(hnappur); }
  }

  function merkjaVirkt(i) {
    var hnappar = markSvaedi.querySelectorAll(".finna-mark");
    for (var j = 0; j < hnappar.length; j++) {
      hnappar[j].setAttribute("data-virkt", j === i ? "true" : "false");
      hnappar[j].setAttribute("aria-pressed", j === i && valinn === i ? "true" : "false");
    }
  }

  /* ── Staðfest val ── */
  function velja(i) {
    valinn = -1;            /* hleypa forskoðun í gegn ef annað mark er valid */
    syndur = -1;
    forskoda(i, null);
    valinn = i;
    var s = steinar[i];
    merkjaVirkt(i);
    slokkvaGull();
    svid.setAttribute("data-valid", "true");
    if (gsapTilbuid && !minniHreyfing) {
      gsap.to(glod, { opacity: .58, duration: 1, ease: "power2.out", overwrite: "auto" });
    }
    birtaTexta(
      '<p class="finna-mark-heiti">Kristallinn þinn</p>' +
      '<p class="finna-steinn-nafn">' + s.nafn + "</p>" +
      '<p class="finna-lysing finna-nidurstada-inn">Kristall sem valinn er út frá markmiði þínu um ' +
        s.markmid + ".</p>" +
      '<div class="finna-merki">' +
        s.merki.map(function (m) { return "<span>" + m + "</span>"; }).join("") +
      "</div>" +
      '<div class="finna-adgerdir">' +
        '<a class="hnappur" href="#boka">Finndu þinn kristal</a>' +
        '<button class="finna-aftur" type="button" id="finna-aftur">Velja aftur</button>' +
      "</div>"
    );
    var aftur = document.getElementById("finna-aftur");
    if (aftur) { aftur.addEventListener("click", endurstilla); }
  }

  function endurstilla() {
    valinn = -1;
    svid.setAttribute("data-valid", "false");
    merkjaVirkt(syndur);
    if (gsapTilbuid && !minniHreyfing) {
      gsap.to(glod, { opacity: .3, duration: .8, overwrite: "auto" });
    }
    birtaTexta(visbending());
    var hnappar = markSvaedi.querySelectorAll(".finna-mark");
    if (hnappar[syndur]) { hnappar[syndur].focus(); }
  }

  /* ── Byggja eiginleikahnappana ── */
  if (markSvaedi) {
    steinar.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "finna-mark";
      b.style.setProperty("--x", s.x);
      b.style.setProperty("--y", s.y);
      b.style.setProperty("--steinn", s.litur);
      b.setAttribute("aria-pressed", "false");
      b.setAttribute("data-virkt", "false");
      b.innerHTML =
        '<span class="finna-mark-takn" aria-hidden="true">' +
          '<svg viewBox="0 0 20 26" focusable="false">' +
            '<path d="M10 1 L18 9 L15 25 L5 25 L2 9 Z" fill="none" stroke="currentColor" stroke-width="1.1"/>' +
            '<path d="M2 9 L10 6.4 L18 9 M10 6.4 L10 25" fill="none" stroke="currentColor" stroke-width=".7" opacity=".6"/>' +
          "</svg>" +
        "</span>" +
        '<span class="finna-mark-nafn">' + s.eiginleiki + "</span>";

      if (bendingStudd) {
        b.addEventListener("mouseenter", function () { forskoda(i, b); });
        b.addEventListener("mouseleave", slokkvaGull);
        b.addEventListener("focus", function () { forskoda(i, b); });
        b.addEventListener("blur", slokkvaGull);
      }
      b.addEventListener("click", function () { velja(i); });
      markSvaedi.appendChild(b);
    });

    teikna();
    setjaLiti(SJALFGEFINN.litur, 0);
    finnaSvar.innerHTML = visbending();
  }

  /* ───────── Haus: fastur við skrun ───────── */
  var haus = document.getElementById("haus");
  function hausStada() {
    if (haus) haus.setAttribute("data-fast", window.scrollY > 40 ? "true" : "false");
  }
  hausStada();
  window.addEventListener("scroll", hausStada, { passive: true });

  /* ───────── Valmynd á farsíma ───────── */
  var vHnappur = document.getElementById("valmyndarhnappur");
  var vFarsimi = document.getElementById("valmynd-farsimi");
  if (vHnappur && vFarsimi) {
    vHnappur.addEventListener("click", function () {
      var opid = vHnappur.getAttribute("aria-expanded") === "true";
      vHnappur.setAttribute("aria-expanded", String(!opid));
      vFarsimi.hidden = opid;
      vHnappur.querySelector(".sr").textContent = opid ? "Opna valmynd" : "Loka valmynd";
    });
    Array.prototype.forEach.call(vFarsimi.querySelectorAll("a"), function (a) {
      a.addEventListener("click", function () {
        vHnappur.setAttribute("aria-expanded", "false");
        vFarsimi.hidden = true;
      });
    });
  }

  /* ───────── Bókunarform ───────── */
  var form = document.getElementById("bokun-form");
  var svar = document.getElementById("bokun-svar");
  var NETFANG = "radgjof@kristalar.is"; /* TODO RAUNGÖGN */

  function villa(reitur, textiEl, skilabod) {
    if (skilabod) {
      reitur.setAttribute("aria-invalid", "true");
      textiEl.textContent = skilabod;
      textiEl.hidden = false;
    } else {
      reitur.removeAttribute("aria-invalid");
      textiEl.hidden = true;
    }
    return !skilabod;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nafn = document.getElementById("nafn");
      var netfang = document.getElementById("netfang");
      var erindi = document.getElementById("erindi");

      var ok = true;
      ok = villa(nafn, document.getElementById("villa-nafn"),
        nafn.value.trim() ? "" : "Sláðu inn nafnið þitt.") && ok;
      ok = villa(netfang, document.getElementById("villa-netfang"),
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(netfang.value.trim()) ? "" : "Sláðu inn gilt netfang.") && ok;
      ok = villa(erindi, document.getElementById("villa-erindi"),
        erindi.value.trim() ? "" : "Segðu okkur í stuttu máli hvað þú vilt ræða.") && ok;

      if (!ok) {
        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }

      /* Engin bakendaþjónusta til staðar — við undirbúum tölvupóst í staðinn. */
      var simi = document.getElementById("simi").value.trim();
      var texti =
        "Nafn: " + nafn.value.trim() + "\n" +
        "Netfang: " + netfang.value.trim() + "\n" +
        (simi ? "Sími: " + simi + "\n" : "") +
        "\nErindi:\n" + erindi.value.trim() + "\n";

      window.location.href = "mailto:" + NETFANG +
        "?subject=" + encodeURIComponent("Beiðni um kristalaráðgjöf") +
        "&body=" + encodeURIComponent(texti);

      svar.hidden = false;
      svar.textContent =
        "Við opnuðum tölvupóst með beiðninni þinni. Sendu hann á okkur og við höfum " +
        "samband með lausa tíma. Opnist hann ekki, sendu þá línu á " + NETFANG + ".";
    });
  }

  /* ───────── Skráning á póstlista ─────────
     Sama mynstur og bókunarformið. Engin bakendaþjónusta er tengd ennþá,
     svo við sýnum staðfestingarskrefið (double opt-in) hérna á síðunni. */
  var sForm = document.getElementById("skra-form");

  if (sForm) {
    sForm.addEventListener("submit", function (e) {
      e.preventDefault();

      /* Gildran: sé hún útfyllt er þetta vélmenni. Við látum sem ekkert sé. */
      if (document.getElementById("s-vefsida").value) return;

      var nafn = document.getElementById("s-nafn");
      var netfang = document.getElementById("s-netfang");
      var samthykki = document.getElementById("s-samthykki");
      var ahugi = sForm.querySelectorAll('input[name="ahugi"]:checked');

      var ok = true;
      ok = villa(nafn, document.getElementById("villa-s-nafn"),
        nafn.value.trim() ? "" : "Sláðu inn fornafnið þitt.") && ok;
      ok = villa(netfang, document.getElementById("villa-s-netfang"),
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(netfang.value.trim()) ? "" : "Sláðu inn gilt netfang.") && ok;

      var ahugiVilla = document.getElementById("villa-ahugi");
      if (!ahugi.length) {
        ahugiVilla.textContent = "Veldu að minnsta kosti eitt, svo við vitum hverju við eigum að senda þér.";
        ahugiVilla.hidden = false;
        ok = false;
      } else {
        ahugiVilla.hidden = true;
      }

      var sVilla = document.getElementById("villa-s-samthykki");
      if (!samthykki.checked) {
        sVilla.textContent = "Við megum ekki senda þér póst nema þú samþykkir þetta.";
        sVilla.hidden = false;
        samthykki.closest(".val").classList.add("villugildi");
        ok = false;
      } else {
        sVilla.hidden = true;
        samthykki.closest(".val").classList.remove("villugildi");
      }

      if (!ok) {
        var fyrsta = sForm.querySelector('[aria-invalid="true"]') ||
          (!ahugi.length ? document.getElementById("ahugi").querySelector("input") : samthykki);
        if (fyrsta) fyrsta.focus();
        return;
      }

      var sSvar = document.getElementById("skra-svar");
      sSvar.hidden = false;
      sSvar.textContent =
        "Næstum því búið. Við sendum staðfestingarpóst á " + netfang.value.trim() +
        ". Smelltu á hlekkinn í honum og þá ertu komin eða kominn á listann. " +
        "Sjáirðu hann ekki eftir nokkrar mínútur, kíktu þá í ruslpóstinn.";
      sForm.querySelector('button[type="submit"]').disabled = true;
      sSvar.focus();
    });
  }

  /* ───────── Ártal í fæti ───────── */
  var ar = document.getElementById("ar");
  if (ar) ar.textContent = new Date().getFullYear();

  /* ═══════════ HREYFINGAR ═══════════ */
  if (!gsapTilbuid || minniHreyfing) {
    /* Án GSAP eða með minni hreyfingu: allt sýnilegt strax. */
    Array.prototype.forEach.call(document.querySelectorAll("[data-birta]"), function (el) {
      el.style.opacity = 1;
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.addEventListener("refresh", jafnaAkkeri);

  /* Hetjan má aldrei bíða eftir hreyfingu. Ekkert í henni er falið með opacity:0 —
     textinn er læsilegur við fyrstu teiknun, hvort sem GSAP kemst að eða ekki.
     Hreyfingin er því aðeins tilfærsla og aðdráttur, hrein skreyting ofan á læsilega síðu. */
  if (document.querySelector(".hetja")) {   /* ferðasíðan hefur enga hetju */
    gsap.timeline({ defaults: { ease: "power2.out" } })
      .from(".hetja-mynd img", { scale: 1.16, duration: 2.4 }, 0)
      .from(".hetja-fyrirsogn .lina", { y: 20, duration: .7, stagger: .08 }, 0)
      .from(".hetja-texti", { y: 14, duration: .7 }, .1)
      .from(".hetja-hnappar", { y: 14, duration: .7 }, .18)
      .from(".hetja-skref li", { y: 14, duration: .7, stagger: .07 }, .24);
  }

  /* Hógvær birting á köflum — engin renna á hverjum einasta hlut */
  Array.prototype.forEach.call(document.querySelectorAll("[data-birta]"), function (el) {
    gsap.from(el, {
      opacity: 0, y: 12, duration: .55, ease: "power1.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true }
    });
  });

  /* Steinninn: eina stóra uppbyggingin á síðunni */
  if (svid) {
    gsap.timeline({
      scrollTrigger: { trigger: svid, start: "top 74%", once: true },
      defaults: { ease: "expo.out" }
    })
      .from(kjarni, { opacity: 0, scale: .7, duration: 1.2 }, 0)
      .from(".finna-mark", {
        opacity: 0, scale: .55, duration: .8, stagger: { each: .07 },
        /* Innkoman ma ekki skilja eftir opacity:1 i style-eigindinu, annars
           gengur CSS-reglan sem deyfir ovalda eiginleika ekki upp. */
        clearProps: "opacity,transform"
      }, .4)
      .from(finnaSvar, { opacity: 0, y: 14, duration: .7 }, .7);

    /* Haeğt flot og hæg snúningur — steinninn má aldrei standa grafkyrr. */
    gsap.to(flot, { y: -10, duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(flot, { rotate: 2.2, duration: 7.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

    /* Hliðfærsla: glóðin, steinninn og viðmótið hreyfast á mismunandi hraða. */
    if (bendingStudd) {
      var kx = gsap.quickTo(kjarni, "x", { duration: .9, ease: "power3.out" });
      var ky = gsap.quickTo(kjarni, "y", { duration: .9, ease: "power3.out" });
      var gx = gsap.quickTo(glod, "x", { duration: 1.5, ease: "power3.out" });
      var gy = gsap.quickTo(glod, "y", { duration: 1.5, ease: "power3.out" });
      var sn = gsap.quickTo("#finna-steinn", "rotate", { duration: 1.3, ease: "power3.out" });

      svid.addEventListener("pointermove", function (e) {
        var r = svid.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - .5;
        var ny = (e.clientY - r.top) / r.height - .5;
        kx(nx * 20); ky(ny * 16);
        gx(nx * 34); gy(ny * 28);
        sn(nx * 4.5);
      }, { passive: true });

      svid.addEventListener("pointerleave", function () {
        kx(0); ky(0); gx(0); gy(0); sn(0);
      });
    }
  }

  /* Mjúkt aðdráttarskrið á myndum */
  gsap.utils.toArray([".radgjof-mynd img", ".heimsokn-mynd img"]).forEach(function (mynd) {
    gsap.from(mynd, {
      scale: 1.1, duration: 1,
      scrollTrigger: { trigger: mynd, start: "top 88%", end: "bottom top", scrub: 1 }
    });
  });

  }

  saekjaSofn(SOFN, keyra);
})();
