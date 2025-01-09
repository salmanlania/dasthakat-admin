import { ConfigProvider } from 'antd';

const theme = {
  token: {
    colorPrimary: '#065098',
    fontFamily: 'Poppins, sans-serif'
  },
  components: {
    Breadcrumb: {
      itemColor: '#065098',
      colorBgTextHover: 'rgba(255, 255, 255, 0)',
      lastItemColor: '#000',
      separatorColor: '#000',
      fontSize: 16
    },
    Table: {
      headerBorderRadius: 0
    },
    Menu: {
      fontSize: 13,
      itemHeight: 32,
      itemSelectedBg: '#065098',
      itemSelectedColor: '#fff',
      motionDurationMid: '0',
      motionDurationFast: '0',
      motionDurationSlow: '0',
      itemBorderRadius: 3
    },
    Select: {
      optionSelectedBg: 'rgb(237,245,250)'
    }
  }
};

// eslint-disable-next-line react/prop-types
const Theme = ({ children }) => {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
export default Theme;
