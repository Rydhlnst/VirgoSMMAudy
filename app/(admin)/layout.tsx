import React from 'react'

type Props = {
    children: React.ReactNode
}

const AdminLayout = ({children}: Props) => {
  return (
    <div className="h-dvh w-full overflow-y-auto overflow-x-hidden">
      {children}
    </div>
  )
}

export default AdminLayout
