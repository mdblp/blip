/*
 * Copyright (c) 2026, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { Drawer } from '@mui/material'
import Button from '@mui/material/Button'
import Portal from '@mui/material/Portal'
import { useTheme } from '@mui/material/styles'
import { ChatKit, useChatKit } from '@openai/chatkit-react'
import React, { FC, useRef } from 'react'

interface AiChatButtonProps {
  // Measured bottom edge (px, viewport-relative) of the header bar this button sits in.
  topOffset?: number
}

// Fallback used until the caller's measured topOffset is available (or when none is provided).
const MAIN_HEADER_HEIGHT = 64

export const AiChatButton: FC<AiChatButtonProps> = (props) => {
  const { topOffset: measuredTopOffset } = props
  const [isChatKitVisible, setIsChatKitVisible] = React.useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const theme = useTheme()
  const topOffset = measuredTopOffset ? `${measuredTopOffset}px` : `${MAIN_HEADER_HEIGHT}px`

  const toggleChatKit = () => {
    setIsChatKitVisible(!isChatKitVisible)
  }

  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          // implement session refresh
        }

        // const appAuthToken = await getAppAuthToken();
        const appAuthToken = 'APP_AUTH_TOKEN'
        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + appAuthToken,
            'Content-Type': 'application/json'
          }
        })
        const { client_secret } = await res.json()
        return client_secret
      }
    },
    theme: {
      color: {
        accent: {
          // TODO: find a way to pass the theme variable instead of the raw value
          primary: '#009bd6',
          level: 2
        }
      },
      density: 'compact'
    },
    composer: {
      placeholder: 'Ask anything... :)'
    },
    disclaimer: {
      text: 'WARNING: AI can make mistakes!'
    },
    frameTitle: 'Title',
    header: {
      rightAction: {
        icon: 'close',
        onClick: () => setIsChatKitVisible(false)
      }
    },
    startScreen: {
      greeting: 'Welcome to YourLoops!',
      prompts: [
        {
          label: "Check on the status of a ticket",
          prompt: "Can you help me check on the status of a ticket?",
          icon: "search"
        },
        {
          label: "Create Ticket",
          prompt: "Can you help me create a new support ticket?",
          icon: "write"
        }
      ]
    }
  });

  return (
    <>
      <Button
        variant="outlined"
        sx={{
          mx: 1
        }}
        onClick={toggleChatKit}
        ref={buttonRef}
      >
        🌍 Loopy
      </Button>
      {isChatKitVisible &&
        // <Popover
        //   open
        //   anchorEl={buttonRef.current}
        //   onClose={toggleChatKit}
        //   anchorOrigin={{
        //     vertical: 'top',
        //     horizontal: 'right'
        //   }}
        // >
        //   <ChatKit
        //     style={{
        //       width: '400px',
        //       height: '500px',
        //     }}
        //     control={control}
        //   />
        // </Popover>

        // Portal'd out of the header: a child can never render below its own ancestor's z-index.
        <Portal>
          <Drawer
            variant="persistent"
            anchor="right"
            open
            sx={{
              zIndex: theme.zIndex.appBar - 1,
              '& .MuiDrawer-paper': {
                top: topOffset,
                height: `calc(100% - ${topOffset})`
              }
            }}
          >
            <ChatKit
              style={{
                width: '400px',
                height: '800px'
              }}
              control={control}
            />
          </Drawer>
        </Portal>
      }
    </>
  )
}
