import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { v4 as uuidv4 } from 'uuid';
import Busboy from 'busboy';

import { uploadObject } from '@src/utils/s3';
import { createJSONPayload } from '@src/utils/api';
import { MIME_TYPES } from '@src/consts/upload';
import { BUCKET_MEDIA_PREFIX } from '@src/consts/s3';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * -- TODO --
 * Create api response types that can also be used in the frontend
 */
const mediaHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  /**
   * We need to return a promise to avoid that nextjs report a warning.
   * The reason for this is the nested async function call on the
   * busboy on file event.
   */
  return new Promise((resolve) => {
    if (req.method === 'POST') {
      const session = getSession({ req });
      if (!session) {
        res.status(401).send({});
        resolve();
      } else {
        const busboy = new Busboy({ headers: req.headers });
        const rejectedFiles: string[] = [];
        const acceptedFiles: string[] = [];
        let httpStatus = 200;
        let counter = 0;

        busboy.on(
          'file',
          async (_, file, filename, encoding, mimetype) => {
            counter = counter + 1;
            if (!MIME_TYPES.includes(mimetype)) {
              httpStatus = 415;
              rejectedFiles.push(filename);
            } else {
              const uuid = uuidv4();

              /**
               * -- TODO --
               * Create a common config for acl options
               */
              const uploadData = await uploadObject(
                `${BUCKET_MEDIA_PREFIX}/${uuid}.${filename}`,
                file,
                encoding,
                mimetype,
                'public-read'
              );
              acceptedFiles.push(uploadData.Location);
              counter = counter - 1;
              console.log(counter, acceptedFiles);
              if (counter === 0) {
                if (httpStatus == 415) {
                  res.status(415);
                  res.send({ acceptedFiles, rejectedFiles });
                  resolve();
                } else {
                  res.status(200);
                  res.send({ acceptedFiles });
                  resolve();
                }
              }
            }
          }
        );
        req.pipe(busboy);
      }
    } else {
      const payload = createJSONPayload<string>(req.method, {
        error: 'Method not allows',
      });
      res.status(405).send(payload);
      resolve();
    }
  });
};

export default mediaHandler;
