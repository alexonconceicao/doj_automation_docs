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
        break; // sair do loop se não houver erro
      } catch (err) {
        console.error(
          'Ocorreu um erro ao tentar capturar a empresa:',
          err.message
        );
        await confirmContinue();
      }
    }

    let dataEmployee, nomeFuncionario, funcionarioCapitalizado;

    while (true) {
      try {
        limparTela();
        console.log(`Empresa: ${selectedCompany.name}`);
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

        nomeFuncionario = linhaNomeFuncionario[1];
        funcionarioCapitalizado = capitalizeName(nomeFuncionario);
        break; // sair do loop se não houver erro
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
        console.log(`Empresa: ${selectedCompany.name}`);
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
        break; // sair do loop se não houver erro
      } catch (err) {
        console.error(
          'Ocorreu um erro ao tentar capturar o cargo do funcionário:',
          err.message
        );
        await confirmContinue();
      }
    }

    let salaryRole;

    while (true) {
      try {
        limparTela();
        console.log(`Empresa: ${selectedCompany.name}`);
        console.log(`Cargo: ${roleEmployee.description}`);
        salaryRole = await askSalarioBase(roleEmployee);
        if (isNaN(salaryRole) || salaryRole <= 0) {
          console.error('\nERRO: Salário inválido ou inexistente.');
          await confirmContinue();
          continue;
        }
        break; // sair do loop se não houver erro
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
      console.log(`Empresa: ${selectedCompany.name}`);
      console.log('\nGerando documento (1/2)');
      const funcionarioDir = createFuncionarioDirectory(
        funcionarioCapitalizado
      );
      const nameFile = `Contrato - ${funcionarioCapitalizado}`;
      const docPath = `${funcionarioDir}/${nameFile}.docx`;

      generateDocument(
        dataEmployee,
        roleEmployee,
        selectedCompany,
        salaryRole,
        funcionarioCapitalizado,
        docPath
      );

      console.log('\nGerando PDF (2/2)');
      const pdfPath = `${funcionarioDir}/${nameFile}.pdf`;
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
