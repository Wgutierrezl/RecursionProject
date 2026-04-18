# Recursividad & Teor�a General de Sistemas � NestJS

> Proyecto acad�mico que demuestra el concepto de **recursividad** aplicado a la **Teor�a General de Sistemas (TGS)**, modelando la estructura jer�rquica de una empresa con NestJS.

---

## Tabla de contenidos

1. [Explicaci�n te�rica](#1-explicaci�n-te�rica)
2. [Descripci�n del proyecto](#2-descripci�n-del-proyecto)
3. [Estructura del c�digo](#3-estructura-del-c�digo)
4. [Explicaci�n de las funciones recursivas](#4-explicaci�n-de-las-funciones-recursivas)
5. [Instrucciones de uso](#5-instrucciones-de-uso)
6. [Endpoints disponibles](#6-endpoints-disponibles)
7. [Probar con Swagger UI](#7-probar-con-swagger-ui)
8. [Ejemplo de salida esperada en consola](#8-ejemplo-de-salida-esperada-en-consola)

---

## 1. Explicaci�n te�rica

### �Qu� es la recursividad en programaci�n?

La **recursividad** es una t�cnica de programaci�n en la que una funci�n **se llama a s� misma** para resolver un problema. Cada llamada trabaja con una versi�n m�s peque�a del problema original hasta alcanzar el **caso base**, que detiene la cadena de llamadas.

```
funci�n recursiva(problema):
  si  problema es el m�s peque�o posible:   ? CASO BASE
    devolver resultado directo
  sino:
    resolver una parte peque�a
    devolver esa parte + recursiva(problema m�s peque�o)  ? CASO RECURSIVO
```

### �Qu� es la recursividad en la Teor�a General de Sistemas (TGS)?

La **Teor�a General de Sistemas** (Bertalanffy, 1968) estudia los sistemas como un todo compuesto de partes interrelacionadas. Uno de sus principios fundamentales es la **auto-similitud recursiva**:

> *Un sistema est� formado por subsistemas, cada uno de los cuales puede ser tratado como un sistema completo en s� mismo.*

Esto significa que la misma estructura l�gica (sistema ? entradas ? procesos ? salidas) se **repite a diferentes escalas** dentro de la jerarqu�a.

### Relaci�n entre ambas

| Concepto TGS | Analog�a en programaci�n |
|---|---|
| Sistema principal | Funci�n ra�z |
| Subsistema | Llamada recursiva |
| Elemento terminal | Caso base |
| Jerarqu�a de niveles | Pila de llamadas (call stack) |

La recursividad en c�digo **implementa naturalmente** la estructura recursiva de los sistemas: un algoritmo que se llama a s� mismo refleja perfectamente un sistema que contiene subsistemas con la misma naturaleza.

### Ejemplo aplicado a este proyecto

```
EMPRESA (sistema ra�z)
+-- DEPARTAMENTO IT (subsistema nivel 1)
�   +-- EQUIPO Backend (sub-subsistema nivel 2)
�   �   +-- Juan P�rez       ? elemento terminal (caso base)
�   �   +-- Mar�a L�pez      ? elemento terminal (caso base)
�   +-- EQUIPO Frontend (sub-subsistema nivel 2)
�       +-- Carlos Garc�a    ? elemento terminal
�       +-- Ana Mart�nez     ? elemento terminal
+-- DEPARTAMENTO RRHH (subsistema nivel 1)
�   +-- ...
+-- DEPARTAMENTO Finanzas (subsistema nivel 1)
    +-- ...
```

Cada nivel llama recursivamente al siguiente hasta llegar a los empleados (caso base).

---

## 2. Descripci�n del proyecto

### �Qu� hace el sistema?

Simula la estructura organizacional de una empresa **TechCorp S.A.** como un sistema jer�rquico en memoria (sin base de datos). Expone endpoints REST que:

- Devuelven la jerarqu�a completa en JSON.
- Ejecutan funciones recursivas para **recorrer** la jerarqu�a.
- **Cuentan** el total de empleados de forma recursiva.
- **Buscan** un empleado por nombre de forma recursiva.

Todas las operaciones recursivas imprimen su recorrido en consola para que sea visible la progresi�n nivel a nivel.

### �C�mo est� estructurado?

```
src/
+-- app.module.ts                       ? M�dulo ra�z (importa EmpresaModule)
+-- empresa/
�   +-- interfaces/
�   �   +-- sistema.interface.ts        ? Tipos: Empresa, Departamento, Equipo, Empleado
�   +-- data/
�   �   +-- empresa.data.ts             ? Datos en memoria (JSON estructurado)
�   +-- empresa.service.ts              ? L�gica de negocio + funciones recursivas
�   +-- empresa.controller.ts           ? Endpoints REST
�   +-- empresa.module.ts              ? M�dulo NestJS
+-- main.ts                             ? Punto de entrada (puerto 3000)
```

---

## 3. Estructura del c�digo

### Interfaces (`sistema.interface.ts`)

Define los 4 niveles del sistema:

```typescript
Empleado     ? elemento terminal (sin subsistemas)
Equipo       ? contiene Empleados[]
Departamento ? contiene Equipos[]
Empresa      ? contiene Departamentos[]
```

### Datos en memoria (`empresa.data.ts`)

Un objeto `EMPRESA_DATA` de tipo `Empresa` con 3 departamentos, 7 equipos y 11 empleados precargados. No se utiliza ninguna base de datos.

### Servicio (`empresa.service.ts`)

Contiene las tres funciones recursivas principales (ver secci�n 4).

### Controlador (`empresa.controller.ts`)

Mapea las rutas HTTP a los m�todos del servicio.

---

## 4. Explicaci�n de las funciones recursivas

### Funci�n 1 � `imprimirJerarquia()`: Recorrer el �rbol

Demuestra el **recorrido recursivo en profundidad** (DFS � Depth First Search).

```
imprimirJerarquia()
  +- recorrerDepartamentos([dept1, dept2, dept3])
       +- Imprime dept1
       +- recorrerEquipos([equipo1, equipo2])
       �    +- Imprime equipo1
       �    +- recorrerEmpleados([emp1, emp2])
       �    �    +- Imprime emp1
       �    �    +- recorrerEmpleados([emp2])  ? llamada recursiva
       �    �         +- Imprime emp2
       �    �         +- recorrerEmpleados([]) ? CASO BASE: lista vac�a
       �    +- recorrerEquipos([equipo2])      ? llamada recursiva
       �         +- ...
       +- recorrerDepartamentos([dept2, dept3]) ? llamada recursiva
            +- ...
```

**Caso base:** Lista vac�a `[]` ? la funci�n retorna sin hacer nada.
**Caso recursivo:** Procesa el primer elemento y se llama con el resto del arreglo (`[primero, ...resto]`).

---

### Funci�n 2 � `contarEmpleados()`: Acumulaci�n recursiva

Demuestra c�mo la recursividad puede **acumular valores** mientras desciende.

```typescript
// Pseudoc�digo simplificado
contarEnDepartamentos([d1, d2, d3]):
  = contarEnEquipos(d1.equipos)
  + contarEnDepartamentos([d2, d3])   ? llamada recursiva

contarEnDepartamentos([]):
  = 0                                 ? CASO BASE
```

El total final es la **suma de todas las llamadas recursivas**.

---

### Funci�n 3 � `buscarEmpleado(nombre)`: B�squeda recursiva

Demuestra una **b�squeda en profundidad**: desciende nivel a nivel hasta encontrar al empleado o agotar todos los nodos.

```
buscarEnDepartamentos([d1, d2, d3], "Juan")
  ? buscarEnEquipos(d1.equipos, "Juan")
      ? Busca en d1.equipo1.empleados ? �Encontrado! ? retorna resultado
  ? Si no encontrado: buscarEnDepartamentos([d2, d3], "Juan")  ? recursiva
```

**Caso base:** Lista vac�a ? `null` (no encontrado).
**Caso recursivo:** Busca en el primer elemento; si no lo encuentra, contin�a con el resto.

---

## 5. Instrucciones de uso

### Requisitos previos

- Node.js >= 18
- npm >= 9

### Instalaci�n

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

Al iniciar, la terminal mostrará las URLs disponibles:

```
🚀 Servidor iniciado en http://localhost:3000
📄 Swagger UI disponible en http://localhost:3000/api
```

El servidor iniciar� en **http://localhost:3000**.
Los `console.log` de las funciones recursivas se ver�n en la terminal donde se ejecuta el servidor.

### Compilar y ejecutar en producci�n

```bash
npm run build
npm run start:prod
```

---

## 6. Endpoints disponibles

| M�todo | URL | Descripci�n |
|--------|-----|-------------|
| `GET` | `/empresa` | Devuelve la estructura completa en JSON |
| `GET` | `/empresa/jerarquia` | Ejecuta el recorrido recursivo (ver �rbol en consola) |
| `GET` | `/empresa/contar` | Cuenta empleados totales de forma recursiva |
| `GET` | `/empresa/buscar/:nombre` | Busca un empleado por nombre (recursivo) |

### Ejemplos con curl

```bash
# Estructura completa
curl http://localhost:3000/empresa

# Mostrar jerarqu�a (�rbol en consola del servidor)
curl http://localhost:3000/empresa/jerarquia

# Contar todos los empleados
curl http://localhost:3000/empresa/contar

# Buscar empleado por nombre
curl http://localhost:3000/empresa/buscar/Juan
curl http://localhost:3000/empresa/buscar/Laura
curl http://localhost:3000/empresa/buscar/inexistente
```

### Ejemplos abriendo el navegador

- http://localhost:3000/empresa
- http://localhost:3000/empresa/jerarquia
- http://localhost:3000/empresa/contar
- http://localhost:3000/empresa/buscar/Maria

---

## 7. Probar con Swagger UI

El proyecto incluye **Swagger UI** integrado, que permite explorar y probar todos los endpoints de forma interactiva desde el navegador, sin necesidad de instalar herramientas adicionales.

### Acceso

Con el servidor corriendo, abre:

> **http://localhost:3000/api**

### ¿Qué encontrarás?

- La **descripción general** del proyecto y su relación con la TGS.
- Todos los endpoints agrupados bajo la etiqueta `empresa`.
- Para cada endpoint:
  - **Descripción** de qué hace y cómo aplica la recursividad.
  - **Parámetros** esperados (ej: `:nombre` para búsqueda).
  - **Schema de respuesta** con ejemplos de cada campo.

### Cómo ejecutar un endpoint desde Swagger UI

1. Abre http://localhost:3000/api en el navegador.
2. Haz clic sobre el endpoint que deseas probar (ej: `GET /empresa/jerarquia`).
3. Haz clic en el botón **"Try it out"**.
4. Si el endpoint requiere parámetros (como `/empresa/buscar/{nombre}`), escríbelos en el campo correspondiente.
5. Haz clic en **"Execute"**.
6. Observa la respuesta JSON en la sección **"Responses"**.
7. Revisa la consola del servidor para ver el recorrido recursivo impreso.

### Endpoints documentados

| Endpoint | Descripción en Swagger |
|----------|------------------------|
| `GET /empresa` | Estructura completa de la empresa en JSON |
| `GET /empresa/jerarquia` | Árbol recursivo generado nivel a nivel |
| `GET /empresa/contar` | Conteo recursivo de empleados con detalle |
| `GET /empresa/buscar/{nombre}` | Búsqueda recursiva por nombre de empleado |

---

## 8. Ejemplo de salida esperada en consola

### `GET /empresa/jerarquia`

```
=======================================================
?? SISTEMA RA�Z ? TechCorp S.A.
=======================================================
  ?? SUBSISTEMA ? Departamento: Tecnolog�a de la Informaci�n (IT)
    ?? SUB-SUBSISTEMA ? Equipo: Backend
      ?? ELEMENTO ? Empleado: Juan P�rez (Desarrollador Senior)
      ?? ELEMENTO ? Empleado: Mar�a L�pez (Desarrolladora Junior)
    ?? SUB-SUBSISTEMA ? Equipo: Frontend
      ?? ELEMENTO ? Empleado: Carlos Garc�a (Dise�ador UI/UX)
      ?? ELEMENTO ? Empleado: Ana Mart�nez (Desarrolladora React)
    ?? SUB-SUBSISTEMA ? Equipo: DevOps
      ?? ELEMENTO ? Empleado: Luis Rodr�guez (Ingeniero de Infraestructura)
  ?? SUBSISTEMA ? Departamento: Recursos Humanos
    ?? SUB-SUBSISTEMA ? Equipo: Reclutamiento
      ?? ELEMENTO ? Empleado: Sof�a Herrera (Reclutadora)
      ?? ELEMENTO ? Empleado: Pedro S�nchez (Analista de Talento)
    ?? SUB-SUBSISTEMA ? Equipo: Bienestar Laboral
      ?? ELEMENTO ? Empleado: Laura Torres (Psic�loga Organizacional)
  ?? SUBSISTEMA ? Departamento: Finanzas
    ?? SUB-SUBSISTEMA ? Equipo: Contabilidad
      ?? ELEMENTO ? Empleado: Roberto D�az (Contador General)
      ?? ELEMENTO ? Empleado: Elena Vargas (Auditora Interna)
    ?? SUB-SUBSISTEMA ? Equipo: Tesorer�a
      ?? ELEMENTO ? Empleado: Miguel Flores (Tesorero)
=======================================================
```

### `GET /empresa/contar`

```
?? Contando empleados de forma recursiva...
      ? Equipo "Backend": 2 empleado(s)
      ? Equipo "Frontend": 2 empleado(s)
      ? Equipo "DevOps": 1 empleado(s)
  ? Departamento "Tecnolog�a de la Informaci�n (IT)": 5 empleado(s)
      ? Equipo "Reclutamiento": 2 empleado(s)
      ? Equipo "Bienestar Laboral": 1 empleado(s)
  ? Departamento "Recursos Humanos": 3 empleado(s)
      ? Equipo "Contabilidad": 2 empleado(s)
      ? Equipo "Tesorer�a": 1 empleado(s)
  ? Departamento "Finanzas": 3 empleado(s)
? Total de empleados encontrados: 11
```

### `GET /empresa/buscar/Juan`

```
?? Buscando empleado "Juan" de forma recursiva...
  ?? Revisando departamento: Tecnolog�a de la Informaci�n (IT)
    ?? Revisando equipo: Backend
? Empleado encontrado: Juan P�rez en Departamento "Tecnolog�a de la Informaci�n (IT)" ? Equipo "Backend"
```

### `GET /empresa/buscar/inexistente`

```
?? Buscando empleado "inexistente" de forma recursiva...
  ?? Revisando departamento: Tecnolog�a de la Informaci�n (IT)
    ?? Revisando equipo: Backend
    ?? Revisando equipo: Frontend
    ?? Revisando equipo: DevOps
  ?? Revisando departamento: Recursos Humanos
    ?? Revisando equipo: Reclutamiento
    ?? Revisando equipo: Bienestar Laboral
  ?? Revisando departamento: Finanzas
    ?? Revisando equipo: Contabilidad
    ?? Revisando equipo: Tesorer�a
? Empleado "inexistente" no encontrado en el sistema.
```

---

## Cr�ditos

Proyecto acad�mico desarrollado con [NestJS](https://nestjs.com/) para ilustrar los conceptos de **recursividad** y **Teor�a General de Sistemas (TGS)**.
