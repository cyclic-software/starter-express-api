import React from 'react'
import "./footer.css"
import cod from "./assetes/cash-on-delivery.png"
import map from "./assetes/maps-and-flags.png"
import returnBox from "./assetes/return-box.png"
import customers from "./assetes/shopping.png"

function Footer() {
  return (
    <div className='footerCont'>
      <div className="features">

        <div className='feature'>
           <div className="featureimage">
              <img src={cod} alt="" />
           </div>
           <div className="featurename">
               cash on delivery
           </div>
        </div>

        <div className='feature'>
           <div className="featureimage">
              <img src={customers} alt="" />
           </div>
           <div className="featurename">
               happy cutomers
           </div>
        </div>

        <div className='feature'>
           <div className="featureimage">
              <img src={map} alt="" />
           </div>
           <div className="featurename">
               made in india for world
           </div>
        </div>

        <div className='feature'>
           <div className="featureimage">
              <img src={returnBox} alt="" />
           </div>
           <div className="featurename">
               easy return policy
           </div>
        </div>
      </div>

      <div className="sections">

        <div className="section">
           <div className="footerLink">
               VISIT OFFLINE STORE
           </div>
           <div className="footerLink">
               454545,that place,that city
           </div>
           <div className="footerLink">
               Get Directions
           </div>
        </div>

        <div className="section">
           <div className="footerLink">
               CUSTOMER CARE
           </div>
           <div className="footerLink">
               call at +91xxxxxxxxxx
           </div>
           <div className="footerLink">
               mail at xxxx@yyyy.com
           </div>
        </div>

        <div className="section">
           <div className="footerLink">
               Contact us
           </div>
           <div className="footerLink">
               FAQ
           </div>
           <div className="footerLink">
               Blogs
           </div>
           <div className="footerLink">
               Term & Conditions
           </div>
        </div>

        <div className="section">
           <div className="footerLink">
               Exchange/return request
           </div>
           <div className="footerLink">
               Return policy
           </div>
           <div className="footerLink">
               Track your order
           </div>
        </div>

      </div>

    </div>
  )
}

export default Footer