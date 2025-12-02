// ==================== TIPOS DE MODO ====================
export type ModeLevel = 'basic' | 'intermediate' | 'advanced'

// ==================== FASES POR MODO ====================

// Modo Básico - 7 fases
export type BasicPhase =
    | 'Intérfase'
    | 'Prófase'
    | 'Metáfase'
    | 'Anáfase'
    | 'Telófase'
    | 'Citocinese'
    | 'Células-Filhas'

// Modo Intermediário - 13 fases (mitose detalhada)
export type IntermediatePhase =
    | 'Intérfase-G1'
    | 'Intérfase-S'
    | 'Intérfase-G2'
    | 'Prófase-Inicial'
    | 'Prófase-Tardia'
    | 'Prometáfase'
    | 'Metáfase'
    | 'Anáfase-A'
    | 'Anáfase-B'
    | 'Telófase'
    | 'Citocinese'
    | 'Células-Filhas-G1'
    | 'Interfase-G0'

// Modo Avançado - Meiose (20+ fases)
export type AdvancedPhase =
    | 'Intérfase-Pré-Meiótica'
    | 'Prófase-I'
    | 'Crossing-Over'
    | 'Metáfase-I'
    | 'Anáfase-I'
    | 'Telófase-I'
    | 'Citocinese-I'
    | 'Células-Intermediárias'
    | 'Prófase-II'
    | 'Metáfase-II'
    | 'Anáfase-II'
    | 'Telófase-II'
    | 'Citocinese-II'
    | 'Gametas'

// Tipo união para todas as fases
export type Phase = BasicPhase | IntermediatePhase | AdvancedPhase

// ==================== CONSTANTES DE FASES ====================

export const BASIC_PHASES: BasicPhase[] = [
    'Intérfase',
    'Prófase',
    'Metáfase',
    'Anáfase',
    'Telófase',
    'Citocinese',
    'Células-Filhas'
]

export const INTERMEDIATE_PHASES: IntermediatePhase[] = [
    'Intérfase-G1',
    'Intérfase-S',
    'Intérfase-G2',
    'Prófase-Inicial',
    'Prófase-Tardia',
    'Prometáfase',
    'Metáfase',
    'Anáfase-A',
    'Anáfase-B',
    'Telófase',
    'Citocinese',
    'Células-Filhas-G1',
]

export const ADVANCED_PHASES: AdvancedPhase[] = [
    'Intérfase-Pré-Meiótica',
    'Prófase-I',
    'Crossing-Over',
    'Metáfase-I',
    'Anáfase-I',
    'Telófase-I',
    'Citocinese-I',
    'Células-Intermediárias',
    'Prófase-II',
    'Metáfase-II',
    'Anáfase-II',
    'Telófase-II',
    'Citocinese-II',
    'Gametas'
]

// ==================== DESCRIÇÕES DAS FASES ====================

export const BASIC_DESCRIPTIONS: Record<BasicPhase, string> = {
    'Intérfase': 'A célula cresce e duplica seu DNA. Os cromossomos estão descondensados.',
    'Prófase': 'Os cromossomos se condensam. O envelope nuclear começa a desaparecer.',
    'Metáfase': 'Os cromossomos se alinham no centro da célula (placa equatorial).',
    'Anáfase': 'As cromátides irmãs são separadas e puxadas para os polos opostos.',
    'Telófase': 'Os novos núcleos se formam ao redor dos cromossomos em cada polo.',
    'Citocinese': 'O citoplasma se divide, formando duas células distintas.',
    'Células-Filhas': 'Duas células-filhas idênticas e independentes foram formadas.'
}

