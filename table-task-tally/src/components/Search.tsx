import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'
import Cart from './Cart'
import { Button } from './ui/button'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'
import { login, logout } from '@/api/authAPI'

type SearchComProp = {
  searchTerm: string,
  setSearchTerm: (value: string) => void
}
async function checkInternetConnection() {
  try {
    await fetch("https://www.google.com", { mode: "no-cors" });
    return true;
  } catch {
    return false;
  }
}

checkInternetConnection().then((isConnected) => {
  console.log("Internet connected:", isConnected);
});
function SearchCom({ searchTerm, setSearchTerm }: SearchComProp) {
  const [count, setCount] = useState(0)

  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      const internetConnected = await checkInternetConnection();
      setIsOnline(internetConnected);

      if (internetConnected) {
        toast({
          title: 'Đang online'
        })
      } else {
        toast({
          title: 'Đang offline'
        })
      }
    };

    checkConnection();
  }, [navigator.onLine]);



  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Search tasks..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

    </div>
  )
}

export default SearchCom
