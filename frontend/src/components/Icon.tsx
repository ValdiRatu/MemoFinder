import React from 'react'
import { Button } from 'react-bootstrap'
import { ButtonVariant } from 'react-bootstrap/types'
import * as icons from 'react-bootstrap-icons'

interface IconProps extends icons.IconProps {
  id?: string
  variant?: ButtonVariant
  iconName: keyof typeof icons
  onClick?: () => void
  buttonClassname?: string
  active?: boolean
  disabled?: boolean
}

export const Icon = ({
  id = '',
  variant,
  iconName,
  onClick,
  buttonClassname,
  active = false,
  disabled = false,
  ...props
}: IconProps) => {
  const BootstrapIcon = icons[iconName]
  return (
    <Button
      id={id}
      variant={variant}
      onClick={onClick}
      className={`${buttonClassname} pb-2`}
      active={active}
      disabled={disabled}
    >
      <BootstrapIcon {...props} />
    </Button>
  )
}
