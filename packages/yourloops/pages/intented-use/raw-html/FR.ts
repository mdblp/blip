import yourloopsLabel from '../images/yourloops-label.png'
import diabeloopLogo from '../images/diabeloop-logo.png'
import yourloopsLogo from '../images/yourloops-logo.png'
import factory from '../images/factory.png'
import ceMark from '../images/ce-mark.png'
import appConfig from '../../../lib/config'

const rawHtmlFR = `
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

    ol {
        margin: 0;
        padding: 0
    }

    table td, table th {
        padding: 0
    }

    .c14 {
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
        width: 228pt;
        border-top-color: #3d9183;
        border-bottom-style: solid
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
        width: 224.2pt;
        border-top-color: #3d9183;
        border-bottom-style: solid
    }

    .c20 {
        color: #000000;
        font-weight: 400;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 16pt;
        font-family: "Arial";
        font-style: normal
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

    .c8 {
        color: #039be5;
        font-weight: 700;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 14pt;
        font-family: "Arial";
        font-style: italic
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

    .c16 {
        color: #000000;
        font-weight: 400;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 11pt;
        font-family: "Arial";
        font-style: normal
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

    .c27 {
        color: #000000;
        text-decoration: none;
        vertical-align: baseline;
        font-family: "Arial";
        font-style: normal
    }

    .c38 {
        padding-top: 0pt;
        padding-bottom: 0pt;
        line-height: 1.0;
        text-align: right
    }

    .c24 {
        margin-left: 0.8pt;
        border-spacing: 0;
        border-collapse: collapse;
        margin-right: auto
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

    .c25 {
        margin-left: 3rem;
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

    .c35 {
        height: 91.5pt
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

    .c23 {
        font-size: 12pt
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

    .subtitle {
        padding-top: 0pt;
        color: #666666;
        font-size: 15pt;
        padding-bottom: 16pt;
        font-family: "Arial";
        line-height: 1.15;
        page-break-after: avoid;
        orphans: 2;
        widows: 2;
        text-align: left
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
  </style>
  <div class="c5 doc-content">
    <div>
      <a href="/"><p class="c37"><span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 176.57px; height: 51.50px;"><img alt="" src="${yourloopsLogo}" style="width: 176.57px; height: 51.50px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span></p></a>
    </div>
    <p class="c0"><span class="c21 c29"></span></p>
    <p class="c3"><span class="c30 c31">Usage pr&eacute;vu et informations r&eacute;glementaires</span></p>
    <p class="c0"><span class="c26"></span></p>
    <p class="c3"><span class="c10">&Agrave; propos</span></p>
    <hr>
    <p class="c0"><span class="c2"></span></p>
    <p class="c3">
      <span class="c11">&nbsp; </span>
      <span class="c11">YourLoops, version ${appConfig.VERSION}, lib&eacute;r&eacute;e le ${appConfig.LATEST_RELEASE}</span>
    </p>
    <p class="c0"><span class="c15"></span></p>
    <p class="c0"><span class="c15"></span></p>
    <p class="c3"><span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 494.00px; height: 99.00px;"><img alt="" src="${yourloopsLabel}" style="width: 494.00px; height: 99.00px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span></p>
    <p class="c18"><span class="c10 c30">Usage pr&eacute;vu</span></p>
    <hr>
    <p class="c18"><span class="c1">&nbsp;</span></p>
    <p class="c7"><span class="c4">YourLoops est con&ccedil;u pour &ecirc;tre utilis&eacute; par des personnes vivant avec un diab&egrave;te mellitus dans le but de les aider &agrave; acc&eacute;der et &agrave; visualiser leurs donn&eacute;es de sant&eacute;.</span></p>
    <p class="c7"><span class="c4">YourLoops est &eacute;galement destin&eacute; &agrave; &nbsp;&ecirc;tre utilis&eacute; par des professionnels de sant&eacute; (m&eacute;decins, infirmier&middot;e&middot;s, formateurs&middot;rices) ainsi que par les personnes avec lesquelles le&middot;la patient&middot;e souhaite&nbsp;partager ses donn&eacute;es (proche, parent, infirmier&middot;e scolaire, enseignant&middot;e).</span></p>
    <p class="c7"><span class="c4">YourLoops collecte et affiche les donn&eacute;es recueillies par un syst&egrave;me d&rsquo;automatisation de la d&eacute;livrance d&#39;insuline d&eacute;velopp&eacute;&nbsp;par Diabeloop.</span></p>
    <p class="c7"><span class="c21">YourLoops n&rsquo;est pas destin&eacute; &agrave; &ecirc;tre utilis&eacute; pour prendre des d&eacute;cisions imm&eacute;diates mais il permet de visualiser les donn&eacute;es et les tendances sur le long terme.</span></p>
    <p class="c7"><span class="c4">Yourloops est utilis&eacute; des deux mani&egrave;res suivantes:</span></p>
    <ul class="c12 lst-kix_y7fyeal6lle0-0 start">
        <li class="c7 c32 li-bullet-0"><span class="c4">Yourloops est utilis&eacute; comme visualiseur secondaire.</span></li>
        <li class="c7 c32 li-bullet-0"><span class="c4">Yourloops est utilis&eacute; pour surveiller &agrave; distance les patients et faciliter les recommandations des professionnels de sant&eacute; pour le traitement des patients.</span></li>
    </ul>
    <p class="c7"><span class="c21">YourLoops n&rsquo;est pas destin&eacute; &agrave; remplacer les pratiques d&#39;autosurveillance recommand&eacute;es par un m&eacute;decin.</span></p>
    <p class="c18 c28"><span class="c4"></span></p>
    <p class="c18"><span class="c10 c30">Mises en garde et pr&eacute;cautions requises devant &ecirc;tre imm&eacute;diatement port&eacute;es &nbsp;&agrave; l&#39;attention de l&#39;utilisateur du dispositif ou de toute autre personne</span></p>
    <hr>
    <p class="c18 c28"><span class="c1"></span></p>
    <p class="c22"><span class="c17 c33">AVERTISSEMENT</span><span class="c17">&nbsp;: Ce logiciel ne fournit pas d&rsquo;avis m&eacute;dical et ne doit pas &ecirc;tre utilis&eacute; &agrave;cet effet. Les utilisateurs &agrave; domicile doivent consulter un professionnel de sant&eacute; avant de faire des ajustements th&eacute;rapeutiques dans leur traitement &agrave; partir des informations de ce logiciel.</span></p>
    <p class="c19"><span class="c1"></span></p>
    <p class="c22"><span class="c33 c17">AVERTISSEMENT</span><span class="c17">&nbsp;: Les professionnels de sant&eacute; doivent utiliser les informations de ce logiciel conjointement aux autres informations cliniques qui sont &agrave; leur disposition.</span></p>
    <p class="c19"><span class="c4"></span></p>
    <p class="c18"><span class="c10">Fabricant</span></p>
    <hr>
    <p class="c0"><span class="c2"></span></p>
    <p class="c0"><span class="c2"></span></p><a id="t.01dd871b06081fb0ac6b9fb856ac0aca41b364bf"></a><a id="t.0"></a>
    <table class="c24">
    <tbody>
      <tr class="c35">
        <td class="c36" colspan="1" rowspan="1">
          <p class="c3"><span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 79.54px; height: 82.00px;"><img alt="" src="${factory}" style="width: 79.54px; height: 82.00px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span></p>
          <p class="c3"><span class="c1">Diabeloop SA</span></p>
          <p class="c3"><span class="c17">1</span><span class="c17">55-15</span><span class="c17">7 </span><span class="c17">Cours Berriat</span></p>
          <p class="c3"><span class="c17">380</span><span class="c17">28</span><span class="c17">&nbsp;Grenoble</span><span class="c17">&nbsp;Cedex 1</span><span class="c1">&nbsp;France</span></p>
          <p class="c3"><span class="c17 c34"><a class="c13" href="mailto:contact@diabeloop.fr">contact@diabeloop.fr</a></span></p>
        </td>
        <td class="c14" colspan="1" rowspan="1">
          <p class="c3 c25"><span class="c23">&nbsp; &nbsp; &nbsp; &nbsp;</span><span class="c17">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 180.50px; height: 95.34px;"><img alt="" src="${ceMark}" style="width: 180.50px; height: 95.34px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span></p>
        </td>
      </tr>
    </tbody>
    </table>
    <p class="c0"><span class="c9"></span></p>
    <div>
      <p class="c3"><span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 160.98px; height: 38.00px;"><img alt="" src="${diabeloopLogo}" style="width: 160.98px; height: 38.00px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title=""></span></p>
      <p class="c38"><span class="c21">YLPZ-RA-LAD-001-en-Rev</span><span class="c21">0</span><span class="c21">&nbsp;</span></p>
    </div>
  </div>
`

export default rawHtmlFR
