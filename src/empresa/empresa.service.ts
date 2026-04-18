import { Injectable } from '@nestjs/common';
import { Empresa, Departamento, Equipo, Empleado } from './interfaces/sistema.interface';
import { EMPRESA_DATA } from './data/empresa.data';

@Injectable()
export class EmpresaService {
  // ----------------------------------------------------------------
  //  Datos en memoria (única fuente de verdad del sistema)
  // ----------------------------------------------------------------
  private readonly empresa: Empresa = EMPRESA_DATA;

  /** Devuelve la estructura completa de la empresa. */
  obtenerEmpresa(): Empresa {
    return this.empresa;
  }

  // ================================================================
  //  FUNCIÓN RECURSIVA 1: Imprimir jerarquía tipo árbol
  //
  //  Concepto TGS aplicado:
  //    Un SISTEMA (empresa) contiene SUBSISTEMAS (departamentos).
  //    Cada subsistema contiene sub-subsistemas (equipos).
  //    Cada equipo agrupa ELEMENTOS (empleados).
  //
  //  La recursividad permite recorrer cada nivel sin saber de
  //  antemano cuántos niveles existen (principio de auto-similitud).
  // ================================================================

  /**
   * Imprime en consola la jerarquía completa en forma de árbol
   * y devuelve la misma representación como string.
   */
  imprimirJerarquia(): string {
    const lineas: string[] = [];

    // --- Nivel 0: Sistema raíz ---
    const encabezado = `🏢 SISTEMA RAÍZ → ${this.empresa.nombre}`;
    console.log('\n' + '='.repeat(55));
    console.log(encabezado);
    console.log('='.repeat(55));
    lineas.push(encabezado);

    // Llamada recursiva inicial: recorre todos los departamentos
    this.recorrerDepartamentos(this.empresa.departamentos, lineas);

    console.log('='.repeat(55) + '\n');
    return lineas.join('\n');
  }

  /**
   * Recorre recursivamente cada departamento y sus equipos.
   * CASO BASE: si no hay más departamentos, la recursión termina.
   * CASO RECURSIVO: procesa el primer departamento y se llama
   *   a sí misma con el resto del arreglo.
   *
   * @param departamentos - Lista de departamentos por recorrer.
   * @param lineas        - Acumulador de líneas de texto para la respuesta HTTP.
   */
  private recorrerDepartamentos(departamentos: Departamento[], lineas: string[]): void {
    // CASO BASE: lista vacía → no hay más subsistemas que procesar
    if (departamentos.length === 0) return;

    const [primero, ...resto] = departamentos;

    // --- Nivel 1: Subsistema departamento ---
    const lineaDept = `  📂 SUBSISTEMA → Departamento: ${primero.nombre}`;
    console.log(lineaDept);
    lineas.push(lineaDept);

    // Llamada recursiva para los equipos de este departamento
    this.recorrerEquipos(primero.equipos, lineas);

    // CASO RECURSIVO: continúa con los departamentos restantes
    this.recorrerDepartamentos(resto, lineas);
  }

  /**
   * Recorre recursivamente cada equipo y sus empleados.
   * Mismo patrón caso-base / caso-recursivo que recorrerDepartamentos.
   *
   * @param equipos - Lista de equipos por recorrer.
   * @param lineas  - Acumulador de líneas de texto.
   */
  private recorrerEquipos(equipos: Equipo[], lineas: string[]): void {
    // CASO BASE
    if (equipos.length === 0) return;

    const [primero, ...resto] = equipos;

    // --- Nivel 2: Sub-subsistema equipo ---
    const lineaEquipo = `    🔧 SUB-SUBSISTEMA → Equipo: ${primero.nombre}`;
    console.log(lineaEquipo);
    lineas.push(lineaEquipo);

    // Llamada recursiva para los empleados de este equipo
    this.recorrerEmpleados(primero.empleados, lineas);

    // CASO RECURSIVO: continúa con los equipos restantes
    this.recorrerEquipos(resto, lineas);
  }

  /**
   * Recorre recursivamente cada empleado (elemento terminal).
   * Al llegar a este nivel no hay más subsistemas → caso base natural.
   *
   * @param empleados - Lista de empleados por recorrer.
   * @param lineas    - Acumulador de líneas de texto.
   */
  private recorrerEmpleados(empleados: Empleado[], lineas: string[]): void {
    // CASO BASE
    if (empleados.length === 0) return;

    const [primero, ...resto] = empleados;

    // --- Nivel 3: Elemento terminal ---
    const lineaEmp = `      👤 ELEMENTO → Empleado: ${primero.nombre} (${primero.cargo})`;
    console.log(lineaEmp);
    lineas.push(lineaEmp);

    // CASO RECURSIVO: continúa con los empleados restantes
    this.recorrerEmpleados(resto, lineas);
  }

  // ================================================================
  //  FUNCIÓN RECURSIVA 2: Contar empleados totales
  //
  //  Demuestra que la recursividad puede ACUMULAR valores mientras
  //  desciende por los niveles del sistema.
  // ================================================================

