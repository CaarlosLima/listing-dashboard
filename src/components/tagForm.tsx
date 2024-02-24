import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";

const createTagSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  slug: z.string(),
})

type CreateTagSchema = z.infer<typeof createTagSchema>

export function TagForm() {
  const { register, handleSubmit, watch } = useForm<CreateTagSchema>({ resolver: zodResolver(createTagSchema) })

  function createTag(data: CreateTagSchema) {
    console.log(data)
  }

  const slug = watch('name')

  return (
    <form className="w-full space-y-6" onSubmit={handleSubmit(createTag)}>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium block">Tag Name</label>
        
        <input
          {...register('name')}
          id="name"
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          type="text" />
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="text-sm font-medium block">Slug</label>
        <input 
          {...register('slug')}
          id="slug" 
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm" 
          readOnly
          type="text" 
          value={slug.replace(/\s/g, '-').toLowerCase()}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button type="button">
            <X className="size-3" />
            
            Cancel
          </Button>
        </Dialog.Close>
        
        <Button className="bg-teal-400 text-teal-950" type="submit">
          <Check className='size-3' />
          
          Save
        </Button>
      </div>
    </form>
  )
}
