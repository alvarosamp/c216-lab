## Prática 6

Adicionei o frontend do controle financeiro com React, JavaScript, Vite e
Tailwind CSS. É possível cadastrar, editar, excluir e filtrar receitas e
despesas. O resumo mostra os totais e o saldo, mesmo com o filtro ativo.

Separei o formulário, a lista e o resumo em componentes. O `App.jsx` mantém
os lançamentos em memória, e o `validation.js` concentra as validações e os
cálculos em centavos. Os dados são apagados ao recarregar a página, pois a
integração com o backend fica para a próxima prática.

Configurei o Biome para lint e formatação, o Vitest para os testes unitários
e de integração e o Playwright para os testes no navegador. Os comandos estão
no Makefile, com o prefixo `front-`. O workflow do frontend tem um job de
qualidade e outro de testes e build.

## Testes

Executei `make front-check`: Biome sem erros, 15 testes Vitest e 2 testes
Playwright passando, além do build. Também conferi a tela em desktop e celular.

Para rodar: `make front-install` e `make front-dev`.
Para testar: `make front-e2e-install` e `make front-check`.

## Base do PR

Criei a branch a partir de `pratica-5`, seguindo a segunda opção do aviso.
Enquanto a V aguarda correção, a base é `pratica-5`. Depois do merge da V,
vou conferir a mudança da base para `aulas`.

Álvaro Careli — `alvarosamp`
