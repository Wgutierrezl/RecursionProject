import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmpresaService } from './empresa.service';
import {
  BuscarResponseDto,
  ContarResponseDto,
  EmpresaDto,
  JerarquiaResponseDto,
} from './dto/empresa.dto';

/**
 * Controlador principal del módulo Empresa.
 * Expone los endpoints que permiten interactuar con el sistema
 * jerárquico y las funciones recursivas.
 */
@ApiTags('empresa')
@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  // ----------------------------------------------------------------
  //  GET /empresa
  // ----------------------------------------------------------------
  @Get()
  @ApiOperation({
    summary: 'Obtener la estructura completa de la empresa',
    description:
      'Devuelve el objeto JSON completo que representa la empresa como sistema raíz, ' +
      'incluyendo todos sus departamentos (subsistemas), equipos (sub-subsistemas) ' +
      'y empleados (elementos terminales). Refleja la jerarquía de la Teoría General de Sistemas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estructura jerárquica completa de la empresa en formato JSON.',
    type: EmpresaDto,
  })
  obtenerEmpresa() {
    return this.empresaService.obtenerEmpresa();
  }

  // ----------------------------------------------------------------
  //  GET /empresa/jerarquia
  // ----------------------------------------------------------------
  @Get('jerarquia')
  @ApiOperation({
    summary: 'Mostrar la jerarquía del sistema en forma de árbol',
    description:
      'Ejecuta la función recursiva de recorrido en profundidad (DFS) que desciende por ' +
      'cada nivel del sistema: Empresa → Departamentos → Equipos → Empleados. ' +
      'El recorrido completo se imprime en la consola del servidor con íconos que ' +
      'identifican cada nivel. La respuesta HTTP incluye el mismo árbol como arreglo de strings.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Árbol jerárquico generado recursivamente. ' +
      'Revisar la consola del servidor para ver el recorrido nivel a nivel.',
    type: JerarquiaResponseDto,
  })
  mostrarJerarquia() {
    const arbol = this.empresaService.imprimirJerarquia();
    return {
      mensaje: 'Jerarquía del sistema generada con recursividad (ver consola)',
      arbol: arbol.split('\n'),
    };
  }

  // ----------------------------------------------------------------
  //  GET /empresa/contar
  // ----------------------------------------------------------------
  @Get('contar')
  @ApiOperation({
    summary: 'Contar el total de empleados de forma recursiva',
    description:
      'Recorre recursivamente todos los departamentos y equipos acumulando ' +
      'el número de empleados en cada nivel. ' +
      'El detalle por departamento y equipo se imprime en la consola del servidor. ' +
      'Demuestra el patrón de acumulación recursiva: ' +
      'total = empleados(dept1) + empleados(dept2) + ... hasta caso base []  → 0.',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de empleados en toda la empresa con mensaje descriptivo.',
    type: ContarResponseDto,
  })
  contarEmpleados() {
    return this.empresaService.contarEmpleados();
  }

  // ----------------------------------------------------------------
  //  GET /empresa/buscar/:nombre
  // ----------------------------------------------------------------
  @Get('buscar/:nombre')
  @ApiOperation({
    summary: 'Buscar un empleado por nombre usando recursividad',
    description:
      'Realiza una búsqueda recursiva en profundidad por todos los niveles del sistema ' +
      '(departamentos → equipos → empleados) hasta encontrar al empleado cuyo nombre ' +
      'contenga el texto ingresado (insensible a mayúsculas). ' +
      'Si se encuentra, detiene la búsqueda inmediatamente y retorna los datos ' +
      'junto con su ubicación dentro de la jerarquía. ' +
      'El recorrido de búsqueda se imprime en la consola del servidor.',
  })
  @ApiParam({
    name: 'nombre',
    description: 'Nombre (parcial o completo) del empleado a buscar. No distingue mayúsculas.',
    example: 'Juan',
  })
  @ApiResponse({
    status: 200,
    description:
      'Resultado de la búsqueda. Si `encontrado` es true, incluye los campos `empleado` y `ubicacion`. ' +
      'Si es false, solo devuelve `{ encontrado: false }`.',
    type: BuscarResponseDto,
  })
  buscarEmpleado(@Param('nombre') nombre: string) {
    return this.empresaService.buscarEmpleado(nombre);
  }
}

