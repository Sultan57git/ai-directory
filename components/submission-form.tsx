"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormData = {
  name: string;
  url: string;
  description: string;
  category: string;
  tags: string[];           // <-- important
  email?: string;
};

export default function SubmissionForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    url: "",
    description: "",
    category: "",
    tags: [],               // <-- typed as string[]
    email: "",
  });

  const [newTag, setNewTag] = useState<string>("");  // <-- make newTag a string

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    const t = newTag.trim();
    if (t && !formData.tags.includes(t)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, t] }));
      setNewTag("");
    }
  };

  const removeTag = (t: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(x => x !== t) }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: submit to your API / email / supabase
    // console.log(formData);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tool Name</label>
          <Input name="name" value={formData.name} onChange={onChange} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Website URL</label>
          <Input name="url" value={formData.url} onChange={onChange} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={4}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Input name="category" value={formData.category} onChange={onChange} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contact Email (optional)</label>
          <Input name="email" value={formData.email} onChange={onChange} />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Tags</label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="e.g. image, code, chatbot"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addTag}>
            Add
          </Button>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted px-3 py-1 text-sm flex items-center gap-2"
              >
                {t}
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => removeTag(t)}
                  aria-label={`Remove ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full md:w-auto">
        Submit Tool
      </Button>
    </form>
  );
}
