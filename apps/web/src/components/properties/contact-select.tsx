import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '#/components/ui/input-group'
import { cn } from '#/lib/utils'
import { contactsInfiniteQueryOptions } from '#/services/query-options/contacts'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChevronDownIcon, XIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { useDebounceValue, useOnClickOutside } from 'usehooks-ts'

interface ContactSelectProps {
  value?: string | null
  onChange: (value: string | null) => void
}

function ContactSelect({ value, onChange }: Readonly<ContactSelectProps>) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 300)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(contactsInfiniteQueryOptions(debouncedSearch))

  const contacts = data?.pages.flatMap((p) => p.data) ?? []

  useOnClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
    setOpen(false)
    if (!value) {
      setInputValue('')
      setSearch('')
    }
  })

  function handleSelect(id: string) {
    const contact = contacts.find((c) => c.id === id)
    if (contact) {
      onChange(id)
      setInputValue(`${contact.firstName} ${contact.lastName}`)
      setSearch('')
      setOpen(false)
    }
  }

  function handleClear() {
    onChange(null)
    setInputValue('')
    setSearch('')
    setOpen(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setInputValue(v)
    setSearch(v)
    setOpen(true)
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget
    if (
      scrollHeight - scrollTop - clientHeight < 60 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <InputGroup>
        <InputGroupInput
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder="Select contact…"
        />
        <InputGroupAddon align="inline-end">
          {value ? (
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              onClick={handleClear}
            >
              <XIcon className="size-4" />
            </InputGroupButton>
          ) : (
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              onClick={() => setOpen((o) => !o)}
            >
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
          <div className="max-h-60 overflow-y-auto p-1" onScroll={handleScroll}>
            {contacts.length === 0 && !isFetchingNextPage ? (
              <div className="py-2 text-center text-sm text-muted-foreground">
                No contacts found.
              </div>
            ) : (
              contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleSelect(contact.id)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm select-none hover:bg-accent hover:text-accent-foreground',
                    value === contact.id && 'bg-accent/50',
                  )}
                >
                  <span className="truncate">
                    {contact.firstName} {contact.lastName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {contact.email}
                  </span>
                </button>
              ))
            )}
            {isFetchingNextPage && (
              <div className="py-2 text-center text-xs text-muted-foreground">
                Loading…
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactSelect
