/**
 * Copyright (c) 2022, Diabeloop
 * Chat message
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

import React from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Face from "@material-ui/icons/Face";

export interface ChatMessageProps {
  text: string;
  author: string;
  privateMsg: boolean;
  isMine: boolean;
}

const chatMessageStyles = makeStyles((theme: Theme) => {
  return {
    chatMessageContainer: {
      fontFamily: "Roboto",
      color: "white",
      width: "90%",
      display: "flex",
      position: "relative",
      padding: theme.spacing(1),
      marginTop: theme.spacing(1),
      whiteSpace: "pre-line",
      flexDirection: "column",
    },
    left: {
      "borderRadius": "0px 12px 12px 12px",
      "backgroundColor": theme.palette.primary.main,
      "&::before": {
        content: "''",
        width: 0,
        height: 0,
        borderTop: `20px solid ${theme.palette.primary.main}`,
        borderLeft: "20px solid transparent",
        position: "absolute",
        top: 0,
        left: -8,
      },
      "&.private": {
        "backgroundColor": "var(--chat-widget-private-msg-not-mine)",
        "&::before": {
          borderTop:"20px solid var(--chat-widget-private-msg-not-mine)",
        },
      },
    },
    right: {
      "marginLeft": "auto",
      "borderRadius": "12px 0px 12px 12px",
      "backgroundColor": theme.palette.primary.dark,
      "&::after": {
        content: "''",
        width: 0,
        height: 0,
        borderTop:`20px solid ${theme.palette.primary.dark}`,
        borderRight: "20px solid transparent",
        position: "absolute",
        top: 0,
        right: -8,
      },
      "&.private": {
        "backgroundColor": "var(--chat-widget-private-msg-mine)",
        "&::after": {
          borderTop:"20px solid var(--chat-widget-private-msg-mine)",
        },
      },
    },
    chatMessageHeader: {
      zIndex: 2,
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(1),
    },
    chatMessageText: {
    },
  };
}, { name: "ylp-chat-message" });


function ChatMessage(props: ChatMessageProps): JSX.Element {
  const { text, author, privateMsg, isMine } = props;
  const classes = chatMessageStyles();
  const messageContainerType = isMine ? classes.right : classes.left;
  const privateMessage = privateMsg ? "private" : "";

  return (
    <div className={`message ${classes.chatMessageContainer} ${messageContainerType} ${privateMessage}`}>
      {!isMine &&
        <div className={classes.chatMessageHeader}>
          <Face/>
          <b>{ author }</b>
        </div>
      }

      <span className={classes.chatMessageText}>
        { text }</span>
    </div>
  );
}

export default ChatMessage;
