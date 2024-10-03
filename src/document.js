const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function createFuncionarioDirectory(caminhoFuncionario) {
  const funcionarioDir = path.join(caminhoFuncionario);
  fs.mkdirSync(funcionarioDir, { recursive: true });
  return funcionarioDir;
}

function generateDocument(
  dataEmployee,
  nomeFuncCapitalizado,
  roleEmployee,
  salaryTxt,
  docPath
) {
  const role = roleEmployee.title;
  const content = fs.readFileSync(
    path.resolve(__dirname, `../docs/${roleEmployee.doc}`),
    'binary'
  );

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  doc.render({
    dados_contratado: dataEmployee.trim(),
    Funcionario: nomeFuncCapitalizado,
    FUNCIONARIO1: nomeFuncCapitalizado.toUpperCase(),
    cargo: role.toLowerCase(),
    CARGO1: role.toUpperCase(),
    salario_base: salaryTxt,
  });

  const buf = doc
    .getZip()
    .generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(docPath, buf);
}

function convertDocxToPdf(docxPath, pdfPath) {
  return new Promise((resolve, reject) => {
    exec(`docx2pdf "${docxPath}" "${pdfPath}"`, (error) => {
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
