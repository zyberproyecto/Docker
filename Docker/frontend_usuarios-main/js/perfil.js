import {
  mountTopbar, getToken, getJSON, postJSON, $, setMsg, API_COOP
} from './common.js';

mountTopbar('perfil');
const token = getToken();

async function prefill() {
  try {
    const r = await getJSON(`${API_COOP}/perfil`, token); // <- API_COOP
    const p = r?.perfil || {};
    const f = $('#f');
    if (!f) return;

    f.ocupacion.value                   = p.ocupacion ?? '';
    f.ingresos_nucleo_familiar.value    = p.ingresos_nucleo_familiar ?? '';
    f.integrantes_familia.value         = p.integrantes_familia ?? '';
    f.contacto.value                    = p.contacto ?? '';
    f.direccion.value                   = p.direccion ?? '';
    f.acepta_declaracion_jurada.checked = !!p.acepta_declaracion_jurada;
    f.acepta_reglamento_interno.checked = !!p.acepta_reglamento_interno;
  } catch {
    // silencioso
  }
}

$('#f')?.addEventListener('submit', async (e) => {
  e.preventDefault(); // evita GET perfil.html?... y usamos fetch

  const f = e.target;
  const m = $('#m');
  setMsg(m, 'Guardando…');

  const payload = {
    ocupacion: f.ocupacion.value.trim(),
    ingresos_nucleo_familiar: Number(f.ingresos_nucleo_familiar.value ?? 0),
    integrantes_familia: Number(f.integrantes_familia.value ?? 0),
    contacto: f.contacto.value.trim(),
    direccion: f.direccion.value.trim(),
    acepta_declaracion_jurada: !!f.acepta_declaracion_jurada.checked,
    acepta_reglamento_interno: !!f.acepta_reglamento_interno.checked,
  };

  try {
    await postJSON(`${API_COOP}/perfil`, payload, token);

  // Mostrar mensaje un momento
  setMsg(m, '¡Enviado! Queda en revisión.', 'good');

  // Redirigir después de 1 segundo
  setTimeout(() => {
    window.location.href = 'index.html'; 
    // ⚠️ Cambiá 'index.html' por la página principal real (por ej. home.html)
  }, 1000);
  } catch (err) {
    const em =
      err?.errors?.ocupacion?.[0] ||
      err?.errors?.ingresos_nucleo_familiar?.[0] ||
      err?.errors?.integrantes_familia?.[0] ||
      err?.errors?.contacto?.[0] ||
      err?.errors?.direccion?.[0] ||
      err?.errors?.acepta_declaracion_jurada?.[0] ||
      err?.errors?.acepta_reglamento_interno?.[0] ||
      err?.message || 'No se pudo guardar.';
    setMsg(m, em, 'bad');
  }
});

prefill();