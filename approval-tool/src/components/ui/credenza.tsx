"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CredenzaContextValue {
  isDesktop: boolean
}

const CredenzaContext = React.createContext<CredenzaContextValue | undefined>(undefined)

function useCredenzaContext() {
  const context = React.useContext(CredenzaContext)
  if (!context) {
    throw new Error("Credenza components must be used within a Credenza")
  }
  return context
}

interface CredenzaProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Credenza = ({ children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const contextValue = React.useMemo(() => ({ isDesktop }), [isDesktop])

  const Comp = isDesktop ? Dialog : Drawer

  return (
    <CredenzaContext.Provider value={contextValue}>
      <Comp {...props}>{children}</Comp>
    </CredenzaContext.Provider>
  )
}

const CredenzaTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ className, ...props }, ref) => {
  const { isDesktop } = useCredenzaContext()
  const Comp = isDesktop ? DialogTrigger : DrawerTrigger

  return <Comp ref={ref} className={className} {...props} />
})
CredenzaTrigger.displayName = "CredenzaTrigger"

const CredenzaClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DialogClose>
>(({ className, ...props }, ref) => {
  const { isDesktop } = useCredenzaContext()
  const Comp = isDesktop ? DialogClose : DrawerClose

  return <Comp ref={ref} className={className} {...props} />
})
CredenzaClose.displayName = "CredenzaClose"

const CredenzaContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, children, ...props }, ref) => {
  const { isDesktop } = useCredenzaContext()

  if (isDesktop) {
    return (
      <DialogContent ref={ref} className={className} {...props}>
        {children}
      </DialogContent>
    )
  }

  return (
    <DrawerContent ref={ref} className={cn("px-4 pb-4", className)} {...props}>
      {children}
    </DrawerContent>
  )
})
CredenzaContent.displayName = "CredenzaContent"

const CredenzaHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { isDesktop } = useCredenzaContext()
  const Comp = isDesktop ? DialogHeader : DrawerHeader

  return <Comp className={className} {...props} />
}
CredenzaHeader.displayName = "CredenzaHeader"

const CredenzaFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { isDesktop } = useCredenzaContext()
  const Comp = isDesktop ? DialogFooter : DrawerFooter

  return <Comp className={className} {...props} />
}
CredenzaFooter.displayName = "CredenzaFooter"

const CredenzaTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ className, ...props }, ref) => {
  const { isDesktop } = useCredenzaContext()
  const Comp = isDesktop ? DialogTitle : DrawerTitle

  return <Comp ref={ref} className={className} {...props} />
})
CredenzaTitle.displayName = "CredenzaTitle"

const CredenzaDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof DialogDescription>
>(({ className, ...props }, ref) => {
  const { isDesktop } = useCredenzaContext()
  const Comp = isDesktop ? DialogDescription : DrawerDescription

  return <Comp ref={ref} className={className} {...props} />
})
CredenzaDescription.displayName = "CredenzaDescription"

const CredenzaBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("px-4 md:px-0 py-4", className)} {...props} />
}
CredenzaBody.displayName = "CredenzaBody"

export {
  Credenza,
  CredenzaTrigger,
  CredenzaClose,
  CredenzaContent,
  CredenzaHeader,
  CredenzaFooter,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaBody,
}
