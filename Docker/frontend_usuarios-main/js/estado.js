import { mountTopbar, getToken, getJSON, $, API_COOP } from './common.js';
mountTopbar("estado");
const token = getToken();

function renderKPIs(arr){
  $('#kpis').innerHTML = arr.map(({name,val}) => `
    <div class="kpi"><div class="name">${name}</div><div class="val">${val}</div></div>
  `).join('');
}
async function load(){
  try{
    const list = await getJSON(`${API_COOP}/comprobantes/estado`, token);
    const items = (list?.items || list) || [];
    const count = (tipo, estado)=> items.filter(x=>x.tipo===tipo && x.estado===estado).length;
    renderKPIs([
      {name:"Mensuales aprobados", val: count('aporte_mensual','aprobado')},
      {name:"Mensuales pendientes",val: count('aporte_mensual','pendiente')},
      {name:"Compensatorios aprobados", val: count('compensatorio','aprobado')},
      {name:"Compensatorios pendientes",val: count('compensatorio','pendiente')},
    ]);
  }catch{ $('#kpis').innerHTML = "<p>Error.</p>"; }
}
load();