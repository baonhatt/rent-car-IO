import React, { useContext, useEffect, useState } from 'react'
import { Card } from './ui/card'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { fetchTasks } from '@/store/taskSlice';
import { fetchTodoList } from '@/api/todoAPI';
import { syncTasksFromQuery } from '@/store/reducer/taskReducer';
import { Form, FormItem } from './ui/form';
export default function Cart() {
  const dispatch = useDispatch<AppDispatch>()

  const tasks = useSelector((state: RootState) => state.tasks.tasks)
  useEffect(() => {
    dispatch(syncTasksFromQuery(tasks)) // 
  }, [dispatch])

  const [isheader, setHeader] = useState(false)
  const handleHeader = () => {
    try{
      const h2 = document.getElementById("Header")
      if(!h2){
        console.log("something was wrong");
        return 
      }
        const headerRed = isheader ? 'black' : 'red'
        h2.style.color = headerRed
        setHeader(!isheader)
      
    }catch (err){
      console.log(err);
      
    }
  }
  return (
    <div className="w-full mt-[15rem] px-3">
    <h2 id="Header"  className='text-2xl font-bold tracking-tight mb-2'><button onClick={handleHeader}>Cery</button></h2>
    <Card className="p-4 space-y-2">
      {tasks.length > 0 ? (
        tasks.map((task) => <p key={task._id}>{task.title}</p>)
      ) : (
        <p className="text-gray-500">Loading data...</p>
      )}
    </Card>
  </div>
  )
}
