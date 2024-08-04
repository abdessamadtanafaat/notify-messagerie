
import { useThemeContext } from '../../contexte/ThemeContext'
import { Moon, Sun } from 'lucide-react'

const SwitcherTheme: React.FC = () => {
    const { theme, setTheme } = useThemeContext()

    const toggleDarkMode = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        
    }

    return (
        <>
        <button
                onClick={toggleDarkMode}
        >
             {theme === 'light' ?  <Moon/> : <Sun/>} 
        </button>
        </>
    )
}

export default SwitcherTheme
