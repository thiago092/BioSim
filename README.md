# 🧬 BioSim - Simulador Interativo de Divisão Celular

![BioSim Logo](https://img.shields.io/badge/BioSim-Educação_Biológica-4488ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img. shields.io/badge/Three.js-3D_Rendering-000000?style=for-the-badge&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)

## 📝 Sobre

**BioSim** é um simulador 3D interativo e educacional de divisão celular desenvolvido para facilitar o ensino de biologia celular. O simulador oferece três níveis progressivos de complexidade, permitindo que estudantes de diferentes níveis explorem desde conceitos básicos de mitose até processos avançados de meiose e recombinação genética.

### 🎯 Público-Alvo
- Estudantes do Ensino Médio e Superior
- Professores de Biologia
- Instituições de Ensino
- Autodidatas interessados em biologia celular

---

## ✨ Funcionalidades Principais

### 🎓 Três Modos de Ensino

#### 1. Modo Básico (7 fases)
Mitose simplificada para iniciantes:
- Intérfase
- Prófase
- Metáfase
- Anáfase
- Telófase
- Citocinese
- Células-Filhas

#### 2. Modo Intermediário (12 fases)
Ciclo celular detalhado:
- Intérfase G1, S, G2
- Prófase Inicial e Tardia
- Prometáfase
- Metáfase
- Anáfase A e B
- Telófase
- Citocinese
- Células-Filhas G1

#### 3. Modo Avançado (14 fases)
Meiose completa com crossing-over:
- Intérfase Pré-Meiótica
- Meiose I (Prófase I, Crossing-Over, Metáfase I, Anáfase I, Telófase I, Citocinese I)
- Células Intermediárias
- Meiose II (Prófase II, Metáfase II, Anáfase II, Telófase II, Citocinese II)
- 4 Gametas Haploides

### 🎮 Controles Interativos

- **Seletor de Modo**: Alterne entre os 3 níveis de complexidade
- **Timeline Interativa**: Navegue por todas as fases visualmente
- **Controles de Animação**:
  - ▶️ Play/Pause automático
  - 🔄 Reset para primeira fase
  - ⚡ Ajuste de velocidade (Lento/Normal/Rápido)
- **Navegação Manual**: Setas de próximo/anterior
- **Câmera 3D**: Rotação, zoom e pan com mouse/touch

### 📚 Recursos Educacionais

- **Glossário Integrado**: 10 termos técnicos com definições claras
- **Curiosidades Científicas**: 7 fatos fascinantes sobre divisão celular
- **Tooltips 3D**: Labels informativos em estruturas celulares
- **Descrições Detalhadas**: Explicação de cada fase em português

### 🔬 Visualizações 3D

- **Cromossomos**: Coloridos e animados
- **Núcleo**: Envelope nuclear com aparecimento/desaparecimento
- **Centríolos**: Migração para os polos
- **Fibras do Fuso**: Conexão aos cromossomos
- **Organelas**: Mitocôndrias, ribossomos, complexo de Golgi
- **Citocinese**: Linha de divisão e separação celular
- **Crossing-Over**: Recombinação genética visível (meiose)
- **Gametas**: 4 células haploides resultantes

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório (ou baixe o zip)
cd biosim

# Instale as dependências
npm install
```

### Executar em Desenvolvimento

```bash
npm run dev
```

O simulador estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
npm run preview
```

---

## 🛠️ Tecnologias Utilizadas

### Core
- **React 18.3** - Framework UI
- **TypeScript 5.7** - Tipagem estática
- **Vite** - Build tool e dev server

### 3D & Animações
- **React Three Fiber** - React renderer para Three.js
- **@react-three/drei** - Helpers 3D
- **@react-three/postprocessing** - Efeitos pós-processamento (Bloom)
- **Three.js** - Engine 3D
- **maath** - Funções matemáticas e easing

### UI
- **lucide-react** - Ícones modernos
- **CSS-in-JS** - Estilos inline com TypeScript

---

## 📁 Estrutura do Projeto

```
biosim/
├── src/
│   ├── components/           # Componentes React/Three.js
│   │   ├── Cell.tsx         # Membrana celular
│   │   ├── Nucleus.tsx      # Núcleo
│   │   ├── Chromosome.tsx   # Cromossomos
│   │   ├── Centrioles.tsx   # Centríolos
│   │   ├── SpindleFibers.tsx# Fibras do fuso
│   │   ├── DivisionLine.tsx # Linha de citocinese
│   │   ├── DaughterCells.tsx# Células-filhas
│   │   ├── CrossingOver.tsx # Crossing-over (meiose)
│   │   ├── MeiosisCells.tsx # 4 gametas
│   │   ├── Organelle.tsx    # Organelas genéricas
│   │   ├── Tooltip.tsx      # Labels 3D
│   │   ├── Scene.tsx        # Cena 3D principal
│   │   ├── ModeSelector.tsx # Seletor de modo
│   │   ├── Timeline.tsx     # Linha do tempo
│   │   ├── AnimationControls.tsx # Controles play/pause
│   │   ├── InfoPanel.tsx    # Painel educacional
│   │   └── UI.tsx           # Interface principal
│   ├── types.ts             # Tipos e constantes
│   ├── App.tsx              # Componente raiz
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globais
├── public/                  # Assets estáticos
├── package.json             # Dependências
├── tsconfig.json            # Configuração TypeScript
├── vite.config.ts           # Configuração Vite
└── README.md                # Este arquivo
```

---

## 🎓 Guia de Uso

### Para Professores

1. **Escolha o Modo**: Selecione o nível apropriado para sua turma
2. **Demonstração**: Use o modo automático (Play) para apresentação
3. **Explicação**: Pause em fases importantes para discussão
4. **Exploração**: Permita que alunos naveguem livremente
5. **Recursos**: Direcione ao glossário para termos técnicos

### Para Estudantes

1. **Comece pelo Básico**: Entenda os conceitos fundamentais
2. **Explore Ativamente**: Clique nas fases da timeline
3. **Use os Recursos**: Consulte o glossário e curiosidades
4. **Progres são Gradual**: Avance para modos superiores conforme dominar o conteúdo

---

## 📊 Estatísticas

- **33 Fases** únicas simuladas
- **17+ Componentes** 3D interativos
- **33 Descrições** educacionais em português
- **10 Termos** no glossário
- **7 Curiosidades** científicas
- **3 Níveis** de dificuldade

---

## 🎨 Capturas de Tela

> *Nota: Adicionar screenshots do simulador em ação*

---

## 🤝 Contribuições

Contribuições são bem-vindas! Algumas sugestões de melhorias futuras:

- [ ] Sistema de quiz interativo
- [ ] Sistema de conquistas/badges
- [ ] Modo de comparação lado a lado
- [ ] Suporte a células vegetais
- [ ] Tradução para outros idiomas
- [ ] Modo VR/AR
- [ ] Exportação de animações

---

## 📜 Licença

Este projeto foi desenvolvido para fins educacionais.

---

## 👩‍🏫 Créditos

**Desenvolvido para:**
Professora Anayram Martins  
📱 @anayrammartins

**Tecnologia:**
Desenvolvido com React Three Fiber e paixão por educação! 💙

---

## 📞 Suporte

Para dúvidas ou sugestões sobre o simulador, entre em contato:
- **Instagram**: @anayrammartins

---

**🧬 BioSim** - Tornando a biologia celular visível e interativa! ✨
