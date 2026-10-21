// Devuelve una tabla HTML. Solo incorpora números validados en el contenido.
function generarTabla(numero, hasta) {
  if (!Number.isFinite(numero)) {
    return "Ingresa un número válido.";
  }
  if (!Number.isInteger(hasta) || hasta < 1 || hasta > 20) {
    return "El límite debe ser un entero entre 1 y 20.";
  }
  if (!Number.isFinite(numero * hasta)) {
    return "El número es demasiado grande para generar la tabla.";
  }

  let filas = "";
  for (let multiplicador = 1; multiplicador <= hasta; multiplicador++) {
    // El formato evita residuos de decimales como 0.30000000000000004.
    const producto = Number((numero * multiplicador).toFixed(10));
    filas += `<tr><td>${numero} × ${multiplicador}</td><td>${producto}</td></tr>`;
  }

  return `<table><caption>Tabla del ${numero} hasta ${hasta}</caption>` +
    '<thead><tr><th scope="col">Multiplicación</th><th scope="col">Resultado</th></tr></thead>' +
    `<tbody>${filas}</tbody></table>`;
}

// El formulario lee los datos; la función anterior solo calcula y devuelve.
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const error = document.querySelector("#error");

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  error.textContent = "";
  resultado.textContent = "";
  const textoNumero = document.querySelector("#numero").value.trim();
  const textoHasta = document.querySelector("#hasta").value.trim();
  if (textoNumero === "" || textoHasta === "") {
    error.textContent = "Completa el número y el límite de la tabla.";
    return;
  }
  const numero = Number(textoNumero);
  const hasta = Number(textoHasta);
  const tabla = generarTabla(numero, hasta);
  if (!tabla.startsWith("<table>")) {
    error.textContent = tabla;
    return;
  }
  // innerHTML es necesario para mostrar la tabla devuelta por la función.
  // El HTML se construye con datos numéricos validados, no con texto del usuario.
  resultado.innerHTML = tabla;
});

formulario.addEventListener("reset", () => {
  error.textContent = "";
  resultado.textContent = "Completa el formulario y pulsa Calcular.";
});
