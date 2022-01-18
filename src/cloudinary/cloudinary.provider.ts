import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'dpisyrhal',
      api_key: '836854575356252',
      api_secret: '-FjzgvotzcwkpbZpB9KfEyae-Tk',
    });
  },
};
