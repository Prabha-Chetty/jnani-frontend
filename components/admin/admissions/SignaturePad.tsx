'use client'

import { useRef, useImperativeHandle, forwardRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Eraser } from 'lucide-react'

export type SignaturePadHandle = {
  toDataURL: () => string | null
  clear: () => void
  isEmpty: () => boolean
}

type Props = {
  label: string
  hint?: string
}

const SignaturePad = forwardRef<SignaturePadHandle, Props>(({ label, hint }, ref) => {
  const sigRef = useRef<SignatureCanvas>(null)

  useImperativeHandle(ref, () => ({
    toDataURL: () => {
      if (!sigRef.current || sigRef.current.isEmpty()) return null
      return sigRef.current.toDataURL('image/png')
    },
    clear: () => sigRef.current?.clear(),
    isEmpty: () => sigRef.current?.isEmpty() ?? true,
  }))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-dark-100">{label}</label>
        <button
          type="button"
          onClick={() => sigRef.current?.clear()}
          className="text-xs text-secondary-400 hover:text-secondary-300 flex items-center gap-1"
        >
          <Eraser className="w-3.5 h-3.5" /> Clear
        </button>
      </div>
      <div className="rounded-lg border-2 border-dashed border-dark-600 bg-white touch-none">
        <SignatureCanvas
          ref={sigRef}
          penColor="#0f172a"
          canvasProps={{
            className: 'w-full h-44 rounded-lg',
            style: { width: '100%', height: '176px' },
          }}
        />
      </div>
      {hint && <p className="text-xs text-dark-400">{hint}</p>}
    </div>
  )
})

SignaturePad.displayName = 'SignaturePad'
export default SignaturePad
