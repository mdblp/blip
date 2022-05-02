/**
 * Copyright (c) 2022, Diabeloop
 * Generic Chat window
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

import React, { useEffect, useRef, useState } from "react";

import Picker, { IEmojiData } from "emoji-picker-react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import Card from "@material-ui/core/Card";
import ChatMessage from "./chat-message";
import { getChatMessages, sendChatMessage } from "../../lib/chat/api";
import { useAuth } from "../../lib/auth";
import { IMessage } from "../../models/chat";
import { Button, Tab, Tabs } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const chatWidgetStyles = makeStyles((theme: Theme) => {
  return {
    chatWidget: {
      width: "300px",
      height: "400px",
    },
    chatWidgetHeader: {
      padding: theme.spacing(1),
      display: "flex",
      alignItems: "center",
      background: "#035271",
      color: "black",
      width: "100%",
      height: "40px",
    },
    chatWidgetHeaderText: {
      padding: theme.spacing(1),
    },
    iconButton: {
      "backgroundColor": "white",
      "border": "none",
      "& :hover": {
        cursor: "pointer",
      },
    },
    chatWidgetContent: {
      background: "white",
      width: "100%",
      height: "280px",
      overflow: "auto",
    },
    chatWidgetFooter: {
      borderTop: "1px solid #E9E9E9",
      background: "white",
      borderRadius: "0px 0px 12px 12px",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    chatWidgetTabs: {
      minHeight: "0px",
    },
    chatWidgetTab: {
      minWidth: "0px",
      minHeight: "0px",
      padding: "0px",
      marginLeft: "10px",
      marginRight: "10px",
      fontSize: "0.6rem",
      textTransform: "none",
    },
    chatWidgetInputRow: {
      display: "flex",
      alignItems: "center",
      background: "white",
      width: "100%",
      height: "40px",
    },
    chatWidgetHCPToggle: {
      height: "20px",
    },
    chatWidgetInput: {
      "fontFamily": "Roboto",
      "fontStyle": "normal",
      "marginLeft": theme.spacing(1),
      "display": "block",
      "width": "90%",
      "maxWidth": "90%",
      "overflow": "hidden",
      "resize": "none",
      "height": "24px",
      "maxHeight": "60px",
      "lineHeight": "20px",
      "border": "1px solid white",
      "& :focus": {
        outlineColor: "#F6F6F6",
      },
    },
    emojiPicker: {
      display: "none",
    },
    icon: {
      margin: theme.spacing(1),
    },
  };
}, { name: "ylp-chat-widget" });

export interface Message {
  text: string,
  isMine: boolean
}

export interface ChatWidgetProps {
  patientId: string;
  teamId: string;
  userId: string;
  userRole: string;
}

function ChatWidget(props: ChatWidgetProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const { patientId, userId, teamId, userRole } = props;
  const classes = chatWidgetStyles();
  const authHook = useAuth();
  const [showPicker, setShowPicker] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputTab, setInputTab] = useState(0);
  const content = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const inputRow = useRef<HTMLDivElement>(null);
  /*retrieve for the patient the first monitoring team found (only one monitoring team is allowed)*/
  /*TODO : get monitoring team, today the field is not present in the UI so it's taking the first team*/


  // TODO remove this lint issue ???
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setInputTab(newValue);
  };

  useEffect(() => {
    content.current?.lastElementChild?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    async function fetchMessages() {
      const messages = await getChatMessages(teamId, patientId);
      setMessages(messages);
    }
    fetchMessages();
  }, [userId, patientId, teamId, authHook]);

  const onEmojiClick = (_event: React.MouseEvent, emojiObject: IEmojiData) => {
    setShowPicker(false);
    setInputText(inputText + emojiObject.emoji);
  };

  const resetInputSize = () => {
    if (!content.current || !inputRow.current || !input.current) {
      throw new Error("Cannot find elements for resize");
    }
    content.current.style.height = "280px";
    inputRow.current.style.height = "40px";
    input.current.style.overflow = "hidden";
    input.current.style.height = "24px";
  };

  const sendMessage = async () => {
    await sendChatMessage(teamId, patientId, inputText);
    const messages = await getChatMessages(teamId, patientId);
    setMessages(messages);
    setInputText("");
    resetInputSize();
    if (input.current) {
      input.current.value = "";
    }
  };

  const inputHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    event.target.style.height = "1px";
    event.target.style.height = (event.target.scrollHeight) + "px";
    if (!content.current || !inputRow.current) {
      throw new Error("Cannot find elements for resize");
    }
    //values for scrollHeight are 24 one line, 44 2 lines and 64 3 lines
    //we display the scrollbar only when 3 lines are present
    if (event.target.scrollHeight > 44) {
      event.target.style.overflow = "auto";
      content.current.style.height = "240px";
      inputRow.current.style.height = "80px";
    } else if (event.target.scrollHeight > 24) {
      content.current.style.height = "260px";
      inputRow.current.style.height = "60px";
      event.target.style.overflow = "hidden";
    } else {
      resetInputSize();
    }
  };

  return (
    <Card className={classes.chatWidget}>
      <div className={classes.chatWidgetHeader}>
        <EmailOutlinedIcon className={classes.icon} />
        {/* TODO : add unread messages number in (), then click on input text is going to ack and
        no messages will be unread */}
        <span className={classes.chatWidgetHeaderText}>{t("chat-messages-header")}</span>
      </div>
      <div ref={content} id="chat-widget-messages" className={classes.chatWidgetContent}>
        {messages.map(
          (msg): JSX.Element => (
            <ChatMessage key={msg.id} text={msg.text}
              isMine={msg.authorId === userId || userRole === "hcp" && msg.authorId !== patientId} />
          ))
        }
      </div>
      {showPicker &&
        <div id="chat-widget-emoji-picker">
          <Picker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
        </div>
      }
      <div id="chat-widget-footer" className={classes.chatWidgetFooter}>
        <div className={classes.chatWidgetHCPToggle}>
          { patientId !== userId &&
            <div>
              <Tabs className={classes.chatWidgetTabs} value={inputTab} aria-label="basic tabs example" onChange={handleChange}>
                <Tab className={classes.chatWidgetTab} label={t("chat-footer-reply")} />
                <Tab className={classes.chatWidgetTab}label={t("chat-footer-private")}/>
              </Tabs>
            </div>
          }
        </div>
        <div ref={inputRow} className={classes.chatWidgetInputRow}>
          <Button id="chat-widget-emoji-button" className={classes.iconButton} onClick={() => setShowPicker(true)}>
            <SentimentSatisfiedOutlinedIcon />
          </Button>
          <textarea ref={input} value={inputText} rows={1} id="chatWidgetInput"
            className={classes.chatWidgetInput}
            onInput={inputHandler} placeholder={t("chat-footer-start-writing")} />
          <Button id="chat-widget-send-button" disabled={inputText.length < 1} className={classes.iconButton} onClick={sendMessage}>
            <SendIcon />
          </Button>
        </div>
      </div>
    </Card>
  )
  ;
}

export default ChatWidget;
