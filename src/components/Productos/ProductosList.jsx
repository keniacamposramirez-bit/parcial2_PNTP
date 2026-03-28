import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

function ProductosList() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        nombre: '', descripcion: '', precio: '', stock: '',
        marca_id: '', categoria_id: '', proveedor_id: '', estado: true
    });
    const [editing, setEditing] = useState(null);
    const [marcas, setMarcas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);

    const fetchData = async () => {
        try {
            const [productosRes, marcasRes, categoriasRes, proveedoresRes] = await Promise.all([
                api.get('/productos'),
                api.get('/marcas'),
                api.get('/categorias'),
                api.get('/proveedores')
            ]);
            setProductos(productosRes.data.data);
            setMarcas(marcasRes.data.data);
            setCategorias(categoriasRes.data.data);
            setProveedores(proveedoresRes.data.data);
        } catch (err) {
            console.error(err);
            alert('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/productos/${editing.id}`, form);
                alert('Producto actualizado');
            } else {
                await api.post('/productos', form);
                alert('Producto creado');
            }
            setForm({ nombre: '', descripcion: '', precio: '', stock: '', marca_id: '', categoria_id: '', proveedor_id: '', estado: true });
            setEditing(null);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Error al guardar');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar producto?')) return;
        try {
            await api.delete(`/productos/${id}`);
            alert('Producto eliminado');
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Error al eliminar');
        }
    };

    const handleRestore = async (id) => {
        if (!confirm('¿Restaurar producto?')) return;
        try {
            await api.post(`/productos/${id}/restore`);
            alert('Producto restaurado');
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Error al restaurar');
        }
    };

    const getMarcaNombre = (id) => marcas.find(m => m.id === id)?.nombre || '-';
    const getCategoriaNombre = (id) => categorias.find(c => c.id === id)?.nombre || '-';
    const getProveedorNombre = (id) => proveedores.find(p => p.id === id)?.nombre || '-';

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            <h2>Productos</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nombre *" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
                <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                <input type="number" step="0.01" placeholder="Precio *" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required />
                <input type="number" placeholder="Stock *" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />

                <select value={form.marca_id} onChange={e => setForm({ ...form, marca_id: e.target.value })} required>
                    <option value="">Seleccione Marca</option>
                    {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>

                <select value={form.categoria_id} onChange={e => setForm({ ...form, categoria_id: e.target.value })} required>
                    <option value="">Seleccione Categoría</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>

                <select value={form.proveedor_id} onChange={e => setForm({ ...form, proveedor_id: e.target.value })} required>
                    <option value="">Seleccione Proveedor</option>
                    {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>

                <label>
                    <input type="checkbox" checked={form.estado} onChange={e => setForm({ ...form, estado: e.target.checked })} /> Activo
                </label>

                <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
                {editing && <button type="button" onClick={() => { setEditing(null); setForm({ nombre: '', descripcion: '', precio: '', stock: '', marca_id: '', categoria_id: '', proveedor_id: '', estado: true }); }}>Cancelar</button>}
            </form>

            <table border="1" cellPadding="8">
                <thead>
                    <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Marca</th><th>Categoría</th><th>Proveedor</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {productos.map(p => (
                        <tr key={p.id} style={{ opacity: p.deleted_at ? 0.6 : 1 }}>
                            <td>{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>${p.precio}</td>
                            <td>{p.stock}</td>
                            <td>{getMarcaNombre(p.marca_id)}</td>
                            <td>{getCategoriaNombre(p.categoria_id)}</td>
                            <td>{getProveedorNombre(p.proveedor_id)}</td>
                            <td>{p.estado ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                {!p.deleted_at ? (
                                    <>
                                        <button onClick={() => { setEditing(p); setForm({ nombre: p.nombre, descripcion: p.descripcion || '', precio: p.precio, stock: p.stock, marca_id: p.marca_id, categoria_id: p.categoria_id, proveedor_id: p.proveedor_id, estado: p.estado }); }}>Editar</button>
                                        <button onClick={() => handleDelete(p.id)}>Eliminar</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleRestore(p.id)}>Restaurar</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductosList;
