import React, { FC, useState } from 'react';

import { Button } from '@/components/button/button';
import useFetch from '@/hooks/useFetch';

export const CreateLinkPage: FC = () => {
  const [params, setParams] = useState<Record<string, string>>({});
  // const tokenSearchRequest = useFetch('/token', params, true);

  const handleClick = () => {
    // tokenSearchRequest.fetch();
  };

  return (
    <div className="create">
      <p>Create page</p>
      <Button onClick={handleClick}>Create</Button>
    </div>
  );
};
