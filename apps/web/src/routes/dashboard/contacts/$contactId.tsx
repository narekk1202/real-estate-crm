import DeleteContact from '#/components/contacts/delete-contact'
import EditContact from '#/components/contacts/edit-contact'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { cn } from '#/lib/utils'
import { contactByIdQueryOptions } from '#/services/query-options/contacts'
import type { Contact, ContactStatus, ContactType } from '@crm/shared'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Copy, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/contacts/$contactId')({
  component: RouteComponent,
})

const typeBadgeClass: Record<ContactType, string> = {
  LEAD: 'bg-blue-100 text-blue-600',
  CLIENT: 'bg-green-100 text-green-600',
  AGENT: 'bg-yellow-100 text-yellow-600',
  LANDLORD: 'bg-purple-100 text-purple-600',
}

const statusBadgeClass: Record<ContactStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-600',
  POTENTIAL: 'bg-yellow-100 text-yellow-600',
  INACTIVE: 'bg-gray-100 text-gray-600',
  ARCHIVED: 'bg-red-100 text-red-600',
}

function ContactHeader({
  contact,
  onDelete,
}: Readonly<{
  contact: Contact
  onDelete: () => void
}>) {
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
  const fullName = `${contact.firstName} ${contact.lastName}`

  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-base font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight">
                {fullName}
              </h1>
              <div className="flex items-center gap-2">
                <Badge className={cn(typeBadgeClass[contact.type])}>
                  {contact.type}
                </Badge>
                <Badge className={cn(statusBadgeClass[contact.status])}>
                  {contact.status}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Member since{' '}
                {new Date(contact.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EditContact contact={contact} />
            <DeleteContact contact={contact} onSuccess={onDelete} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ContactInfoCard({ contact }: Readonly<{ contact: Contact }>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <InfoRow label="Email">
            <a
              href={`mailto:${contact.email}`}
              className="text-primary hover:underline"
            >
              {contact.email}
            </a>
          </InfoRow>
          <Separator />
          <InfoRow label="Phone">
            <a
              href={`tel:${contact.phone}`}
              className="text-primary hover:underline"
            >
              {contact.phone}
            </a>
          </InfoRow>
          {contact.source && (
            <>
              <Separator />
              <InfoRow label="Source">{contact.source}</InfoRow>
            </>
          )}
          <Separator />
          <InfoRow label="Last Updated">
            {new Date(contact.updatedAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </InfoRow>
        </dl>
      </CardContent>
    </Card>
  )
}

function ContactNotesCard({ contact }: Readonly<{ contact: Contact }>) {
  if (!contact.notes) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
          {contact.notes}
        </p>
      </CardContent>
    </Card>
  )
}

function ContactQuickActions({
  contact,
  onCopy,
}: Readonly<{
  contact: Contact
  onCopy: () => void
}>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <a href={`mailto:${contact.email}`}>
            <Mail />
            Send Email
          </a>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <a href={`tel:${contact.phone}`}>
            <Phone />
            Call
          </a>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onCopy}
        >
          <Copy />
          Copy Contact Info
        </Button>
      </CardContent>
    </Card>
  )
}

function InfoRow({
  label,
  children,
}: Readonly<{
  label: string
  children: React.ReactNode
}>) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <main className="page-wrap space-y-6">
      <div className="h-5 w-36 animate-pulse rounded bg-muted" />
      <div className="h-36 animate-pulse rounded-xl bg-muted" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-52 animate-pulse rounded-xl bg-muted" />
        <div className="h-52 animate-pulse rounded-xl bg-muted" />
      </div>
    </main>
  )
}

function RouteComponent() {
  const { contactId } = Route.useParams()
  const navigate = useNavigate()

  const { data: contact, isLoading } = useQuery(
    contactByIdQueryOptions(contactId),
  )

  const handleCopy = () => {
    if (!contact) return
    const text = `${contact.firstName} ${contact.lastName}\n${contact.email}\n${contact.phone}`
    navigator.clipboard.writeText(text)
    toast.success('Contact info copied to clipboard')
  }

  if (isLoading) return <LoadingSkeleton />

  if (!contact) {
    return (
      <main className="page-wrap space-y-4">
        <Link
          to="/dashboard/contacts"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" />
          Back to Contacts
        </Link>
        <p className="text-muted-foreground">Contact not found.</p>
      </main>
    )
  }

  return (
    <main className="page-wrap space-y-6">
      <Link
        to="/dashboard/contacts"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Contacts
      </Link>

      <ContactHeader
        contact={contact}
        onDelete={() => navigate({ to: '/dashboard/contacts' })}
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <ContactInfoCard contact={contact} />
          <ContactNotesCard contact={contact} />
        </div>
        <ContactQuickActions contact={contact} onCopy={handleCopy} />
      </div>
    </main>
  )
}
