const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
const report = [];

function check(nombre, obtenido, esperado) {
  assert.deepEqual(obtenido, esperado, nombre);
  report.push({ prueba: nombre, obtenido, esperado, estado: 'Correcto' });
}

// Ejecuta cada app.js original; el DOM mínimo solo sirve para sus formularios.
function load(folder) {
  const html = fs.readFileSync(path.join(root, folder, 'index.html'), 'utf8');
  const code = fs.readFileSync(path.join(root, folder, 'app.js'), 'utf8');
  assert.match(html, /<script src="app\.js" defer><\/script>/);
  const elements = {};
  const handlers = {};
  for (const match of html.matchAll(/id="([^"]+)"/g)) {
    let text = '';
    let markup = '';
    elements['#' + match[1]] = {
      value: '',
      get textContent() { return text; },
      set textContent(v) { text = v; markup = ''; },
      get innerHTML() { return markup; },
      set innerHTML(v) { markup = v; text = ''; }
    };
  }
  elements['#formulario'].addEventListener = (type, handler) => { handlers[type] = handler; };
  const context = {
    document: { querySelector: selector => {
      assert.ok(elements[selector], 'Existe ' + selector);
      return elements[selector];
    } }
  };
  vm.createContext(context);
  vm.runInContext(code, context, {filename:folder + '/app.js'});
  return {
    context,
    submit(values) {
      for (const e of Object.values(elements)) e.value = '';
      for (const [id, value] of Object.entries(values)) elements['#' + id].value = String(value);
      handlers.submit({ preventDefault() {} });
      return { resultado:elements['#resultado'].textContent, html:elements['#resultado'].innerHTML, error:elements['#error'].textContent };
    },
    reset() {
      handlers.reset();
      return { resultado:elements['#resultado'].textContent, error:elements['#error'].textContent, html:elements['#resultado'].innerHTML };
    }
  };
}

const e1=load('ejercicio1');
const cases1=[[-1,'Nota no válida'],[0,'Reprobado'],[4.99,'Reprobado'],[5,'En recuperación'],[6.99,'En recuperación'],[7,'Aprobado'],[8.99,'Aprobado'],[9,'Excelente'],[10,'Excelente'],[10.01,'Nota no válida'],[NaN,'Nota no válida'],[Infinity,'Nota no válida']];
for (const [input,expected] of cases1) check('clasificarNota(' + input + ')', e1.context.clasificarNota(input),expected);
check('Formulario de nota con 7',e1.submit({nota:7}).resultado,'Aprobado');
check('Formulario de nota vacío',e1.submit({nota:''}).error,'Ingresa una nota.');

const e2=load('ejercicio2');
function bodyRows(html) {
  const tbody=html.match(/<tbody>([\s\S]*?)<\/tbody>/);
  return tbody ? [...tbody[1].matchAll(/<tr><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/g)].map(m=>[m[1],m[2]]) : [];
}
const rows=bodyRows(e2.context.generarTabla(7,10));
check('Tabla de 7 hasta 10 tiene 10 filas',rows.length,10);
check('Primera fila de tabla de 7',rows[0],['7 × 1','7']);
check('Última fila de tabla de 7',rows[9],['7 × 10','70']);
check('Límite máximo de 20 filas',bodyRows(e2.context.generarTabla(3,20)).length,20);
for (const limit of [0,21,2.5,NaN]) check('Rechazo del límite ' + limit,e2.context.generarTabla(7,limit),'El límite debe ser un entero entre 1 y 20.');
check('Tabla con límite 1',bodyRows(e2.context.generarTabla(7,1)),[['7 × 1','7']]);
check('Tabla de número negativo',bodyRows(e2.context.generarTabla(-2,3))[2],['-2 × 3','-6']);
check('Tabla del cero',bodyRows(e2.context.generarTabla(0,2))[1],['0 × 2','0']);
check('Producto decimal sin residuo visible',bodyRows(e2.context.generarTabla(0.1,3))[2],['0.1 × 3','0.3']);
check('Número no finito',e2.context.generarTabla(Infinity,10),'Ingresa un número válido.');
check('Formulario genera tabla HTML',bodyRows(e2.submit({numero:7,hasta:10}).html).length,10);
check('Formulario rechaza 21',e2.submit({numero:7,hasta:21}).error,'El límite debe ser un entero entre 1 y 20.');
check('Una tabla previa se elimina al rechazar un límite',e2.submit({numero:7,hasta:21}).html,'');
check('Formulario de tabla vacío',e2.submit({numero:'',hasta:10}).error,'Completa el número y el límite de la tabla.');

