import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Admin - Tez Natija 6 Navigator',
}

export default async function NavigatorAdminPage() {
  const supabase = await createClient()

  // In a real scenario with auth enforced:
  // const { data: { user }, error: authError } = await supabase.auth.getUser()
  // if (authError || !user) redirect('/admin/login')

  // Fetch leads
  const { data: leads, error } = await supabase
    .from('navigator_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  // Fallback if table doesn't exist yet (for the sake of the MVP without running migrations)
  const displayLeads = leads || []

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Biznes Navigator - Boshqaruv Paneli</h1>
          <p className="text-slate-500 mt-2">Tez Natija 6 ishtirokchilaridan kelib tushgan ma'lumotlar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Jami Diagnostikalar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{displayLeads.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Yangi murojaatlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{displayLeads.filter(l => l.status === 'Yangi').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">O'rtacha ball</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {displayLeads.length > 0 
                  ? Math.round(displayLeads.reduce((acc, curr) => acc + (curr.total_score || 0), 0) / displayLeads.length)
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Barcha murojaatlar</CardTitle>
          </CardHeader>
          <CardContent>
            {displayLeads.length === 0 ? (
              <div className="text-center py-12 text-slate-500">Hozircha ma'lumotlar yo'q yoki baza ulanmagan.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sana</TableHead>
                      <TableHead>Ism / Kompaniya</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Soha</TableHead>
                      <TableHead>Ball</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayLeads.map((lead: any) => (
                      <TableRow key={lead.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString('uz-UZ')}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-900">{lead.full_name}</div>
                          <div className="text-sm text-slate-500">{lead.company_name}</div>
                        </TableCell>
                        <TableCell>{lead.contact}</TableCell>
                        <TableCell>{lead.industry}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {lead.total_score} ball
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            lead.status === 'Yangi' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' : 
                            'bg-slate-50 text-slate-600 ring-slate-500/10'
                          }`}>
                            {lead.status || 'Yangi'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
