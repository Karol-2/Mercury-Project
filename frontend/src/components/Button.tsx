type ButtonType = "disabled" | "normal" | "cancel" | "accept" | "highlight"

interface ButtonProps {
  type: ButtonType,
  className?: string,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  children: React.ReactNode
}

function Button({ type, className = "", onClick, children }: ButtonProps) {
  const buttonColors: Record<ButtonType, string> = {
    "disabled": "bg-my-dark text-my-light",
    "normal": "bg-my-light text-my-dark",
    "cancel": "bg-my-cancel text-my-dark",
    "accept": "bg-my-accept text-my-dark",
    "highlight": "bg-my-orange text-my-dark"
  }

  const buttonColor = buttonColors[type]
  const finalClassName = `${buttonColor} rounded-full px-5 py-2 m-1` + className

  return (
    <button className={finalClassName} onClick={onClick}>{children}</button>
  )
}

export default Button
