/*
 * Copyright (c) 2022-2025, Diabeloop
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

import React, { type KeyboardEvent, useEffect, useRef, useState } from 'react'

import EmojiPicker, { type EmojiClickData, EmojiStyle } from 'emoji-picker-react'

import { type Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import SendIcon from '@mui/icons-material/Send'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import ChatMessage from './chat-message'
import ChatApi from '../../lib/chat/chat.api'
import { useAuth } from '../../lib/auth'
import { type IMessage } from '../../lib/chat/models/i-message.model'
import { useTranslation } from 'react-i18next'
import { useTeam } from '../../lib/team'
import { usePatientsContext } from '../../lib/patient/patients.provider'
import { type Patient } from '../../lib/patient/models/patient.model'
import Box from '@mui/material/Box'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import MenuItem from '@mui/material/MenuItem'
import FormGroup from '@mui/material/FormGroup'
import TeamUtils from '../../lib/team/team.util'
import { getUserName } from '../../lib/auth/user.util'
import Badge from '@mui/material/Badge'
import { getUnreadMessagesByTeam } from './chat.util'
import Link from '@mui/material/Link'
import Dialog from '@mui/material/Dialog'
import DialogContentText from '@mui/material/DialogContentText'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import { useParams } from 'react-router-dom'
import { DataCard } from '../data-card/data-card'
import Typography from '@mui/material/Typography'

const CHAT_CONTENT_MIN_HEIGHT = '280px'
const CHAT_CONTENT_MAX_HEIGHT = '450px'
const KEYBOARD_EVENT_ESCAPE = 'Escape'

const chatWidgetStyles = makeStyles({ name: 'ylp-chat-widget' })((theme: Theme) => {
  return {
    iconButton: {
      backgroundColor: 'white',
      border: 'none',
      '& :hover': {
        cursor: 'pointer'
      }
    },
    chatWidgetContent: {
      paddingBottom: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      minHeight: CHAT_CONTENT_MIN_HEIGHT,
      maxHeight: CHAT_CONTENT_MAX_HEIGHT,
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    chatWidgetFooter: {
      borderTop: `1px solid ${theme.palette.divider}`,
      paddingTop: theme.spacing(1)
    },
    chatWidgetEmojiPickerContainer: {
      position: 'absolute',
      top: 10,
      zIndex: 3,
      width: '100%'
    },
    chatWidgetTabs: {
      minHeight: '0px'
    },
    chatWidgetTab: {
      minWidth: '0px',
      minHeight: '0px',
      padding: '0px',
      marginLeft: '10px',
      marginRight: '10px'
    },
    chatWidgetInputRow: {
      display: 'flex',
      alignItems: 'center',
      background: theme.palette.common.white,
      paddingTop: theme.spacing(1)
    },
    teamDropdown: {
      borderRadius: '28px',
      textTransform: 'none',
      padding: 0,
      height: '34px'
    }
  }
})

export interface Message {
  text: string
  isMine: boolean
}

export type UnreadMessagesByTeam = Record<string, boolean>

export interface ChatWidgetProps {
  patient: Patient
}

function ChatWidget(props: Readonly<ChatWidgetProps>): JSX.Element {
  const { t } = useTranslation()
  const { patient } = props
  const { classes } = chatWidgetStyles()
  const { getMedicalTeams } = useTeam()
  const theme = useTheme()
  const patientsHook = usePatientsContext()
  const { teamId: selectedTeamId } = useParams()
  const { user } = useAuth()
  const [showPicker, setShowPicker] = useState(false)
  const [privateMessage, setPrivateMessage] = useState(false)
  const [here, setHere] = useState(false)
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])
  const [nbUnread, setNbUnread] = useState(0)
  const [unreadMessagesByTeamForPatient, setUnreadMessagesByTeamForPatient] = useState<UnreadMessagesByTeam>(null)
  const [inputTab, setInputTab] = useState(0)
  const content = useRef<HTMLDivElement>(null)
  const inputRow = useRef<HTMLDivElement>(null)
  const teamIdForWhichMessagesHaveBeenFetched = useRef(null)
  const isUserHcp = user.isUserHcp()
  const isUserPatient = user.isUserPatient()
  const teams = getMedicalTeams()
  const teamId = isUserHcp ? selectedTeamId : teams[0].id
  const [dropdownTeamId, setDropdownTeamId] = useState(teamId)
  const userId = user.id

  const handleChange = (_event: React.ChangeEvent, newValue: number): void => {
    setInputTab(newValue)
  }

  useEffect(() => {
    content.current?.scroll({ left: 0, top: content.current?.scrollHeight })
  }, [messages])

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const messages = await ChatApi.getChatMessages(dropdownTeamId, patient.userid)
      if (patient.hasSentUnreadMessages) {
        patientsHook.markPatientMessagesAsRead(patient)
      }
      setMessages(messages)
      setNbUnread(messages.filter(m => !(m.authorId === userId) && !m.destAck).length)
    }

    async function fetchUnreadMessagesCountForPatient(): Promise<void> {
      const unreadMessagesCountByTeam = await ChatApi.getUnreadMessagesCountForPatient(userId)

      const unreadMessages = getUnreadMessagesByTeam(unreadMessagesCountByTeam, teams)
      unreadMessages[dropdownTeamId] = false

      setUnreadMessagesByTeamForPatient(unreadMessages)
    }

    if (dropdownTeamId !== teamIdForWhichMessagesHaveBeenFetched.current) {
      teamIdForWhichMessagesHaveBeenFetched.current = dropdownTeamId
      fetchMessages()
      if (isUserPatient) {
        fetchUnreadMessagesCountForPatient()
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownTeamId])

  const onEmojiClick = (emoji: EmojiClickData): void => {
    setShowPicker(false)
    setInputText(inputText + emoji.emoji)
  }

  const sendMessage = async (): Promise<void> => {
    await ChatApi.sendChatMessage(dropdownTeamId, patient.userid, inputText, privateMessage)
    const messages = await ChatApi.getChatMessages(dropdownTeamId, patient.userid)
    setMessages(messages)
    setInputText('')
  }

  const onEmojiPickerKeyPress = (event: KeyboardEvent): void => {
    if (event.key === KEYBOARD_EVENT_ESCAPE) {
      setShowPicker(false)
    }
  }

  const onTeamSelected = (event: SelectChangeEvent<string>): void => {
    setDropdownTeamId(event.target.value)
  }

  const hasNoUnreadMessages = (): boolean => {
    return unreadMessagesByTeamForPatient === null || Object.values(unreadMessagesByTeamForPatient).every((hasUnread: boolean) => !hasUnread)
  }

  const checkThisOut = (text: string): void => {
    if (text === '666' && process.env.NODE_ENV === 'development') {
      setHere(true)
    }
  }

  return (
    <DataCard data-testid="chat-card">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ paddingBottom: theme.spacing(1) }}
      >
        <Typography sx={{ fontWeight: 'bold', paddingBottom: '8px' }}>
          {`${t('messages')} ${nbUnread > 0 ? `(+${nbUnread})` : ''}`}
        </Typography>
        {isUserPatient &&
          <FormGroup>
            <Badge color="primary" variant="dot" invisible={hasNoUnreadMessages()}
                   data-testid="unread-messages-badge">
              <Select
                data-testid="chat-widget-team-scope"
                defaultValue={teamId}
                IconComponent={KeyboardArrowDownIcon}
                onChange={onTeamSelected}
                variant="outlined"
                className={classes.teamDropdown}
              >
                {
                  teams.map((team, index) =>
                    <MenuItem
                      key={index}
                      data-testid={`chat-widget-team-scope-menu-${TeamUtils.formatTeamNameForTestId(team.name)}-option`}
                      value={team.id}
                    >
                      {team.name}
                      {unreadMessagesByTeamForPatient?.[team.id] &&
                        <Badge
                          variant="dot"
                          color="primary"
                          sx={{ p: 0.5 }}
                          data-testid={`unread-messages-badge-team-${team.id}`}
                        />
                      }
                    </MenuItem>
                  )
                }
              </Select>
            </Badge>
          </FormGroup>
        }
      </Box>

      <Box position="relative">
        <Dialog open={here} onClose={() => setHere(false)}>
          <DialogContent>
            <DialogContentText>
              You asked for the beast, meet her at <Link href="https://eightsins.fr">www.eightsins.fr</Link>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Box
          ref={content}
          className={classes.chatWidgetContent}
          data-testid="chat-card-messages"
        >
          {messages.map((msg): JSX.Element => (
            <ChatMessage
              key={msg.id}
              text={msg.text}
              privateMsg={msg.private}
              author={getUserName(msg.user.firstName, msg.user.lastName, msg.user.fullName)}
              timestamp={msg.timestamp}
              ack={msg.destAck}
              isMine={msg.authorId === userId}
            />
          ))}
        </Box>
        {showPicker &&
          <div
            id="chat-widget-emoji-picker"
            data-testid="chat-widget-emoji-picker"
            className={classes.chatWidgetEmojiPickerContainer}
            onKeyDown={onEmojiPickerKeyPress}
          >
            <EmojiPicker
              width="100%"
              height="440px"
              lazyLoadEmojis
              emojiStyle={EmojiStyle.NATIVE}
              onEmojiClick={onEmojiClick}
            />
          </div>
        }
        <div id="chat-widget-footer" className={classes.chatWidgetFooter}>
          {isUserHcp &&
            <Tabs
              className={classes.chatWidgetTabs}
              value={inputTab}
              onChange={handleChange}
              sx={{ marginBottom: theme.spacing(1) }}
            >
              <Tab
                className={classes.chatWidgetTab}
                label={t('chat-footer-reply')}
                aria-label={t('chat-footer-reply')}
                data-testid="chat-card-reply"
                onClick={() => {
                  setPrivateMessage(false)
                }}
              />
              <Tab
                className={classes.chatWidgetTab}
                label={t('chat-footer-private')}
                aria-label={t('chat-footer-private')}
                data-testid="chat-card-private"
                onClick={() => {
                  setPrivateMessage(true)
                }}
              />
            </Tabs>
          }
          <div ref={inputRow} className={classes.chatWidgetInputRow}>
            <Button
              id="chat-widget-emoji-button"
              data-testid="chat-widget-emoji-button"
              className={classes.iconButton}
              onClick={() => {
                setShowPicker(true)
              }}
            >
              <SentimentSatisfiedOutlinedIcon />
            </Button>
            <TextField
              id="standard-multiline-flexible"
              placeholder={t('chat-footer-start-writing')}
              size="small"
              multiline
              maxRows={3}
              value={inputText}
              onChange={event => {
                checkThisOut(event.target.value)
                setInputText(event.target.value)
              }}
              InputLabelProps={{ shrink: false }}
              data-testid="chat-card-input"
            />
            <Button
              id="chat-widget-send-button"
              disabled={inputText.length < 1}
              className={classes.iconButton}
              arial-label={t('send')}
              title={t('send')}
              data-testid="chat-card-send"
              onClick={sendMessage}
            >
              <SendIcon />
            </Button>
          </div>
        </div>
      </Box>
    </DataCard>
  )
}

export default ChatWidget
