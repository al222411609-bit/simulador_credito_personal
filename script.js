document.getElementById('credit-form').addEventListener('submit', function (evento) {
  evento.preventDefault();
  procesarSimulacion();
});

function procesarSimulacion() {
  const nombre = document.getElementById('nombre').value.trim();
  const monto = parseFloat(document.getElementById('monto').value);
  const tasaAnual = parseFloat(document.getElementById('tasa').value) / 100;
  const plazoMeses = parseInt(document.getElementById('plazo').value);
  const IVA = 0.16;

  if (!nombre) {
    alert('Escribe tu nombre para continuar.');
    return;
  }

  if (isNaN(monto) || isNaN(tasaAnual) || monto <= 0) {
    alert('Ingresa datos numéricos válidos e intenta de nuevo.');
    return;
  }

  const abonoCapital = monto / plazoMeses;
  const tasaMensual = tasaAnual / 12;
  let saldo = monto;

  const tabla = document.querySelector('#tabla-amortizacion tbody');
  tabla.innerHTML = '';

  for (let mes = 1; mes <= plazoMeses; mes++) {
    const interes = saldo * tasaMensual;
    const iva = interes * IVA;
    const pagoMensual = abonoCapital + interes + iva;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${mes}</td>
      <td>$${abonoCapital.toFixed(2)}</td>
      <td>$${interes.toFixed(2)}</td>
      <td>$${iva.toFixed(2)}</td>
      <td>$${pagoMensual.toFixed(2)}</td>
    `;
    tabla.appendChild(fila);

    saldo -= abonoCapital;
  }

  document.getElementById('saludo').textContent = 'Esto es lo que pagarías, ' + nombre.split(' ')[0] + ':';
  document.getElementById('resultado').hidden = false;
}