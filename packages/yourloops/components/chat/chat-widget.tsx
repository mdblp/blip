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

const chatWidgetStyles = makeStyles((theme: Theme) => {
  return {
    chatWidget: {
      width: "300px",
      height: "500px",
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
      height: "420px",
      overflow: "auto",
    },
    chatWidgetFooter: {
      display: "flex",
      alignItems: "center",
      borderTop: "1px solid #E9E9E9",
      background: "white",
      borderRadius: "0px 0px 12px 12px",
      width: "100%",
      height: "40px",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
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
      "&:focus" : {
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

export interface Message {text: string, isMine: boolean}
export interface ChatWidgetProps {
  patientId: string;
  teamId: string;
  userId: string
  role: string
}

function ChatWidget(props: ChatWidgetProps): JSX.Element {
  const { patientId, teamId, userId, role } = props;
  const authHook = useAuth();
  const [showPicker, setShowPicker] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const content = useRef<HTMLDivElement>(null);
  const footer = useRef<HTMLDivElement>(null);
  const classes = chatWidgetStyles();

  useEffect(() => {
    content.current?.lastElementChild?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    async function fetchMessages() {
      const session = authHook.session();
      if (session !== null) {
        console.log(patientId);
        console.log(teamId);
        console.log(userId);
        const messages = await getChatMessages(session, teamId, patientId);
        setMessages(messages);
      }
    }
    fetchMessages();
  }, [authHook, userId, patientId, teamId]);

  const onEmojiClick = (_event: React.MouseEvent, emojiObject: IEmojiData) => {
    setShowPicker(false);
    setInputText(inputText + emojiObject.emoji);
  };

  const sendMessage = async () => {
    const session = authHook.session();
    if (session !== null) {
      await sendChatMessage(session, teamId, patientId, inputText);
      const messages = await getChatMessages(session, teamId, patientId);
      setMessages(messages);
      setInputText("");
    }
  };


  const inputHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    event.target.style.height = "1px";
    event.target.style.height = (event.target.scrollHeight) + "px";
    if (!content.current || !footer.current) {
      throw new Error("Cannot find elements for resize");
    }
    //values are 24 (lineHeight = 24 + margin 5 top and 5 bottom) - 44 - 64
    //we display the scrollbar only when 3 lines are present
    if (event.target.scrollHeight > 44) {
      event.target.style.overflow = "auto";
      content.current.style.height = "380px";
      footer.current.style.height = "80px";
    } else if (event.target.scrollHeight > 24) {
      content.current.style.height = "400px";
      footer.current.style.height = "60px";
      event.target.style.overflow = "hidden";
    } else {
      content.current.style.height = "420px";
      footer.current.style.height = "40px";
      event.target.style.overflow = "hidden";
    }
  };

  return (
    <Card className={`${classes.chatWidget}`} >
      <div className={`${classes.chatWidgetHeader}`}>
        <EmailOutlinedIcon className={`${classes.icon}`}/>
        <span className={`${classes.chatWidgetHeaderText}`}>Messages (+1)</span>
      </div>
      <div ref={content} id={"chatWidgetContent"} className={`${classes.chatWidgetContent}`}>
        {messages.map(
          (msg): JSX.Element => (
            <ChatMessage key={Math.random()} text={msg.text} isMine={msg.author === userId || role === "hcp" && msg.author !== patientId }/>
          ))
        }
      </div>
      <div>
        { showPicker &&
          <Picker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
        }
      </div>
      <div ref={footer} id={"chatWidgetFooter"} className={`${classes.chatWidgetFooter}`}>
        <button className={`${classes.iconButton}`} onClick={() => setShowPicker(true)}>
          <SentimentSatisfiedOutlinedIcon/>
        </button>
        <textarea value={inputText} rows={1} id={"chatWidgetInput"} className={`${classes.chatWidgetInput}`}
          onInput={inputHandler} placeholder={"Commencer à écrire ..."}/>
        <button disabled={inputText.length < 1} className={`${classes.iconButton}`} onClick={sendMessage}>
          <SendIcon/>
        </button>
      </div>
    </Card>
  );
}

export default ChatWidget;
