import * as React from "react"

export type ToastProps = {
  title?: string
  description?: string
}

type ToastContextValue = {
  toast: (props: ToastProps) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
)

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toast, setToast] = React.useState<ToastProps | null>(null)

  return (
    <ToastContext.Provider
      value={{
        toast: (props) => setToast(props),
      }}
    >
      {children}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-white border shadow-lg rounded-lg p-4 max-w-sm">
          <p className="font-semibold">{toast.title}</p>
          <p className="text-sm text-neutral-600">
            {toast.description}
          </p>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) {
    throw new Error(
      "useToast must be used within a ToastProvider"
    )
  }
  return ctx
}
