import { mountTopbar, getToken, getJSON, postFile, $, setMsg, API_COOP, API_USUARIOS } from './common.js';

document.addEventListener('DOMContentLoaded', init);

async function init () {
  mountTopbar('home');

  const token  = getToken();
  const gate   = $('#gate');
  const atajos = $('#atajos');

  setMsg($('#ai-estado'), 'Verificando…', 'ok');
  setMsg($('#pf-estado'), 'Verificando…', 'ok');
  if ($('#un-estado')) setMsg($('#un-estado'), 'Verificando…', 'ok');

  if (!token) {
    const msg = 'No hay sesión. Iniciá desde la Landing.';
    setMsg($('#ai-estado'), msg, 'bad');
    setMsg($('#pf-estado'), msg, 'bad');
    if ($('#un-estado')) setMsg($('#un-estado'), msg, 'bad');
    pintarNombre('');
    gate?.classList.remove('hidden');
    atajos?.classList.add('hidden');
    return;
  }

  await cargarNombre(token);
  await cargarEstado(token, gate, atajos);
  await cargarUnidad(token);

  $('#form-ai')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const msg = $('[data-msg-ai]');
    const btn = f.querySelector('button[type="submit"]');

    const monto = Number((f.monto?.value || '').toString().replace(',', '.'));
    const file  = f.archivo?.files?.[0];
    if (!Number.isFinite(monto) || monto < 0) return setMsg(msg, 'Monto inválido.', 'bad');
    if (!file) return setMsg(msg, 'Adjuntá PDF/JPG/PNG (≤8 MB).', 'bad');

    const fd = new FormData(f);
    fd.set('monto', String(monto));
    fd.set('tipo', 'aporte_inicial');

    setMsg(msg, 'Subiendo…');
    btn?.setAttribute('disabled','disabled');
    try {
      await postFile(`${API_COOP}/comprobantes`, fd, token);
      setMsg(msg, '¡Enviado! Queda en revisión.', 'good');
      f.reset();
      await cargarEstado(token, gate, atajos);

    } catch (err) {
      setMsg(msg, err?.msg || err?.message || 'Error al subir.', 'bad');
    } finally {
      btn?.removeAttribute('disabled');
    }
  });
}

async function cargarNombre(token) {
  try {
    const r = await getJSON(`${API_USUARIOS}/perfil`, token);
    const nombre = r?.user?.nombre || '';
    const el = $('#nombre-socio'); 
    if (el) el.textContent = nombre;
  } catch { }
}

async function cargarEstado(token, gate, atajos) {
  const r = await getJSON(`${API_COOP}/estado-inicial`, token);
  const e = r.estado;

  setMsg($('#ai-estado'), texto(e.aporte_inicial), estilo(e.aporte_inicial));
  setMsg($('#pf-estado'), texto(e.perfil),         estilo(e.perfil));

  if ($('#un-estado')) {
    const unTxt = e.unidad === 'asignada' ? 'Asignada ✔' : 'Sin unidad asignada.';
    setMsg($('#un-estado'), unTxt, e.unidad === 'asignada' ? 'good' : 'ok');
  }

  if (r.ready_for_dashboard) {
    gate?.classList.add('hidden');
    atajos?.classList.remove('hidden');
  } else {
    atajos?.classList.add('hidden');
    gate?.classList.remove('hidden');
  }
}

async function cargarUnidad(token) {
  const card = $('#card-unidad');
  if (!card) return;      

  const msg  = $('#un-estado');  
  const det  = $('#un-detalle'); 

  card.hidden = false;   

  try {
    const r = await getJSON(`${API_COOP}/unidad/mia`, token);

    if (!r?.unidad) {
      setMsg(msg, 'Sin unidad asignada.', 'ok');
      det.innerHTML = '';
      return;
    }

    const u = r.unidad;
    setMsg(msg, 'Asignada ✔', 'good');
    det.innerHTML = `
      <div><strong>Código:</strong> ${u.codigo ?? '-'}</div>
      <div><strong>Descripción:</strong> ${u.descripcion ?? '-'}</div>
      <div><strong>Dormitorios:</strong> ${u.dormitorios ?? '-'}</div>
      <div><strong>Superficie:</strong> ${u.m2 ? (u.m2 + ' m²') : '-'}</div>
      <div><strong>Estado:</strong> ${u.estado_unidad ?? '-'}</div>
      <div><strong>Asignada el:</strong> ${u.fecha_asignacion ?? '-'}</div>
    `;
  } catch (err) {
    const blocked = (err?.status === 401 || err?.status === 403);
    setMsg(msg, blocked ? 'Disponible cuando tu cuenta esté aprobada.' : 'No se pudo cargar la unidad.', 'ok');
    det.innerHTML = '';
  }
}

function texto(x) {
  return {
    no_presentado: 'Falta subir el comprobante.',
    pendiente:     'En revisión.',
    aprobado:      'Aprobado',
    rechazado:     'Rechazado',
    incompleto:    'Faltan cargar sus datos personales'
  }[x] || x;
}

function estilo(x) {
  if (x === 'aprobado') return 'good';
  if (x === 'rechazado') return 'bad';
  return 'ok';
}