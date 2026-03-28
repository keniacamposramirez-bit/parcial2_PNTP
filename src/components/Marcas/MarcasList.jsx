import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

function MarcasList() {
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ nombre: '', descripcion: '', estado: true });
    const [editing, setEditing] = useState(null);

    const fetchMarcas = async () => {
        try {
            const res = await api.get('/marcas');
            setMarcas(res.data.data);
        } catch (err) {
            console.error(err);
            alert('Error al cargar marcas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarcas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/marcas/${editing.id}`, form);
                alert('Marca actualizada');
            } else {
                await api.post('/marcas', form);
                alert('Marca creada');
            }
            setForm({ nombre: '', descripcion: '', estado: true });
            setEditing(null);
            fetchMarcas();
        } catch (err) {
            console.error(err);
            alert('Error al guardar');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar marca?')) return;
        try {
            await api.delete(`/marcas/${id}`);
            alert('Marca eliminada (soft delete)');
            fetchMarcas();
        } catch (err) {
            console.error(err);
            alert('Error al eliminar');
        }
    };

    const handleRestore = async (id) => {
        if (!confirm('¿Restaurar marca?')) return;
        try {
            await api.post(`/marcas/${id}/restore`);
            alert('Marca restaurada');
            fetchMarcas();
        } catch (err) {
            console.error(err);
            alert('Error al restaurar');
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            <h2>Marcas</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={form.estado}
                        onChange={(e) => setForm({ ...form, estado: e.target.checked })}
                    /> Activo
                </label>
                <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
                {editing && <button type="button" onClick={() => { setEditing(null); setForm({ nombre: '', descripcion: '', estado: true }); }}>Cancelar</button>}
            </form>

            <table border="1" cellPadding="8">
                <thead>
                    <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {marcas.map(m => (
                        <tr key={m.id} style={{ opacity: m.deleted_at ? 0.6 : 1 }}>
                            <td>{m.id}</td>
                            <td>{m.nombre}</td>
                            <td>{m.descripcion || '-'}</td>
                            <td>{m.estado ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                {!m.deleted_at ? (
                                    <>
                                        <button onClick={() => { setEditing(m); setForm({ nombre: m.nombre, descripcion: m.descripcion || '', estado: m.estado }); }}>Editar</button>
                                        <button onClick={() => handleDelete(m.id)}>Eliminar</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleRestore(m.id)}>Restaurar</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MarcasList;