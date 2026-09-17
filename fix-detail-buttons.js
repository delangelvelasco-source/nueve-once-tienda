/* Blindaje de interacciones del catálogo Nueve Once. */
(function(){
  function productFromCard(card){
    if(!card) return null;
    const name=(card.querySelector('h3')||{}).textContent?.trim();
    const cat=(card.querySelector('.cat')||{}).textContent?.trim();
    if(!name) return null;
    return (window.PRODUCTS||[]).find(p=>p.name===name && p.category===cat) || null;
  }

  function bind(){
    document.querySelectorAll('.details').forEach(btn=>{
      btn.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        const p=productFromCard(btn.closest('.card'));
        if(p && typeof window.showDetail==='function') window.showDetail({...p,price:300});
      };
    });
    document.querySelectorAll('.card .actions .add').forEach(btn=>{
      btn.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        const p=productFromCard(btn.closest('.card'));
        if(p && typeof window.addToCart==='function') window.addToCart({...p,price:300});
      };
    });
  }

  function patchRender(){
    if(typeof window.render!=='function') return false;
    if(window.__nueveOnceRenderPatched) return true;
    const original=window.render;
    window.render=function(){
      original.apply(this,arguments);
      bind();
    };
    window.__nueveOnceRenderPatched=true;
    return true;
  }

  function patchDetail(){
    if(typeof window.showDetail!=='function') return false;
    if(window.__nueveOnceDetailPatched) return true;
    const original=window.showDetail;
    window.showDetail=function(p){
      original.apply(this,arguments);
      const modal=document.getElementById('modal');
      if(!modal) return;
      const close=modal.querySelector('.close');
      if(close) close.onclick=function(e){e.preventDefault();e.stopPropagation();window.closeModal();};
      const add=modal.querySelector('.add');
      if(add && p){
        add.removeAttribute('onclick');
        add.onclick=function(e){e.preventDefault();e.stopPropagation();window.addToCart({...p,price:300});};
      }
    };
    window.__nueveOnceDetailPatched=true;
    return true;
  }

  function patchClose(){
    if(typeof window.closeModal!=='function') return false;
    if(window.__nueveOnceClosePatched) return true;
    const original=window.closeModal;
    window.closeModal=function(){
      const modal=document.getElementById('modal');
      if(modal) modal.classList.remove('open');
      try{original.apply(this,arguments);}catch(e){}
    };
    window.__nueveOnceClosePatched=true;
    return true;
  }

  function start(){
    patchRender();
    patchDetail();
    patchClose();
    bind();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  setTimeout(start,100);
  setTimeout(start,500);
})();
