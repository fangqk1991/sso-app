import React from 'react'

export const Input = (props: { onEnter?: Function; [p: string]: any }) => {
  const newProps = { ...props }
  const onEnter = newProps.onEnter
  delete newProps.onEnter
  return (
    <input
      {...newProps}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && onEnter) {
          onEnter()
        }
      }}
    />
  )
}
