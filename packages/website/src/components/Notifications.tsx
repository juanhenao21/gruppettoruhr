import { FC } from 'react';
import { toast } from 'react-toastify';
import { BiAlarm, BiInfoCircle } from 'react-icons/bi';

type NotificationProps = {
  message: string;
};

export const SuccessNotification: FC<NotificationProps> = ({
  message,
}) => (
  <div className="flex items-center">
    <BiInfoCircle className="h-6 w-6 mr-2" />
    {message}
  </div>
);

export const ErrorNotification: FC<NotificationProps> = ({
  message,
}) => (
  <div className="flex items-center">
    <BiAlarm className="h-6 w-6 mr-2" />
    {message}
  </div>
);

export const showSuccessNotification = (message: string): void => {
  toast(<SuccessNotification message={message} />, {
    type: 'success',
  });
};

export const showErrorNotification = (message: string): void => {
  toast(<ErrorNotification message={message} />, {
    type: 'error',
  });
};
