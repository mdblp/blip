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

import React from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";

export interface ChatMessageProps {
  text: string;
  isMine: boolean;
}

const chatMessageStyles = makeStyles((theme: Theme) => {
  return {
    chatMessage: {
      fontFamily: "Roboto",
      fontStyle: "normal",
      color: "white",
      width: "80%",
      padding: theme.spacing(1),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    chatMessageLeftContainer: {
      "display": "flex",
      "& span": {
        borderRadius: "0px 12px 12px 12px",
        backgroundColor: "#00A3E2",
        position: "relative",
        left: "-15%",
      },
      "& svg" : {
        fill: "#00A3E2",
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
      },
    },
    chatMessageRightContainer: {
      "display": "flex",
      "& span": {
        borderRadius: "12px 0px 12px 12px",
        backgroundColor: "#035271",
        position: "relative",
        right: "-15%",
      },
      "& svg" : {
        fill: "#035271",
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
  };
}, { name: "ylp-chat-message" });


function ChatMessage(props: ChatMessageProps): JSX.Element {
  const { text, isMine } = props;
  const classes = chatMessageStyles();
  const messageContainerType = isMine ? `${classes.chatMessageRightContainer}` : `${classes.chatMessageLeftContainer}`;

  return (
    <div className={`${messageContainerType}`}>
      {
        !isMine &&
        <svg height="10" width="10" transform="scale(-1,1)">
          <polygon points="0,0 10,0 0,10"/>
        </svg>
      }
      <span className={`${classes.chatMessage}`}>{ text }</span>
      {
        isMine &&
        <svg height="10" width="10">
          <polygon points="0,0 10,0 0,10"/>
        </svg>
      }
    </div>
  );
}

export default ChatMessage;
