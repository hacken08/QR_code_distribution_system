import z from 'zod'
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'



const productSchemas = z.object({
  itemCode: z.number(),
  productName: z.string(),
  createdAt: z.date().nullable().optional().default(new Date),
  deletedAt: z.date().nullable().optional().default(null),
  updatedAt: z.date().nullable().optional().default(null)
})

type ProductType = z.infer<typeof productSchemas>

// product Model from it's schema
const ProductModel: FirestoreDataConverter<ProductType> = {
  toFirestore: (user: ProductType) => {
    return productSchemas.parse(user);
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ProductType => {
    const data = snapshot.data(options);
    const validatedData = productSchemas.parse({
      ...data,
      id: snapshot.id,
    });
    return validatedData;
  },
};


export { ProductModel, type ProductType, productSchemas }