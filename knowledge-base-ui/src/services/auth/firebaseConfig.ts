import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { appConfig } from '../../config/app.config';

const firebaseConfig = {
  apiKey: appConfig.firebase.apiKey,
  authDomain: appConfig.firebase.authDomain,
  projectId: appConfig.firebase.projectId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
