import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";

const createTagSchema = z.object({
  title: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
})

type CreateTagSchema = z.infer<typeof createTagSchema>

export function TagForm() {
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, watch, formState } = useForm<CreateTagSchema>({ resolver: zodResolver(createTagSchema) })
  
  function getSlugFromString (slug?: string) {
    return slug?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/g, '').replace(/\s+/g, '-').toLowerCase();
  }
  
  const slug = getSlugFromString(watch('title'))

  const { mutateAsync, } = useMutation({
    mutationFn: async ({ title }: CreateTagSchema) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
    
      await fetch('http://localhost:3333/tags', {
        method: 'POST',
        body: JSON.stringify({ title, slug, amountOfVideos: 0 })
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-tags'] })
  })

  const createTag = async (data: CreateTagSchema) => {
    await mutateAsync(data)
  }

  return (
    <form className="w-full space-y-6" onSubmit={handleSubmit(createTag)}>
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium block">Tag Title</label>
        
        <input
          {...register('title')}
          id="title"
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          type="text" 
        />

        {formState.errors?.title && <p className="text-red-400 text-sm">{formState.errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="text-sm font-medium block">Slug</label>
        <input 
          id="slug" 
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm" 
          readOnly
          value={slug}
          type="text" 
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button type="button">
            <X className="size-3" />
            
            Cancel
          </Button>
        </Dialog.Close>
        
        <Button className="bg-teal-400 text-teal-950" type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? <Loader2 className="size-3 animate-spin" /> : <Check className='size-3' />}
          
          Save
        </Button>
      </div>
    </form>
  )
}
