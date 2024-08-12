import React from "react";
import { ComponentProps, ReactNode } from "react";


interface ButtonProps extends ComponentProps<'button'> {
    children: ReactNode
}

export function Button({ children,  ...props } : ButtonProps) {
    return (
        <button 
            {...props}
            className="border border-white px-5 py-2 bg-blue-700 hover:bg-blue-900 text-white rounded-lg"
        >
            {children}
        </button>
    )
}