import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/auth/index';
import prescriptionsReducer from './reducers/prescriptions/index';
import hiringRequestReducer from './reducers/doctorsHiringRequest/index'

export default configureStore({
  reducer: {
    auth: authReducer,
    prescriptions: prescriptionsReducer,
    hiringRequest:hiringRequestReducer,
  },
});
