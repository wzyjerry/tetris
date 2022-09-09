import Tetris from '@/components/tetris';
import { useSearchParams } from 'umi';
import style from './index.less';

const Index: React.FC = () => {
  const [params] = useSearchParams();
  const startLv = params.get('startLv');
  const lv = parseInt(startLv ? startLv : '0');
  return (
    <div className={style.content}>
      <Tetris className={style.tetris} startLv={lv} />
    </div>
  );
};
export default Index;
