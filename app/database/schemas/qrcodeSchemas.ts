
import { z } from 'zod';
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

//  Main Entity
export const qrcodeSchemas = z.object({
  id: z.string().optional(),
  productName: z.string(),
  productId: z.string().min(0, "Product id not defined"),
  itemCode: z.number().gt(0, "item code should be positive integer"),
  batchNo: z.number().gt(0, "'batch no' should be positive integer"),
  qrcodeString: z.string(),
  points: z.number(),
  isUsed: z.boolean().optional().default(false),
  createdAt: z.date().nullable().optional().default(new Date),
  deletedAt: z.date().nullable().optional().default(null),
  updatedAt: z.date().nullable().optional().default(null),
})

// creat qrcode payload
const qrCodePayloadSchema = z.object({
  productName: z.string(),
  itemCode: z.number(),
  batchNo: z.number(),
  qrcodeString: z.string(),
  points: z.number(),
});
type QrCodeSchema = z.infer<typeof qrCodePayloadSchema>

const qrCodeSchemaList = z.array(qrCodePayloadSchema)
type QrCodeSchemaList = z.infer<typeof qrCodeSchemaList>

export type QrCode = z.infer<typeof qrcodeSchemas>;

// creating a model from qr code schemas
const qrcodeModel: FirestoreDataConverter<QrCode> = {
  toFirestore: (user: QrCode) => {
    return qrcodeSchemas.parse(user);
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): QrCode => {
    const data = snapshot.data(options);
    const validatedData = qrcodeSchemas.parse({
      ...data,
      id: snapshot.id,
    });
    return validatedData;
  },
};

export {
  qrcodeModel,
  qrCodeSchemaList,
  qrCodePayloadSchema,
  type QrCodeSchema,
  type QrCodeSchemaList,
}
