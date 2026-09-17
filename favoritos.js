/* Nueve Once · Favoritos */
(function(){
  'use strict';
  const KEY='nueveOnceFavoritos';
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}};
  const save=a=>localStorage.setItem(KEY,JSON.stringify(a));
  window.NueveOnceFavoritos={
    has:id=>load().includes(Number(id)),
    toggle:id=>{id=Number(id);const a=load(),i=a.indexOf(id);i>=0?a.splice(i,1):a.push(id);save(a);return a.includes(id)},
    count:()=>load().length,
    all:()=>load()
  };
})();
