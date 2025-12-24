
import { z } from 'zod';
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

//  Main Entity
export const qrcodeSchemas = z.object({
  id: z.number().optional(),
  product_name: z.string(),
  product_id: z.number().min(1, "Product id not defined"),
  item_code: z.number().gt(0, "item_code should be positive integer"),
  batch_no: z.number().gt(0, "batch_no should be positive integer"),
  qrcode_string: z.string(),
  points: z.number(),
  is_used: z.boolean().optional().default(false),
  created_at: z.date().nullable().optional().default(() => new Date()),
  deleted_at: z.date().nullable().optional().default(null),
  updated_at: z.date().nullable().optional().default(null),
})
type QrCodeType = z.infer<typeof qrcodeSchemas>;

// creat qrcode payload
const qrCodePayloadSchema = z.object({
  productName: z.string(),
  itemCode: z.number(),
  batchNo: z.number(),
  qrcodeString: z.string(),
  points: z.number(),
});

type QrCodePayloadTypes = z.infer<typeof qrCodePayloadSchema>
const qrCodeSchemaList = z.array(qrCodePayloadSchema)
type QrCodeSchemaList = z.infer<typeof qrCodeSchemaList>


// creating a model from qr code schemas
const QrcodeModel: FirestoreDataConverter<QrCodeType> = {
  toFirestore: (user: QrCodeType) => {
    return qrcodeSchemas.parse(user);
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): QrCodeType => {
    const data = snapshot.data(options);
    const validatedData = qrcodeSchemas.parse({
      ...data,
      id: snapshot.id,
    });
    return validatedData;
  },
};

export {
  QrcodeModel as qrcodeModel,
  qrCodeSchemaList,
  qrCodePayloadSchema,
  type QrCodeType,
  type QrCodeSchemaList,
}
