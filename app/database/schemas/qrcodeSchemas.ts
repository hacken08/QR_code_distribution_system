
import {z} from 'zod';
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from 'firebase/firestore';

//  Main Entity
export const qrcodeSchemas = z.object({
    id: z.string().optional(), 
    productName: z.string(),
    itemCode: z.number().gt(0, "item code should be positive integer").nullable(),
    batchNo: z.number().gt(0, "'batch no' should be positive integer").nullable(),
    qrcodeString: z.string(),
    isUsed: z.boolean().optional().default(false),
    createdAt: z.date().nullable().optional().default(new Date),
    deletedAt: z.date().nullable().optional().default(null),
    updatedAt: z.date().nullable().optional().default(null),
})

// creat qrcode payload
 const qrCodePayloadSchema = z.object({
  productName: z.string(),  
  itemCode: z.number().nullable(),
  batchNo: z.number().nullable(),
  qrcodeString: z.string(),
  points: z.number().nullable(),
});
type QrCodeSchema = z.infer<typeof qrCodePayloadSchema>

const qrCodeSchemaList = z.array(qrCodePayloadSchema)
type QrCodeSchemaList = z.infer<typeof qrCodeSchemaList>

export type QrCode = z.infer<typeof qrcodeSchemas>;
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

export { qrcodeModel, qrCodeSchemaList, qrCodePayloadSchema, type QrCodeSchemaList, type QrCodeSchema }