import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export const Header = () => {
  const user = useSelector((state: RootState) => state.user.user)
    // const user = JSON.parse(localStorage.getItem('user'))
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="font-medium">{user?.username || 'Guest'}</div>
              {/* <div className="text-xs text-gray-500">{user?.email}</div> */}
            </div>
            <Avatar>
              {/* <AvatarImage src={user?.avatar} alt={user?.name} /> */}
              <AvatarFallback>
                {/* {user?.name?.charAt(0)?.toUpperCase() || 'G'} */}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}
