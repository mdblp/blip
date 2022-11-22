/*
 * Copyright (c) 2022, Diabeloop
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

import React, { useEffect, useRef, useState } from 'react'

import Picker, { IEmojiData } from 'emoji-picker-react'

import { makeStyles, Theme } from '@material-ui/core/styles'
import SendIcon from '@material-ui/icons/Send'
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined'
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined'
import Card from '@material-ui/core/Card'
import ChatMessage from './chat-message'
import ChatApi from '../../lib/chat/api'
import { useAuth } from '../../lib/auth'
import { IMessage } from '../../models/chat'
import { Button, CardHeader, Tab, Tabs, TextField } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { UserRoles } from '../../models/user'
import { Patient } from '../../lib/data/patient'
import { useTeam } from '../../lib/team'
import { usePatientContext } from '../../lib/patient/provider'
import PatientUtils from '../../lib/patient/utils'

const chatWidgetStyles = makeStyles((theme: Theme) => {
  return {
    chatWidget: {
      width: '400px',
      height: '450px'
    },
    chatWidgetHeader: {
      textTransform: 'uppercase',
      backgroundColor: 'var(--card-header-background-color)'
    },
    chatWidgetHeaderText: {
      padding: theme.spacing(1)
    },
    iconButton: {
      backgroundColor: 'white',
      border: 'none',
      '& :hover': {
        cursor: 'pointer'
      }
    },
    chatWidgetContent: {
      padding: theme.spacing(2),
      background: theme.palette.common.white,
      width: '100%',
      height: '290px',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    chatWidgetFooter: {
      borderTop: '1px solid #E9E9E9',
      background: theme.palette.common.white,
      borderRadius: '0px 0px 12px 12px',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    },
    chatWidgetEmojiPickerContainer: {
      position: 'relative',
      top: '-250px',
      zIndex: 3
    },
    chatWidgetTabs: {
      minHeight: '0px'
    },
    chatWidgetTab: {
      minWidth: '0px',
      minHeight: '0px',
      padding: '0px',
      marginLeft: '10px',
      marginRight: '10px',
      fontSize: '0.6rem',
      textTransform: 'none'
    },
    chatWidgetInputRow: {
      display: 'flex',
      alignItems: 'center',
      background: theme.palette.common.white,
      width: '100%',
      height: '60px'
    },
    chatWidgetHCPToggle: {
      height: '20px'
    },
    chatWidgetInput: {
      width: '90%',
      maxWidth: '90%'
    },
    icon: {
      margin: theme.spacing(1)
    }
  }
}, { name: 'ylp-chat-widget' })

export interface Message {
  text: string
  isMine: boolean
}

export interface ChatWidgetProps {
  patient: Patient
  userId: string
  userRole: string
}

function ChatWidget(props: ChatWidgetProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const { patient, userId, userRole } = props
  const classes = chatWidgetStyles()
  const authHook = useAuth()
  const teamHook = useTeam()
  const patientHook = usePatientContext()
  const [showPicker, setShowPicker] = useState(false)
  const [privateMessage, setPrivateMessage] = useState(false)
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])
  const [nbUnread, setNbUnread] = useState(0)
  const [inputTab, setInputTab] = useState(0)
  const content = useRef<HTMLDivElement>(null)
  const inputRow = useRef<HTMLDivElement>(null)
  const team = PatientUtils.getRemoteMonitoringTeam(patient)

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number): void => {
    setInputTab(newValue)
  }

  useEffect(() => {
    content.current?.scroll({ left: 0, top: content.current?.scrollHeight })
  }, [messages])

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const messages = await ChatApi.getChatMessages(team.teamId, patient.userid)
      if (patient.metadata.hasSentUnreadMessages) {
        patientHook.markPatientMessagesAsRead(patient)
      }
      setMessages(messages)
      setNbUnread(messages.filter(m => !(m.authorId === userId) && !m.destAck).length)
    }

    fetchMessages()
  }, [userId, authHook, patient.userid, team.teamId, patient, teamHook, patientHook])

  const onEmojiClick = (_event: React.MouseEvent, emojiObject: IEmojiData): void => {
    setShowPicker(false)
    setInputText(inputText + emojiObject.emoji)
  }

  const resetInputSize = (): void => {
    if (!content.current || !inputRow.current) {
      throw new Error('Cannot find elements for resize')
    }
    content.current.style.height = '290px'
    inputRow.current.style.height = '60px'
  }

  const sendMessage = async (): Promise<void> => {
    await ChatApi.sendChatMessage(team.teamId, patient.userid, inputText, privateMessage)
    const messages = await ChatApi.getChatMessages(team.teamId, patient.userid)
    setMessages(messages)
    setInputText('')
    resetInputSize()
  }

  const inputHandler = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInputText(event.target.value)
    if (!content.current || !inputRow.current) {
      throw new Error('Cannot find elements for resize')
    }
    // values for scrollHeight are 24 one line, 44 2 lines and 64 3 lines
    // we display the scrollbar only when 3 lines are present
    if (event.target.scrollHeight > 44) {
      content.current.style.height = '250px'
      inputRow.current.style.height = '100px'
    } else if (event.target.scrollHeight > 24) {
      content.current.style.height = '270px'
      inputRow.current.style.height = '80px'
    } else {
      resetInputSize()
    }
  }

  return (
    <Card className={classes.chatWidget} id="chat-widget" data-testid="chat-card">
      <CardHeader
        id="chat-widget-header"
        avatar={<EmailOutlinedIcon />}
        className={classes.chatWidgetHeader}
        title={`${t('chat-messages-header')} ${nbUnread > 0 ? `(+${nbUnread})` : ''}`}
      />
      <div ref={content} id="chat-widget-messages" className={classes.chatWidgetContent} data-testid="chat-card-messages">
        {messages.map(
          (msg): JSX.Element => (
            <ChatMessage key={msg.id} text={msg.text}
              privateMsg={msg.private}
              author={msg.user.fullName}
              timestamp={msg.timestamp}
              ack={msg.destAck}
              isMine={msg.authorId === userId} />
          ))
        }
      </div>
      {showPicker &&
        <div id="chat-widget-emoji-picker" className={classes.chatWidgetEmojiPickerContainer}>
          <Picker pickerStyle={{ width: '100%' }} onEmojiClick={onEmojiClick} />
        </div>
      }
      <div id="chat-widget-footer" className={classes.chatWidgetFooter}>
        <div className={classes.chatWidgetHCPToggle}>
          {userRole === UserRoles.hcp &&
            <div>
              <Tabs className={classes.chatWidgetTabs} value={inputTab} aria-label="basic tabs example"
                onChange={handleChange}>
                <Tab className={classes.chatWidgetTab} label={t('chat-footer-reply')} data-testid="chat-card-reply"
                  onClick={() => setPrivateMessage(false)} />
                <Tab className={classes.chatWidgetTab} label={t('chat-footer-private')} data-testid="chat-card-private"
                  onClick={() => setPrivateMessage(true)} />
              </Tabs>
            </div>
          }
        </div>
        <div ref={inputRow} className={classes.chatWidgetInputRow}>
          <Button id="chat-widget-emoji-button" className={classes.iconButton} onClick={() => setShowPicker(true)}>
            <SentimentSatisfiedOutlinedIcon />
          </Button>
          <TextField
            className={classes.chatWidgetInput}
            id="standard-multiline-flexible"
            placeholder={t('chat-footer-start-writing')}
            multiline
            maxRows={3}
            value={inputText}
            onChange={inputHandler}
            variant="outlined"
            InputLabelProps={{ shrink: false }}
            data-testid="chat-card-input"
          />
          <Button id="chat-widget-send-button" disabled={inputText.length < 1} className={classes.iconButton} arial-label={t('send')} data-testid="chat-card-send"
            onClick={sendMessage}>
            <SendIcon />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ChatWidget
