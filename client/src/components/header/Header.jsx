import React from 'react'
import "./header.css"
import Bubbles from './Bubbles/Bubbles'
import logoText from "./assets/logo_text.png"
import searchIcon from "./assets/magnifying-glass-solid.svg"
import userIcon from "./assets/user-solid.svg"
import favoriteIcon from "./assets/heart-solid.svg"
import cartIcon from "./assets/bag-shopping-solid.svg"
import homeIcon from "./assets/home.svg"

import { Link } from 'react-router-dom'


function Header() {
  
  const handleScroll = (e)=>{
      const head=document.querySelector(".header")
  
      head.classList.add('sticky',window.scrollY >5)
      document.querySelector(".nav").style.display="flex";
  }
  
 
  //window.addEventListener("scroll",handleScroll,{once:true})
  setTimeout(handleScroll,3000)

  return (
    <>
    <div key="header" className={`header`}>
      <Bubbles/>
      <Link to="/">
      <div key="logoCont" className='logoCont'>
         <img src={logoText} id="logoText" alt=''/>
         <h1 className='textlogo'>DRIP</h1>
      </div>
      </Link>
    </div>
    <ul className="nav">

<Link to="/">
<li key ="0" className="search-box">
  <img src={searchIcon}alt="" className='icon' />
</li>
</Link>


<Link to="/">
<li key="10"><img src={homeIcon} alt="" className="icon" /></li> 
</Link>


<Link to="/account">
<li key="1"><img src={userIcon} alt="" className="icon" /></li>
</Link>

<Link to="/favorites">
<li key="2">
  <img src={favoriteIcon} alt="" className="icon" /></li>
</Link>

<Link to="/cart">
<li key="3">
  <img src={cartIcon} alt="" className="icon" />
</li>
</Link>

</ul>
    </>
  )
}
 
export default Header