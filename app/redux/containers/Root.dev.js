import { hot, setConfig } from 'react-hot-loader';
import Perf from 'react-addons-perf';
import Root from '../containers/Root.prod';
window.Perf = Perf;

setConfig({ logLevel: 'warning' })

export default hot(module)(Root);
