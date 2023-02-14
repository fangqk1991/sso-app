import React from 'react'

export const Input = (
  props: { onEnter?: Function } & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
) => {
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
