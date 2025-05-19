import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Boxes, ShoppingCart, Users, Lightbulb, LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
  actionLink?: string;
  actionText?: string;
}

function StatCard({ title, value, icon: Icon, description, actionLink, actionText }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {actionLink && actionText && (
          <Button asChild size="sm" className="mt-4">
            <Link href={actionLink}>{actionText}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome to Bloom POS! Here's an overview of your florist shop."
        icon={LayoutDashboard}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Inventory Items"
          value="125"
          icon={Boxes}
          description="Total distinct items in stock"
          actionLink="/inventory"
          actionText="Manage Inventory"
        />
        <StatCard
          title="Today's Sales"
          value="$1,280"
          icon={ShoppingCart}
          description="Revenue generated today"
          actionLink="/sales"
          actionText="Process New Sale"
        />
        <StatCard
          title="Active Customers"
          value="78"
          icon={Users}
          description="Customers with recent activity"
          actionLink="/customers"
          actionText="View Customers"
        />
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-muted-foreground" />
              AI Arrangement Suggester
            </CardTitle>
            <CardDescription>
              Get AI-powered suggestions for floral arrangements based on occasion, preferences, and inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/suggestions">Get Suggestions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
