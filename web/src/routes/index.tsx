import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-background">
      <h1 className='text-4xl font-mono'>Mainframe</h1>
      <Link to='/login'><Button>Enter</Button></Link>
    </div>
  )
}
