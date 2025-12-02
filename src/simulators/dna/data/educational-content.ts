export const EDUCATIONAL_CONTENT = {
    chromosome: {
        title: '🧬 CROMOSSOMOS',
        description: 'Os cromossomos são estruturas compostas por DNA e proteínas (histonas) que armazenam a informação genética. Durante a divisão celular, o DNA se condensa formando estruturas visíveis ao microscópio.',
        facts: [
            '🔬 Humanos têm 46 cromossomos (23 pares)',
            '👨‍👩‍👧 23 da mãe + 23 do pai',
            '🧫 22 pares autossômicos + 1 par sexual',
            '♀️ Mulheres: XX | ♂️ Homens: XY',
            '📏 Maior cromossomo: 1 (~249 milhões de pares de bases)',
            '📏 Menor cromossomo: 21 (~47 milhões de pares de bases)',
            '🔄 O DNA de um cromossomo tem ~5cm de comprimento',
        ],
        stats: {
            total: 46,
            pairs: 23,
            autosomes: 22,
            sexual: 1,
        },
        details: {
            centromero: 'Região central que une as cromátides irmãs',
            telomeros: 'Extremidades protetoras do cromossomo',
            cromatides: 'Duas cópias idênticas após a replicação',
            histonas: 'Proteínas que ajudam a compactar o DNA',
        }
    },
    gene: {
        title: '🧬 GENES',
        description: 'Genes são segmentos específicos do DNA que contêm instruções para produzir proteínas ou moléculas de RNA funcional. Cada gene ocupa uma posição específica (lócus) no cromossomo.',
        facts: [
            '📊 Humanos têm cerca de 20.000-25.000 genes',
            '📍 Cada gene tem uma posição específica (lócus)',
            '🔤 Alelos são versões diferentes do mesmo gene',
            '💪 Alelo Dominante (V) - Expresso com uma cópia',
            '🌱 Alelo Recessivo (v) - Precisa de duas cópias',
            '🎯 Menos de 2% do DNA codifica proteínas',
            '🧪 Exons: partes codificantes | Introns: partes não codificantes',
        ],
        stats: {
            humanGenes: '20.000-25.000',
            codingDNA: '~2%',
            avgGeneSize: '~27.000 pares de bases',
        },
        details: {
            promotor: 'Região que inicia a transcrição do gene',
            exons: 'Partes que serão traduzidas em proteína',
            introns: 'Partes removidas durante o processamento do RNA',
            codon: 'Sequência de 3 nucleotídeos que codifica um aminoácido',
        }
    },
    dna: {
        title: '🔬 DNA (Ácido Desoxirribonucleico)',
        description: 'O DNA é uma molécula em forma de dupla hélice composta por nucleotídeos. Cada nucleotídeo contém um açúcar (desoxirribose), um grupo fosfato e uma base nitrogenada.',
        facts: [
            '🌀 Estrutura: Dupla hélice antiparalela',
            '📏 ~3,2 bilhões de pares de bases no genoma humano',
            '🔗 Fitas conectadas por ligações de hidrogênio',
            '⚛️ Composto: Açúcar + Fosfato + Base nitrogenada',
            '📐 Uma volta completa = 10 pares de bases = 3,4 nm',
            '📏 Diâmetro da hélice: 2 nm',
            '🧬 Se esticado, o DNA humano teria ~2 metros',
            '🔄 Sulcos maior e menor permitem ligação de proteínas',
        ],
        stats: {
            totalBases: '~3,2 bilhões',
            structure: 'Dupla hélice antiparalela',
            diameter: '2 nm',
            turnLength: '3,4 nm (10 bp)',
        },
        details: {
            backbone: 'Esqueleto açúcar-fosfato que suporta as bases',
            sulcoMaior: 'Permite acesso para proteínas reguladoras',
            sulcoMenor: 'Espaço menor entre as fitas',
            antiparalela: 'Uma fita vai 5\' → 3\' e a outra 3\' → 5\'',
        }
    },
    bases: {
        title: '⚛️ BASES NITROGENADAS',
        description: 'As quatro bases nitrogenadas do DNA formam pares específicos através de ligações de hidrogênio, seguindo a regra de Chargaff. Esta complementaridade é fundamental para a replicação e transcrição do DNA.',
        pairs: [
            {
                base1: 'Adenina (A)',
                base2: 'Timina (T)',
                color1: '#4ade80',
                color2: '#f87171',
                rule: 'A-T: 2 ligações de hidrogênio',
                type: 'Purina-Pirimidina',
            },
            {
                base1: 'Citosina (C)',
                base2: 'Guanina (G)',
                color1: '#60a5fa',
                color2: '#fbbf24',
                rule: 'C-G: 3 ligações de hidrogênio (mais forte)',
                type: 'Pirimidina-Purina',
            },
        ],
        facts: [
            '🔬 Purinas: Adenina (A) e Guanina (G) - 2 anéis',
            '🔬 Pirimidinas: Citosina (C) e Timina (T) - 1 anel',
            '🔗 A-T: 2 ligações de hidrogênio',
            '🔗 C-G: 3 ligações de hidrogênio (ligação mais forte)',
            '📊 Regra de Chargaff: %A = %T e %C = %G',
            '🧬 RNA: Timina é substituída por Uracila (U)',
            '⚡ Sequência das bases = Código genético',
        ],
        details: {
            purina: 'Base com dois anéis aromáticos (A e G)',
            pirimidina: 'Base com um anel aromático (C e T)',
            hidrogenio: 'Ligações fracas que permitem separação das fitas',
            chargaff: 'A quantidade de A sempre igual a T, C igual a G',
        }
    },
    replication: {
        title: '🔄 REPLICAÇÃO DO DNA',
        description: 'A replicação é o processo pelo qual o DNA se duplica antes da divisão celular, garantindo que cada célula-filha receba uma cópia idêntica do material genético.',
        facts: [
            '🔓 Helicase: "abre" a dupla hélice',
            '🎯 Primase: adiciona primer (iniciador)',
            '✏️ DNA Polimerase: sintetiza a nova fita (5\' → 3\')',
            '🔗 Ligase: une os fragmentos de Okazaki',
            '⚡ Semiconservativa: cada nova molécula tem uma fita antiga',
            '🔍 Proofreading: correção de erros pela polimerase',
            '📍 Origem de replicação: ponto de início',
            '🔀 Forquilha de replicação: estrutura em Y',
        ],
        stats: {
            speed: '~1000 nucleotídeos/segundo',
            accuracy: '1 erro a cada 10⁹ bases',
            enzymes: 'Helicase, Primase, Polimerase, Ligase',
        },
        pairs: [],
        details: {
            leading: 'Fita líder: sintetizada continuamente',
            lagging: 'Fita retardada: fragmentos de Okazaki',
            okazaki: 'Pequenos fragmentos na fita retardada',
            topoisomerase: 'Alivia a tensão de torção do DNA',
        }
    },
    transcription: {
        title: '📝 TRANSCRIÇÃO',
        description: 'A transcrição é o processo de síntese de RNA a partir de uma fita molde de DNA. É o primeiro passo da expressão gênica.',
        facts: [
            '🔓 RNA Polimerase: enzima principal',
            '📍 Promotor: sequência que inicia a transcrição',
            '🎯 Fatores de transcrição: proteínas auxiliares',
            '📝 RNA mensageiro (mRNA): carrega a informação',
            '🔄 No RNA, Uracila (U) substitui Timina (T)',
            '✂️ Splicing: remoção dos introns',
            '🧢 Cap 5\': proteção do mRNA',
            '📏 Cauda Poli-A: estabilidade do mRNA',
        ],
        stats: {
            enzyme: 'RNA Polimerase II (para mRNA)',
            direction: 'Sempre 5\' → 3\'',
            template: 'Fita molde 3\' → 5\'',
        },
        pairs: [],
        details: {
            iniciacao: 'Ligação da RNA pol ao promotor',
            elongacao: 'Síntese do RNA',
            terminacao: 'Liberação do RNA produzido',
        }
    },
    translation: {
        title: '🏭 TRADUÇÃO',
        description: 'A tradução é o processo de síntese de proteínas nos ribossomos, usando a informação contida no mRNA.',
        facts: [
            '📖 Códon: sequência de 3 nucleotídeos no mRNA',
            '🔑 Anticódon: sequência complementar no tRNA',
            '🏗️ Ribossomo: "fábrica" de proteínas',
            '🧱 tRNA: transporta aminoácidos',
            '▶️ AUG: códon de início (metionina)',
            '⏹️ UAA, UAG, UGA: códons de parada',
            '🔗 64 códons diferentes, 20 aminoácidos',
            '📊 Código genético é degenerado (redundante)',
        ],
        stats: {
            codons: 64,
            aminoacids: 20,
            startCodon: 'AUG (Metionina)',
            stopCodons: 'UAA, UAG, UGA',
        },
        pairs: [],
        details: {
            iniciacao: 'Montagem do ribossomo no mRNA',
            elongacao: 'Adição de aminoácidos à cadeia',
            terminacao: 'Liberação da proteína',
        }
    },
}

