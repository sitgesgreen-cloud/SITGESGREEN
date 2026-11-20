/* Sección de opiniones: botón + QR para dejar opinión, y opiniones aprobadas desde Supabase */
(function(){
  var TXT={
    es:{h:"¿Eres cliente nuestro?",p:"Cuéntanos qué tal fue. Escanea el código con el móvil o pulsa el botón.",b:"Dejar mi opinión",alt:"Código QR para dejar una opinión"},
    ca:{h:"Ets client nostre?",p:"Explica'ns què tal va ser. Escaneja el codi amb el mòbil o prem el botó.",b:"Deixar la meva opinió",alt:"Codi QR per deixar una opinió"},
    en:{h:"Are you a customer?",p:"Tell us how it went. Scan the code with your phone or tap the button.",b:"Leave my review",alt:"QR code to leave a review"}
  };
  var sec=document.getElementById("opiniones"); if(!sec) return;
  var grid=sec.querySelector(".opiniones-grid");

  var css=document.createElement("style");
  css.textContent=
   ".op-cta{display:flex;align-items:center;gap:32px;margin-top:48px;padding:28px 32px;background:var(--deep);color:var(--on-deep);border-radius:24px}"+
   ".op-cta img{width:150px;height:150px;flex:none;border-radius:14px;background:#fff;padding:8px}"+
   ".op-cta h3{font-size:1.7rem;margin-bottom:8px;color:var(--on-deep)}"+
   ".op-cta p{margin:0 0 18px;color:var(--on-deep);max-width:44ch}"+
   ".op-cta .btn{display:inline-block;background:var(--lime);color:#14201A}"+
   ".op-stars{color:#E0A800;letter-spacing:2px;margin-bottom:8px}"+
   "@media(max-width:560px){.op-cta{flex-direction:column;align-items:flex-start}.op-cta img{display:none}}";
  document.head.appendChild(css);

  var cta=document.createElement("div"); cta.className="op-cta";
  cta.innerHTML='<img src="qr-opiniones.png" width="132" height="132"><div><h3></h3><p></p><a class="btn" href="opinion.html"></a></div>';
  sec.appendChild(cta);

  function lang(){ var l=document.documentElement.lang; return TXT[l]?l:"es"; }
  function paint(){
    var t=TXT[lang()];
    cta.querySelector("h3").textContent=t.h;
    cta.querySelector("p").textContent=t.p;
    cta.querySelector("a").textContent=t.b;
    cta.querySelector("img").alt=t.alt;
  }
  paint();
  new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});

  /* las tarjetas escritas a mano en index.html se ignoran: solo se muestran las aprobadas */
  if(grid){ grid.innerHTML=""; grid.style.display="none"; }

  function pintar(list){
    if(!grid||!Array.isArray(list)) return;
    list.forEach(function(o){
      if(!o||!o.texto) return;
      var c=document.createElement("div"); c.className="opinion-card";
      var n=Math.max(0,Math.min(5,parseInt(o.estrellas,10)||0));
      if(n){var s=document.createElement("div"); s.className="op-stars"; s.setAttribute("aria-label",n+"/5"); s.textContent="★★★★★".slice(0,n); c.appendChild(s);}
      var p=document.createElement("p"); p.textContent=o.texto; c.appendChild(p);
      var a=document.createElement("div"); a.className="autor";
      var b=document.createElement("b"); b.textContent=o.nombre||""; a.appendChild(b);
      if(o.poblacion) a.appendChild(document.createTextNode(" — "+o.poblacion));
      c.appendChild(a); grid.appendChild(c);
    });
    if(grid.children.length) grid.style.display="";
  }

  /* opiniones aprobadas: Supabase (si está configurado) o, si no, opiniones.json */
  var url=window.SUPABASE_URL, key=window.SUPABASE_KEY;
  var conectado=url && key && url.indexOf("TU-PROYECTO")===-1 && key.indexOf("TU-CLAVE")===-1;
  var pedir = conectado
    ? fetch(url+"/rest/v1/opiniones?select=nombre,poblacion,estrellas,texto&aprobada=eq.true&order=created_at.desc&limit=12",{headers:{"apikey":key}})
    : fetch("opiniones.json",{cache:"no-cache"});
  pedir.then(function(r){return r.ok?r.json():[]}).then(pintar).catch(function(){});
})();