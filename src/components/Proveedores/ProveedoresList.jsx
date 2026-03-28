import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

function ProveedoresList() {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        nombre: '',
        contacto: '',
        telefono: '',
        email: '',
        direccion: '',
        estado: true,
    });
    const [editing, setEditing] = useState(null);
    const [errors, setErrors] = useState({});

    const fetchProveedores = async () => {
        try {
            const res = await api.get('/proveedores');
            setProveedores(res.data.data);
        } catch (err) {
            console.error(err);
            alert('Error al cargar proveedores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    const resetForm = () => {
        setForm({
            nombre: '',
            contacto: '',
            telefono: '',
            email: '',
            direccion: '',
            estado: true,
        });
        setEditing(null);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            if (editing) {
                // Actualizar proveedor existente
                await api.put(`/proveedores/${editing.id}`, form);
                alert('Proveedor actualizado exitosamente');
            } else {
                // Crear nuevo proveedor
                await api.post('/proveedores', form);
                alert('Proveedor creado exitosamente');
            }
            resetForm();
            fetchProveedores();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 422) {
                // Errores de validación
                setErrors(err.response.data.errors || {});
                alert('Error de validación. Revisa los campos.');
            } else {
                alert('Error al guardar el proveedor');
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;
        try {
            await api.delete(`/proveedores/${id}`);
            alert('Proveedor eliminado (soft delete)');
            fetchProveedores();
        } catch (err) {
            console.error(err);
            alert('Error al eliminar proveedor');
        }
    };

    const handleRestore = async (id) => {
        if (!window.confirm('¿Restaurar este proveedor?')) return;
        try {
            await api.post(`/proveedores/${id}/restore`);
            alert('Proveedor restaurado exitosamente');
            fetchProveedores();
        } catch (err) {
            console.error(err);
            alert('Error al restaurar proveedor');
        }
    };

    const handleEdit = (proveedor) => {
        setEditing(proveedor);
        setForm({
            nombre: proveedor.nombre,
            contacto: proveedor.contacto || '',
            telefono: proveedor.telefono || '',
            email: proveedor.email || '',
            direccion: proveedor.direccion || '',
            estado: proveedor.estado,
        });
        setErrors({});
    };

    if (loading) return <div>Cargando proveedores...</div>;

    return (
        <div>
            <h2>Gestión de Proveedores</h2>

            {/* Formulario para crear/editar */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre *</label>
                    <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                    />
                    {errors.nombre && <span className="error">{errors.nombre[0]}</span>}
                </div>
                <div>
                    <label>Contacto</label>
                    <input
                        type="text"
                        value={form.contacto}
                        onChange={(e) => setForm({ ...form, contacto: e.target.value })}
                    />
                    {errors.contacto && <span className="error">{errors.contacto[0]}</span>}
                </div>
                <div>
                    <label>Teléfono</label>
                    <input
                        type="text"
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    />
                    {errors.telefono && <span className="error">{errors.telefono[0]}</span>}
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <span className="error">{errors.email[0]}</span>}
                </div>
                <div>
                    <label>Dirección</label>
                    <textarea
                        value={form.direccion}
                        onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                        rows="2"
                    />
                    {errors.direccion && <span className="error">{errors.direccion[0]}</span>}
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={form.estado}
                            onChange={(e) => setForm({ ...form, estado: e.target.checked })}
                        />
                        Activo
                    </label>
                </div>
                <div>
                    <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
                    {editing && (
                        <button type="button" onClick={resetForm}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* Tabla de proveedores */}
            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Contacto</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Dirección</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.map((p) => (
                        <tr key={p.id} style={{ opacity: p.deleted_at ? 0.6 : 1 }}>
                            <td>{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>{p.contacto || '-'}</td>
                            <td>{p.telefono || '-'}</td>
                            <td>{p.email || '-'}</td>
                            <td>{p.direccion || '-'}</td>
                            <td>{p.estado ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                {!p.deleted_at ? (
                                    <>
                                        <button onClick={() => handleEdit(p)}>Editar</button>
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

export default ProveedoresList;