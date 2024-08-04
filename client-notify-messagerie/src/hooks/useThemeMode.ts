// Filename - hooks/useThemeMode.ts

import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark';

const useThemeMode = (): [ThemeMode, (theme: ThemeMode) => void] => {
    const [theme, setTheme] = useState<ThemeMode>(localStorage.theme || 'light')

    const colorTheme = theme === 'dark' ? 'light' : 'dark'

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove(colorTheme)
        root.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme, colorTheme])

    return [theme, setTheme]
}

export default useThemeMode
