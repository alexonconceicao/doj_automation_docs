# DAD - DOJ AUTOMATION DOCS

## Últimas versões

```
 Chief Justice: em breve...
 Judge: em breve...
 District Attorney: em breve...
 Lawyer: 1.0 (Versão Terminal)
```

## Lawyer:info

### Configuração:

Para configurar:

1. Deve acessar o arquivo "_data/company_db.js_" (remover o "_.example_" do nome arquivo)
2. Configurar do modo que achar melhor, com informações da empresa
   2.2 Dados obrigatórios: name, ctrs_employees_path, roles.{}.title, roles.{}.salary, roles.{}.doc
3. Acessar o arquivo "_.env_" (remover o "_.example_" do nome arquivo)
4. Informar o caminho raiz onde estão salvos os diretórios das empresas: **path_companies**

### Como usar:

1. Deve usar os dados do funcionário da seguinte forma copiado:

```
Nome: Nome
Citizen ID: citizen_id
Endereço: endereco
Telefone: telefone
E-mail: info_email
```

2. Executar os comandos:

```
npm install && npm start
```

3. Selecionar e preencher as informações que aparecem na tela

### Configuração do documento

As informações para serem substituídas no documento devem estar entre chaves -> {}

Exemplo:

```
[...] {salario_base} e bla bla bla bla [...]
```

### Vídeo demonstração

Vídeo tutorial no YouTube: ["DAD - DOJ Automation Docs 2.0? 😅"](http://www.youtube.com/watch?v=JrAXS20BIkY)

[![IMAGE ALT TEXT](http://img.youtube.com/vi/JrAXS20BIkY/0.jpg)](http://www.youtube.com/watch?v=JrAXS20BIkY 'DAD - DOJ Automation Docs 2.0? 😅')
