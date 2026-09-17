/* Nueve Once · Favoritos */
(function(){
  'use strict';
  const KEY='nueveOnceFavoritos';
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]').map(Number)}catch(e){return[]}};
  const save=a=>localStorage.setItem(KEY,JSON.stringify(a));
  const api={
    has:id=>load().includes(Number(id)),
    toggle:id=>{id=Number(id);const a=load(),i=a.indexOf(id);i>=0?a.splice(i,1):a.push(id);save(a);return a.includes(id)},
    count:()=>load().length,
    all:()=>load()
  };
  window.NueveOnceFavoritos=api;

  function syncCards(){
    document.querySelectorAll('#grid .card').forEach(card=>{
      const id=Number(card.dataset.id);
      let btn=card.querySelector('[data-favorite]');
      if(!btn){
        const visual=card.querySelector('.product-visual');
        if(!visual)return;
        btn=document.createElement('button');
        btn.type='button';
        btn.className='favorite-btn';
        btn.dataset.favorite=String(id);
        btn.setAttribute('aria-label','Agregar a favoritos');
        visual.appendChild(btn);
      }
      const active=api.has(id);
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',String(active));
      btn.setAttribute('aria-label',active?'Quitar de favoritos':'Agregar a favoritos');
      btn.textContent=active?'♥':'♡';
    });
    const counter=document.getElementById('favCount');
    if(counter)counter.textContent=api.count();
    const toggle=document.getElementById('favoritesToggle');
    if(toggle){
      const active=toggle.classList.contains('active');
      toggle.setAttribute('aria-pressed',String(active));
      toggle.innerHTML='❤️ Favoritos (<span id="favCount">'+api.count()+'</span>)';
      toggle.classList.toggle('active',active);
    }
  }

  function applyFavoriteFilter(){
    const toggle=document.getElementById('favoritesToggle');
    if(!toggle)return;
    toggle.addEventListener('click',function(){
      const on=!toggle.classList.contains('active');
      toggle.classList.toggle('active',on);
      toggle.setAttribute('aria-pressed',String(on));
      document.querySelectorAll('#grid .card').forEach(card=>{
        card.style.display=(!on||api.has(Number(card.dataset.id)))?'':'none';
      });
      toggle.innerHTML='❤️ Favoritos (<span id="favCount">'+api.count()+'</span>)';
    },{once:true});
  }

  function handleClicks(e){
    const btn=e.target.closest('[data-favorite]');
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    api.toggle(Number(btn.dataset.favorite));
    syncCards();
    applyFavoriteFilter();
  }

  function init(){
    const grid=document.getElementById('grid');
    if(grid){
      grid.addEventListener('click',handleClicks,true);
      new MutationObserver(function(){syncCards()}).observe(grid,{childList:true,subtree:true});
    }
    syncCards();
    applyFavoriteFilter();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
