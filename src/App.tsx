import { HashRouter, Routes, Route, Navigate } from 'react-router'
import { ProveedorAuth } from '@/features/auth/contexto-auth'
import { PantallaLogin } from '@/features/auth/pantalla-login'
import { RutaProtegida } from '@/app/ruta-protegida'
import { ShellApp } from '@/app/shell-app'
import { PantallaDieta } from '@/features/dieta/pantalla-dieta'
import { PantallaCompra } from '@/features/compra/pantalla-compra'

function App() {
  return (
    <ProveedorAuth>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<PantallaLogin />} />
          <Route
            path="/app"
            element={
              <RutaProtegida>
                <ShellApp />
              </RutaProtegida>
            }
          >
            <Route index element={<Navigate to="dieta" replace />} />
            <Route path="dieta" element={<PantallaDieta />} />
            <Route path="compra" element={<PantallaCompra />} />
          </Route>
          <Route path="*" element={<Navigate to="/app/dieta" replace />} />
        </Routes>
      </HashRouter>
    </ProveedorAuth>
  )
}

export default App
