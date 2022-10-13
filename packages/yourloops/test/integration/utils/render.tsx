import { Router } from 'react-router-dom'
import { AuthContextProvider } from '../../../lib/auth'
import { MainLobby } from '../../../app/main-lobby'
import { createMemoryHistory, MemoryHistory } from 'history'
import { render } from '@testing-library/react'
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

export const renderPageFromHistory = (history: MemoryHistory) => {
  render(getMainLobby(history))
}

export const renderPage = (url: string) => {
  const history = createMemoryHistory({ initialEntries: [url] })
  renderPageFromHistory(history)
  expect(history.location.pathname).toBe(url)
}
