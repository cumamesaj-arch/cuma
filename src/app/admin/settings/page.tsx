import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Ana Sayfa Ayarları</CardTitle>
            <CardDescription>
                Siteye ait renk ayarları, font ayarları ve genel görünüm.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Ana Renk (Primary)</Label>
                <Input type="color" defaultValue="#FFD700" />
            </div>
             <div className="space-y-2">
                <Label>Arkaplan Rengi (Background)</Label>
                <Input type="color" defaultValue="#F5F5DC" />
            </div>
             <div className="space-y-2">
                <Label>Vurgu Rengi (Accent)</Label>
                <Input type="color" defaultValue="#800000" />
            </div>
            <Button>Ayarları Kaydet</Button>
        </CardContent>
    </Card>
  )
}
