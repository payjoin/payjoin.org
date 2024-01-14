// The ?raw is needed to get the raw svg string, otherwise it will be the file path
import moon from './svg/moon.svg?raw';
import arrowJoin from './svg/arrowJoin.svg?raw';
import close from './svg/close.svg?raw';
import hamburger from './svg/hamburger.svg?raw';
import externalLink from './svg/externalLink.svg?raw';
import lightning from './svg/lightning.svg?raw';
import monad from './svg/monad.svg?raw';
import spiral from './svg/spiral.svg?raw';
import arrow from './svg/arrow.svg?raw';
import check from './svg/check.svg?raw';
import plus from './svg/plus.svg?raw';
import minus from './svg/minus.svg?raw';
import megaphone from './svg/megaphone.svg?raw';

const icons = {
	moon,
	arrowJoin,
	close,
	hamburger,
	externalLink,
	lightning,
	monad,
	spiral,
	arrow,
	check,
	plus,
	minus,
	megaphone
};

export type IconName = keyof typeof icons;
export default icons;
