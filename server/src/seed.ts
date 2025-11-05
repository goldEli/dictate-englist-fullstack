import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import 'dotenv/config';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'dictate_english',
  entities: [User],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const existingUser = await userRepository.findOne({
    where: { email: 'test@example.com' },
  });

  if (existingUser) {
    console.log('User already exists: test@example.com');
    await dataSource.destroy();
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = userRepository.create({
    email: 'test@example.com',
    password_hash: hashedPassword,
  });

  await userRepository.save(user);

  console.log('Created test user: test@example.com');
  console.log('Password: password123');

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
