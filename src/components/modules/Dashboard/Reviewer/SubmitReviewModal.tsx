/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Save, Info, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { submitReviewAction } from "@/app/(dashboardLayout)/(committeeReviewerRoutes)/committee-reviewer/applications/_actions";

export default function SubmitReviewModal({ 
  open, 
  onOpenChange, 
  applicationId, 
  studentName,
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  applicationId: string;
  studentName: string;
  onSuccess: () => void;
}) {
  const qc = useQueryClient();
  
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: any) => submitReviewAction(applicationId, values),
  });

  const form = useForm({
    defaultValues: {
      gpaScore: 0,
      essayScore: 0,
      financialScore: 0,
      criteriaScore: 0,
      notes: "",
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Saving evaluation...");
      const result = await mutateAsync(value);

      if (result.success) {
        toast.success(result.message, { id: toastId });
        qc.invalidateQueries({ queryKey: ["applications"] });
        onOpenChange(false);
        form.reset();
        onSuccess();
      } else {
        toast.error(result.message, { id: toastId });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="bg-muted/10 px-8 pt-8 pb-6 border-b border-border/40">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-2 text-foreground">
              <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
              Score Applicant
            </DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">
              Evaluation for <span className="text-foreground font-bold">{studentName}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <ScoreInput form={form} name="gpaScore" label="GPA Score" />
            <ScoreInput form={form} name="essayScore" label="Essay Score" />
            <ScoreInput form={form} name="financialScore" label="Financial Score" />
            <ScoreInput form={form} name="criteriaScore" label="Criteria Score" />
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
              <Info className="h-4 w-4" /> Justification Notes
            </Label>
            <form.Field name="notes">
              {(field) => (
                <Textarea 
                  placeholder="Provide brief reasoning for these scores..." 
                  className="rounded-xl min-h-[100px] bg-background border-border/60"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>
          </div>

          <DialogFooter>
            <AppSubmitButton 
              isPending={isPending} 
              className="w-full h-12 rounded-xl font-black text-white"
              style={{ background: `linear-gradient(135deg, #4b2875, #0097b2)` }}
            >
              <CheckCircle2 className="mr-2 h-5 w-5" /> Submit Review
            </AppSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ScoreInput({ form, name, label }: any) {
  return (
    <form.Field name={name}>
      {(field: { state: { value: string | number | readonly string[] | undefined; }; handleChange: (arg0: number) => void; }) => (
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{label}</Label>
          <div className="relative">
            <Input 
              type="number" max={10} min={0}
              className="h-12 rounded-xl font-black text-lg pl-4 pr-10 border-border/60 focus:border-primary/50"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">/ 10</span>
          </div>
        </div>
      )}
    </form.Field>
  );
}