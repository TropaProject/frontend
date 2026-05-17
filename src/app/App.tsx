import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import { Providers } from '@/app/providers/Providers'

export const App = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}