import { Header } from '@/components/Header';
import TaskTable from '@/components/TaskTable';

const Index = () => {
  
  return (
    <div className=" min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <Header/>
        
        <TaskTable />
        
        <footer className="pt-4 text-center text-sm text-muted-foreground">
        </footer>
      </div>
    </div>
  );
};

export default Index;
