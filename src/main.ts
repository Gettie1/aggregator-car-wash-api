import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
// import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet()); // Use Helmet for security headers
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      'Content-Type, Accept, Authorization, X-Requested-With, X-API-KEY',
  });
  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // transform: true,
      // forbidNonWhitelisted: true,
    }),
  );
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4001;

  const config = new DocumentBuilder()
    .setTitle('🚗Aggregator Car Wash API')
    .setDescription(
      `
The **Aggregator Car Was System API** enables both administrators,vendors and customers to perform booking and review operations seamlessly.

### ✨ Key Features
- User authentication and authorization (Admin, Vendor, Customer)
- Booking and review management
- Vendor and customer profile management

### 👥 Roles & Access
- **Admin**: Manage vendors, customers, bookings, and view reports
- **Vendor**: Manage their own profile, services, and bookings
- **Customer**: Book services, leave reviews, and manage their profile

### 🌐 Base URLs
- **Production**: \`https://car-wash.example.com/api/v1\`
- **Development**: \`http://localhost:${port}/api/v1\`

### 🔐 Authentication
- Use the **Bearer Token** (JWT) via the \`Authorization\` header
`,
    )

    .setVersion('1.0')
    .addTag('Vendors', 'Vendor management endpoint')
    .addTag('Customer', 'Customer management endpoint')
    .addTag('Bookings', 'Booking management endpoint')
    .addTag('Auth', 'Authentication and authorization endpoint')
    .addTag('Profile', 'Profile management endpoint')
    .addTag('Admin', 'Admin management endpoint')
    .addTag('Vehicles', 'Vehicle management endpoint')
    .addTag('Reports', 'Report generation endpoint')
    .addTag('Reviews', 'Review management endpoint')
    .addTag('Services', 'Service management endpoint')
    .addTag('Seed', 'Seed data management endpoint')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // Name of the security scheme
    )
    .addServer(`http://localhost:3000`, 'Local development server')
    .addServer(`https://car-wash.example.com`, 'Production server')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    jsonDocumentUrl: 'api/api-json',
    yamlDocumentUrl: 'api/api-yaml',
    swaggerOptions: {
      persistAuthorization: true, // This allows Swagger UI to remember the token
      tagsSorter: 'alpha', // Sort tags alphabetically
      operationsSorter: 'alpha', // Sort operations alphabetically
      docExpansion: 'none', // Start with all sections collapsed
      filter: true, // Enable filtering of endpoints
      showRequestDuration: true, // Show request duration in milliseconds
      tryItOutEnabled: true, // Enable the "Try it out" feature
    },
    customCss: `
      .swagger-ui .topbar { display: none; }
      swagger-ui .info { margin-bottom: 20px; }
      `,
    customSiteTitle: 'Car-wash System Documentation',
    customfavIcon:
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f393.png', // 🎓 graduation cap
  });
  await app.listen(port, () => {
    console.log(`App running on: http://localhost:${port}`);
  });
}

void bootstrap();
