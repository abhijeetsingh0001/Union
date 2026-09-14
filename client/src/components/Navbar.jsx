import React from 'react'
import { dummyUser } from '../assets/asset'
import { Link,useLocation } from 'react-router-dom'
import { AstroidIcon, HistoryIcon, LayoutDashboard } from 'lucide-react';
import { UserButton, useUser } from '@clerk/react';



const Navbar = () => {
  const {isSignedIn, user} = useUser()
  const location = useLocation()
  const userName = user?.fullname || user?.firstName ||user?.primaryEmailAddress?.emailAddres?.split("@")[0]||"User";

  return (
    <header className="w-full max-w-305 mx-auto bg-white/90 backdrop-blur xl:rounded-b-xl sticky top-0 z-40 px-6 py-4 flex items-center justify-between border border-slate-200">
      {/* brand logo and navigation Link */}
      <div className='flex items-center gap-6'>
        <Link to ='/dashboard' className='flex items-center gap-1.5'>
        <img src="/logo.svg" alt ="Meetup-logo" className="size-6.5"/>
        <span className='text-2xl font-medium tracking-tight text-slate-900 flex items-center'>
          UNION <span className = "text-primary">.</span>
        </span>
        </Link>
        {isSignedIn &&(
          <nav className=" flex flex-items-center gap-1.5 ml-2">
            <Link to ="/dashboard" className = {`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname ==='/dashboard'?"ring ring-blue-100 bg-blue-50 text-slate-800":
            "text-slate-500 hover:text-slate-900 hover:bg-slate-50"

              }`}>
                <LayoutDashboard className = "w-3.5 h-3.5"/>
                Dashboard
            </Link>
            <Link to ="/sessions" className = {`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname ==='/sessions'?"ring ring-blue-100 bg-blue-50 text-slate-800":
            "text-slate-500 hover:text-slate-900 hover:bg-slate-50"

              }`}>
                < HistoryIcon className = "w-3.5 h-3.5"/>
                Sessions
            </Link>
            <Link to ="/pricing" className = {`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${location.pathname ==='/pricing'?"ring ring-blue-100 bg-blue-50 text-slate-800":
            "text-slate-500 hover:text-slate-900 hover:bg-slate-50"

              }`}>
                < AstroidIcon className = "w-3.5 h-3.5"/>
                Pricing
            </Link>


          </nav>
        )}

      </div>

      {/* right profile*/}
      {isSignedIn && (
        <div className='flex items-center gap-4'>
          <Link to = "/sessions" className='md:hidden text-xs font-medium text-slate-600 hover:text-primary flex items-center gap-1'>
          < HistoryIcon className = "w-4 h-4"/>
          sessions

          </Link>
          <span className='font-medium hidden sm:inline tracking-wide text-sm text-slate-700'>
            Welcome, {userName}
          </span>
          <UserButton afterSignOutUrl = "/login"/>

        </div>
      )

      }

    </header>
  )
}

export default Navbar
