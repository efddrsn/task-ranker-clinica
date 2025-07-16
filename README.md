# 📋 Task Ranker - Clínica Odontológica

Uma ferramenta web interativa para priorização e organização de tarefas administrativas em clínicas odontológicas. Permite upload de arquivos CSV, drag & drop para reordenação, edição inline e exportação de rankings.

## ✨ Funcionalidades

- **📤 Upload de CSV**: Carregue suas tarefas a partir de arquivos CSV
- **🎯 Ranking TOP 5**: Sistema fixo de priorização com TOP 5 tarefas
- **🔄 Drag & Drop**: Reordene tarefas arrastando e soltando
- **✏️ Edição Inline**: Edite títulos e comentários com duplo clique
- **🏷️ Categorização**: Categorias coloridas para organização visual
- **📱 Responsivo**: Interface otimizada para desktop e mobile
- **💾 Exportação**: Exporte o ranking final em formato CSV
- **📋 Dados de Exemplo**: Carregue exemplos prontos para testar

## 🚀 Como Usar

### 1. Carregando Tarefas

**Opção A: Arquivo CSV**
- Clique em "📥 Baixar CSV" para ver o formato esperado
- Prepare seu arquivo no formato: `tarefa,categoria,comentarios`
- Use o botão de upload para carregar seu arquivo

**Opção B: Dados de Exemplo**
- Clique em "📋 Carregar Exemplo" para ver a ferramenta em ação

### 2. Organizando Prioridades

- **Arraste** as tarefas para reordenar
- As **5 primeiras posições** são destacadas como "TOP 5"
- Use as **categorias coloridas** para identificação rápida

### 3. Editando Informações

- **Duplo clique** no título para editar
- **Clique simples** nos comentários para adicionar/editar
- Use **Enter** para salvar ou **Esc** para cancelar

### 4. Exportando Resultados

- Clique em "💾 Exportar" para baixar o ranking final
- O arquivo incluirá posição, status (TOP/Normal) e comentários

## 📊 Categorias Disponíveis

- 🔵 **Administrativo** - Gestão geral da clínica
- 🟣 **RH** - Recursos humanos e pessoal
- 🟢 **Financeiro** - Controle financeiro e contábil
- 🩷 **Clínico** - Procedimentos e protocolos médicos
- 🟠 **Marketing** - Divulgação e relacionamento
- 🔵 **Tecnologia** - Equipamentos e sistemas
- 🔴 **Compliance** - Conformidade e regulamentações
- 🟡 **Operacional** - Operações do dia a dia
- 🟦 **Educação** - Capacitação e desenvolvimento
- 🟫 **Pacientes** - Atendimento e relacionamento
- 🔴 **Emergência** - Situações urgentes
- 🟣 **Estratégico** - Planejamento de longo prazo

## 🛠️ Executando Localmente

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/efddrsn/task-ranker-clinica.git

# Entre no diretório
cd task-ranker-clinica

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🌐 Acesso Online

**🔗 [Acesse a aplicação online](https://efddrsn.github.io/task-ranker-clinica/)**

A aplicação está disponível online através do GitHub Pages com deploy automático!

## 🔧 Tecnologias Utilizadas

- **React** - Interface de usuário
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **HTML5 Drag & Drop API** - Funcionalidade de arrastar e soltar
- **GitHub Pages** - Hospedagem estática
- **GitHub Actions** - Deploy automático

## 📁 Estrutura do Projeto

```
task-ranker-clinica/
├── src/
│   ├── App.jsx              # Componente principal
│   ├── TaskManagerPanel.jsx # Componente do gerenciador de tarefas
│   ├── index.css           # Estilos globais
│   └── main.jsx            # Ponto de entrada
├── .github/workflows/       # Configuração do deploy automático
├── public/                 # Arquivos estáticos
├── index.html             # Template HTML
├── package.json           # Dependências e scripts
├── tailwind.config.js     # Configuração do Tailwind
├── vite.config.js         # Configuração do Vite
└── tarefas_clinica_exemplo.csv # Arquivo de exemplo
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato através das issues do GitHub.