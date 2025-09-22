import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, DollarSign, Users, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billParticipants: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

const AddExpenseModal = ({ open, onOpenChange, billParticipants }: AddExpenseModalProps) => {
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState<"equally" | "custom">("equally");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const resetForm = () => {
    setExpenseName("");
    setAmount("");
    setPaidBy("");
    setSplitType("equally");
    setSelectedParticipants([]);
    setCustomAmounts({});
    setErrors([]);
  };

  const handleParticipantToggle = (participantId: string) => {
    setSelectedParticipants(prev => {
      const newSelection = prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId];
      
      // Clear custom amount if participant is deselected
      if (!newSelection.includes(participantId)) {
        setCustomAmounts(prev => {
          const newAmounts = { ...prev };
          delete newAmounts[participantId];
          return newAmounts;
        });
      }
      
      return newSelection;
    });
  };

  const handleCustomAmountChange = (participantId: string, value: string) => {
    setCustomAmounts(prev => ({
      ...prev,
      [participantId]: value
    }));
  };

  const calculateEqualSplit = () => {
    const totalAmount = parseFloat(amount) || 0;
    const participantCount = splitType === "equally" ? billParticipants.length : selectedParticipants.length;
    return participantCount > 0 ? (totalAmount / participantCount).toFixed(2) : "0.00";
  };

  const calculateCustomTotal = () => {
    return Object.values(customAmounts)
      .reduce((total, amount) => total + (parseFloat(amount) || 0), 0)
      .toFixed(2);
  };

  const validateForm = () => {
    const newErrors = [];
    
    if (!expenseName.trim()) newErrors.push("Expense name is required");
    if (!amount || parseFloat(amount) <= 0) newErrors.push("Valid amount is required");
    if (!paidBy) newErrors.push("Please select who paid for this expense");
    
    if (splitType === "custom") {
      if (selectedParticipants.length === 0) {
        newErrors.push("Please select at least one participant for custom split");
      } else {
        const totalCustom = parseFloat(calculateCustomTotal());
        const originalAmount = parseFloat(amount);
        
        if (Math.abs(totalCustom - originalAmount) > 0.01) {
          newErrors.push(`Custom amounts (${totalCustom.toFixed(2)}) must equal the total amount (${originalAmount.toFixed(2)})`);
        }
        
        selectedParticipants.forEach(participantId => {
          const participant = billParticipants.find(p => p.id === participantId);
          const customAmount = parseFloat(customAmounts[participantId] || "0");
          if (customAmount <= 0) {
            newErrors.push(`Please enter a valid amount for ${participant?.name}`);
          }
        });
      }
    }
    
    return newErrors;
  };

  const handleAddExpense = () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const expenseData = {
      name: expenseName,
      amount: parseFloat(amount),
      paidBy,
      splitType,
      participants: splitType === "equally" 
        ? billParticipants.map(p => ({ id: p.id, amount: parseFloat(calculateEqualSplit()) }))
        : selectedParticipants.map(id => ({ id, amount: parseFloat(customAmounts[id] || "0") }))
    };

    console.log("Adding expense:", expenseData);
    
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Add an expense and specify how it should be split among participants
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

          {/* Expense Details */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="expenseName">Expense Name *</Label>
              <Input
                id="expenseName"
                placeholder="e.g., Lunch at Italian Restaurant"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className={errors.some(e => e.includes("Expense name")) ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={errors.some(e => e.includes("amount")) ? "border-destructive pl-9" : "pl-9"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Paid By *</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className={errors.some(e => e.includes("paid")) ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select who paid for this expense" />
                </SelectTrigger>
                <SelectContent>
                  {billParticipants.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id}>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{participant.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Split Type */}
          <div className="space-y-4">
            <Label>How should this be split?</Label>
            <RadioGroup value={splitType} onValueChange={(value: "equally" | "custom") => setSplitType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="equally" id="equally" />
                <Label htmlFor="equally" className="flex items-center space-x-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  <span>Split equally among all participants</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="flex items-center space-x-2 cursor-pointer">
                  <Calculator className="h-4 w-4" />
                  <span>Custom amounts for selected participants</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Split Preview/Configuration */}
          <Card>
            <CardContent className="p-4">
              {splitType === "equally" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Equal Split Preview</h4>
                    <Badge variant="outline">
                      ${calculateEqualSplit()} per person
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {billParticipants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{participant.name}</span>
                        </div>
                        <span className="font-mono">${calculateEqualSplit()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Custom Split Configuration</h4>
                    <Badge variant="outline">
                      Total: ${calculateCustomTotal()} / ${amount || "0.00"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {billParticipants.map((participant) => (
                      <div key={participant.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`participant-${participant.id}`}
                            checked={selectedParticipants.includes(participant.id)}
                            onCheckedChange={() => handleParticipantToggle(participant.id)}
                          />
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <Label 
                            htmlFor={`participant-${participant.id}`} 
                            className="flex-1 cursor-pointer font-medium"
                          >
                            {participant.name}
                          </Label>
                        </div>
                        
                        {selectedParticipants.includes(participant.id) && (
                          <div className="ml-8">
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={customAmounts[participant.id] || ""}
                                onChange={(e) => handleCustomAmountChange(participant.id, e.target.value)}
                                className="pl-8 text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {selectedParticipants.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Select participants to include in this custom split
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>
              Add Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;