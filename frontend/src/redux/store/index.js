import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import system from '../services/system'
import exam from '../services/exam'
import lesson from '../services/lesson'
import subscriptions from '../services/subscription'
export const store = configureStore({
  reducer: {
    system,
    exam,
    lesson,
    subscriptions
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
})

setupListeners(store.dispatch)
