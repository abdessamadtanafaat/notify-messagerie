// Filename - components/SwitcherTheme.tsx

import { useEffect, useState } from 'react'
import useThemeMode from '../../hooks/useThemeMode'
import { Moon, Sun } from 'lucide-react'

const SwitcherTheme: React.FC = () => {
    const [colorTheme, setTheme] = useThemeMode()
    const [label, setLabel] = useState<string>('Dark Mode')

    useEffect(()=> {
        setLabel(colorTheme === 'light' ? 'Dark Mode' : 'Light Mode')
        
    },[colorTheme])

    const toggleDarkMode = () => {
        const newTheme = colorTheme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
    }

    return (
        <>
        <button
                onClick={toggleDarkMode}
        >
             {colorTheme === 'light' ?  <Moon/> : <Sun/>} 
        </button>
        {/* {label && (
            <span
            className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"

            > {label}</span>
        )} */}
        </>
    )
}

export default SwitcherTheme