  /**
   * Cuenta el total de empleados en toda la empresa.
   * Llama a contarEnDepartamentos que desciende recursivamente.
   */
  contarEmpleados(): { total: number; detalle: string } {
    console.log('\n📊 Contando empleados de forma recursiva...');
    const total = this.contarEnDepartamentos(this.empresa.departamentos);
    console.log(`✅ Total de empleados encontrados: ${total}\n`);
    return {
      total,
      detalle: `La empresa "${this.empresa.nombre}" tiene ${total} empleado(s) en total.`,
    };
  }

  /**
   * CASO BASE: arreglo vacío → 0 empleados.
   * CASO RECURSIVO: empleados del primer depto + llamada con el resto.
   */
  private contarEnDepartamentos(departamentos: Departamento[]): number {
    if (departamentos.length === 0) return 0;

    const [primero, ...resto] = departamentos;

    const enEsteDepartamento = this.contarEnEquipos(primero.equipos);
    console.log(`  ↳ Departamento "${primero.nombre}": ${enEsteDepartamento} empleado(s)`);

    // Suma recursiva: este departamento + los demás departamentos
    return enEsteDepartamento + this.contarEnDepartamentos(resto);
  }

  /**
   * CASO BASE: arreglo vacío → 0 empleados.
   * CASO RECURSIVO: empleados del primer equipo + llamada con el resto.
   */
  private contarEnEquipos(equipos: Equipo[]): number {
    if (equipos.length === 0) return 0;

    const [primero, ...resto] = equipos;

    // Los empleados son el nivel terminal → se cuentan directamente
    const enEsteEquipo = primero.empleados.length;
    console.log(`      ↳ Equipo "${primero.nombre}": ${enEsteEquipo} empleado(s)`);

    return enEsteEquipo + this.contarEnEquipos(resto);
  }

  // ================================================================
  //  FUNCIÓN RECURSIVA 3: Buscar empleado por nombre
  //
  //  Demuestra búsqueda en profundidad (DFS) usando recursividad:
  //  se desciende hasta encontrar el empleado o agotar los niveles.
  // ================================================================

  /**
   * Punto de entrada público para buscar un empleado por nombre.
   * La búsqueda es insensible a mayúsculas/minúsculas.
   *
   * @param nombre - Nombre (parcial o completo) del empleado a buscar.
   */
  buscarEmpleado(nombre: string): { encontrado: boolean; empleado?: Empleado; ubicacion?: string } {
    console.log(`\n🔍 Buscando empleado "${nombre}" de forma recursiva...`);
    const resultado = this.buscarEnDepartamentos(nombre.toLowerCase(), this.empresa.departamentos);

    if (resultado) {
      console.log(`✅ Empleado encontrado: ${resultado.empleado.nombre} en ${resultado.ubicacion}\n`);
      return { encontrado: true, ...resultado };
    }

    console.log(`❌ Empleado "${nombre}" no encontrado en el sistema.\n`);
    return { encontrado: false };
  }

  /**
   * CASO BASE: arreglo vacío → null (no encontrado en este nivel).
   * CASO RECURSIVO: busca en el primer departamento; si no lo
   *   encuentra, continúa con el resto.
   */
  private buscarEnDepartamentos(
    nombre: string,
    departamentos: Departamento[],
  ): { empleado: Empleado; ubicacion: string } | null {
    if (departamentos.length === 0) return null;

    const [primero, ...resto] = departamentos;
    console.log(`  🔎 Revisando departamento: ${primero.nombre}`);

    const resultado = this.buscarEnEquipos(nombre, primero.equipos, primero.nombre);

    // Si lo encontró en este departamento, devuelve sin seguir buscando
    if (resultado) return resultado;

    // CASO RECURSIVO: sigue buscando en los departamentos restantes
    return this.buscarEnDepartamentos(nombre, resto);
  }

  /**
   * CASO BASE: arreglo vacío → null.
   * CASO RECURSIVO: busca en el primer equipo; si no lo encuentra,
   *   continúa con el resto.
   */
  private buscarEnEquipos(
    nombre: string,
    equipos: Equipo[],
    nombreDepartamento: string,
  ): { empleado: Empleado; ubicacion: string } | null {
    if (equipos.length === 0) return null;

    const [primero, ...resto] = equipos;
    console.log(`    🔎 Revisando equipo: ${primero.nombre}`);

    // Búsqueda en el nivel terminal (empleados)
    const empleadoEncontrado = primero.empleados.find((e) =>
      e.nombre.toLowerCase().includes(nombre),
    );

    if (empleadoEncontrado) {
      return {
        empleado: empleadoEncontrado,
        ubicacion: `Departamento "${nombreDepartamento}" → Equipo "${primero.nombre}"`,
      };
    }

    // CASO RECURSIVO: sigue buscando en los equipos restantes
    return this.buscarEnEquipos(nombre, resto, nombreDepartamento);
  }
}
