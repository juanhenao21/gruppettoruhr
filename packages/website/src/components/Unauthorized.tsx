import { FC } from 'react';
import Link from 'next/link';

import {
  primaryActionButtonClasses,
  secondaryActionButtonClasses,
  hoverScale,
} from '@src/styles/buttons';

type UnauthorizedProps = {
  classes?: string;
};

const Unauthorized: FC<UnauthorizedProps> = ({ classes }) => {
  return (
    <div
      className={` h-full bg-gray-100 flex flex-col justify-center items-center ${classes}`}
    >
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 className="text-2xl text-center font-bold mb-8">
          You are not authorized to see this content
        </h1>
        <span className="w-full">
          <Link
            href={{
              pathname: 'login',
              query: { from: window.location.pathname },
            }}
          >
            <a
              className={`mb-4 ${primaryActionButtonClasses} ${hoverScale}`}
            >
              Login
            </a>
          </Link>
          <Link href="/">
            <a
              className={`mb-4 ${secondaryActionButtonClasses} ${hoverScale}`}
            >
              Home
            </a>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Unauthorized;
