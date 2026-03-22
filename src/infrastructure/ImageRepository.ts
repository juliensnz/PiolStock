import {Either, Result} from '@/domain/model/common/Result';
import {RuntimeError} from '@/domain/model/common/RuntimeError';
import {firebaseApp} from '@/lib/firebase';
import {FirebaseStorage, getStorage, listAll, ref, uploadBytes} from 'firebase/storage';

const storage = getStorage(firebaseApp);

const imagesRepositoryCreator = ({storage}: {storage: FirebaseStorage}) => ({
  findAll: async (): Promise<Either<string[], RuntimeError>> => {
    try {
      const listRef = await listAll(ref(storage, 'images'));

      return Result.Ok(listRef.items.map(item => item.name));
    } catch (error) {
      return Result.Error({
        type: 'image_repository.find_all',
        message: 'Error fetching images',
        payload: {error},
      });
    }
  },

  upload: async (file: File, fileName: string): Promise<Either<string, RuntimeError>> => {
    try {
      const imageRef = ref(storage, `images/${fileName}`);
      await uploadBytes(imageRef, file);

      return Result.Ok(fileName);
    } catch (error) {
      return Result.Error({
        type: 'image_repository.upload',
        message: 'Error uploading image',
        payload: {error},
      });
    }
  },
});

const imagesRepository = imagesRepositoryCreator({storage});

export {imagesRepository};
