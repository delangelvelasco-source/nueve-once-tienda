(function(){
  function esc2(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function refGraphic(p){
    const name=esc2(p.inspiration||'Fragancia de inspiración');
    const brand=esc2(p.brand||'Marca de referencia');
    const initials=esc2((p.inspiration||'N').split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase());
    return `<div class="reference-graphic" aria-label="Ficha gráfica de referencia de ${name}">
      <div class="rg-glow"></div>
      <div class="rg-bottle">
        <div class="rg-cap"></div>
        <div class="rg-neck"></div>
        <div class="rg-body"><div class="rg-mark">${initials}</div><div class="rg-name">${name}</div><div class="rg-brand">${brand}</div></div>
      </div>
      <div class="rg-copy"><span>REFERENCIA OLFATIVA</span><strong>${name}</strong><small>${brand}</small></div>
    </div>`;
  }
  window.showDetail=function(p){
    const img=p.category==="HOMBRE"?"hombre.PNG":"mujer.PNG";
    const refUrl=typeof referenceUrl==='function'?referenceUrl(p):'#';
    document.getElementById("modalcontent").innerHTML=`
      <div><img class="modalimg" src="${img}" alt="${esc2(p.name)} Nueve Once"></div>
      <div>
        <div class="cat">${esc2(p.category)}</div>
        <h2 style="color:var(--deep);font-family:Georgia,serif;font-size:34px;margin:8px 0 12px">${esc2(p.name)}</h2>
        <p><b>Inspiración:</b> ${esc2(p.inspiration)}</p>
        <p><b>Marca de referencia:</b> ${esc2(p.brand)}</p>
        <div class="price" style="font-size:25px;margin:18px 0">$300.00 MXN</div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:16px"><button onclick='addToCart(${JSON.stringify(p)})' class="add" style="border:0;border-radius:11px;padding:12px 18px;cursor:pointer;font-weight:800">Agregar a mi bolsa</button></div>
        <div class="reference-note"><b>Fragancia de inspiración</b><br>Nuestras fragancias son creaciones de Nueve Once inspiradas en referencias olfativas reconocidas. No estamos afiliados, asociados ni respaldados por las marcas mencionadas.</div>
        <div class="notes" style="margin-top:16px"><b>Notas aromáticas</b><br>${esc2(p.notes)}</div>
        <div class="modal-reference open" id="referenceBox">
          <div class="modal-reference-head" onclick="document.getElementById('referenceBox').classList.toggle('open')">
            <div><div class="reference-label">REFERENCIA DE INSPIRACIÓN</div><div class="modal-reference-title">${esc2(p.inspiration)}</div><div class="modal-reference-sub">Ficha gráfica original para identificar visualmente la referencia.</div></div>
            <span style="font-size:18px;color:var(--deep)">⌃</span>
          </div>
          <div class="modal-reference-body" style="display:block">
            ${refGraphic(p)}
            <div class="reference-note" style="margin-top:10px">Esta es una representación gráfica original de Nueve Once; no es una fotografía ni una reproducción del envase de la marca de referencia.</div>
            <a class="reference-link" href="${refUrl}" target="_blank" rel="noopener noreferrer">Ver referencia en el sitio de la marca ↗</a>
          </div>
        </div>
      </div>`;
    document.getElementById("modal").classList.add("open");
  };
})();
