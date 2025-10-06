interface PageContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
  noPadding?: boolean
}

export function PageContainer({ 
  children, 
  maxWidth = '7xl',
  noPadding = false 
}: PageContainerProps) {
  const maxWidthClass = maxWidth === 'full' ? 'max-w-full' : `max-w-${maxWidth}`
  const paddingClass = noPadding ? '' : 'px-4 sm:px-6 lg:px-8 py-8'

  return (
    <div className={`${maxWidthClass} mx-auto ${paddingClass}`}>
      {children}
    </div>
  )
}
