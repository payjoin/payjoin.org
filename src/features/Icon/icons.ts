// The ?raw is needed to get the raw svg string, otherwise it will be the file path
import moon from './svg/moon.svg?raw';

const icons = {
	moon
};

export type IconName = keyof typeof icons;
export default icons;
