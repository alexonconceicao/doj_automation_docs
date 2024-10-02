const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getMultilineInput() {
  const lines = [];
  console.log(
    "\nInsira os dados (pressione 'Enter' duas vezes para terminar):"
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

function askName() {
  return new Promise((resolve) => {
    rl.question('Insira o NOME do funcionário: ', resolve);
  });
}

function askCargo() {
  return new Promise((resolve) => {
    rl.question('Insira o CARGO do funcionário: ', resolve);
  });
}

function convertDocxToPdf(docxPath, pdfPath) {
  return new Promise((resolve, reject) => {
    exec(`docx2pdf ${docxPath} "${pdfPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao converter para PDF: ${error.message}`);
        return reject(error);
      }
      //   if (stderr) {
      //     console.error(`Erro: ${stderr}`);
      //     return reject(new Error(stderr));
      //   }
      resolve();
    });
  });
}

function capitalizeName(name) {
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function generateDocument(dadosInput, nomeFuncionario, cargoFuncionario) {
  const content = fs.readFileSync(
    path.resolve(__dirname, `./docs/${process.env.ARQUIVO}`),
    'binary'
  );

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const funcionarioCapitalizado = capitalizeName(nomeFuncionario);

  doc.render({
    dados_contratado: dadosInput.trim(),
    Funcionario: funcionarioCapitalizado,
    FUNCIONARIO1: nomeFuncionario.toUpperCase(),
    cargo: cargoFuncionario,
    CARGO1: cargoFuncionario.toUpperCase(),
  });

  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });

  const docxPath = path.join(__dirname, './docs/output.docx');
  fs.writeFileSync(docxPath, buf);

  return funcionarioCapitalizado;
}

async function createFuncionarioDirectory(funcionarioCapitalizado) {
  const funcionarioDir = path.join(
    process.env.PATH_TO_SAVE,
    funcionarioCapitalizado
  );

  fs.mkdirSync(funcionarioDir, { recursive: true });
  return funcionarioDir;
}

async function askToContinue() {
  return new Promise((resolve) => {
    rl.question('\nDeseja realizar outra operação? (s/n): ', (answer) => {
      resolve(answer.toLowerCase() === 's');
    });
  });
}

async function main() {
  while (true) {
    const dadosInput = await getMultilineInput();
    const nomeFuncionario = await askName();
    const cargoFuncionario = await askCargo();

    console.log('\nGerando documento (1/3)');

    const funcionarioCapitalizado = await generateDocument(
      dadosInput,
      nomeFuncionario,
      cargoFuncionario
    );

    console.log('\nDocumento gerado (2/3)');

    const funcionarioDir = await createFuncionarioDirectory(
      funcionarioCapitalizado
    );

    console.log('\nGerando PDF (3/3)');

    const pdfPath = path.join(
      funcionarioDir,
      `Contrato - ${funcionarioCapitalizado}.pdf`
    );

    await convertDocxToPdf(path.join(__dirname, './docs/output.docx'), pdfPath);
    console.log(`\nArquivo PDF gerado: ${pdfPath}`);

    console.log(
      '\n================================> Programa Finalizado <================================'
    );

    const continuar = await askToContinue();
    if (!continuar) {
      rl.close();
      break;
    }
  }
}

main();
