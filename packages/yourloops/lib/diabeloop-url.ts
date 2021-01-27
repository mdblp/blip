/**
 * Copyright (c) 2021, Diabeloop
 *  Diabeloop Url
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
import config from "./config";

/**
 * Class containing all URLs related to Diableloop
 */
class DiabeloopUrl {
  private termsUrl: string;
  private privacyPolicyUrl: string;
  private intendedUseUrL: string;
  private supportUrL: string;

  constructor() {
    this.termsUrl = `${config.ASSETS_URL}terms.pdf`;
    this.privacyPolicyUrl = `${config.ASSETS_URL}data-privacy.pdf`;
    this.intendedUseUrL = `${config.ASSETS_URL}intendedUse.pdf`;
    this.supportUrL = "https://www.diabeloop.com";
  }

  get Support(): string { return 'Diabeloop'; }
  get SupportUrl(): string { return this.supportUrL; }

  get Terms(): string { return 'Diabeloop Applications Terms of Use'; }
  get TermsUrL(): string { return this.termsUrl; }
  set TermsUrL(value: string) { this.termsUrl = value; }

  get PrivacyPolicy(): string { return 'Privacy Policy'; }
  get PrivacyPolicyUrL(): string { return this.privacyPolicyUrl; }
  set PrivacyPolicyUrL(value: string) { this.privacyPolicyUrl = value; }

  get IntendedUse(): string { return 'Regulatory Information'; }
  get IntendedUseUrL(): string { return this.intendedUseUrL; }
  set IntendedUseUrL(value: string) { this.intendedUseUrL = value; }
}

const diabeloopUrl = new DiabeloopUrl();
export default diabeloopUrl;
