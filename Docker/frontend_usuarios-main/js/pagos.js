import { mountTopbar, getToken, getJSON, postFile, $, setMsg, fmt, API_COOP } from './common.js';
mountTopbar("pagos");
const token = getToken();

function yyyymm(){ return new Date().toISOString().slice(0,7); }

async function loadList(){
  try{
    const list = await getJSON(`${API_COOP}/comprobantes/estado`, token);
    const arr = (list?.items || list) || [];
    $('#tabla').innerHTML = arr.map(x=>`
      <div class="row">
        <div class="cell key">${x.tipo} (${x.periodo})</div>
        <div class="cell">UYU ${fmt(x.monto)} — <strong>${x.estado}</strong></div>
      </div>`).join('') || "<div class='row'><div class='cell'>Sin registros</div></div>";
  }catch{ $('#tabla').innerHTML = "<p>Error listando.</p>"; }
}

$('#fm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const m = $('#mm'); setMsg(m,"Subiendo…");
  const fd = new FormData(e.target);
  fd.append('tipo','aporte_mensual');
  try{
    await postFile(`${API_COOP}/comprobantes`, fd, token);
    setMsg(m,"¡Enviado! Queda en revisión",'good');
    await loadList();
  }catch(err){ setMsg(m, err?.message || "No se pudo subir", 'bad'); }
});

if ($('#fm') && !$('#fm').periodo.value) $('#fm').periodo.value = yyyymm();
loadList();