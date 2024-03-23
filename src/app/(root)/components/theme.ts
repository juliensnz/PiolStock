import {pimTheme} from 'akeneo-design-system';

const IS_MOBILE = '@media only screen and (max-width: 768px)';

const theme = {
  ...pimTheme,
  color: {
    ...pimTheme.color,
    brand20: '#c2e1c7',
    brand40: '#a3d1ab',
    brand60: '#85c28f',
    brand80: '#67b373',
    brand100: '#528f5c',
    brand120: '#3d6b45',
    brand140: '#2d4e32',
  },
  layout: {
    margin: '40px',
    mobile: {
      margin: '20px',
      menu: {
        height: '70px',
      },
    },
  },
};

export {IS_MOBILE, theme};
