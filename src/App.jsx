import React, { useState } from 'react';
import MarcasList from './components/Marcas/MarcasList';
import ProveedoresList from './components/Proveedores/ProveedoresList';
import ProductosList from './components/Productos/ProductosList';
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState('marcas');

    return (
        <div className="App">
            <h1>Catálogos - Parcial 2</h1>
            <div className="tabs">
                <button className={activeTab === 'marcas' ? 'active' : ''} onClick={() => setActiveTab('marcas')}>Marcas</button>
                <button className={activeTab === 'proveedores' ? 'active' : ''} onClick={() => setActiveTab('proveedores')}>Proveedores</button>
                <button className={activeTab === 'productos' ? 'active' : ''} onClick={() => setActiveTab('productos')}>Productos</button>
            </div>
            <div className="tab-content">
                {activeTab === 'marcas' && <MarcasList />}
                {activeTab === 'proveedores' && <ProveedoresList />}
                {activeTab === 'productos' && <ProductosList />}
            </div>
        </div>
    );
}

export default App;