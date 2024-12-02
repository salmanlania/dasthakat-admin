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
  },
};

const Theme = ({ children }) => {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
export default Theme;
