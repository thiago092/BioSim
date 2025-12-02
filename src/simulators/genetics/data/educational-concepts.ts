export interface EducationalConcept {
    id: string
    title: string
    description: string
    example: string
    icon: string
}

export const GENETICS_CONCEPTS: EducationalConcept[] = [
    {
        id: 'dna',
        title: 'DNA (Ácido Desoxirribonucleico)',
        description: 'Molécula que contém as instruções genéticas para o desenvolvimento e funcionamento de todos os organismos vivos. É formada por duas cadeias em forma de dupla hélice.',
        example: 'O DNA é como um "manual de instruções" do seu corpo, determinando características como cor dos olhos, altura, tipo sanguíneo, etc.',
        icon: '🧬'
    },
    {
        id: 'gene',
        title: 'Gene',
        description: 'Segmento de DNA que contém informações para produzir uma característica específica. Cada gene ocupa uma posição fixa (lócus) no cromossomo.',
        example: 'O gene para cor dos olhos determina se você terá olhos castanhos, azuis, verdes, etc.',
        icon: '🔬'
    },
    {
        id: 'allele',
        title: 'Alelo',
        description: 'Versões diferentes de um mesmo gene. Você herda um alelo da mãe e outro do pai para cada gene.',
        example: 'Para o gene de cor da semente, "V" (verde) e "v" (amarela) são alelos diferentes.',
        icon: '🎨'
    },
    {
        id: 'chromosome',
        title: 'Cromossomo',
        description: 'Estrutura que contém DNA organizado. Humanos têm 23 pares de cromossomos (46 total). Cada par tem um cromossomo da mãe e um do pai.',
        example: 'Imagine os cromossomos como "volumes" de uma enciclopédia genética.',
        icon: '📚'
    },
    {
        id: 'genotype',
        title: 'Genótipo',
        description: 'Combinação de alelos que um indivíduo possui para um gene específico. Representado por letras (ex: VV, Vv, vv).',
        example: 'Se você tem genótipo "Vv" para cor da semente, possui um alelo V e um alelo v.',
        icon: '🔤'
    },
    {
        id: 'phenotype',
        title: 'Fenótipo',
        description: 'Característica observável resultante do genótipo. É o que você realmente vê ou mede.',
        example: 'Mesmo com genótipo "Vv", o fenótipo será "Verde" porque V é dominante.',
        icon: '👁️'
    },
    {
        id: 'dominant',
        title: 'Dominância',
        description: 'Alelo que se expressa mesmo quando presente em apenas uma cópia. Representado por letra MAIÚSCULA.',
        example: 'V (verde) é dominante: VV = verde, Vv = verde. Só vv será amarelo.',
        icon: '🔹'
    },
    {
        id: 'recessive',
        title: 'Recessividade',
        description: 'Alelo que só se expressa quando presente em duas cópias (homozigose). Representado por letra minúscula.',
        example: 'v (amarela) é recessivo: só aparece em vv. Em Vv, o V domina.',
        icon: '🔸'
    },
    {
        id: 'crossover',
        title: 'Crossing-Over (Recombinação)',
        description: 'Troca de segmentos entre cromossomos homólogos durante a meiose. Aumenta a variabilidade genética.',
        example: 'É como "embaralhar" os genes dos seus pais, criando combinações únicas!',
        icon: '🔄'
    },
    {
        id: 'mutation',
        title: 'Mutação',
        description: 'Alteração espontânea no DNA que pode criar novos alelos. Pode ser benéfica, neutra ou prejudicial.',
        example: 'Uma mutação pode mudar um alelo V para v, ou criar um alelo totalmente novo.',
        icon: '⚡'
    },
    {
        id: 'mendel',
        title: 'Lei de Mendel (Segregação)',
        description: 'Os dois alelos de um gene se separam durante a formação dos gametas. Cada gameta recebe apenas um alelo.',
        example: 'Se você é Vv, metade dos seus gametas terá V e metade terá v.',
        icon: '⚖️'
    },
    {
        id: 'ratio',
        title: 'Proporção 3:1',
        description: 'Proporção fenotípica esperada no cruzamento de dois heterozigotos (Vv x Vv). 75% dominante, 25% recessivo.',
        example: 'Vv x Vv → VV (25%), Vv (50%), vv (25%) = 3 verdes : 1 amarelo',
        icon: '📊'
    }
]
