import { ConfigProvider } from "antd";

const theme = {
  token: {
    colorPrimary: "#065098",
    fontFamily: "Poppins, sans-serif",
  },
  components: {
    Breadcrumb: {
      itemColor: "#065098",
      colorBgTextHover: "rgba(255, 255, 255, 0)",
      lastItemColor: "#000",
      separatorColor: "rgb(0, 0, 0)",
      fontSize: 16,
    },
    Table: {
      headerBorderRadius: 0,
    },
    Menu: {
      itemSelectedBg: "#ecede8",
      fontSize: 13,
      itemHeight: 32,
    },
    Select: {
      optionSelectedBg: "rgb(237,245,250)",
    },
  },
};

// eslint-disable-next-line react/prop-types
const Theme = ({ children }) => {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
export default Theme;
