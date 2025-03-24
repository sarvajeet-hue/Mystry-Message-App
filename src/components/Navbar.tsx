"use client"

import React from 'react'
import { useSession , signOut } from 'next-auth/react'
import Link from 'next/link'
import {User} from 'next-auth'

export const Navbar = () => {

    const {data : session} = useSession()

  return (
    <div>Navbar</div>
  )
}
