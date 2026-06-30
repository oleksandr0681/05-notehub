import { BarLoader } from 'react-spinners';
import style from './Loader.module.css';

export default function Loader() {
  return (
    <div className={style.backdrop}>
      <BarLoader color="#e22df3" />
    </div>
  );
}
