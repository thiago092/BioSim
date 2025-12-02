import type { Gene, Allele } from '../types'

// ============== ERVILHAS DE MENDEL - 7 CARACTERÍSTICAS CLÁSSICAS ==============

// 1. COR DA SEMENTE (Verde x Amarela)
const greenSeedAllele: Allele = {
    symbol: 'Y',
    name: 'Amarela',
    color: '#fbbf24',
    isDominant: true
}

const yellowSeedAllele: Allele = {
    symbol: 'y',
    name: 'Verde',
    color: '#22c55e',
    isDominant: false
}

// 2. FORMA DA SEMENTE (Lisa x Rugosa)
const smoothAllele: Allele = {
    symbol: 'R',
    name: 'Lisa',
    color: '#60a5fa',
    isDominant: true
}

const wrinkledAllele: Allele = {
    symbol: 'r',
    name: 'Rugosa',
    color: '#a78bfa',
    isDominant: false
}

// 3. COR DA FLOR (Púrpura x Branca)
const purpleFlowerAllele: Allele = {
    symbol: 'P',
    name: 'Púrpura',
    color: '#a855f7',
    isDominant: true
}

const whiteFlowerAllele: Allele = {
    symbol: 'p',
    name: 'Branca',
    color: '#f1f5f9',
    isDominant: false
}

// 4. POSIÇÃO DA FLOR (Axial x Terminal)
const axialFlowerAllele: Allele = {
    symbol: 'A',
    name: 'Axial',
    color: '#14b8a6',
    isDominant: true
}

const terminalFlowerAllele: Allele = {
    symbol: 'a',
    name: 'Terminal',
    color: '#f97316',
    isDominant: false
}

// 5. COR DA VAGEM (Verde x Amarela)
const greenPodAllele: Allele = {
    symbol: 'G',
    name: 'Verde',
    color: '#16a34a',
    isDominant: true
}

const yellowPodAllele: Allele = {
    symbol: 'g',
    name: 'Amarela',
    color: '#eab308',
    isDominant: false
}

// 6. FORMA DA VAGEM (Inflada x Contraída)
const inflatedPodAllele: Allele = {
    symbol: 'I',
    name: 'Inflada',
    color: '#06b6d4',
    isDominant: true
}

const constrictedPodAllele: Allele = {
    symbol: 'i',
    name: 'Contraída',
    color: '#ec4899',
    isDominant: false
}

// 7. ALTURA DA PLANTA (Alta x Baixa)
const tallAllele: Allele = {
    symbol: 'T',
    name: 'Alta',
    color: '#84cc16',
    isDominant: true
}

const dwarfAllele: Allele = {
    symbol: 't',
    name: 'Baixa (anã)',
    color: '#f43f5e',
    isDominant: false
}

// ============== DEFINIÇÃO DOS GENES ==============

export const SEED_COLOR_GENE: Gene = {
    id: 'seed-color',
    name: 'Cor da Semente',
    locus: 0.15,
    alleles: [greenSeedAllele, yellowSeedAllele],
    description: 'Determina a cor do cotilédone. Amarelo (Y) é dominante sobre verde (y). Mendel observou proporção 3:1 em F2.'
}

export const SEED_TEXTURE_GENE: Gene = {
    id: 'seed-texture',
    name: 'Forma da Semente',
    locus: 0.3,
    alleles: [smoothAllele, wrinkledAllele],
    description: 'Determina a textura da semente. Lisa (R) é dominante sobre rugosa (r). Sementes rugosas têm menos amido.'
}

export const FLOWER_COLOR_GENE: Gene = {
    id: 'flower-color',
    name: 'Cor da Flor',
    locus: 0.45,
    alleles: [purpleFlowerAllele, whiteFlowerAllele],
    description: 'Determina a pigmentação da flor. Púrpura (P) é dominante. A cor branca resulta da ausência de antocianina.'
}

export const FLOWER_POSITION_GENE: Gene = {
    id: 'flower-position',
    name: 'Posição da Flor',
    locus: 0.55,
    alleles: [axialFlowerAllele, terminalFlowerAllele],
    description: 'Determina onde as flores crescem. Axial (A) = ao longo do caule. Terminal (a) = apenas no topo.'
}

export const POD_COLOR_GENE: Gene = {
    id: 'pod-color',
    name: 'Cor da Vagem',
    locus: 0.7,
    alleles: [greenPodAllele, yellowPodAllele],
    description: 'Cor da vagem imatura. Verde (G) é dominante. Vagens amarelas são mais maduras/secas.'
}

export const POD_SHAPE_GENE: Gene = {
    id: 'pod-shape',
    name: 'Forma da Vagem',
    locus: 0.85,
    alleles: [inflatedPodAllele, constrictedPodAllele],
    description: 'Forma da vagem. Inflada (I) é dominante sobre contraída (i). Afeta o desenvolvimento das sementes.'
}

export const PLANT_HEIGHT_GENE: Gene = {
    id: 'plant-height',
    name: 'Altura da Planta',
    locus: 0.95,
    alleles: [tallAllele, dwarfAllele],
    description: 'Altura da planta adulta. Alta (T) ~180cm. Anã (t) ~45cm. Relacionado ao hormônio giberelina.'
}

// Lista de todos os genes - começamos com os 3 mais importantes
export const AVAILABLE_GENES: Gene[] = [
    SEED_COLOR_GENE,
    SEED_TEXTURE_GENE,
    FLOWER_COLOR_GENE
]

// Todos os 7 genes de Mendel
export const ALL_MENDEL_GENES: Gene[] = [
    SEED_COLOR_GENE,
    SEED_TEXTURE_GENE,
    FLOWER_COLOR_GENE,
    FLOWER_POSITION_GENE,
    POD_COLOR_GENE,
    POD_SHAPE_GENE,
    PLANT_HEIGHT_GENE
]

// Helper para obter alelo por símbolo
export function getAlleleBySymbol(gene: Gene, symbol: string): Allele | undefined {
    return gene.alleles.find(a => a.symbol === symbol)
}

// Helper para obter alelo dominante
export function getDominantAllele(gene: Gene): Allele {
    return gene.alleles.find(a => a.isDominant) || gene.alleles[0]
}

// Helper para obter alelo recessivo
export function getRecessiveAllele(gene: Gene): Allele {
    return gene.alleles.find(a => !a.isDominant) || gene.alleles[1]
}

// Dados históricos de Mendel
export const MENDEL_DATA = {
    seedColor: { dominant: 6022, recessive: 2001, ratio: '3.01:1' },
    seedShape: { dominant: 5474, recessive: 1850, ratio: '2.96:1' },
    flowerColor: { dominant: 705, recessive: 224, ratio: '3.15:1' },
    flowerPosition: { dominant: 651, recessive: 207, ratio: '3.14:1' },
    podColor: { dominant: 428, recessive: 152, ratio: '2.82:1' },
    podShape: { dominant: 882, recessive: 299, ratio: '2.95:1' },
    plantHeight: { dominant: 787, recessive: 277, ratio: '2.84:1' }
}

// Informações sobre os experimentos de Mendel
export const MENDEL_INFO = {
    period: '1856-1863',
    location: 'Mosteiro de São Tomás, Brno (atual República Tcheca)',
    totalPlants: 'Mais de 28.000 plantas',
    generations: '8 gerações estudadas',
    publication: 'Experimentos com Híbridos de Plantas (1866)',
    rediscovery: '1900 - De Vries, Correns e Tschermak'
}
