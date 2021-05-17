import React, { FC } from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider  } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import 'taro-ui/dist/style/index.scss' 
import './app.less'
import models from './models'
import dva from './models/dva'
import createLoading from 'dva-loading'

const client = new QueryClient();

const dvaApp = dva.createApp( {
  initialState: {},
  models,
  router: () => <App />
} );  
dvaApp.use(createLoading());
const store = dvaApp.getStore();


interface AppProps {
  children?: React.ReactNode,
}

const App : FC<AppProps> = ({children}) => {

  return (
    <QueryClientProvider client={client}>
      <Provider store={store}>
          {children}
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
