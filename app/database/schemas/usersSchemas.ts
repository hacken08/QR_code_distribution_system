// src/schemas.ts
import { z } from 'zod';
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export const userSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    profilePicture: z.string().url('Invalid URL').optional(),
});

export type User = z.infer<typeof userSchema>;

const userConverter: FirestoreDataConverter<User> = {
    toFirestore: (user: User) => {
        return userSchema.parse(user);
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User => {
        const data = snapshot.data(options);
        const validatedData = userSchema.parse({
            ...data,
            id: snapshot.id,
        });
        return validatedData;
    },
};

export { userConverter }