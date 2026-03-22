/**
 * One-off migration script: reads the flat `products` collection and writes
 * grouped documents with embedded variants into `products_with_variants`.
 *
 * Uses the client Firebase SDK with the same config as the app (.env values).
 *
 * Prerequisites:
 *   1. Install tsx if not already:  npm i -D tsx
 *   2. Run:  npx tsx --env-file=.env scripts/migrate-products-with-variants.ts
 */

import {initializeApp} from 'firebase/app';
import {getFirestore, collection, getDocs, writeBatch, doc} from 'firebase/firestore';
import {randomUUID} from 'crypto';

const SOURCE_COLLECTION = 'products';
const TARGET_COLLECTION = 'products_with_variants';

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);

type OldProduct = {
  id: string;
  name: string;
  image: string;
  format: string;
  stock: number;
};

type Variant = {id: string; format: string; stock: number};
type NewProduct = {id: string; name: string; image: string; variants: Variant[]};

async function migrate() {
  const snapshot = await getDocs(collection(db, SOURCE_COLLECTION));

  if (snapshot.empty) {
    console.log(`No documents found in '${SOURCE_COLLECTION}'. Nothing to migrate.`);
    return;
  }

  const grouped = new Map<string, {name: string; image: string; variants: Variant[]}>();

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data() as OldProduct;
    const key = `${data.name}::${data.image}`;

    if (!grouped.has(key)) {
      grouped.set(key, {name: data.name, image: data.image, variants: []});
    }
    grouped.get(key)!.variants.push({
      id: randomUUID(),
      format: data.format,
      stock: data.stock,
    });
  }

  const batch = writeBatch(db);

  for (const product of grouped.values()) {
    const id = randomUUID();
    const newProduct: NewProduct = {id, ...product};
    batch.set(doc(db, TARGET_COLLECTION, id), newProduct);
  }

  await batch.commit();

  console.log(
    `Migrated ${snapshot.size} documents from '${SOURCE_COLLECTION}' → ${grouped.size} products in '${TARGET_COLLECTION}'.`
  );
}

migrate().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
