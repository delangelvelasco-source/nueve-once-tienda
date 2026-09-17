/* Nueve Once — blindaje definitivo de interacciones */
(function(){
  'use strict';
  const state={category:'TODOS'};
  const all=()=>window.PRODUCTS||[];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const getArr=()=>{
    const search=document.getElementById('search');
    const sort=document.getElementById('sort');
    const q=(search?.value||'').toLowerCase().trim();
    let arr=all().filter(p=>(state.category==='TODOS'||p.category===state.category)&&(!q||[p.name,p.inspiration,p.brand,p.notes,p.category].join(' ').toLowerCase().includes(q)));
    const sv=sort?.value||'name';
    arr.sort((a,b)=>sv==='new'?Number(b.new)-Number(a.new)||String(a.name).localeCompare(String(b.name)):sv==='brand'?String(a.brand).localeCompare(String(b.brand))||String(a.name).localeCompare(String(b.name)):String(a.name).localeCompare(String(b.name)));
    return arr;
  };
  function renderSafe(){
    const grid=document.getElementById('grid'); if(!grid)return;
    const arr=getArr();
    grid.innerHTML=arr.map(p=>{
      const pi=all().indexOf(p);
      const image=p.category==='HOMBRE'?'hombre.PNG':p.category==='MUJER'?'mujer.PNG':null;
      const visual=image?`<img src="${image}" alt="${esc(p.name)} Nueve Once" loading="lazy">`:`<img src="mujer.PNG" alt="Nueve Once Mujer 30 ml" loading="lazy"><img src="hombre.PNG" alt="Nueve Once Hombre 30 ml" loading="lazy">`;
      return `<article class="card" data-product-index="${pi}"><div class="product-visual ${image?'':'dual-image'}">${p.new?'<span class="new">NUEVO</span>':''}${visual}</div><div class="cardbody"><div class="cat">${esc(p.category)}</div><h3>${esc(p.name)}</h3><div class="insp"><b>Inspiración:</b> ${esc(p.inspiration)} · ${esc(p.brand)}</div><div class="notes">${esc(p.notes)}</div><div class="price">$300.00 MXN</div><div class="actions"><button class="details" type="button" data-action="detail" data-product-index="${pi}">Detalles</button><button class="add" type="button" data-action="add" data-product-index="${pi}">Agregar</button></div></div></article>`;
    }).join('')||'<p>No encontramos fragancias con esa búsqueda.</p>';
  }
  function showDetailSafe(p){
    if(!p)return;
    const modal=document.getElementById('modal'), content=document.getElementById('modalcontent'); if(!modal||!content)return;
    const pi=all().indexOf(p);
    const img=p.category==='HOMBRE'?'hombre.PNG':'mujer.PNG';
    const query=encodeURIComponent(`${p.brand||''} ${p.inspiration||''} perfume bottle original`.trim());
    content.innerHTML=`<img class="modalimg" src="${img}" alt="${esc(p.name)} Nueve Once"><div><div class="cat">${esc(p.category)}</div><h2 style="color:var(--deep);font-family:Georgia,serif;font-size:34px;margin:8px 0">${esc(p.name)}</h2><p><b>Inspiración:</b> ${esc(p.inspiration)}<br><b>Marca:</b> ${esc(p.brand)}</p><p><b>Notas aromáticas</b></p><p style="line-height:1.7;color:#536360">${esc(p.notes)}</p><div class="price">$300.00 MXN</div><button id="modalAddButton" class="add" type="button" data-product-index="${pi}" style="width:100%;border:0;border-radius:13px;padding:13px;font-weight:800;cursor:pointer">Agregar a mi bolsa</button><div class="modal-reference"><div class="modal-reference-head"><div><div class="modal-reference-title">Ver botella original</div><div class="modal-reference-sub">Referencia visual del perfume de inspiración.</div></div></div><div class="modal-reference-body" style="display:block"><div class="reference-note">La referencia se abre en una página de imágenes para localizar el frasco original.</div><a class="reference-link" href="https://www.google.com/search?tbm=isch&q=${query}" target="_blank" rel="noopener">Ver botella original ↗</a></div></div></div>`;
    modal.classList.add('open');
  }
  function install(){
    const grid=document.getElementById('grid');
    if(grid&&!grid.dataset.n9Bound){
      grid.dataset.n9Bound='1';
      grid.addEventListener('click',e=>{
        const b=e.target.closest('button[data-action]'); if(!b)return;
        e.preventDefault(); e.stopImmediatePropagation();
        const p=all()[Number(b.dataset.productIndex)]; if(!p)return;
        if(b.dataset.action==='detail') window.showDetail?.({...p,price:300});
        if(b.dataset.action==='add') window.addToCart?.({...p,price:300});
      },true);
    }
    const modal=document.getElementById('modal');
    if(modal&&!modal.dataset.n9Bound){
      modal.dataset.n9Bound='1';
      modal.addEventListener('click',e=>{
        if(e.target===modal||e.target.closest('.modalbox>.close')){e.preventDefault();e.stopImmediatePropagation();window.closeModal?.();return;}
        const add=e.target.closest('#modalAddButton');
        if(add){e.preventDefault();e.stopImmediatePropagation();const p=all()[Number(add.dataset.productIndex)];if(p){window.addToCart?.({...p,price:300});window.closeModal?.();}}
      },true);
    }
    if(!document.documentElement.dataset.n9Escape){
      document.documentElement.dataset.n9Escape='1';
      document.addEventListener('keydown',e=>{if(e.key==='Escape')window.closeModal?.();});
    }
  }
  function patch(){
    const originalSet=window.setCategory;
    if(originalSet&&!originalSet.__n9){const wrapped=function(c){state.category=c;return originalSet.apply(this,arguments)};wrapped.__n9=true;window.setCategory=wrapped;}
    window.render=renderSafe;
    window.showDetail=showDetailSafe;
    install();
    renderSafe();
    document.querySelectorAll('#grid button').forEach(b=>b.removeAttribute('onclick'));
    document.querySelectorAll('#modal .close').forEach(b=>b.removeAttribute('onclick'));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch,{once:true});else patch();
})();
