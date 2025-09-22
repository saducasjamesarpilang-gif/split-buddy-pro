import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { DollarSign, Search, UserPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const GuestJoin = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [guestForm, setGuestForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [step, setStep] = useState<"search" | "register">("search");
  const [errors, setErrors] = useState<string[]>([]);
  const [billInfo, setBillInfo] = useState<any>(null);

  const handleCodeSearch = () => {
    const newErrors = [];
    if (!inviteCode.trim()) newErrors.push("Invitation code is required");
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate bill search
    const mockBill = {
      name: "Weekend Trip Expenses",
      host: "John Doe",
      participants: 3,
      code: inviteCode.toUpperCase()
    };

    setBillInfo(mockBill);
    setStep("register");
    setErrors([]);
  };

  const handleGuestRegistration = () => {
    const newErrors = [];
    if (!guestForm.firstName.trim()) newErrors.push("First name is required");
    if (!guestForm.lastName.trim()) newErrors.push("Last name is required");
    if (!guestForm.email.trim()) newErrors.push("Email is required");
    else if (!/\S+@\S+\.\S+/.test(guestForm.email)) newErrors.push("Email format is invalid");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate guest registration
    console.log("Guest joining bill:", { 
      bill: billInfo, 
      guest: guestForm 
    });
  };

  const handleBack = () => {
    setStep("search");
    setBillInfo(null);
    setErrors([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 text-primary hover:text-primary/80">
            <DollarSign className="h-8 w-8" />
            <span className="text-2xl font-bold">SplitBuddy</span>
          </Link>
          <p className="text-muted-foreground">Join a bill as a guest</p>
        </div>

        {step === "search" ? (
          /* Search Step */
          <Card>
            <CardHeader>
              <CardTitle>Join with Invite Code</CardTitle>
              <CardDescription>
                Enter the invitation code shared by the bill creator
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invitation Code</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="inviteCode"
                      placeholder="Enter code (e.g., SPLIT123)"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      className={errors.some(e => e.includes("code")) ? "border-destructive pl-9" : "pl-9"}
                    />
                  </div>
                </div>

                <Button onClick={handleCodeSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Find Bill
                </Button>
              </div>

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Don't have an invite code?
                </p>
                <p className="text-sm text-muted-foreground">
                  <Link 
                    to="/register" 
                    className="text-primary hover:text-primary/80 hover:underline font-medium"
                  >
                    Create an account
                  </Link>{" "}
                  to create and manage your own bills
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Registration Step */
          <Card>
            <CardHeader>
              <CardTitle>Join as Guest</CardTitle>
              <CardDescription>
                Provide your details to join "{billInfo?.name}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Bill Information */}
                <div className="p-3 bg-muted rounded-md space-y-2">
                  <h4 className="font-medium">Bill Details</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><span className="font-medium">Name:</span> {billInfo?.name}</p>
                    <p><span className="font-medium">Host:</span> {billInfo?.host}</p>
                    <p><span className="font-medium">Participants:</span> {billInfo?.participants}</p>
                    <p><span className="font-medium">Code:</span> {billInfo?.code}</p>
                  </div>
                </div>

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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={guestForm.firstName}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className={errors.some(e => e.includes("First name")) ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={guestForm.lastName}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className={errors.some(e => e.includes("Last name")) ? "border-destructive" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={guestForm.email}
                    onChange={(e) => setGuestForm(prev => ({ ...prev, email: e.target.value }))}
                    className={errors.some(e => e.includes("Email")) ? "border-destructive" : ""}
                  />
                </div>

                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    <UserPlus className="h-4 w-4 inline mr-1" />
                    As a guest, you'll have limited access (6 hours/day). 
                    You can upgrade to a full account later by setting a password.
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleGuestRegistration} className="flex-1">
                    Join Bill
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-primary hover:text-primary/80 hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GuestJoin;