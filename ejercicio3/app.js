// El operador corresponde al valor de la opción seleccionada: +, -, * o /.
function operar(a, b, operador) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return "Ingresa dos números válidos.";
  }

  let resultadoOperacion;
  switch (operador) {
    case "+":
      resultadoOperacion = a + b;
      break;
    case "-":
      resultadoOperacion = a - b;
      break;
    case "*":
      resultadoOperacion = a * b;
      break;
    case "/":
      if (b === 0) {
        return "No se puede dividir para 0";
      }
      resultadoOperacion = a / b;
      break;
    default:
      return "Operador no válido";
  }

  if (!Number.isFinite(resultadoOperacion)) {
    return "El resultado está fuera del rango permitido.";
  }
  return resultadoOperacion;
}

// El formulario lee los datos; la función anterior solo calcula y devuelve.
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const error = document.querySelector("#error");

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  error.textContent = "";
  resultado.textContent = "";
  const textoA = document.querySelector("#a").value.trim();
  const textoB = document.querySelector("#b").value.trim();
  const operador = document.querySelector("#operador").value;
  if (textoA === "" || textoB === "") {
    error.textContent = "Completa los dos números.";
    return;
  }
  const a = Number(textoA);
  const b = Number(textoB);
  const respuesta = operar(a, b, operador);
  if (typeof respuesta === "string") {
    resultado.textContent = respuesta;
  } else {
    resultado.textContent = respuesta.toFixed(2);
  }
});

formulario.addEventListener("reset", () => {
  error.textContent = "";
  resultado.textContent = "Completa el formulario y pulsa Calcular.";
});
