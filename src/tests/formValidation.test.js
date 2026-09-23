import { describe, it, expect } from 'vitest';

describe('Validación de Formularios PQRS y Admisión', () => {
  const validatePqrs = (values) => {
    const errors = {};
    if (!values.usuario || values.usuario.trim().length < 3) {
      errors.usuario = 'El nombre debe tener al menos 3 caracteres';
    }
    if (!values.correo || !values.correo.includes('@')) {
      errors.correo = 'Correo electrónico inválido';
    }
    if (!values.asunto || values.asunto.trim().length === 0) {
      errors.asunto = 'El asunto es obligatorio';
    }
    return errors;
  };

  it('debe detectar campos vacíos en formulario PQRS', () => {
    const errors = validatePqrs({ usuario: '', correo: '', asunto: '' });
    expect(errors.usuario).toBeDefined();
    expect(errors.correo).toBeDefined();
    expect(errors.asunto).toBeDefined();
  });

  it('debe validar un formulario completo sin errores', () => {
    const errors = validatePqrs({
      usuario: 'María Elena Rojas',
      correo: 'm.rojas@gmail.com',
      asunto: 'Consulta sobre guía EMS'
    });
    expect(Object.keys(errors).length).toBe(0);
  });

  it('debe invalidar correos electrónicos sin formato correcto', () => {
    const errors = validatePqrs({
      usuario: 'Andrés Fallas',
      correo: 'correo-sin-arroba',
      asunto: 'Reclamo'
    });
    expect(errors.correo).toBe('Correo electrónico inválido');
  });
});
