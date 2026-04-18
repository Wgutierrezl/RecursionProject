// ============================================================
//  Clases DTO (Data Transfer Object) para documentación Swagger.
//  Swagger no puede leer interfaces de TypeScript en tiempo de
//  ejecución, por eso se usan clases con decoradores @ApiProperty.
// ============================================================

import { ApiProperty } from '@nestjs/swagger';

// ──────────────────────────────────────────────────────────────
//  Nivel 3 — Elemento terminal
// ──────────────────────────────────────────────────────────────
export class EmpleadoDto {
  @ApiProperty({ example: 1, description: 'Identificador único del empleado' })
  id: number;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del empleado' })
  nombre: string;

  @ApiProperty({ example: 'Desarrollador Senior', description: 'Cargo que ocupa dentro del equipo' })
  cargo: string;
}

// ──────────────────────────────────────────────────────────────
//  Nivel 2 — Sub-subsistema
// ──────────────────────────────────────────────────────────────
export class EquipoDto {
  @ApiProperty({ example: 1, description: 'Identificador único del equipo' })
  id: number;

  @ApiProperty({ example: 'Backend', description: 'Nombre del equipo de trabajo' })
  nombre: string;

  @ApiProperty({ type: [EmpleadoDto], description: 'Lista de empleados que pertenecen a este equipo' })
  empleados: EmpleadoDto[];
}

// ──────────────────────────────────────────────────────────────
//  Nivel 1 — Subsistema
// ──────────────────────────────────────────────────────────────
export class DepartamentoDto {
  @ApiProperty({ example: 1, description: 'Identificador único del departamento' })
  id: number;

  @ApiProperty({ example: 'Tecnología de la Información (IT)', description: 'Nombre del departamento' })
  nombre: string;

  @ApiProperty({ type: [EquipoDto], description: 'Lista de equipos que forman parte de este departamento' })
  equipos: EquipoDto[];
}

// ──────────────────────────────────────────────────────────────
//  Nivel 0 — Sistema raíz
// ──────────────────────────────────────────────────────────────
export class EmpresaDto {
  @ApiProperty({ example: 1, description: 'Identificador único de la empresa' })
  id: number;

  @ApiProperty({ example: 'TechCorp S.A.', description: 'Nombre de la empresa (sistema raíz)' })
  nombre: string;

  @ApiProperty({ type: [DepartamentoDto], description: 'Lista de departamentos (subsistemas)' })
  departamentos: DepartamentoDto[];
}

// ──────────────────────────────────────────────────────────────
//  Respuesta de GET /empresa/jerarquia
// ──────────────────────────────────────────────────────────────
export class JerarquiaResponseDto {
  @ApiProperty({
    example: 'Jerarquía del sistema generada con recursividad (ver consola)',
    description: 'Mensaje informativo',
  })
  mensaje: string;

  @ApiProperty({
    example: [
      '🏢 SISTEMA RAÍZ → TechCorp S.A.',
      '  📂 SUBSISTEMA → Departamento: Tecnología de la Información (IT)',
      '    🔧 SUB-SUBSISTEMA → Equipo: Backend',
      '      👤 ELEMENTO → Empleado: Juan Pérez (Desarrollador Senior)',
    ],
    description: 'Árbol jerárquico representado como arreglo de líneas de texto',
    type: [String],
  })
  arbol: string[];
}

// ──────────────────────────────────────────────────────────────
//  Respuesta de GET /empresa/contar
// ──────────────────────────────────────────────────────────────
export class ContarResponseDto {
  @ApiProperty({ example: 11, description: 'Número total de empleados en toda la empresa' })
  total: number;

  @ApiProperty({
    example: 'La empresa "TechCorp S.A." tiene 11 empleado(s) en total.',
    description: 'Descripción textual del resultado',
  })
  detalle: string;
}

// ──────────────────────────────────────────────────────────────
//  Respuesta de GET /empresa/buscar/:nombre (encontrado)
// ──────────────────────────────────────────────────────────────
export class BuscarResponseDto {
  @ApiProperty({ example: true, description: 'Indica si el empleado fue encontrado en el sistema' })
  encontrado: boolean;

  @ApiProperty({
    type: EmpleadoDto,
    required: false,
    description: 'Datos del empleado encontrado. Ausente si no se encontró.',
  })
  empleado?: EmpleadoDto;

  @ApiProperty({
    example: 'Departamento "Tecnología de la Información (IT)" → Equipo "Backend"',
    required: false,
    description: 'Ruta de ubicación del empleado dentro de la jerarquía. Ausente si no se encontró.',
  })
  ubicacion?: string;
}
