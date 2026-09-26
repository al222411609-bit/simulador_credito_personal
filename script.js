const IVA_TASA = 0.16;

const formatoMoneda = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

document.getElementById('credit-form').addEventListener('submit', (evento) => {
  evento.preventDefault();
  procesarSimulacion();
});

function procesarSimulacion() {
  const nombre = document.getElementById('nombre').value.trim();
  const monto = parseFloat(document.getElementById('monto').value);
  const tasaAnual = parseFloat(document.getElementById('tasa').value) / 100;
  const plazoMeses = parseInt(document.getElementById('plazo').value, 10);

  if (!nombre) {
    alert('Ingresa tu nombre completo para continuar.');
    return;
  }

  if (isNaN(monto) || isNaN(tasaAnual) || monto <= 0 || plazoMeses <= 0) {
    alert('Ingresa parámetros numéricos válidos e intenta nuevamente.');
    return;
  }

  const primerNombre = nombre.split(' ')[0];
  document.getElementById('saludo').textContent =
    `Resumen de tu simulación, ${primerNombre}:`;

  const amortizacionCapital = monto / plazoMeses;
  const tasaMensual = tasaAnual / 12;

  let saldoInsoluto = monto;
  let totalInteres = 0;
  let totalIva = 0;
  let totalPagado = 0;
  let pagoInicial = 0;
  let pagoFinal = 0;

  const filas = [];

  for (let periodo = 1; periodo <= plazoMeses; periodo++) {
    const interesDelPeriodo = saldoInsoluto * tasaMensual;
    const ivaDelPeriodo = interesDelPeriodo * IVA_TASA;
    const pagoMensual = amortizacionCapital + interesDelPeriodo + ivaDelPeriodo;
    const saldoFinalPeriodo = Math.max(0, saldoInsoluto - amortizacionCapital);

    filas.push({
      periodo,
      saldoInsoluto,
      amortizacionCapital,
      interesDelPeriodo,
      ivaDelPeriodo,
      pagoMensual,
      saldoFinalPeriodo,
    });

    if (periodo === 1) pagoInicial = pagoMensual;
    if (periodo === plazoMeses) pagoFinal = pagoMensual;

    totalInteres += interesDelPeriodo;
    totalIva += ivaDelPeriodo;
    totalPagado += pagoMensual;

    saldoInsoluto = saldoFinalPeriodo;
  }

  renderResumen({ pagoInicial, pagoFinal, totalInteres, totalPagado });
  renderTabla(filas);

  document.getElementById('resultado').hidden = false;
}

function renderResumen({ pagoInicial, pagoFinal, totalInteres, totalPagado }) {
  document.getElementById('pago-inicial').textContent = formatoMoneda.format(pagoInicial);
  document.getElementById('pago-final').textContent = formatoMoneda.format(pagoFinal);
  document.getElementById('total-interes').textContent = formatoMoneda.format(totalInteres);
  document.getElementById('total-pagado').textContent = formatoMoneda.format(totalPagado);
}

function renderTabla(filas) {
  const cuerpo = document.querySelector('#tabla-amortizacion tbody');
  cuerpo.innerHTML = '';

  filas.forEach((fila) => {
    const renglon = document.createElement('tr');
    renglon.innerHTML = `
      <td>${fila.periodo}</td>
      <td>${formatoMoneda.format(fila.saldoInsoluto)}</td>
      <td>${formatoMoneda.format(fila.amortizacionCapital)}</td>
      <td>${formatoMoneda.format(fila.interesDelPeriodo)}</td>
      <td>${formatoMoneda.format(fila.ivaDelPeriodo)}</td>
      <td>${formatoMoneda.format(fila.pagoMensual)}</td>
      <td>${formatoMoneda.format(fila.saldoFinalPeriodo)}</td>
    `;
    cuerpo.appendChild(renglon);
  });
}