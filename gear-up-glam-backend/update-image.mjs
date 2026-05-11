import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates = [
  { id: 'seed-5', image: 'https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?w=600' },
  { id: 'seed-6', image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?w=600' },
  { id: 'seed-11', image: 'https://images.pexels.com/photos/2549942/pexels-photo-2549942.jpeg?w=600' },
  { id: 'seed-15', image: 'https://images.pexels.com/photos/1715193/pexels-photo-1715193.jpeg?w=600' },
  { id: 'seed-16', image: 'https://images.pexels.com/photos/104842/bmw-car-vehicle-antique-104842.jpeg?w=600' },
  { id: 'seed-18', image: 'https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?w=600' },
];

for (const { id, image } of updates) {
  await prisma.product.update({ where: { id }, data: { image } });
  console.log(`Updated ${id}`);
}

console.log('All done!');
await prisma.$disconnect();