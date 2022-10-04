import { Router } from 'react-router-dom'
import { AuthContextProvider } from '../../../lib/auth'
import { MainLobby } from '../../../app/main-lobby'
import { createMemoryHistory } from 'history'
import { act, render } from '@testing-library/react'
import React from 'react'

function getMainLobby(history) {
  return (
    <Router history={history}>
      <AuthContextProvider>
        <MainLobby />
      </AuthContextProvider>
    </Router>
  )
}

export const renderPage = (url: string) => {
  const history = createMemoryHistory({ initialEntries: [url] })

  act(() => {
    render(getMainLobby(history))
  })
  expect(history.location.pathname).toBe(url)
}
