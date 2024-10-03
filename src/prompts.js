const readline = require('readline');
const company = require('../data/company_db');
const number = require('numero-por-extenso');
const { capitalizeName, formatCurrency } = require('./document');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function formatSalary(salary) {
  const salarioExtenso = number.porExtenso(salary);
  const salarioFormatado = formatCurrency(salary);
  const salarioTexto = `${salarioFormatado} (${salarioExtenso} dólares)`;

  return salarioTexto;
}

function getMultilineInput() {
  const lines = [];
  console.log(
    "\n\nInsira os dados (pressione 'Enter' duas vezes para encerrar):"
  );

  return new Promise((resolve) => {
    rl.on('line', (line) => {
      if (line === '') {
        rl.removeAllListeners('line');
        resolve(lines.join('\n'));
      } else {
        lines.push(line);
      }
    });
  });
}

function selectCompany() {
  const textCompanies = Object.values(company)
    .map((item) => item.name)
    .map((company, index) => `${index + 1} - ${company}`)
    .join('\n');
  const questionText = `\n\nSelecione a EMPRESA:\n\n${textCompanies}\n\n>>> `;
  return new Promise((resolve) => {
    rl.question(questionText, resolve);
  });
}

function selectRole(roles) {
  const textRoles = Object.values(roles)
    .map((item) => item.title)
    .map((role, index) => `${index + 1} - ${capitalizeName(role)}`)
    .join('\n');

  const text = `\n\nSelecione o CARGO do funcionário:\n\n${textRoles}\n\n>>> `;
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
}

function askSalarioBase(role) {
  const defaultSalary = role.salary;
  const formatedDefaultSalary = formatSalary(defaultSalary);
  console.log(
    `\n\nO salário padrão registrado para este cargo é: ${formatedDefaultSalary}`
  );

  return new Promise((resolve) => {
    rl.question(
      '\n\nPara manter o salário padrão digite (s/y/sim/yes).\nCaso deseje um novo salário digite o valor: ',
      (answer) => {
        if (['s', 'sim', 'y', 'yes'].includes(answer.toLowerCase())) {
          resolve(formatedDefaultSalary);
        } else {
          const newSalary = parseInt(answer);
          if (!isNaN(newSalary) && newSalary > 0) {
            const formatedNewSalary = formatSalary(newSalary);
            resolve(formatedNewSalary);
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}

function limparTela() {
  process.stdout.write('\x1Bc');
}

function askToContinue() {
  return new Promise((resolve) => {
    rl.question(
      '\n\nDeseja realizar outra operação? (sim = s/y || não = n): ',
      (answer) => {
        resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'y');
      }
    );
  });
}

function confirmContinue() {
  return new Promise((resolve) => {
    rl.question('\nPressione Enter para continuar...', resolve);
  });
}

module.exports = {
  getMultilineInput,
  selectCompany,
  selectRole,
  askSalarioBase,
  askToContinue,
  confirmContinue,
  limparTela,
  rl,
};
