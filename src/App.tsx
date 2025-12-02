import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CellDivisionSimulator } from './simulators/cell-division/CellDivisionSimulator'
import { GeneticsSimulator } from './simulators/genetics/GeneticsSimulator'
import { DNAExplorer } from './simulators/dna/DNAExplorer'
import { SolarSystemSimulator } from './simulators/solar-system/SolarSystemSimulator'
import { NavigationMenu } from './shared/components/NavigationMenu'

function App() {
  return (
    <Router>
      <NavigationMenu />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cell-division" element={<CellDivisionSimulator />} />
        <Route path="/genetics" element={<GeneticsSimulator />} />
        <Route path="/dna" element={<DNAExplorer />} />
        <Route path="/solar-system" element={<SolarSystemSimulator />} />
      </Routes>
    </Router>
  )
}

export default App
