import { mountTopbar, getToken, getJSON, $, API_COOP } from './common.js';
mountTopbar("unidad");
const token = getToken();

async function load(){
  try{
    const r = await getJSON(`${API_COOP}/unidad/mia`, token);
    const u = r?.unidad || null;
    if(!u){ $('#tbl').innerHTML = "<div class='row'><div class='cell'>Sin asignar</div></div>"; return; }
    $('#tbl').innerHTML = `
      <div class="row"><div class="cell key">Código</div><div class="cell">${u.codigo}</div></div>
      <div class="row"><div class="cell key">Dormitorios</div><div class="cell">${u.dormitorios}</div></div>
      <div class="row"><div class="cell key">Superficie (m²)</div><div class="cell">${u.m2}</div></div>
      <div class="row"><div class="cell key">Estado</div><div class="cell">${u.estado_unidad || u.estado || "—"}</div></div>
      <div class="row"><div class="cell key">Fecha asignación</div><div class="cell">${r?.fecha_asignacion || "—"}</div></div>`;
  }catch{ $('#tbl').innerHTML = "<p>Error consultando.</p>"; }
}
load();