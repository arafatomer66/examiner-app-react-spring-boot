import { purple, blue, cyan, gray } from '@ant-design/colors';

const textColor = '#301901';
const borderColor = '#8c8f91';
const blueColor = '#1677FF';
const theme = {
  token: {
    colorBgContainer: '#FBF2FA',
    // colorBgContainer: '#f9e8f7',
    fontSize: 16,
    colorPrimary: purple[6],
    colorSecondary: blueColor,
    colorTextBase: textColor,
    colorBgBase: '#ffffff',
    borderRadius: 4,
    Input: {
      colorBorder: borderColor,
    },
    Select: {
      colorBorder: borderColor,
    },
    Radio: {
      colorBorder: purple[6],
    },
    Button: {
      colorBorder: borderColor,
    },
    Tabs: {
      colorBorderSecondary: '#abaab0',
    },
    Form: {
      colorText: '5e5d5d'
    },
    Card : {
      colorBorderSecondary: '#4B04A0'
    },
    Divider: {
        "colorSplit": purple[2],
        "lineWidth": 0.8 ,
        orientationMargin: .15,
      }
    }
};

export default theme;