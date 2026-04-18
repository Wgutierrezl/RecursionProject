// ============================================================
//  Datos en memoria que simulan la estructura de una empresa.
//  Representan la jerarquía sistema → subsistema → elemento
//  según la Teoría General de Sistemas (TGS).
// ============================================================

import { Empresa } from '../interfaces/sistema.interface';

export const EMPRESA_DATA: Empresa = {
  id: 1,
  nombre: 'TechCorp S.A.',
  departamentos: [
    {
      id: 1,
      nombre: 'Tecnología de la Información (IT)',
      equipos: [
        {
          id: 1,
          nombre: 'Backend',
          empleados: [
            { id: 1, nombre: 'Juan Pérez', cargo: 'Desarrollador Senior' },
            { id: 2, nombre: 'María López', cargo: 'Desarrolladora Junior' },
          ],
        },
        {
          id: 2,
          nombre: 'Frontend',
          empleados: [
            { id: 3, nombre: 'Carlos García', cargo: 'Diseñador UI/UX' },
            { id: 4, nombre: 'Ana Martínez', cargo: 'Desarrolladora React' },
          ],
        },
        {
          id: 3,
          nombre: 'DevOps',
          empleados: [
            { id: 5, nombre: 'Luis Rodríguez', cargo: 'Ingeniero de Infraestructura' },
          ],
        },
      ],
    },
    {
      id: 2,
      nombre: 'Recursos Humanos',
      equipos: [
        {
          id: 4,
          nombre: 'Reclutamiento',
          empleados: [
            { id: 6, nombre: 'Sofía Herrera', cargo: 'Reclutadora' },
            { id: 7, nombre: 'Pedro Sánchez', cargo: 'Analista de Talento' },
          ],
        },
        {
          id: 5,
          nombre: 'Bienestar Laboral',
          empleados: [
            { id: 8, nombre: 'Laura Torres', cargo: 'Psicóloga Organizacional' },
          ],
        },
      ],
    },
    {
      id: 3,
      nombre: 'Finanzas',
      equipos: [
        {
          id: 6,
          nombre: 'Contabilidad',
          empleados: [
            { id: 9, nombre: 'Roberto Díaz', cargo: 'Contador General' },
            { id: 10, nombre: 'Elena Vargas', cargo: 'Auditora Interna' },
          ],
        },
        {
          id: 7,
          nombre: 'Tesorería',
          empleados: [
            { id: 11, nombre: 'Miguel Flores', cargo: 'Tesorero' },
          ],
        },
      ],
    },
  ],
};
