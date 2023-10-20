type ButtonType = "disabled" | "normal" | "cancel" | "accept" | "highlight"

interface ButtonProps {
  type: ButtonType,
  className?: string,
  children: React.ReactNode
}

function Button({ type, className = "", children }: ButtonProps) {
  console.log(type)
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
    <button className={finalClassName}>{children}</button>
  )
}

export default Button
