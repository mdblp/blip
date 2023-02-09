/*
 * Copyright (c) 2022-2023, Diabeloop
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

import yourloopsLabel from '../images/yourloops-label.png'
import diabeloopLogo from '../images/diabeloop-logo.png'
import yourloopsLogo from '../images/yourloops-logo.png'
import factory from '../images/factory.png'
import ceMark from '../images/ce-mark.png'
import appConfig from '../../../lib/config/config'

const rawHtmlDE = `
  <style type="text/css">@import url('https://themes.googleusercontent.com/fonts/css?kit=dpiI8CyVsrzWsJLBFKehGpLhv3qFjX7dUn1mYxfCXhI');
    .lst-kix_y7fyeal6lle0-0 > li:before {
        content: "-  "
    }

    .lst-kix_y7fyeal6lle0-7 > li:before {
        content: "-  "
    }

    .lst-kix_y7fyeal6lle0-8 > li:before {
        content: "-  "
    }

    .lst-kix_y7fyeal6lle0-1 > li:before {
        content: "-  "
    }

    li.li-bullet-0:before {
        margin-left: -18pt;
        white-space: nowrap;
        display: inline-block;
        min-width: 18pt
    }

    .lst-kix_y7fyeal6lle0-3 > li:before {
        content: "-  "
    }

    .lst-kix_y7fyeal6lle0-4 > li:before {
        content: "-  "
    }

    .lst-kix_y7fyeal6lle0-2 > li:before {
        content: "-  "
    }

    .lst-kix_y7fyeal6lle0-6 > li:before {
        content: "-  "
    }

    ul.lst-kix_y7fyeal6lle0-7 {
        list-style-type: none
    }

    ul.lst-kix_y7fyeal6lle0-8 {
        list-style-type: none
    }

    ul.lst-kix_y7fyeal6lle0-5 {
        list-style-type: none
    }

    ul.lst-kix_y7fyeal6lle0-6 {
        list-style-type: none
    }

    ul.lst-kix_y7fyeal6lle0-3 {
        list-style-type: none
    }

    ul.lst-kix_y7fyeal6lle0-4 {
        list-style-type: none
    }

    ul.lst-kix_y7fyeal6lle0-1 {
        list-style-type: none
    }

    ul.lst-kix_y7fyeal6lle0-2 {
        list-style-type: none
    }

    .lst-kix_y7fyeal6lle0-5 > li:before {
        content: "-  "
    }

    ul.lst-kix_y7fyeal6lle0-0 {
        list-style-type: none
    }

    .c36 {
        border-right-style: solid;
        padding: 5pt 5pt 5pt 5pt;
        border-bottom-color: #3d9183;
        border-top-width: 1pt;
        border-right-width: 1pt;
        border-left-color: #3d9183;
        vertical-align: top;
        border-right-color: #3d9183;
        border-left-width: 1pt;
        border-top-style: solid;
        border-left-style: solid;
        border-bottom-width: 1pt;
        border-top-color: #3d9183;
        border-bottom-style: solid
    }

    .c4 {
        color: #000000;
        font-weight: 400;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 9pt;
        font-family: "Arial";
        font-style: normal
    }

    .c1 {
        color: #000000;
        font-weight: 400;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 10pt;
        font-family: "Arial";
        font-style: normal
    }

    .c2 {
        color: #0000ff;
        font-weight: 400;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 10pt;
        font-family: "Arial";
        font-style: normal
    }

    .c0 {
        padding-top: 0pt;
        padding-bottom: 0pt;
        line-height: 1.15;
        orphans: 2;
        widows: 2;
        text-align: left;
        height: 11pt
    }

    .c15 {
        color: #000000;
        font-weight: 400;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 6pt;
        font-family: "Arial";
        font-style: normal
    }

    .c9 {
        color: #0096d7;
        font-weight: 400;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 16.5pt;
        font-family: "Arial";
        font-style: normal
    }

    .c26 {
        color: #039be5;
        font-weight: 400;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 5pt;
        font-family: "Roboto";
        font-style: normal
    }

    .c29 {
        color: #0096d7;
        font-weight: 400;
        text-decoration: none;
        vertical-align: baseline;
        font-family: "Arial";
        font-style: normal
    }

    .c37 {
        padding-top: 0pt;
        padding-bottom: 0pt;
        line-height: 1.0;
        orphans: 2;
        widows: 2;
        text-align: left
    }

    .c18 {
        padding-top: 0pt;
        padding-bottom: 0pt;
        line-height: 1.15;
        orphans: 2;
        widows: 2;
        text-align: justify
    }

    .c3 {
        padding-top: 0pt;
        padding-bottom: 0pt;
        line-height: 1.15;
        orphans: 2;
        widows: 2;
        text-align: left
    }

    .c7 {
        padding-top: 0pt;
        padding-bottom: 0pt;
        line-height: 1.1500000000000001;
        orphans: 2;
        widows: 2;
        text-align: justify
    }

    .c19 {
        padding-top: 0pt;
        padding-bottom: 0pt;
        line-height: 1.0;
        text-align: justify;
        height: 11pt
    }

    .c38 {
        padding-top: 0pt;
        padding-bottom: 0pt;
        line-height: 1.0;
        text-align: right
    }

    .c31 {
        color: #039be5;
        font-weight: 700;
        font-size: 18pt;
        font-family: "Roboto"
    }

    .c10 {
        font-size: 14pt;
        font-family: "Roboto";
        color: #039be5;
        font-weight: 700
    }

    .c22 {
        padding-top: 0pt;
        padding-bottom: 0pt;
        line-height: 1.0;
        text-align: justify
    }

    .c5 {
        background-color: #ffffff;
        max-width: 750px;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        margin: 1rem auto 0 auto;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 12px;
    }

    .c30 {
        text-decoration: none;
        vertical-align: baseline;
        font-style: normal
    }

    .c34 {
        text-decoration-skip-ink: none;
        -webkit-text-decoration-skip: none;
        text-decoration: underline
    }

    .c13 {
        color: inherit;
        text-decoration: inherit
    }

    .c12 {
        padding: 0;
        margin: 0
    }

    .c11 {
        font-size: 12pt;
        font-weight: 700
    }

    .c32 {
        margin-left: 36pt;
        padding-left: 0pt
    }

    .c33 {
        font-weight: 700
    }

    .c28 {
        height: 11pt
    }

    .c17 {
        font-size: 10pt
    }

    .c21 {
        font-size: 9pt
    }

    .title {
        padding-top: 0pt;
        color: #000000;
        font-size: 26pt;
        padding-bottom: 3pt;
        font-family: "Arial";
        line-height: 1.15;
        page-break-after: avoid;
        orphans: 2;
        widows: 2;
        text-align: left
    }

    .flex-container {
        display: flex;
    }

    .address-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 125px;
        width: 50%;
    }

    li {
        color: #000000;
        font-size: 11pt;
        font-family: "Arial"
    }

    p {
        margin: 0;
        color: #000000;
        font-size: 11pt;
        font-family: "Arial"
    }

    hr {
      width: 100%;
    }

    #udi-version {
        position: relative;
        top: 70px;
        left: 377px;
        z-index: 100;
    }
  </style>
  <div class="c5 doc-content">
    <div>
      <a href="/"><p class="c37"><span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 176.57px; height: 51.50px;"><img alt="" src="${yourloopsLogo}" style="width: 176.57px; height: 51.50px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span></p></a>
    </div>
    <p class="c0"><span class="c21 c29"></span></p>
    <p class="c3"><span class="c30 c31">Verwendungszweck und gesetzliche Informationen</span></p>
    <p class="c0"><span class="c26"></span></p>
    <p class="c3"><span class="c10">Über</span></p>
    <hr>
    <p class="c0"><span class="c2"></span></p>
    <p class="c3">
      <span class="c11">&nbsp; </span>
      <span class="c11">YourLoops, version ${appConfig.VERSION}, veröffentlicht am ${appConfig.LATEST_RELEASE}</span>
    </p>
    <p id="udi-version">${appConfig.VERSION}</p><img alt="" src="${yourloopsLabel}" style="width: 494.00px; height: 99.00px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span></p>
    <p class="c18"><span class="c10 c30">Verwendungszweck</span></p>
    <hr>
    <p class="c18"><span class="c1">&nbsp;</span></p>
    <p class="c7"><span class="c4">YourLoops ist zur Verwendung durch Menschen mit Diabetes mellitus vorgesehen, um ihnen den Zugriff auf ihre bzw. die Überprüfung ihrer Diabetesdaten zu erleichtern.</span></p>
    <p class="c7"><span class="c4">YourLoops ist zur Verwendung durch andere Personen vorgesehen, mit denen die Person mit Diabetes ihre Daten und kontextbezogenen Daten teilen möchte (z. B. Eltern, Freunde, Lehrer oder Schulkrankenschwestern).</span></p>
    <p class="c7"><span class="c4">YourLoops ist auch für die Nutzung durch medizinisches Fachpersonal (z. B. Ärzte, Krankenschwestern, zertifizierte Diabetesberater, Klinikpersonal) vorgesehen.</span></p>
    <p class="c7"><span class="c21">YourLoops zeigt Informationen an, die von einem von Diabeloop entwickelten automatischen Insulinabgabesystem erfasst wurden.</span></p>
    <p class="c7"><span class="c4">YourLoops ist nicht dafür vorgesehen, sofortige Maßnahmen zu ergreifen, sondern ermöglicht die Visualisierung von Daten und Trends auf lange Sicht.</span></p>
    <p class="c7"><span class="c4">YourLoops wird auf die beiden folgenden Arten verwendet: </span></p>
    <ul class="c12 lst-kix_y7fyeal6lle0-0 start">
        <li class="c7 c32 li-bullet-0"><span class="c4">YourLoops wird als zusätzliche Anzeige verwendet.</span></li>
        <li class="c7 c32 li-bullet-0"><span class="c4">YourLoops wird für die telemedizinische Betreuung von Patienten verwendet und soll das medizinische Fachpersonal dabei unterstützen, Empfehlungen für die Behandlung des Patienten zu geben.</span></li>
    </ul>
    <p class="c7"><span class="c21">Dieses Gerät ist nicht dazu gedacht, die vom Arzt empfohlene Selbstkontrolle zu ersetzen.</span></p>
    <p class="c18 c28"><span class="c4"></span></p>
    <p class="c18"><span class="c10 c30">Warnungen oder zu ergreifende Vorsichtsmaßnahmen, die dem Benutzer des Geräts oder einer anderen Person unverzüglich zur Kenntnis gebracht werden müssen.</span></p>
    <hr>
    <p class="c18 c28"><span class="c1"></span></p>
    <p class="c22"><span class="c17 c33">WARNUNG</span><span class="c17">: </span><span class="c21">Diese Software stellt keinen medizinischen Ratschlag jeglicher Art dar und darf auch nicht diesem Zweck dienen. Heimanwender müssen eine medizinische Fachkraft zu Rate ziehen, bevor medizinische Befunde interpretiert und Therapieanpassungen anhand der Softwaredaten vorgenommen werden.</span></p>
    <p class="c19"><span class="c1"></span></p>
    <p class="c22"><span class="c33 c17">WARNUNG</span><span class="c17">: </span><span class="c21">Medizinische Fachkräfte müssen die Informationen der Software im Zusammenhang mit anderen, für sie verfügbaren klinischen Informationen verwenden.</span></p>
    <p class="c19"><span class="c4"></span></p>
    <p class="c18"><span class="c10">Rechtmäßiger Hersteller </span></p>
    <hr>
    <p class="c0"><span class="c2"></span></p>
    <p class="c0"><span class="c2"></span></p><a id="t.01dd871b06081fb0ac6b9fb856ac0aca41b364bf"></a><a id="t.0"></a>
    <div class="flex-container">
        <div class="c36 address-container" colspan="1" rowspan="1">
          <div>
            <p class="c3"><span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 79.54px; height: 82.00px;"><img alt="" src="${factory}" style="width: 79.54px; height: 82.00px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span></p>
          </div>
          <div>
            <p class="c3"><span class="c1">Diabeloop SA</span></p>
            <p class="c3"><span class="c17">17 Rue Félix Esclangon</span></p>
            <p class="c3"><span class="c17">38000 Grenoble&nbsp;France</span></p>
            <p class="c3"><span class="c17 c34"><a class="c13" href="mailto:contact@diabeloop.fr">contact@diabeloop.fr</a></span></p>
          </div>
        </div>
        <div class="c36 address-container" colspan="1" rowspan="1">
          <span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 180.50px; height: 95.34px;"><img alt="" src="${ceMark}" style="width: 180.50px; height: 95.34px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span>
        </div>
    </div>
    <p class="c0"><span class="c9"></span></p>
    <div>
      <p class="c3"><span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 160.98px; height: 38.00px;"><img alt="" src="${diabeloopLogo}" style="width: 160.98px; height: 38.00px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span></p>
      <p class="c38"><span class="c21">YLPZ-RA-LAD-001-de-Rev${appConfig.YLPZ_RA_LAD_001_DE_REV}</span></p>
    </div>
  </div>
`

export default rawHtmlDE
