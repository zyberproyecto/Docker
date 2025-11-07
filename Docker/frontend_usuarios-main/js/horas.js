import { mountTopbar, getToken, getJSON, postJSON, $, setMsg, API_COOP } from './common.js';
mountTopbar("horas");
const token = getToken();

$('#fh')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const f = e.target, m = $('#mh'); setMsg(m,"Enviando…");
  const payload = {
    semana_inicio: f.semana_inicio.value,
    horas_reportadas: Number(f.horas_reportadas.value || 0),
    motivo: f.motivo.value.trim()
  };
  try{
    await postJSON(`${API_COOP}/horas`, payload, token);
    setMsg(m,"¡Registrado!",'good'); f.reset(); await loadList();
  }catch(err){
    const em = err?.errors?.semana_inicio?.[0] || err?.errors?.horas_reportadas?.[0] ||
               err?.errors?.motivo?.[0] || err?.message || "No se pudo registrar";
    setMsg(m, em,'bad');
  }
});

async function loadList(){
  try{
    const r = await getJSON(`${API_COOP}/horas/mias`, token);
    const arr = r?.items || r || [];
    $('#tabla').innerHTML = arr.map(h=>`
      <div class="row">
        <div class="cell key">${h.semana_inicio} → ${h.semana_fin || ""}</div>
        <div class="cell">${h.horas_reportadas} hs — <strong>${h.estado}</strong>${h.motivo?` — <em>${h.motivo}</em>`:""}</div>
      </div>`).join('') || "<div class='row'><div class='cell'>Sin registros</div></div>";
  }catch{ $('#tabla').innerHTML = "<p>Error listando.</p>"; }
}
loadList();