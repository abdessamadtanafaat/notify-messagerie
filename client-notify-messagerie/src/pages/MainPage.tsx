import React, { useEffect } from 'react'

export default function MainPage() {

    const  getData() = async () => {
        const data =await axios.get(

        );
    }
        throw new Error('Function not implemented.');
    }

    useEffect(()=>{
    // han fin dir api li katjib data w affichihoum like f page mn api external 
    await getData(); 

    },[//hna kn7etto fo9ach bghina n3eyto 3la api tani])

  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
          <MainPageData />
        </Suspense>

    </div>
  )
}