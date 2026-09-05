import Fastify from 'fastify';

const fastify = Fastify();
const port = 3000;

fastify.get('/', async () => {
  return { message: 'Server is running' };
});

try {
  await fastify.listen({ port });
  console.log(`Server is running at http://localhost:${port}`);
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
