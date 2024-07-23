import Image from 'next/image'
import React from 'react'

export default function Header() {
  return (
    <header className='bg-[#1E2139]'>
       <section className='flex justify-between'>
        <div>
            <Image src={"/InvoicePurpleHeaderImg.svg"} alt='firstHeaderImg' width={72} height={72}/>
        </div>
        <div className='flex justify-center items-center gap-4 pr-6'>
            <div className='w-[20px] h-[20px] bg-[#858BB2] rounded-[50%]'></div>
            <div className='w-[1px] h-[100%] bg-[#494E6E]'></div>
            <Image className='rounded-[50%]' src={"/mainGithubPhoto.jpg"} alt='firstHeaderImg' width={32} height={32}/>
        </div>
        </section> 
    </header>
  )
}
