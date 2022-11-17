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

/**
 * Copied from https://github.com/esayemm/connect-with-transition-group (ISC license)
 * Cannot use dist from npm because `const` is not available yet under node v0.12.x
 * updated according to https://github.com/esayemm/connect-with-transition-group/pull/2
 */

/**
 * Must have called react-redux/connect with the 'withRef' flag
 * ex:
 * connectWithTransitionGroup(connect(mapStateToProps, null, null, {
 *   withRef: true,
 * }));
 *
 * @param {*} connect - return from react-redux/connect
 * @returns {*} component monkey patched with special lifecycle functions
 */
export default function connectWithTransitionGroup(connect) {
  const willFunctions = [
    'componentWillAppear',
    'componentWillEnter',
    'componentWillLeave'
  ]

  const didFunctions = [
    'componentDidAppear',
    'componentDidEnter',
    'componentDidLeave'
  ]

  willFunctions.forEach((key) => {
    if(!connect || !connect.prototype){
      return
    }
    connect.prototype[key] = function (cb) {
      if (this.wrappedInstance[key]) {
        this.wrappedInstance[key](cb)
      } else {
        cb()
      }
    }
  })

  didFunctions.forEach((key) => {
    if(!connect || !connect.prototype){
      return
    }
    connect.prototype[key] = function () {
      if (this.wrappedInstance[key]) {
        this.wrappedInstance[key]()
      }
    }
  })

  return connect
}
