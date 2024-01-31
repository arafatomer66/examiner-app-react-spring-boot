let bgColor = "#000000";

const videoModalThemeConfig = {
  token: {
    padding: 0,
    colorIcon: "white",
    colorIconHover: "white",
    colorBgMask: 'rgba(0, 0, 0, 0.85)'
  },
  components: {
    Modal: {
      contentBg: bgColor,
      footerBg: bgColor,
      headerBg: bgColor,
      // titleColor: "black",
    }
  }
};

export default videoModalThemeConfig;