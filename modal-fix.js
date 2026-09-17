(function(){
  function closeDetail(){
    var modal=document.getElementById('modal');
    if(modal){
      modal.classList.remove('open');
      modal.style.display='none';
      document.body.style.overflow='';
    }
  }

  // Sobrescribe la función global para que el botón X siempre cierre el detalle.
  window.closeModal=closeDetail;

  document.addEventListener('DOMContentLoaded',function(){
    var modal=document.getElementById('modal');
    if(!modal) return;

    modal.addEventListener('click',function(e){
      if(e.target===modal) closeDetail();
    });

    // Delegación: funciona aunque el contenido del detalle se regenere.
    modal.addEventListener('click',function(e){
      var btn=e.target.closest('.close');
      if(btn){
        e.preventDefault();
        e.stopPropagation();
        closeDetail();
      }
    });

    document.addEventListener('keydown',function(e){
      if(e.key==='Escape' && modal.classList.contains('open')) closeDetail();
    });

    // Evita que el contenido interno interfiera con el botón de cierre.
    var style=document.createElement('style');
    style.textContent='.modal{pointer-events:auto!important}.modalbox{position:relative}.modalbox>.close{z-index:9999!important;pointer-events:auto!important;touch-action:manipulation}.modalbox>.close:hover{transform:scale(1.05)}';
    document.head.appendChild(style);
  });
})();
