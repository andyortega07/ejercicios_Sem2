// Redondea hacia arriba: cualquier fracción de hora cuenta como una hora.
function horasACobrar(minutos) {
  if (!Number.isFinite(minutos) || minutos < 0) {
    return "Ingresa una cantidad de minutos igual o mayor que cero.";
  }
  const horas = Math.ceil(minutos / 60);
  if (!Number.isSafeInteger(horas)) {
    return "El tiempo está fuera del rango permitido.";
  }
  return horas;
}

// Reutiliza horasACobrar y aplica un máximo de $5.00 por bloque de 24 horas.
function calcularTarifa(minutos) {
  const horas = horasACobrar(minutos);
  if (typeof horas === "string") {
    return horas;
  }
  if (horas === 0) {
    return 0;
  }

  const diasCompletos = Math.floor(horas / 24);
  const horasRestantes = horas % 24;
  let tarifa = diasCompletos * 5;
  if (horasRestantes > 0) {
    const tarifaRestante = 1 + (horasRestantes - 1) * 0.50;
    tarifa += Math.min(tarifaRestante, 5);
  }
  return tarifa;
}

// El formulario lee los datos; la función anterior solo calcula y devuelve.
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const error = document.querySelector("#error");

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  error.textContent = "";
  resultado.textContent = "";
  const textoMinutos = document.querySelector("#minutos").value.trim();
  if (textoMinutos === "") {
    error.textContent = "Ingresa el tiempo de estacionamiento.";
    return;
  }
  const minutos = Number(textoMinutos);
  const tarifa = calcularTarifa(minutos);
  if (typeof tarifa === "string") {
    error.textContent = tarifa;
    return;
  }
  const horas = horasACobrar(minutos);
  resultado.textContent = `Horas a cobrar: ${horas}\nTarifa: $${tarifa.toFixed(2)}`;
});

formulario.addEventListener("reset", () => {
  error.textContent = "";
  resultado.textContent = "Completa el formulario y pulsa Calcular.";
});
