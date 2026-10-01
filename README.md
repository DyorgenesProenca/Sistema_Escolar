# 📐 Delta Math - Sistema de Gestão Escolar

O **Delta Math** é um sistema full-stack de gerenciamento escolar focado na disciplina de matemática. Desenvolvido em **Node.js** e **MySQL**, o projeto conta com controle rigoroso de níveis de acesso (**Roles**), criptografia de segurança para credenciais e uma interface web colorida, responsiva e intuitiva dividida para três perfis de usuários: Administradores, Professores e Alunos.

---

## 📸 Demonstração do Sistema & Telas

### 1. Portal de Acesso (Login & Registro)
A porta de entrada do sistema conta com uma interface moderna em gradiente roxo. Permite a autenticação unificada de qualquer perfil e o autorregistro de novos professores de forma dinâmica na mesma tela.
*(Insira sua imagem aqui: `![Tela de Login](img/login.png)`)*

### 2. Painel do Professor (`professor.html`)
Espaço em tons quentes (ouro/amarelo) para gerenciamento pedagógico. O professor consegue matricular alunos, editar dados cadastrais e lançar as 4 notas bimestrais com cálculo de média automático em tempo real.
*(Insira sua imagem aqui: `![Painel do Professor](img/professor.png)`)*

### 3. Portal do Aluno (`aluno.html`)
Ambiente personalizado e limpo em tons roxos e verdes. O estudante visualiza de forma clara o seu boletim de matemática fragmentado por bimestre e recebe um feedback visual dinâmico com o veredito final do ano letivo.
*(Insira sua imagem aqui: `![Portal do Aluno](img/aluno.png)`)*

### 4. Painel Master Root Admin (`admin-dados.html`)
Interface em modo escuro para fins de auditoria técnica da TI. O administrador possui superpoderes para criar qualquer tipo de conta (incluindo novos administradores), auditar e-mails cadastrados e realizar exclusões definitivas na base de dados.
*(Insira sua imagem aqui: `![Painel Administrativo](img/admin.png)`)*

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3 (Flexbox/Grid), JavaScript Vanilla (Fetch API, LocalStorage).
- **Back-end:** Node.js, Express.js (Arquitetura MVC & Rotas Centralizadas).
- **Banco de Dados:** MySQL (Chaves Estrangeiras, Restrições `ENUM` e exclusões em `CASCADE`).
- **Segurança:** Criptografia de senhas com `bcrypt` e proteção preventiva contra e-mails duplicados na API.

---

## ⚙️ Configuração e Instalação Local

1. Clone o repositório para o seu computador:
```bash
git clone https://github.com
```

2. Instale as dependências do Node.js:
```bash
npm install
```

3. Configure o arquivo de credenciais criando um arquivo `.env` na raiz:
```env
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=escola_matematica
DB_PORT=3306
```

4. Suba a estrutura do banco de dados executando o script SQL de criação de tabelas e massa de testes no seu MySQL.

5. Inicie o servidor:
```bash
node index.js
```

6. Abra o arquivo `frontend/login.html` utilizando a extensão **Live Server** do VS Code para evitar bloqueios de políticas de CORS do navegador.

---

## 🔐 Credenciais Padrão de Teste (Massa de Dados)

- **Administrador:** `admin@escola.com` | Senha: `admin123`
- **Professor:** `professor@escola.com` | Senha: `123456` *(Cadastre uma nova conta via tela de registro para testar o hashing com bcrypt)*
- **Aluno:** `chaves@escola.com` | Senha: `123456`