const e3=load('ejercicio3');
for(const [op,expected] of [['+',16],['-',8],['*',48],['/',3]]) check('operar(12,4,'+op+')',e3.context.operar(12,4,op),expected);
check('División entre cero',e3.context.operar(12,0,'/'),'No se puede dividir para 0');
check('Operador no permitido',e3.context.operar(12,4,'?'),'Operador no válido');
check('Argumento no numérico',e3.context.operar(NaN,4,'+'),'Ingresa dos números válidos.');
check('Resultado fuera de rango',e3.context.operar(1e308,1e308,'+'),'El resultado está fuera del rango permitido.');
check('Formulario muestra resultado con dos decimales',e3.submit({a:12,b:4,operador:'/'}).resultado,'3.00');
check('Formulario muestra aviso de división entre cero',e3.submit({a:12,b:0,operador:'/'}).resultado,'No se puede dividir para 0');
check('Formulario de calculadora vacío',e3.submit({a:'',b:4,operador:'+'}).error,'Completa los dos números.');

const e4=load('ejercicio4');
for(const [minutes,expected] of [[0,0],[1,1],[40,1],[60,1],[61,1.5],[75,1.5],[300,3],[480,4.5],[481,5],[720,5],[1440,5],[1441,6],[2880,10]]) {
  check('calcularTarifa('+minutes+')',e4.context.calcularTarifa(minutes),expected);
}
for(const [minutes,expected] of [[40,1],[75,2],[300,5],[720,12]]) check('horasACobrar('+minutes+')',e4.context.horasACobrar(minutes),expected);
check('Rechazo de tiempo negativo',e4.context.calcularTarifa(-1),'Ingresa una cantidad de minutos igual o mayor que cero.');
check('Rechazo de tiempo no finito',e4.context.calcularTarifa(Infinity),'Ingresa una cantidad de minutos igual o mayor que cero.');
check('Formulario del parqueadero con 75 minutos',e4.submit({minutos:75}).resultado,'Horas a cobrar: 2\nTarifa: $1.50');
check('Formulario del parqueadero vacío',e4.submit({minutos:''}).error,'Ingresa el tiempo de estacionamiento.');

for(const [exercise,names] of [[e1,['clasificarNota']],[e2,['generarTabla']],[e3,['operar']],[e4,['horasACobrar','calcularTarifa']]]) {
  for(const name of names) {
    const code=exercise.context[name].toString();
    check(name+' no accede al DOM',/\b(document|window|querySelector|innerHTML|textContent)\b/.test(code),false);
    check(name+' tiene parámetros y return',exercise.context[name].length>0 && /\breturn\b/.test(code),true);
  }
  check('Limpiar restablece mensajes y resultados',exercise.reset(),{resultado:'Completa el formulario y pulsa Calcular.',error:'',html:''});
}

const reflection=fs.readFileSync(path.join(root,'README.md'),'utf8').trim().split('\n');
check('Reflexión de máximo ocho líneas',reflection.length<=8,true);
const data={
  metodo:'Ejecución de los app.js originales con Node.js y un entorno DOM mínimo. No es una prueba visual en navegador ni certifica su consola.',
  total:report.length,
  resultados:report
};
fs.mkdirSync(path.join(root,'evidencias'),{recursive:true});
fs.writeFileSync(path.join(root,'evidencias','pruebas_logica.json'),JSON.stringify(data,null,2));
console.log(`${report.length} comprobaciones correctas. Se verificaron las cuatro funciones principales y horasACobrar.`);