export const INTERMEDIATE_DESCRIPTIONS: Record<IntermediatePhase, string> = {
    'Intérfase-G1': 'Fase G1: A célula cresce e realiza suas funções normais. Organelas são duplicadas.',
    'Intérfase-S': 'Fase S: O DNA é replicado. Cada cromossomo é duplicado formando cromátides irmãs.',
    'Intérfase-G2': 'Fase G2: A célula continua crescendo e se prepara para a divisão. Proteínas essenciais são sintetizadas.',
    'Prófase-Inicial': 'Os cromossomos começam a se condensar. Centríolos migram para os polos.',
    'Prófase-Tardia': 'Cromossomos totalmente condensados. Envelope nuclear se desintegra completamente.',
    'Prometáfase': 'Cromossomos se ligam às fibras do fuso através dos cinetócoros.',
    'Metáfase': 'Todos os cromossomos estão alinhados na placa equatorial (metafásica).',
    'Anáfase-A': 'As cromátides irmãs se separam e começam a migrar para os polos opostos.',
    'Anáfase-B': 'Os polos da célula se afastam, alongando ainda mais a célula.',
    'Telófase': 'Novos envelopes nucleares se formam ao redor de cada conjunto de cromossomos.',
    'Citocinese': 'Formação do sulco de clivagem. A membrana celular se contrai dividindo a célula.',
    'Células-Filhas-G1': 'Duas células-filhas idênticas em fase G1, prontas para crescer.',
    'Interfase-G0': 'Fase G0: Estado de quiescência. A célula sai do ciclo celular temporariamente.',
}

export const ADVANCED_DESCRIPTIONS: Record<AdvancedPhase, string> = {
    'Intérfase-Pré-Meiótica': 'A célula duplica seu DNA em preparação para meiose. Células diploides (2n).',
    'Prófase-I': 'Cromossomos homólogos se pareiam formando tétrades. Processo mais longo da meiose.',
    'Crossing-Over': 'Recombinação genética! Cromátides não-irmãs trocam segmentos de DNA.',
    'Metáfase-I': 'Pares de cromossomos homólogos se alinham na placa equatorial.',
    'Anáfase-I': 'Cromossomos homólogos (não cromátides irmãs) são separados para polos opostos.',
    'Telófase-I': 'Formação de dois núcleos. Cada um com metade do número de cromossomos.',
    'Citocinese-I': 'Divisão em duas células haploides (n). Cromátides ainda unidas.',
    'Células-Intermediárias': 'Duas células haploides com cromossomos duplicados. Breve intérfase.',
    'Prófase-II': 'Nas duas células: cromossomos se condensam novamente. Sem replicação de DNA.',
    'Metáfase-II': 'Cromossomos se alinham na placa equatorial em cada uma das duas células.',
    'Anáfase-II': 'Cromátides irmãs finalmente se separam em cada célula.',
    'Telófase-II': 'Formação de quatro núcleos haploides.',
    'Citocinese-II': 'Divisão final resultando em quatro células.',
    'Gametas': 'Quatro gametas haploides geneticamente únicos! (espermatozoides ou óvulos)'
}

// ==================== HELPERS ====================

export function getPhasesForMode(mode: ModeLevel): Phase[] {
    switch (mode) {
        case 'basic':
            return BASIC_PHASES
        case 'intermediate':
            return INTERMEDIATE_PHASES
        case 'advanced':
            return ADVANCED_PHASES
    }
}

export function getDescriptionForPhase(phase: Phase): string {
    if (BASIC_PHASES.includes(phase as BasicPhase)) {
        return BASIC_DESCRIPTIONS[phase as BasicPhase]
    }
    if (INTERMEDIATE_PHASES.includes(phase as IntermediatePhase)) {
        return INTERMEDIATE_DESCRIPTIONS[phase as IntermediatePhase]
    }
    if (ADVANCED_PHASES.includes(phase as AdvancedPhase)) {
        return ADVANCED_DESCRIPTIONS[phase as AdvancedPhase]
    }
    return 'Descrição não disponível'
}

export const MODE_NAMES: Record<ModeLevel, string> = {
    basic: '🎓 Básico - Mitose Simplificada',
    intermediate: '📚 Intermediário - Mitose Detalhada',
    advanced: '🧬 Avançado - Meiose Completa'
}
