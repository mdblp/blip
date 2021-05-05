import colors from '../../src/styles/colors.css';
import _ from 'lodash';

describe('colors', () => {
  it('should export all required colors', () => {
    expect(_.toLower(colors.bolus)).to.equal('var(--bolus)');
    expect(_.toLower(colors.bolusMeal)).to.equal('var(--bolus-meal)');
    expect(_.toLower(colors.bolusMicro)).to.equal('var(--bolus-micro)');
    expect(_.toLower(colors.bolusManual)).to.equal('var(--bolus-manual)');
    expect(_.toLower(colors.basal)).to.equal('#19a0d7');
    expect(_.toLower(colors.basalHeader)).to.equal('#DCF1F9');
    expect(_.toLower(colors.basalAutomated)).to.equal('#00D3E6');
    expect(_.toLower(colors.basalManual)).to.equal('#a8c8d4');
    expect(_.toLower(colors.statDark)).to.equal('#27385b');
    expect(_.toLower(colors.statDefault)).to.equal('#727375');
    expect(_.toLower(colors.statDisabled)).to.equal('#e7e9ee');
    expect(_.toLower(colors.veryLow)).to.equal('#DA3A1B');
    expect(_.toLower(colors.low)).to.equal('#E98D7C');
    expect(_.toLower(colors.target)).to.equal('#9FCC93');
    expect(_.toLower(colors.high)).to.equal('#F9D83E');
    expect(_.toLower(colors.veryHigh)).to.equal('##FFA700');
    expect(_.toLower(colors.insulin)).to.equal('#0096d1');
    expect(_.toLower(colors.white)).to.equal('#ffffff');
    expect(_.toLower(colors.axis)).to.equal('#e7e9ee');
    expect(_.toLower(colors.muted)).to.equal('#c1c9d6');
    expect(_.toLower(colors.rescuecarbs)).to.equal('#fa9494');
    expect(_.toLower(colors.deviceEvent)).to.equal('#727375');
    expect(_.toLower(colors.physicalActivity)).to.equal('#00D3E6');
    expect(_.toLower(colors.confidentialMode)).to.equal('#b4b4b4');
    expect(_.toLower(colors.smbg)).to.equal('#6480FB');
    expect(_.toLower(colors.smbgHeader)).to.equal('#E8ECFE');
    expect(_.toLower(colors.siteChange)).to.equal('#FCD144');
    expect(_.toLower(colors.grey)).to.equal('#6D6D6D');
    expect(_.toLower(colors.lightGrey)).to.equal('#979797');
    expect(_.toLower(colors.darkGrey)).to.equal('#4E4E4F');

  });
});