export type ZoomLevel = 'chromosome' | 'gene' | 'dna' | 'bases' | 'replication' | 'transcription' | 'translation'

export const ZOOM_LEVELS: ZoomLevel[] = ['chromosome', 'gene', 'dna', 'bases']

export const PROCESS_LEVELS: ZoomLevel[] = ['replication', 'transcription', 'translation']

export const ALL_LEVELS: ZoomLevel[] = [...ZOOM_LEVELS, ...PROCESS_LEVELS]

export const BASE_COLORS = {
    A: '#4ade80', // Verde - Adenina
    T: '#f87171', // Vermelho - Timina
    C: '#60a5fa', // Azul - Citosina
    G: '#fbbf24', // Amarelo - Guanina
    U: '#c084fc', // Roxo - Uracila (RNA)
}

export const STRUCTURE_COLORS = {
    backbone: '#94a3b8',      // Cinza - Esqueleto
    phosphate: '#f97316',     // Laranja - Fosfato
    sugar: '#818cf8',         // Índigo - Açúcar
    hydrogen: '#ffffff',       // Branco - Ligação H
    helicase: '#ec4899',      // Rosa - Helicase
    polymerase: '#14b8a6',    // Verde-água - Polimerase
    primase: '#8b5cf6',       // Violeta - Primase
    ligase: '#eab308',        // Amarelo - Ligase
}

