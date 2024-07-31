import * as dotenv from'dotenv'
import path  from 'path';
dotenv.config({path:path.resolve('../../config/.env')})
import cloudinary from 'cloudinary';
cloudinary.config({ 
  cloud_name: 'dwlvfku2z', 
  api_key: '627444142219221', 
  api_secret: 'O-GuGtRDuE4h8FxpLcvAZGLTqw0' ,
  secure:true
});

export default cloudinary.v2