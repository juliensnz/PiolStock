'use client';

import {Loader} from '@/app/(root)/components/common/Loader';

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader color="#000" size={50} />
    </div>
  );
};

export default Loading;
