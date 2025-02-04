/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate} from "react-router-dom"
import { useCheckAuthQuery, useFindUserQuery, useLogoutMutation, useLogoutUsingUserIdMutation } from "../redux/api/user"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/features/auth/authSlice"
import { useEffect, useState } from "react"
import { setSearch, setTicket, setTickets } from "../redux/features/ticket/ticketSlice"
import {setQueryParams, clearQueryParam} from "../middleware/query"
export const Navbar = () => {
  const {userInfo} = useSelector((state)=> state.auth)
  const [logoutUser] = useLogoutMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {data:yourInfo, refetch, isError} = useFindUserQuery(userInfo?._id)
  const [transition, setTransition] = useState("translate-x-full")
  const [menuBar, setMenuBar] = useState(false)
  const [isLogout, setIsLogout] = useState(false)
  const [logoutModal, setLogoutModal] = useState("-translate-y-8 opacity-0")
  const {search} = useLocation()
  const [serverError, setServerError] = useState(false)
  const {isError:checkAuthError, refetch:checkAuthRefetch} = useCheckAuthQuery()
  const [logoutUsingUserId] = useLogoutUsingUserIdMutation()

  useEffect(()=> {
    refetch()
    const intervalRefetch = setInterval(refetch,3000)
    return ()=> clearInterval(intervalRefetch)
  },[])

  useEffect(()=> {
    checkAuthRefetch()
    const intervalRefetch = setInterval(checkAuthRefetch,2000)
    return ()=> clearInterval(intervalRefetch)
  },[])



  useEffect(()=> {
    const timer = setTimeout(async()=> {
      if(checkAuthError) {
        try {
          const res = await logoutUsingUserId(userInfo?._id)
          if(!res.error) {
            dispatch(logout())
            dispatch(setTicket({}))
            dispatch(setTickets([]))
            dispatch(setSearch(""))
            navigate('/')   
          }
        } catch (error) {
          console.log(error)
          setQueryParams('error',true)
        }
          
      }
    })
    return ()=> clearTimeout(timer)
  },[checkAuthError])

  useEffect(()=> {
    const timer = setTimeout(async()=> {
      if(yourInfo?.isOnline === false) {
        try {
          const res = await logoutUser()
          if(!res.error){
            dispatch(logout())
            dispatch(setTicket({}))
            dispatch(setTickets([]))
            dispatch(setSearch(""))
            navigate('/')          
          }
        } catch (error) {
          console.log(error)
          setQueryParams('error',true)
        }
      }
    },200)
    return ()=> clearTimeout(timer)
  },[yourInfo])

  useEffect(()=> {
    if(isError){
      setQueryParams('error',true)
    }
  },[isError])


  const handleLogout = async() => {
    setIsLogout(true)
    setTimeout(()=> {
      setLogoutModal("-translate-y-0 opacity-100")
    })
  }
  
  const submitLogout = async()=> {
    try {
      const res = await logoutUser()
      if(!res.error){
        dispatch(logout())
        dispatch(setTicket({}))
        dispatch(setTickets([]))
        dispatch(setSearch(""))
        navigate('../')
      }
    } catch (error) {
    
      console.log(error)
      setQueryParams('error',true)
    }
  }

  const handleCancelLogout = () => {
    setLogoutModal("-translate-y-8 opacity-0")
    setTimeout(()=> {
      setIsLogout(false)
    },700)
  }

  const handleMenuBar = () => {
    setMenuBar(true)
    setTimeout(()=> {
      setTransition("translate-x-0")
    })
  }

  const handleCloseMenu = ()=> {
    setTransition("translate-x-full")
    setTimeout(()=> {
      setMenuBar(false)
    },700)
  }


  useEffect(()=> {
    if(search === "?error=true") {
      setServerError(true)
    }
  },[search])


  return (
    <>
      <header className="flex justify-between py-2 xs:px-2 lg:px-10 items-center hover:shadow-lg hover:shadow-black/10 absolute duration-300 ease-in-out  w-full z-20 bg-white">
        <img src="/bernalesLogo.png" alt="logo" className="h-10"/>
        <div  className="flex items-center gap-5">
          <p className="font-semibold xs:hidden lg:block xs:text-xs lg:text-base">Welcome, {userInfo?.name.toUpperCase()} {userInfo?.type !== "APPROVER" && "("}{userInfo?.type !== "APPROVER" && userInfo?.department} {userInfo?.type !== "APPROVER" && "-"} {userInfo?.type !== "APPROVER" && userInfo?.type} {userInfo?.type !== "APPROVER" && ")"}</p>
          <i className={`bi bi-door-open-fill text-xl cursor-pointer rounded-full px-2 py-1  duration-200 ease-in-out border-2 hover:bg-red-500 hover:text-white ${isLogout && "bg-red-500 text-white"} xs:hidden lg:block `} onClick={handleLogout}></i>
        </div>
        <i className="lg:hidden bi bi-list text-3xl pr-2" onClick={handleMenuBar}></i>
      </header>
      {
        isLogout && 
        <div className="absolute top-0 left-0 bg-white/10 backdrop-blur-[1px] h-full w-full z-50 flex items-center justify-center">
          <div className={`w-96 h-64 bg-white flex flex-col rounded-md overflow-hidden  transition-all duration-700 ease-in-out ${logoutModal} shadow-md shadow-black/40`}>
              <h1 className="p-2 font-bold text-xl bg-red-500 text-white">Confirmation</h1>
              <div className="flex flex-col items-center justify-center px-5 w-full h-full gap-5">
                <p className="font-semibold">You want to logout?</p>
                <div className="flex gap-5">
                  <button className="border-2 border-red-500 bg-red-500 text-white hover:text-red-500 hover:bg-white w-24 py-2 rounded duration-200 ease-in-out font-bold" onClick={submitLogout}>YES</button>
                  <button className="border-2 border-slate-500 bg-slate-500 text-white hover:text-slate-500 hover:bg-white w-24 py-2 rounded duration-200 ease-in-out font-bold" onClick={handleCancelLogout}>NO</button>
                </div>
              </div>
          </div>
        </div>
      }
        <div className={`${!menuBar && "hidden"} w-full absolute z-20 h-screen bg-black/10 top-0 left-0 flex justify-end`} >
          <div className="w-4/12 h-full" onClick={handleCloseMenu}></div>
          <div className={`w-8/12 h-full bg-white transition-all ${transition} duration-700 flex flex-col justify-between`}>
            <div className="flex flex-col text-xs">
              <p className="font-bold p-4 border-b-2 ">Welcome, {userInfo?.name.toUpperCase()} {userInfo?.type !== "APPROVER" && "("}{userInfo?.type !== "APPROVER" && userInfo?.department} {userInfo?.type !== "APPROVER" && "-"} {userInfo?.type !== "APPROVER" && userInfo?.type} {userInfo?.type !== "APPROVER" && ")"}</p>
              <Link to="/approver-dashboard" className="p-4 font-semibold border-b-2">
                Dashbord
              </Link>
            </div>
            <div onClick={handleLogout} className="p-2 border-t-2 font-semibold">
              <i className={`bi bi-door-open-fill text-xl px-2 py-1 `}></i>
              Logout
            </div>
          </div>
      </div>
      { 
        serverError &&
        <div className="absolute w-screen h-screen top-0 left-0 bg-black/30 backdrop-blur-[1.5px] z-50 flex items-center justify-center">
          <div className="w-7/12 bg-white h-5/6 rounded-xl flex items-center justify-center shadow-xl">
            <div className="flex flex-col gap-20 items-center">
              <div className="text-center text-slate-700">
              <p className="text-7xl font-bold ">Server Error!</p>
              <p className="text-2xl font-semibold">Please Try Again Later!</p>
                </div>
              <button className="p-3 rounded  text-3xl font-bold bg-red-500 w-28 text-white" onClick={()=> {setServerError(false); clearQueryParam('error')}}>OK</button>
            </div>
          </div>
        </div>
      }
    </>
  )
}
