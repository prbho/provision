interface LeadData {
  name?: string
  email?: string
  phone?: string
}

interface LeadFormStepsProps {
  // step: 'name' | 'email' | 'phone'
  step: number

  data: LeadData
  onChange: (field: keyof LeadData, value: string) => void
  onSubmit: () => void
}

export default function LeadFormSteps({
  step,
  data,
  onChange,
  onSubmit,
}: LeadFormStepsProps) {
  const getLabel = () => {
    switch (step) {
      case 0:
        return "What's your name?"
      case 1:
        return 'Your email address'
      case 2:
        return 'Phone number'
      default:
        return 'Please provide your details'
    }
  }

  const getValue = () => {
    switch (step) {
      case 0:
        return data.name || ''
      case 1:
        return data.email || ''
      case 2:
        return data.phone || ''
      default:
        return ''
    }
  }

  const getField = () => {
    switch (step) {
      case 0:
        return 'name' as keyof LeadData
      case 1:
        return 'email' as keyof LeadData
      case 2:
        return 'phone' as keyof LeadData
      default:
        return 'name' as keyof LeadData
    }
  }
  return (
    <div className="px-4 py-3 border-t bg-white space-y-3">
      <p className="text-sm font-medium">{getLabel()}</p>

      <input
        value={getValue()}
        onChange={(e) => onChange(getField(), e.target.value)}
        className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
        placeholder="Type here…"
      />

      <button
        onClick={onSubmit}
        className="w-full py-2 text-sm font-medium rounded-lg bg-brand text-white hover:bg-brand"
      >
        {step === 2 ? 'Submit' : 'Continue'}
      </button>
    </div>
  )
}
