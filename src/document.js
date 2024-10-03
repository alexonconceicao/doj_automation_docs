const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const number = require('numero-por-extenso');

function createFuncionarioDirectory(funcionarioCapitalizado) {
  const funcionarioDir = path.join(funcionarioCapitalizado);
  fs.mkdirSync(funcionarioDir, { recursive: true });
  return funcionarioDir;
}

function generateDocument(
  dataEmployee,
  roleEmployee,
  indexCompany,
  salaryRole,
  funcionarioCapitalizado,
  docPath
) {
  const content = fs.readFileSync(
    path.resolve(__dirname, `./docs/${process.env.ARQUIVO}`),
    'binary'
  );

  const salarioExtenso = number.porExtenso(salaryRole);
  const salarioTexto = `${formatCurrency(
    salaryRole
  )} (${salarioExtenso} dólares)`;

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  doc.render({
    dados_contratado: dataEmployee.trim(),
    Funcionario: funcionarioCapitalizado,
    FUNCIONARIO1: funcionarioCapitalizado.toUpperCase(),
    cargo: roleEmployee,
    CARGO1: roleEmployee.toUpperCase(),
    salario_base: salarioTexto,
  });

  const buf = doc
    .getZip()
    .generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(docPath, buf);
}

function convertDocxToPdf(docxPath, pdfPath) {
  return new Promise((resolve, reject) => {
    exec(`docx2pdf ${docxPath} "${pdfPath}"`, (error) => {
      if (error) {
        console.error(`Erro ao converter para PDF: ${error.message}`);
        return reject(error);
      }
      resolve();
    });
  });
}

function formatCurrency(value) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(value);
}

function capitalizeName(name) {
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

module.exports = {
  createFuncionarioDirectory,
  generateDocument,
  convertDocxToPdf,
  formatCurrency,
  capitalizeName,
};
