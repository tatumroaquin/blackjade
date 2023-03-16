import { Login } from './pages/Login';
import { Block } from './components/Block';
import { DUMMY_BLOCKCHAIN } from './dummy/BLOCKCHAIN';
import './App.scss';

export default function App() {
  const {chain} = DUMMY_BLOCKCHAIN;
  const block = chain[2];
  return (
    <>
      <Block block={block} />
    </>
  );
}
