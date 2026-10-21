// La función recibe una nota y devuelve su clasificación sin leer el DOM.
function clasificarNota(nota) {
  if (!Number.isFinite(nota) || nota < 0 || nota > 10) {
    return "Nota no válida";
  } else if (nota >= 9) {
    return "Excelente";
  } else if (nota >= 7) {
    return "Aprobado";
  } else if (nota >= 5) {
    return "En recuperación";
  } else {
    return "Reprobado";
  }
}

// El formulario lee los datos; la función anterior solo calcula y devuelve.
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const error = document.querySelector("#error");

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  error.textContent = "";
  resultado.textContent = "";
  const textoNota = document.querySelector("#nota").value.trim();
  if (textoNota === "") {
    error.textContent = "Ingresa una nota.";
    return;
  }
  const nota = Number(textoNota);
  resultado.textContent = clasificarNota(nota);
});

formulario.addEventListener("reset", () => {
  error.textContent = "";
  resultado.textContent = "Completa el formulario y pulsa Calcular.";
});
