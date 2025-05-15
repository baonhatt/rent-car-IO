import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'
import Cart from './Cart'
import { Button } from './ui/button'
import { Navigate, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { login, logout } from '@/api/authAPI'

type SearchComProp = {
    searchTerm: string,
    setSearchTerm: (value: string) => void
}
function SearchCom({ searchTerm, setSearchTerm }: SearchComProp) {
    const [count, setCount] = useState(0)
    const navigate = useNavigate()
    useEffect(() => {
        const intervalId = setInterval(() => {
          setCount(prev => prev + 1); 
        }, 1000);
    
        return () => clearInterval(intervalId);
      }, []); //
    

    const  handleLogout = async ()  => {
        try {
            const res = await logout()
            navigate('/')
            toast({
                title: 'Logout successfully!'
            })
        } catch (error) {
            toast({
                title: error.message
            })
        }
          
    }
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <h1>{count}</h1>
            <Input
                type="text"
                placeholder="Search tasks..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className='px-6' onClick={()=> setCount(0)}>Clear</Button>
                <Button className='px-6' onClick={()=> handleLogout()}>Logout</Button>
        </div>
    )
}

export default SearchCom
