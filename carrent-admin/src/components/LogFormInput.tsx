import React, { ChangeEventHandler } from 'react'

interface LogFormInputProps {
  label: string
  placeholder?: string
  name: string
  type?: React.HTMLInputTypeAttribute
  id?: string
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  htmlFor?: string
}

export default function LogFormInput({
  label,
  placeholder,
  type = 'text',
  name,
  id,
  value,
  onChange,
  htmlFor,
}: LogFormInputProps) {
  const resolvedId = id ?? htmlFor ?? name

  return (
    <div className="space-y-2">
      <label htmlFor={resolvedId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={resolvedId}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
    </div>
  )
}
