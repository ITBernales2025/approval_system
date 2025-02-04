import { useNavigate } from "react-router"


const NotFound = () => {
  const query = window.location.search
  const navigate = useNavigate()
  const goBackToLogin = ()=> {
    navigate('/')
  }
  return (
    <div className="h-screen  relative w-full flex overflow-x-hidden bg-no-repeat bg-cover items-center justify-center" style={{backgroundImage: `url(/001.jpg)`}}>
       <div className="absolute w-full h-full bg-blue-500/60 backdrop-blur-sm z-10">
       </div>
        <div className="w-8/12 h-5/6 mt-10 bg-white z-20  flex flex-col gap-24 rounded-md shadow-md shadow-black/50 items-center justify-center text-center">
          
          
          {query === "?error=Danger" ? (
            <p className="xs:text-3xl lg:text-7xl font-black text-slate-700">You Dont Have Authorize To Do That!</p>
          ) : (

            <p className="xs:text-3xl lg:text-7xl font-black text-slate-700">ERROR: 404, PAGE NOT FOUND </p>
          )}
          <button className="text-3xl font-semibold bg-red-500 text-white p-3 rounded hover:scale-105 duration-200 ease-in-out " onClick={goBackToLogin}>Back</button>
        </div>
    </div>
  )
}

export default NotFound