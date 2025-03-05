import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3002;

  await app.listen(port, () => {
    console.log(`Item Catalog Service is running on port ${port}`);
  });
}
bootstrap();
