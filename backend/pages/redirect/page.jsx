import { redirectDriveApi } from 'src/_api/drive'
import { LOCAL_STORAGE_KEYS } from 'src/lib/utils/constant'
import {  useSearchParams } from "react-router-dom";
import { useEffect } from 'react'
import Cookies from 'universal-cookie';
import { useDispatch } from 'react-redux';
import { changeIsCookieSet } from 'src/redux/services/system';


export default function RedirectPage() {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  let [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const abortController = new AbortController();
  const signal = abortController.signal;
  useEffect(() => {
    redirectDriveApi(code, {signal}).then(res => {
      const current = new Date();
      const next45Mninutes = new Date();
      next45Mninutes.setMinutes(current.getMinutes() + 45);
      cookies.set(
        LOCAL_STORAGE_KEYS.GOOGLE_DRIVE_AUTHORIZATION, 
        res.data.accessToken, 
        {path: '/', expires: next45Mninutes}
      );
      dispatch(changeIsCookieSet(res.data.accessToken))
      let parent = window.top;
      if (parent == window.self) {
        parent = window.opener;
        console.log({parent})
        parent.document.getElementById(
          window.name
        ).click(); 
      }
      window.close();  
      
    })
    return () => {
      abortController.abort();
    }
  }, [])

  return (
    <div>
    </div>
  )
}
