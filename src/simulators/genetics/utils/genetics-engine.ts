import type { Chromosome, Individual, Offspring, ExperimentConfig, Gene, GeneStatistics, ExperimentStatistics } from '../types'
import { getAlleleBySymbol } from '../data/sample-genes'

// Gera um descendente a partir de dois pais
export function generateOffspring(
    parent1: Individual,
    parent2: Individual,
    config: ExperimentConfig,
    genes: Gene[],
    generation: number
): Offspring {
    // Simula crossing-over se necessário
    const maternalChromosome = simulateMeiosis(parent1.maternal, parent1.paternal, config.recombinationRate)
    const paternalChromosome = simulateMeiosis(parent2.maternal, parent2.paternal, config.recombinationRate)

    // Aplica mutações
    applyMutations(maternalChromosome, config.mutationRate, genes)
    applyMutations(paternalChromosome, config.mutationRate, genes)

    const offspring: Offspring = {
        id: `offspring-${generation}-${Math.random().toString(36).substr(2, 9)}`,
        maternal: maternalChromosome,
        paternal: paternalChromosome,
        phenotype: new Map(),
        generation
    }

    // Calcula fenótipo para cada gene
    genes.forEach(gene => {
        const phenotype = calculatePhenotype(gene, offspring)
        offspring.phenotype.set(gene.id, phenotype)
    })

    return offspring
}

// Simula meiose com possível crossing-over
function simulateMeiosis(chr1: Chromosome, chr2: Chromosome, recombinationRate: number): Chromosome {
    const newGenes = new Map<string, string>()

    // Decide se ocorre crossing-over
    const hasCrossover = Math.random() < (recombinationRate / 100)

    if (!hasCrossover) {
        // Sem crossing-over: escolhe aleatoriamente um dos cromossomos parentais
        const selectedChr = Math.random() < 0.5 ? chr1 : chr2
        selectedChr.genes.forEach((allele, geneId) => {
            newGenes.set(geneId, allele)
        })
    } else {
        // Com crossing-over: mistura genes baseado em posição de corte
        chr1.genes.forEach((_, geneId) => {
            // Precisamos saber a posição do gene (locus) para decidir de qual cromossomo vem
            // Por simplicidade, usamos 50/50 para cada gene após o ponto de crossing-over
            const useChr1 = Math.random() < 0.5
            const allele = useChr1 ? chr1.genes.get(geneId)! : chr2.genes.get(geneId)!
            newGenes.set(geneId, allele)
        })
    }

    return {
        id: `chr-${Math.random().toString(36).substr(2, 9)}`,
        genes: newGenes,
        color: Math.random() < 0.5 ? chr1.color : chr2.color,
        isPaternal: Math.random() < 0.5
    }
}

// Aplica mutações aleatórias
function applyMutations(chromosome: Chromosome, mutationRate: number, genes: Gene[]) {
    chromosome.genes.forEach((currentAllele, geneId) => {
        if (Math.random() < (mutationRate / 100)) {
            // Mutação! Troca para outro alelo
            const gene = genes.find(g => g.id === geneId)
            if (gene && gene.alleles.length > 1) {
                const otherAlleles = gene.alleles.filter(a => a.symbol !== currentAllele)
                if (otherAlleles.length > 0) {
                    const newAllele = otherAlleles[Math.floor(Math.random() * otherAlleles.length)]
                    chromosome.genes.set(geneId, newAllele.symbol)
                }
            }
        }
    })
}

// Calcula fenótipo baseado em genótipo e dominância
export function calculatePhenotype(gene: Gene, individual: Individual | Offspring): string {
    const maternalAlleleSymbol = individual.maternal.genes.get(gene.id) || ''
    const paternalAlleleSymbol = individual.paternal.genes.get(gene.id) || ''

    const maternalAllele = getAlleleBySymbol(gene, maternalAlleleSymbol)
    const paternalAllele = getAlleleBySymbol(gene, paternalAlleleSymbol)

    if (!maternalAllele || !paternalAllele) return 'Desconhecido'

    // Se pelo menos um alelo é dominante, fenótipo é dominante
    if (maternalAllele.isDominant || paternalAllele.isDominant) {
        const dominant = maternalAllele.isDominant ? maternalAllele : paternalAllele
        return dominant.name
    }

    // Ambos recessivos
    return maternalAllele.name
}

// Obtém genótipo como string (ex: "Vv", "VV", "vv")
export function getGenotype(gene: Gene, individual: Individual | Offspring): string {
    const maternal = individual.maternal.genes.get(gene.id) || '?'
    const paternal = individual.paternal.genes.get(gene.id) || '?'

    // Ordena alfabeticamente (maiúscula primeiro)
    const sorted = [maternal, paternal].sort((a, b) => {
        if (a === a.toUpperCase() && b === b.toLowerCase()) return -1
        if (a === a.toLowerCase() && b === b.toUpperCase()) return 1
        return a.localeCompare(b)
    })

    return sorted.join('')
}

// Calcula estatísticas de uma população de descendentes
export function calculateStatistics(offspring: Offspring[], genes: Gene[]): ExperimentStatistics {
    const geneStats: GeneStatistics[] = genes.map(gene => {
        const alleleFreq = new Map<string, number>()
        const phenotypeFreq = new Map<string, number>()

        offspring.forEach(child => {
            // Conta alelos
            const maternal = child.maternal.genes.get(gene.id)
            const paternal = child.paternal.genes.get(gene.id)

            if (maternal) {
                alleleFreq.set(maternal, (alleleFreq.get(maternal) || 0) + 1)
            }
            if (paternal) {
                alleleFreq.set(paternal, (alleleFreq.get(paternal) || 0) + 1)
            }

            // Conta fenótipos
            const phenotype = child.phenotype.get(gene.id) || 'Desconhecido'
            phenotypeFreq.set(phenotype, (phenotypeFreq.get(phenotype) || 0) + 1)
        })

        return {
            geneId: gene.id,
            geneName: gene.name,
            alleleFrequencies: alleleFreq,
            phenotypeFrequencies: phenotypeFreq,
            expectedRatio: '3:1' // Simplificado para heterozigoto x heterozigoto
        }
    })

    return {
        totalOffspring: offspring.length,
        geneStats,
        mendelianRatioMatch: checkMendelianRatio(geneStats)
    }
}

// Verifica se a proporção se aproxima de 3:1 (Mendeliano)
function checkMendelianRatio(stats: GeneStatistics[]): boolean {
    // Simplificado: verifica se razão dominante:recessivo está entre 2:1 e 4:1
    // (3:1 é esperado, mas com variação estatística)
    return stats.every(stat => {
        const phenotypes = Array.from(stat.phenotypeFrequencies.values())
        if (phenotypes.length !== 2) return false

        const [first, second] = phenotypes.sort((a, b) => b - a)
        const ratio = first / second

        return ratio >= 2 && ratio <= 4
    })
}

// Cria um indivíduo inicial com alelos especificados
export function createIndividual(
    maternalAlleles: Map<string, string>,
    paternalAlleles: Map<string, string>
): Individual {
    return {
        id: `parent-${Math.random().toString(36).substr(2, 9)}`,
        maternal: {
            id: `chr-m-${Math.random().toString(36).substr(2, 9)}`,
            genes: new Map(maternalAlleles),
            color: '#ff6b9d',
            isPaternal: false
        },
        paternal: {
            id: `chr-p-${Math.random().toString(36).substr(2, 9)}`,
            genes: new Map(paternalAlleles),
            color: '#4d7cfe',
            isPaternal: true
        }
    }
}
