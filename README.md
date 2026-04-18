# Recursividad & Teoría General de Sistemas — NestJS

> Proyecto académico que demuestra el concepto de **recursividad** aplicado a la  
> **Teoría General de Sistemas (TGS)**, modelando la estructura jerárquica de una empresa con NestJS.

---

## Tabla de contenidos

1. [Explicación teórica](#1-explicación-teórica)
2. [Descripción del proyecto](#2-descripción-del-proyecto)
3. [Estructura del código](#3-estructura-del-código)
4. [Explicación de las funciones recursivas](#4-explicación-de-las-funciones-recursivas)
5. [Instrucciones de uso](#5-instrucciones-de-uso)
6. [Endpoints disponibles](#6-endpoints-disponibles)
7. [Probar con Swagger UI](#7-probar-con-swagger-ui)
8. [Ejemplo de salida esperada en consola](#8-ejemplo-de-salida-esperada-en-consola)

---

## 1. Explicación teórica

### ¿Qué es la recursividad en programación?

La **recursividad** es una técnica de programación en la que una función **se llama a sí misma**
para resolver un problema. Cada llamada trabaja con una versión más pequeña del problema original
hasta alcanzar el **caso base**, que detiene la cadena de llamadas.

```
función recursiva(problema):
  si problema es el más pequeño posible:        ← CASO BASE
    devolver resultado directo
  sino:
    resolver una parte pequeña
    devolver esa parte + recursiva(problema - 1) ← CASO RECURSIVO
```

### ¿Qué es la recursividad en la Teoría General de Sistemas (TGS)?

La **Teoría General de Sistemas** (Bertalanffy, 1968) estudia los sistemas como un todo compuesto
de partes interrelacionadas. Uno de sus principios fundamentales es la **auto-similitud recursiva**:

> *Un sistema está formado por subsistemas, cada uno de los cuales puede ser tratado  
> como un sistema completo en sí mismo.*

Esto significa que la misma estructura lógica *(sistema → entradas → procesos → salidas)*
se **repite a diferentes escalas** dentro de la jerarquía.

### Relación entre ambas

| Concepto TGS            | Analogía en programación          |
|-------------------------|-----------------------------------|
| Sistema principal       | Función raíz                      |
| Subsistema              | Llamada recursiva                 |
| Elemento terminal       | Caso base                         |
| Jerarquía de niveles    | Pila de llamadas *(call stack)*   |

La recursividad en código **implementa naturalmente** la estructura recursiva de los sistemas:
un algoritmo que se llama a sí mismo refleja perfectamente un sistema que contiene subsistemas
con la misma naturaleza.

### Ejemplo aplicado a este proyecto

```
EMPRESA  ─────────────────────── sistema raíz
├── DEPARTAMENTO IT ──────────── subsistema nivel 1
│   ├── EQUIPO Backend ────────── sub-subsistema nivel 2
│   │   ├── Juan Pérez           ← elemento terminal (caso base)
│   │   └── María López          ← elemento terminal (caso base)
│   └── EQUIPO Frontend
│       ├── Carlos García        ← elemento terminal
│       └── Ana Martínez         ← elemento terminal
├── DEPARTAMENTO RRHH
│   └── ...
└── DEPARTAMENTO Finanzas
    └── ...
```

Cada nivel llama recursivamente al siguiente hasta llegar a los empleados (caso base).

---

## 2. Descripción del proyecto

### ¿Qué hace el sistema?

Simula la estructura organizacional de **TechCorp S.A.** como un sistema jerárquico en memoria
(sin base de datos). Expone endpoints REST que:

- Devuelven la jerarquía completa en JSON.
- Ejecutan funciones recursivas para **recorrer** el árbol de la organización.
- **Cuentan** el total de empleados de forma recursiva.
- **Buscan** un empleado por nombre de forma recursiva.

Todas las operaciones imprimen su recorrido en consola nivel a nivel, haciendo visible
el proceso recursivo en tiempo real.

### ¿Cómo está estructurado?

```
src/
├── app.module.ts
├── main.ts                              ← Punto de entrada (puerto 3000) + Swagger
└── empresa/
    ├── interfaces/
    │   └── sistema.interface.ts         ← Tipos: Empresa, Departamento, Equipo, Empleado
    ├── data/
    │   └── empresa.data.ts              ← Datos en memoria (sin base de datos)
    ├── dto/
    │   └── empresa.dto.ts               ← Clases DTO para documentación Swagger
    ├── empresa.service.ts               ← Lógica de negocio + funciones recursivas
    ├── empresa.controller.ts            ← Endpoints REST con decoradores Swagger
    └── empresa.module.ts               ← Módulo NestJS
```

---

## 3. Estructura del código

### Interfaces — `sistema.interface.ts`

Define los 4 niveles del sistema jerárquico:

```
Empleado       elemento terminal — no contiene subsistemas
Equipo         sub-subsistema   — contiene Empleado[]
Departamento   subsistema       — contiene Equipo[]
Empresa        sistema raíz     — contiene Departamento[]
```

### Datos en memoria — `empresa.data.ts`

Constante `EMPRESA_DATA` con **3 departamentos**, **7 equipos** y **11 empleados** precargados.
No se utiliza ninguna base de datos; todo vive en memoria durante la ejecución.

### Servicio — `empresa.service.ts`

Contiene las tres funciones recursivas principales (ver sección 4).

### Controlador — `empresa.controller.ts`

Mapea las rutas HTTP a los métodos del servicio. Cada endpoint incluye decoradores
`@ApiOperation`, `@ApiParam` y `@ApiResponse` para la documentación Swagger.

---

## 4. Explicación de las funciones recursivas

### Función 1 — `imprimirJerarquia()` · Recorrido en árbol

Recorrido recursivo en profundidad (**DFS — Depth First Search**) que desciende por cada nivel
del sistema imprimiendo cada nodo.

```
imprimirJerarquia()
└── recorrerDepartamentos([d1, d2, d3])
      ├── imprime d1
      ├── recorrerEquipos([e1, e2])
      │     ├── imprime e1
      │     ├── recorrerEmpleados([emp1, emp2])
      │     │     ├── imprime emp1
      │     │     └── recorrerEmpleados([emp2])   ← llamada recursiva
      │     │           ├── imprime emp2
      │     │           └── recorrerEmpleados([]) ← CASO BASE: lista vacía → retorna
      │     └── recorrerEquipos([e2])             ← llamada recursiva
      │           └── ...
      └── recorrerDepartamentos([d2, d3])         ← llamada recursiva
            └── ...
```

- **Caso base:** lista vacía `[]` → la función retorna sin hacer nada.
- **Caso recursivo:** procesa el primer elemento y se llama con el resto `[primero, ...resto]`.

---

### Función 2 — `contarEmpleados()` · Acumulación recursiva

Demuestra cómo la recursividad puede **acumular valores** sumando hacia arriba en la pila.

```
contarEnDepartamentos([d1, d2, d3])
  = contarEnEquipos(d1.equipos)  +  contarEnDepartamentos([d2, d3])
                                              ↑ llamada recursiva
contarEnDepartamentos([])
  = 0                                ← CASO BASE
```

El total final es la **suma de todas las llamadas recursivas** al volver la pila.

---

### Función 3 — `buscarEmpleado(nombre)` · Búsqueda recursiva

Búsqueda en profundidad: desciende nivel a nivel hasta encontrar al empleado o agotar los nodos.

```
buscarEnDepartamentos([d1, d2, d3], "Juan")
  → buscarEnEquipos(d1.equipos, "Juan")
      → revisa d1.equipo1.empleados → ¡Encontrado! → retorna y detiene la recursión
  → si no encontrado: buscarEnDepartamentos([d2, d3], "Juan")  ← sigue recursivamente
```

- **Caso base:** lista vacía → `null` (no encontrado en este nivel).
- **Caso recursivo:** busca en el primer elemento; si no lo encuentra, continúa con el resto.

---

## 5. Instrucciones de uso

### Requisitos previos

- Node.js >= 18
- npm >= 9

### Instalación

```bash
# Entrar al directorio del proyecto
cd recursividad_project

# Instalar dependencias
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run start:dev
```

Al iniciar, la consola mostrará:

```
Servidor iniciado en http://localhost:3000
Swagger UI disponible en http://localhost:3000/api
```

Los `console.log` de cada función recursiva aparecerán en esta misma terminal.

### Compilar y ejecutar en producción

```bash
npm run build
npm run start:prod
```

---

## 6. Endpoints disponibles

| Método | URL                        | Descripción                                      |
|--------|----------------------------|--------------------------------------------------|
| `GET`  | `/empresa`                 | Estructura completa de la empresa en JSON        |
| `GET`  | `/empresa/jerarquia`       | Árbol recursivo generado nivel a nivel           |
| `GET`  | `/empresa/contar`          | Conteo recursivo de empleados con detalle        |
| `GET`  | `/empresa/buscar/:nombre`  | Búsqueda recursiva por nombre de empleado        |

### Ejemplos con curl

```bash
# Estructura completa
curl http://localhost:3000/empresa

# Árbol jerárquico (ver consola del servidor)
curl http://localhost:3000/empresa/jerarquia

# Contar empleados
curl http://localhost:3000/empresa/contar

# Buscar empleado por nombre
curl http://localhost:3000/empresa/buscar/Juan
curl http://localhost:3000/empresa/buscar/Laura
curl http://localhost:3000/empresa/buscar/inexistente
```

### Ejemplos desde el navegador

```
http://localhost:3000/empresa
http://localhost:3000/empresa/jerarquia
http://localhost:3000/empresa/contar
http://localhost:3000/empresa/buscar/Maria
```

---

## 7. Probar con Swagger UI

El proyecto incluye **Swagger UI** integrado. Permite explorar y ejecutar todos los endpoints
de forma interactiva desde el navegador, sin herramientas externas.

### Acceso

> Con el servidor corriendo, abre: **http://localhost:3000/api**

### ¿Qué encontrarás?

- Descripción general del proyecto y su relación con la TGS.
- Todos los endpoints agrupados bajo la etiqueta **empresa**.
- Por cada endpoint:
  - Descripción de qué hace y cómo aplica la recursividad.
  - Parámetros esperados con ejemplos.
  - Schema completo de la respuesta con tipos y ejemplos de cada campo.

### Cómo probar un endpoint paso a paso

```
1. Abre http://localhost:3000/api en el navegador
2. Haz clic en el endpoint que quieres probar
   Ejemplo: GET /empresa/jerarquia
3. Haz clic en "Try it out"
4. Si el endpoint tiene parámetros (ej: /empresa/buscar/{nombre}),
   escribe el valor en el campo que aparece  →  Juan
5. Haz clic en "Execute"
6. Revisa la respuesta JSON en la sección "Responses"
7. Observa la consola del servidor para ver el recorrido recursivo
```

### Endpoints documentados en Swagger

| Endpoint                        | Descripción en Swagger                            |
|---------------------------------|---------------------------------------------------|
| `GET /empresa`                  | Estructura completa de la empresa en JSON         |
| `GET /empresa/jerarquia`        | Árbol recursivo generado nivel a nivel            |
| `GET /empresa/contar`           | Conteo recursivo de empleados con detalle         |
| `GET /empresa/buscar/{nombre}`  | Búsqueda recursiva por nombre de empleado         |

---

## 8. Ejemplo de salida esperada en consola

### `GET /empresa/jerarquia`

```
=======================================================
Sistema Raiz: TechCorp S.A.
=======================================================
  Departamento: Tecnologia de la Informacion (IT)
    Equipo: Backend
      Empleado: Juan Perez (Desarrollador Senior)
      Empleado: Maria Lopez (Desarrolladora Junior)
    Equipo: Frontend
      Empleado: Carlos Garcia (Disenador UI/UX)
      Empleado: Ana Martinez (Desarrolladora React)
    Equipo: DevOps
      Empleado: Luis Rodriguez (Ingeniero de Infraestructura)
  Departamento: Recursos Humanos
    Equipo: Reclutamiento
      Empleado: Sofia Herrera (Reclutadora)
      Empleado: Pedro Sanchez (Analista de Talento)
    Equipo: Bienestar Laboral
      Empleado: Laura Torres (Psicologa Organizacional)
  Departamento: Finanzas
    Equipo: Contabilidad
      Empleado: Roberto Diaz (Contador General)
      Empleado: Elena Vargas (Auditora Interna)
    Equipo: Tesoreria
      Empleado: Miguel Flores (Tesorero)
=======================================================
```

### `GET /empresa/contar`

```
Contando empleados de forma recursiva...
      Equipo "Backend": 2 empleado(s)
      Equipo "Frontend": 2 empleado(s)
      Equipo "DevOps": 1 empleado(s)
  Departamento "Tecnologia de la Informacion (IT)": 5 empleado(s)
      Equipo "Reclutamiento": 2 empleado(s)
      Equipo "Bienestar Laboral": 1 empleado(s)
  Departamento "Recursos Humanos": 3 empleado(s)
      Equipo "Contabilidad": 2 empleado(s)
      Equipo "Tesoreria": 1 empleado(s)
  Departamento "Finanzas": 3 empleado(s)
Total de empleados encontrados: 11
```

### `GET /empresa/buscar/Juan`

```
Buscando empleado "Juan" de forma recursiva...
  Revisando departamento: Tecnologia de la Informacion (IT)
    Revisando equipo: Backend
Empleado encontrado: Juan Perez
Ubicacion: Departamento "Tecnologia de la Informacion (IT)" > Equipo "Backend"
```

### `GET /empresa/buscar/inexistente`

```
Buscando empleado "inexistente" de forma recursiva...
  Revisando departamento: Tecnologia de la Informacion (IT)
    Revisando equipo: Backend
    Revisando equipo: Frontend
    Revisando equipo: DevOps
  Revisando departamento: Recursos Humanos
    Revisando equipo: Reclutamiento
    Revisando equipo: Bienestar Laboral
  Revisando departamento: Finanzas
    Revisando equipo: Contabilidad
    Revisando equipo: Tesoreria
Empleado "inexistente" no encontrado en el sistema.
```

---

## Créditos

Proyecto académico desarrollado con [NestJS](https://nestjs.com/) para ilustrar
los conceptos de **recursividad** y **Teoría General de Sistemas (TGS)**.