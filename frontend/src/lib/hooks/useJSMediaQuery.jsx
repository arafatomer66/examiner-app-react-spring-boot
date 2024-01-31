import { useMediaQuery } from 'react-responsive'

export const useJSMediaQuery = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isSmallMobile = useMediaQuery({ query: '(min-width: 400px)' })
  const isMobile = useMediaQuery({ query: '(min-width: 600px)' })
  const isTablet = useMediaQuery({ query: '(min-width: 900px)' })
//   const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
//   const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

  return {
    isDesktopOrLaptop,
    isBigScreen,
    isTablet,
    // isPortrait,
    // isRetina,
    isSmallMobile,
    isMobile
  }
}