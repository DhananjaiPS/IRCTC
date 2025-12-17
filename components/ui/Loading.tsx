import React from 'react'

function Loading() {
    return (
        <div>
            <div className="flex items-center justify-center ">
                <div className="w-5 h-5 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        </div>
    )
}

export default Loading