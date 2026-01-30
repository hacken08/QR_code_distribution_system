import z from 'zod'
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'



const productSchemas = z.object({
  id: z.number(),
  item_code: z.number(),
  product_name: z.string(),
  created_at: z.string().nullable().optional().default(""),
  deleted_at: z.string().nullable().optional().default(null),
  updated_at: z.string().nullable().optional().default(null)
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