export const GENETIC_CODE: Record<string, string> = {
    'UUU': 'Phe', 'UUC': 'Phe', 'UUA': 'Leu', 'UUG': 'Leu',
    'CUU': 'Leu', 'CUC': 'Leu', 'CUA': 'Leu', 'CUG': 'Leu',
    'AUU': 'Ile', 'AUC': 'Ile', 'AUA': 'Ile', 'AUG': 'Met',
    'GUU': 'Val', 'GUC': 'Val', 'GUA': 'Val', 'GUG': 'Val',
    'UCU': 'Ser', 'UCC': 'Ser', 'UCA': 'Ser', 'UCG': 'Ser',
    'CCU': 'Pro', 'CCC': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro',
    'ACU': 'Thr', 'ACC': 'Thr', 'ACA': 'Thr', 'ACG': 'Thr',
    'GCU': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
    'UAU': 'Tyr', 'UAC': 'Tyr', 'UAA': 'Stop', 'UAG': 'Stop',
    'CAU': 'His', 'CAC': 'His', 'CAA': 'Gln', 'CAG': 'Gln',
    'AAU': 'Asn', 'AAC': 'Asn', 'AAA': 'Lys', 'AAG': 'Lys',
    'GAU': 'Asp', 'GAC': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu',
    'UGU': 'Cys', 'UGC': 'Cys', 'UGA': 'Stop', 'UGG': 'Trp',
    'CGU': 'Arg', 'CGC': 'Arg', 'CGA': 'Arg', 'CGG': 'Arg',
    'AGU': 'Ser', 'AGC': 'Ser', 'AGA': 'Arg', 'AGG': 'Arg',
    'GGU': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly',
}

export const DNA_FACTS = [
    { category: 'Estrutura', fact: 'A dupla hélice do DNA foi descoberta por Watson e Crick em 1953' },
    { category: 'Tamanho', fact: 'O DNA de uma única célula humana, se esticado, teria cerca de 2 metros' },
    { category: 'Genoma', fact: 'O genoma humano tem aproximadamente 3,2 bilhões de pares de bases' },
    { category: 'Genes', fact: 'Apenas cerca de 2% do DNA codifica proteínas' },
    { category: 'Mitocondrial', fact: 'As mitocôndrias têm seu próprio DNA circular, herdado da mãe' },
    { category: 'Replicação', fact: 'O DNA é replicado com precisão de 99,9999999%' },
    { category: 'Mutação', fact: 'Cerca de 100-200 novas mutações ocorrem a cada geração humana' },
    { category: 'Identidade', fact: 'Humanos compartilham 99,9% do DNA entre si' },
    { category: 'Parentesco', fact: 'Compartilhamos cerca de 98,8% do DNA com chimpanzés' },
    { category: 'Telômeros', fact: 'Telômeros encurtam a cada divisão celular, relacionados ao envelhecimento' },
]
