import React, { useState, useEffect} from "react"
import axios from 'axios'

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}

const IndexPage = () => {
  

  const [ip, setIp] = useState('')

  useEffect(()=>{
    axios.get('https://api.db-ip.com/v2/free/self').then((response) => {
      setIp(response.data.ipAddress)
    })
  }, [])

  return (
    <main style={pageStyles}>
      <title>Home Page</title>
      <h1 style={headingStyles}>
        {`Today is : ${new Date().toString()}`}
        <br />
        {`Your ip address: ${ip}`}
       </h1>
     </main>

  )
}

export default IndexPage
