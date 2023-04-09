import { useTheme } from 'next-themes'
import { useCallback } from 'react'

export enum THEME {
  DARK = 'halloween',
  LIGHT = 'fantasy',
}

const useToggleTheme = () => {
  const { theme, setTheme } = useTheme()
  const isDarkTheme = theme === THEME.DARK
  const toggleTheme = useCallback(
    () => (theme === THEME.DARK ? setTheme(THEME.LIGHT) : setTheme(THEME.DARK)),
    [setTheme, theme]
  )
  return {
    toggleTheme,
    isDarkTheme,
  }
}

export default useToggleTheme
