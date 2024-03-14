import {Either, Result} from '@/domain/model/common/Result';
import {RuntimeError} from '@/domain/model/common/RuntimeError';
import {firebaseApp} from '@/lib/firebase';
import {FirebaseStorage, getStorage, listAll, ref} from 'firebase/storage';

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
});

const imagesRepository = imagesRepositoryCreator({storage});

export {imagesRepository};
