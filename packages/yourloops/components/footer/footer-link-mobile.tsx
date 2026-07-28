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


import Link from '@mui/material/Link'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

const styles = makeStyles()((theme) => {
  return {
    link: {
      color: theme.palette.grey[700],
      fontWeight: 400,
      textAlign: 'center',
      display: 'inline-block',
      lineHeight: 1.2
    }
  }
})

interface FooterLinkProps {
  id: string
  href?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  isExternal?: boolean
  className?: string
  children: React.ReactNode
}

export const FooterLink : React.FC<FooterLinkProps> = (props) => {
  const {
    id,
    href,
    onClick,
    isExternal,
    children
  } = props
  const { classes } = styles()
  return (
    <Link
      id={id}
      href={href}
      onClick={onClick}
      className={classes.link}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'nofollow' : undefined}
    >
      {children}
    </Link>
  )
}

