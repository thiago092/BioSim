// ==================== TIPOS BÁSICOS ====================

export interface Allele {
    symbol: string // Ex: 'V' ou 'v'
    name: string // Ex: 'Verde' ou 'Amarela'
    color: string // Cor para visualização
    isDominant: boolean
}

export interface Gene {
    id: string
    name: string // Ex: 'Cor da Semente'
    locus: number // Posição no cromossomo (0-1)
    alleles: Allele[] // Lista de alelos possíveis
    description: string
}

export interface Chromosome {
    id: string
    genes: Map<string, string> // geneId -> allele symbol
    color: string // Cor do cromossomo
    isPaternal: boolean // true = paterno, false = materno
}

export interface Individual {
    id: string
    maternal: Chromosome
    paternal: Chromosome
}

export interface Offspring extends Individual {
    phenotype: Map<string, string> // geneId -> fenótipo observado
    generation: number
}

// ==================== CONFIGURAÇÕES DE EXPERIMENTO ====================

export interface ExperimentConfig {
    numOffspring: number // 1-100
    recombinationRate: number // 0-50% (probabilidade de crossing-over)
    mutationRate: number // 0-20% (probabilidade de mutação)
    parentalAlleles: {
        maternal: Map<string, string> // geneId -> allele symbol
        paternal: Map<string, string>
    }
}

// ==================== ESTATÍSTICAS ====================

export interface GeneStatistics {
    geneId: string
    geneName: string
    alleleFrequencies: Map<string, number> // allele symbol -> count
    phenotypeFrequencies: Map<string, number> // phenotype -> count
    expectedRatio?: string // Ex: "3:1" or "9:3:3:1"
}

export interface ExperimentStatistics {
    totalOffspring: number
    geneStats: GeneStatistics[]
    mendelianRatioMatch: boolean
}

// ==================== CROSSING-OVER ====================

export interface CrossoverEvent {
    position: number // 0-1 (posição relativa no cromossomo)
    affectedGenes: string[] // IDs dos genes afetados
}

// ==================== MODO DE SIMULAÇÃO ====================

export type SimulationMode = 'simple' | 'linked' | 'multi-gene'

// Simple: 1 gene, herança mendeliana básica
// Linked: 2+ genes próximos (linkage)
// Multi-gene: 2+ genes independentes
