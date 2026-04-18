// ============================================================
//  Interfaces que modelan la jerarquía de la empresa.
//  Cada nivel representa un (sub)sistema en la TGS:
//    Empresa → Departamento → Equipo → Empleado
// ============================================================

/** Elemento terminal del sistema: no contiene subsistemas. */
export interface Empleado {
  id: number;
  nombre: string;
  cargo: string;
}

/** Subsistema de segundo orden: agrupa Empleados. */
export interface Equipo {
  id: number;
  nombre: string;
  empleados: Empleado[];
}

/** Subsistema de primer orden: agrupa Equipos. */
export interface Departamento {
  id: number;
  nombre: string;
  equipos: Equipo[];
}

/** Sistema raíz: contiene todos los Departamentos. */
export interface Empresa {
  id: number;
  nombre: string;
  departamentos: Departamento[];
}
