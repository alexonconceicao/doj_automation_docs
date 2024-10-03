const readline = require('readline');
const {
  getMultilineInput,
  selectCompany,
  selectRole,
  askSalarioBase,
  askToContinue,
  confirmContinue,
  limparTela,
  rl,
} = require('./prompts');
const {
  createFuncionarioDirectory,
  generateDocument,
  convertDocxToPdf,
  capitalizeName,
} = require('./document');
const company = require('../data/company_db');
async function main() {
  while (true) {
    const companies = Object.values(company);
    let info;
    let selectedCompany;

    while (true) {
      try {
        limparTela();
        const indexCompany = await selectCompany();
        if (isNaN(indexCompany)) {
          console.error('\nERRO: Por favor, informe um número válido!');
          await confirmContinue();
          continue;
        }

        selectedCompany = companies[parseInt(indexCompany) - 1];
        if (!selectedCompany) {
          console.error('\nERRO: Empresa inválida!');
          await confirmContinue();
          continue;
        }

        info = `Empresa: ${selectedCompany.name}`;
        break;
      } catch (err) {
        console.error(
          'Ocorreu um erro ao tentar capturar a empresa:',
          err.message
        );
        await confirmContinue();
      }
    }

    let dataEmployee, nomeFuncCapitalizado;

    while (true) {
      try {
        limparTela();
        console.log(info);
        dataEmployee = await getMultilineInput();
        if (!dataEmployee) {
          console.error(
            '\nERRO: Dados do funcionário inválidos ou inexistentes.'
          );
          await confirmContinue();
          continue;
        }

        const linhaNomeFuncionario = dataEmployee.match(/Nome:\s*(.+)/);
        if (!linhaNomeFuncionario) {
          console.error('\nERRO: Nome do funcionário não encontrado.');
          await confirmContinue();
          continue;
        }

        const nomeFuncionario = linhaNomeFuncionario[1];
        nomeFuncCapitalizado = capitalizeName(nomeFuncionario);

        info += `\nFuncionário: ${nomeFuncCapitalizado}`;
        break;
      } catch (err) {
        console.error(
          'Ocorreu um erro ao tentar capturar os dados do funcionário:',
          err.message
        );
        await confirmContinue();
      }
    }

    let roleEmployee;

    while (true) {
      try {
        limparTela();
        console.log(info);
        const indexRole = await selectRole(selectedCompany.roles);

        if (isNaN(indexRole)) {
          console.error('\nERRO: Por favor, informe um número válido!');
          await confirmContinue();
          continue;
        }

        const roles = Object.values(selectedCompany.roles);

        roleEmployee = roles[parseInt(indexRole) - 1];
        if (!roleEmployee) {
          console.error('\nERRO: Cargo inválido!');
          await confirmContinue();
          continue;
        }

        info += `\nCargo: ${capitalizeName(roleEmployee.title)}`;
        break;
      } catch (err) {
        console.error(
          'Ocorreu um erro ao tentar capturar o cargo do funcionário:',
          err.message
        );
        await confirmContinue();
      }
    }

    let salaryTxt;

    while (true) {
      try {
        limparTela();
        console.log(info);

        salaryTxt = await askSalarioBase(roleEmployee);

        if (salaryTxt === null) {
          console.error('\nERRO: Salário inválido ou inexistente.');
          await confirmContinue();
          continue;
        }
        break;
      } catch (err) {
        console.error(
          'Ocorreu um erro ao tentar capturar o salário do funcionário:',
          err.message
        );
        await confirmContinue();
      }
    }

    try {
      limparTela();
      console.log(info);

      console.log('\n(1/2) Gerando documento...');
      const funcionarioPath = `${selectedCompany.ctrs_employees_path}\\${nomeFuncCapitalizado}`;
      const funcionarioDir = createFuncionarioDirectory(funcionarioPath);
      const nameFile = `Contrato - ${nomeFuncCapitalizado}`;
      const totalPath = `${funcionarioDir}\\${nameFile}`;
      const docPath = `${totalPath}.docx`;

      generateDocument(
        dataEmployee,
        nomeFuncCapitalizado,
        roleEmployee,
        salaryTxt,
        docPath
      );

      console.log('\n(2/2) Gerando PDF...');
      const pdfPath = `${totalPath}.pdf`;

      await convertDocxToPdf(docPath, pdfPath);
      console.log(`\nArquivo PDF gerado: ${pdfPath}`);
    } catch (err) {
      console.error(
        'Ocorreu um erro ao gerar o documento ou o PDF:',
        err.message
      );
      await confirmContinue();
      continue;
    }

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
