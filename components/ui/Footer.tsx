"use client"
import React from 'react'
export default function 
() {
  return (
    <div>
          {/* Footer Info */}
              <div className="bg-white rounded-lg shadow-md p-4 text-center space-y-2">
                
                <p className="text-blue-900 font-semibold">
                  Festival Round Trip Scheme: User Guide and Terms & Conditions
                </p>
                <p className="text-blue-700">
                  Customers can use enhanced interface for their IRCTC related queries!!
                </p>
                <a href="https://equery.irctc.co.in" className="text-blue-600 underline">
                  https://equery.irctc.co.in
                </a>
                <p className="text-sm text-red-600">
                  Customer Care Numbers : Dial 14646 (Within India); Call: +91-8044647999 / +91-8035734999(Outside India)
                </p>
                <div className='w-[100%] flex justify-center items-center mt-10 flex-col'>

                <img src="/footertrain.png" alt="" className='self-center w-50 mb-10'/>
                 <p className="text-sm text-gray-600 mb-20">
                  Developed and maintained by Dhananjai Pratap Singh
                </p>
                </div>
              </div>

    </div>
  )
}
