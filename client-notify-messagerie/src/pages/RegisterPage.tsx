import { Button } from '@material-tailwind/react'
import React from 'react'
const RegsiterPage: React.FC = ()=> {

    //const handleResgister = ()=> {}
return (
        // <div> HELLO THSI REGISTER PAGE</div>
        <div className="flex items-center justify-center h-screen">
        <Button color="blue" onClick={() => console.log('Button Clicked')}>
          Register
        </Button>
      </div>
      )
    
}
export default RegsiterPage

