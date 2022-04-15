/**
 * Copyright (c) 2022, Diabeloop
 * Rounded Hospital Icon
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

import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

const RoundedHospitalIcon = (props: SvgIconProps): JSX.Element => {
  return (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" {...props}>
      <path d="M10.5 0C16.294 0 21 4.70602 21 10.5C21 16.294 16.294 21 10.5 21C4.70602 21 -1.90735e-06 16.294 -1.90735e-06 10.5C-1.90735e-06 4.70602 4.70602 0 10.5 0ZM10.5 19.5C15.5 19.5 19.5 15.5 19.5 10.5C19.5 5.5 15.5 1.5 10.5 1.5C5.5 1.5 1.5 5.5 1.5 10.5C1.5 15.5 5.5 19.5 10.5 19.5Z" />
      <path d="M5.03485 8.2229H8.2228V5.03494C8.2228 4.78193 8.42521 4.57952 8.67823 4.57952H12.3216C12.5746 4.57952 12.777 4.78193 12.777 5.03494V8.2229H15.965C16.218 8.2229 16.4204 8.4253 16.4204 8.67832V12.3217C16.4204 12.5747 16.218 12.7771 15.965 12.7771H12.777V15.9651C12.777 16.2181 12.5746 16.4205 12.3216 16.4205H8.67823C8.42521 16.4205 8.2228 16.2181 8.2228 15.9651V12.7771H5.03485C4.78184 12.7771 4.57943 12.5747 4.57943 12.3217V8.67832C4.60473 8.4253 4.80714 8.2229 5.03485 8.2229Z" />
    </SvgIcon>
  );
};

export default RoundedHospitalIcon;
