import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ──────────────────────────────────────────────────────────────
  //  Configuración de Swagger UI
  //  Disponible en: http://localhost:3000/api
  // ──────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Recursividad & TGS — API')
    .setDescription(
      'API REST que modela una empresa como sistema jerárquico recursivo ' +
      'según la Teoría General de Sistemas (TGS). ' +
      'Cada endpoint ejecuta funciones recursivas que recorren la jerarquía: ' +
      'Empresa → Departamentos → Equipos → Empleados.',
    )
    .setVersion('1.0')
    .addTag('empresa', 'Operaciones sobre la estructura jerárquica de la empresa')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`\n🚀 Servidor iniciado en http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📄 Swagger UI disponible en http://localhost:${process.env.PORT ?? 3000}/api\n`);
}
bootstrap();
