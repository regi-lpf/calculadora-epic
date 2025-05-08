const tela = document.getElementById("tela");
let characters = 0;
 
function appendCharacter(char) {
  const operators = ['+', '-', '*', '/', '^'];
  const lastChar = tela.innerHTML.slice(-1);

  if (characters === 0 && !operators.includes(char)) {
    deleteAll();
  }

  // Evitar operadores repetidos
  if (operators.includes(char)) {
    if (operators.includes(lastChar)) {
      // Substitui o operador anterior
      tela.innerHTML = tela.innerHTML.slice(0, -1) + char;
      return;
    }
  }

  if (char === '.') {
    const currentNumber = tela.innerHTML.split(/[\+\-\*\/\^]/).pop();
    if (currentNumber.includes('.')) {
      return;
    }
  }

  tela.innerHTML += char;
  characters++;
}



function deleteCharacter() {
    tela.innerHTML = tela.innerHTML.substring(0, tela.innerHTML.length - 1);
}

function deleteAll() {
    tela.innerHTML = '';
}

function preprocessExpression(input) {
    input = input.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, 'pow($1,$2)');
    input = input.replace(/√\s*\(?([0-9+\-*/. ]+)\)?/g, 'sqrt($1)');
  
    return input;
}

function evaluateExpression() {
    let raw = tela.innerHTML;
    const str = preprocessExpression(raw);
  
    const isValid = /^[0-9+\-*/().,\s]*((pow|sqrt)[\s]*\([\d+\-*/().,\s]*\))*[0-9+\-*/().,\s]*$/.test(str);
    if (!isValid) return 'Invalid characters in expression';
  
    try {
      const result = Function(`
        "use strict";
        const pow = Math.pow;
        const sqrt = Math.sqrt;
        return (${str});
      `)();
      characters = 0;
      return tela.innerHTML = Math.round(result * 1000) / 1000;
      ;
    } catch (err) {
      return tela.innerHTML = "Err";
    }
  }
  
  