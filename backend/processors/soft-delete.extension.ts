import { Prisma } from '@prisma/client';

export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  model: {
    $allModels: {
      async delete<M, A>(this: M, args: Prisma.Args<M, 'delete'>): Promise<Prisma.Result<M, A, 'update'>> {
        const context = Prisma.getExtensionContext(this);
        return (context as any).update({
          ...args,
          data: {
            deletedAt: new Date(),
          },
        });
      },
      async deleteMany<M, A>(this: M, args: Prisma.Args<M, 'deleteMany'>): Promise<Prisma.Result<M, A, 'updateMany'>> {
        const context = Prisma.getExtensionContext(this);
        return (context as any).updateMany({
          ...args,
          data: {
            deletedAt: new Date(),
          },
        });
      },
    },
  },
  query: {
    $allModels: {
      async findFirst({ model, operation, args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findMany({ model, operation, args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
    },
  },
});