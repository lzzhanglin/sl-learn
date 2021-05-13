import React, { FC } from 'react'
import { QueryClient, QueryClientProvider  } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import 'taro-ui/dist/style/index.scss' 
import './app.less'

const client = new QueryClient();



interface AppProps {
  children: React.ReactNode,
}

const App : FC<AppProps> = ({children}) => {

  return (
    <QueryClientProvider client={client}>
        {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
