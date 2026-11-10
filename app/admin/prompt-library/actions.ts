// 更新 createLibraryPrompt 函数
export async function createLibraryPrompt(formData: FormData) {
  const supabase = await createClient()
  const tagsString = formData.get('tags') as string
  
  const { error } = await supabase.from('prompt_library').insert({
    title: formData.get('title') as string,
    category_id: Number(formData.get('category_id')), // 👈 改为接收 ID
    model: formData.get('model') as string,
    content: formData.get('content') as string,
    image_url: formData.get('image_url') as string || null,
    tags: tagsString ? tagsString.split(',').map(t => t.trim()) : []
  })
  
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/prompt-library'); revalidatePath('/prompt-library')
  return { success: true }
}