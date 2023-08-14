// The ?raw is needed to get the raw svg string, otherwise it will be the file path
import moon from './svg/moon.svg?raw';
import arrowJoin from './svg/arrowJoin.svg?raw';
import close from './svg/close.svg?raw';
import hamburger from './svg/hamburger.svg?raw';

const icons = {
	moon,
	arrowJoin,
	close,
	hamburger
};

export type IconName = keyof typeof icons;
export default icons;
