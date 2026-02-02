
import { z } from 'zod';
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';


export const qrcodeSchemas = z.object({
  id: z.number(),
  product_id: z.number(),
  item_code: z.number(),
  batch_no: z.number(),
  qrcode_string: z.string(),
  product_name: z.string(),
  points: z.number(),
  is_used: z.boolean(),
  created_at: z.date(),
  deleted_at: z.date().nullable(),
  updated_at: z.date().nullable(),
  product: z.any(),
});

type QrCodeType = z.infer<typeof qrcodeSchemas>;

// creat qrcode payload
const qrCodePayloadSchema = z.object({
  product_name: z.string(),
  item_code: z.number(),
  batch_no: z.number(),
  qrcode_string: z.string(),
  points: z.number(),
});

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
