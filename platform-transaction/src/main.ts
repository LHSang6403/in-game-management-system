import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3003;

  await app.listen(port, () => {
    console.log(`Transaction Service is running on port ${port}`);
  });
}
bootstrap();
