import { describe, it, expect } from 'vitest';
import { usuariosService } from '../services/usuariosService';

describe('Servicio de Autenticación y Cuentas', () => {
  it('debe autenticar al operador administrador Carlos Mora', async () => {
    const user = await usuariosService.login('carlos.mora@correos.go.cr');
    expect(user).toBeDefined();
    expect(user.rol).toBe('Administrador');
    expect(user.nombre).toBe('Carlos Mora Jiménez');
  });

  it('debe autenticar a un usuario ciudadano activo', async () => {
    const user = await usuariosService.login('m.rojas@gmail.com');
    expect(user).toBeDefined();
    expect(user.rol).toBe('Usuario');
    expect(user.estado).toBe('Activo');
  });

  it('debe rechazar el acceso a una cuenta suspendida', async () => {
    await expect(usuariosService.login('rvargas@gmail.com')).rejects.toThrow(
      'Esta cuenta se encuentra temporalmente suspendida.'
    );
  });
});
