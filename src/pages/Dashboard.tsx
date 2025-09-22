import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  DollarSign, 
  Users, 
  Calendar, 
  Crown, 
  Settings, 
  LogOut, 
  Search,
  Filter,
  Archive,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  // Mock data
  const userProfile = {
    name: "John Doe",
    nickname: "Johnny",
    email: "john@example.com",
    accountType: "Standard",
    monthlyBills: 3,
    maxBills: 5
  };

  const bills = [
    {
      id: 1,
      name: "Weekend Trip",
      code: "WKD123",
      participants: 4,
      totalAmount: 450.00,
      yourShare: 112.50,
      status: "active",
      createdAt: "2024-01-15",
      isHost: true
    },
    {
      id: 2,
      name: "Dinner at Italian Place",
      code: "DIN456",
      participants: 3,
      totalAmount: 89.50,
      yourShare: 29.83,
      status: "active",
      createdAt: "2024-01-20",
      isHost: false
    },
    {
      id: 3,
      name: "Monthly Groceries",
      code: "GRO789",
      participants: 2,
      totalAmount: 156.75,
      yourShare: 78.38,
      status: "completed",
      createdAt: "2024-01-10",
      isHost: true
    }
  ];

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         bill.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "active" ? bill.status === "active" : bill.status === "completed";
    return matchesSearch && matchesTab;
  });

  const handleCreateBill = () => {
    console.log("Create new bill");
  };

  const handleViewBill = (billId: number) => {
    console.log("View bill:", billId);
  };

  const handleEditBill = (billId: number) => {
    console.log("Edit bill:", billId);
  };

  const handleDeleteBill = (billId: number) => {
    console.log("Delete bill:", billId);
  };

  const handleArchiveBill = (billId: number) => {
    console.log("Archive bill:", billId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">SplitBuddy</span>
              </div>
              <Badge variant={userProfile.accountType === "Premium" ? "default" : "secondary"}>
                {userProfile.accountType === "Premium" && <Crown className="h-3 w-3 mr-1" />}
                {userProfile.accountType}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{userProfile.name}</p>
                <p className="text-sm text-muted-foreground">@{userProfile.nickname}</p>
              </div>
              <Avatar>
                <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="h-4 w-4 mr-2" />
                    Archived Bills
                  </DropdownMenuItem>
                  {userProfile.accountType === "Standard" && (
                    <DropdownMenuItem>
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bills</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bills.filter(b => b.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">
                {userProfile.accountType === "Standard" && 
                  `${userProfile.monthlyBills}/${userProfile.maxBills} this month`
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bills.reduce((acc, bill) => acc + bill.participants, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all bills</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Total Share</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${bills.filter(b => b.status === 'active').reduce((acc, bill) => acc + bill.yourShare, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Pending payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Bills Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Bills</CardTitle>
                <CardDescription>Manage and track your shared expenses</CardDescription>
              </div>
              <Button onClick={handleCreateBill} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Bill</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search bills by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="active">Active Bills</TabsTrigger>
                <TabsTrigger value="completed">Completed Bills</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => (
                    <Card key={bill.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-lg">{bill.name}</h3>
                              <Badge variant="outline">#{bill.code}</Badge>
                              {bill.isHost && <Badge>Host</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>{bill.participants} participants</span>
                              </p>
                              <p className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>Created {new Date(bill.createdAt).toLocaleDateString()}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Total</p>
                              <p className="font-semibold">${bill.totalAmount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Your Share</p>
                              <p className="font-semibold text-primary">${bill.yourShare.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewBill(bill.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {bill.isHost && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditBill(bill.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleArchiveBill(bill.id)}
                              >
                                <Archive className="h-4 w-4 mr-1" />
                                Archive
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDeleteBill(bill.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No bills found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? "No bills match your search criteria." : "Create your first bill to get started."}
                    </p>
                    {!searchTerm && (
                      <Button onClick={handleCreateBill}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Bill
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {/* Similar structure for completed bills */}
                <div className="text-center py-12">
                  <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No completed bills</h3>
                  <p className="text-muted-foreground">Completed bills will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;