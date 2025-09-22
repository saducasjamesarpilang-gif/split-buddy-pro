import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Copy, Plus, X, Search, User, UserPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CreateBillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  type: 'registered' | 'guest';
  nickname?: string;
}

const CreateBillModal = ({ open, onOpenChange }: CreateBillModalProps) => {
  const [billName, setBillName] = useState("");
  const [inviteCode, setInviteCode] = useState("SPLIT123");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("registered");
  const [errors, setErrors] = useState<string[]>([]);

  // Mock data for registered users search
  const mockUsers = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", nickname: "alice_j", type: "registered" as const },
    { id: "2", name: "Bob Smith", email: "bob@example.com", nickname: "bobsmith", type: "registered" as const },
    { id: "3", name: "Carol Davis", email: "carol@example.com", nickname: "carol_d", type: "registered" as const },
  ];

  // Guest form state
  const [guestForm, setGuestForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const generateNewCode = () => {
    const codes = ["BILL", "SPLIT", "SHARE", "PAY", "FUND"];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setInviteCode(`${randomCode}${randomNum}`);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    // Show toast notification
  };

  const addRegisteredUser = (user: typeof mockUsers[0]) => {
    if (!participants.find(p => p.id === user.id)) {
      setParticipants(prev => [...prev, user]);
    }
  };

  const addGuestUser = () => {
    const guestErrors = [];
    if (!guestForm.firstName.trim()) guestErrors.push("First name is required");
    if (!guestForm.lastName.trim()) guestErrors.push("Last name is required");
    if (!guestForm.email.trim()) guestErrors.push("Email is required");
    else if (!/\S+@\S+\.\S+/.test(guestForm.email)) guestErrors.push("Invalid email format");

    if (guestErrors.length > 0) {
      setErrors(guestErrors);
      return;
    }

    const guestId = `guest_${Date.now()}`;
    const newGuest: Participant = {
      id: guestId,
      name: `${guestForm.firstName} ${guestForm.lastName}`,
      email: guestForm.email,
      type: 'guest'
    };

    setParticipants(prev => [...prev, newGuest]);
    setGuestForm({ firstName: "", lastName: "", email: "" });
    setErrors([]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleCreateBill = () => {
    const billErrors = [];
    if (!billName.trim()) billErrors.push("Bill name is required");
    if (participants.length === 0) billErrors.push("At least one participant is required");

    if (billErrors.length > 0) {
      setErrors(billErrors);
      return;
    }

    console.log("Creating bill:", {
      name: billName,
      code: inviteCode,
      participants
    });

    onOpenChange(false);
    // Reset form
    setBillName("");
    setParticipants([]);
    setErrors([]);
    generateNewCode();
  };

  const filteredUsers = mockUsers.filter(user => 
    !participants.find(p => p.id === user.id) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.nickname?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Bill</DialogTitle>
          <DialogDescription>
            Set up a new bill and invite participants to share expenses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Bill Name */}
          <div className="space-y-2">
            <Label htmlFor="billName">Bill Name *</Label>
            <Input
              id="billName"
              placeholder="Enter bill name (e.g., Weekend Trip, Dinner Out)"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              className={errors.some(e => e.includes("Bill name")) ? "border-destructive" : ""}
            />
          </div>

          {/* Invite Code */}
          <div className="space-y-2">
            <Label>Invitation Code</Label>
            <div className="flex space-x-2">
              <div className="flex-1 flex items-center space-x-2 p-3 bg-muted rounded-md">
                <Badge variant="outline" className="font-mono text-lg">
                  {inviteCode}
                </Badge>
                <Button variant="ghost" size="sm" onClick={copyInviteCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" onClick={generateNewCode}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this code with participants to join the bill
            </p>
          </div>

          {/* Current Participants */}
          {participants.length > 0 && (
            <div className="space-y-2">
              <Label>Participants ({participants.length})</Label>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-sm text-muted-foreground">{participant.email}</p>
                          </div>
                          <Badge variant={participant.type === 'registered' ? 'default' : 'secondary'}>
                            {participant.type === 'registered' ? (
                              <User className="h-3 w-3 mr-1" />
                            ) : (
                              <UserPlus className="h-3 w-3 mr-1" />
                            )}
                            {participant.type}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeParticipant(participant.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Add Participants */}
          <div className="space-y-2">
            <Label>Add Participants</Label>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="registered">Registered Users</TabsTrigger>
                <TabsTrigger value="guest">Guest Users</TabsTrigger>
              </TabsList>

              <TabsContent value="registered" className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users by name, email, or nickname..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">@{user.nickname} • {user.email}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => addRegisteredUser(user)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      {searchTerm ? "No users found matching your search." : "No available users to add."}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="guest" className="space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guestFirstName">First Name *</Label>
                        <Input
                          id="guestFirstName"
                          placeholder="John"
                          value={guestForm.firstName}
                          onChange={(e) => setGuestForm(prev => ({ ...prev, firstName: e.target.value }))}
                          className={errors.some(e => e.includes("First name")) ? "border-destructive" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guestLastName">Last Name *</Label>
                        <Input
                          id="guestLastName"
                          placeholder="Doe"
                          value={guestForm.lastName}
                          onChange={(e) => setGuestForm(prev => ({ ...prev, lastName: e.target.value }))}
                          className={errors.some(e => e.includes("Last name")) ? "border-destructive" : ""}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guestEmail">Email *</Label>
                      <Input
                        id="guestEmail"
                        type="email"
                        placeholder="john@example.com"
                        value={guestForm.email}
                        onChange={(e) => setGuestForm(prev => ({ ...prev, email: e.target.value }))}
                        className={errors.some(e => e.includes("Email")) ? "border-destructive" : ""}
                      />
                    </div>
                    <Button onClick={addGuestUser} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Guest User
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBill}>
              Create Bill
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBillModal;