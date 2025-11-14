export function verify(){
  setTimeout(()=>{
    try{
      const el=document.querySelector('footer a[data-dev]');
      if(!el||el.getAttribute('data-dev')!=='R1NhbnRvcw=='||!el.textContent.includes('GSantos')){
        console.warn('Dev signature missing');
      }
    }catch(e){}
  },3000);
}
