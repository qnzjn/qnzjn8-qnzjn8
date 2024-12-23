'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import styles from '../../write/write.module.css'

interface Post {
  id: number
  title: string
  content: string
  author: string
  date: string
  views: number
  images?: string[]
  comments?: any[]
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]')
    const currentPost = posts.find((p: Post) => p.id === parseInt(resolvedParams.id))
    if (currentPost) {
      setPost(currentPost)
      setTitle(currentPost.title)
      setContent(currentPost.content)
      setImages(currentPost.images || [])
    }
  }, [resolvedParams.id])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!post) return

    const posts = JSON.parse(localStorage.getItem('posts') || '[]')
    const updatedPosts = posts.map((p: Post) => {
      if (p.id === post.id) {
        return {
          ...p,
          title: title.trim(),
          content: content.trim(),
          images
        }
      }
      return p
    })

    localStorage.setItem('posts', JSON.stringify(updatedPosts))
    router.push(`/board/${post.id}`)
  }

  if (!post) {
    return <div className={styles.container}>게시글을 찾을 수 없습니다.</div>
  }

  return (
    <div className={styles.container}>
      <h1>게시글 수정</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목��� 입력하세요"
            required
            maxLength={100}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            required
            rows={15}
          />
        </div>

        <div className={styles.imageUploadSection}>
          <label htmlFor="image" className={styles.imageUploadButton}>
            이미지 첨부
            <input
              type="file"
              id="image"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className={styles.hiddenInput}
            />
          </label>

          <div className={styles.imagePreviewContainer}>
            {images.map((image, index) => (
              <div key={index} className={styles.imagePreview}>
                <img src={image} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className={styles.removeImageButton}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => router.back()} className={styles.cancelButton}>
            취소
          </button>
          <button type="submit" className={styles.submitButton}>
            수정완료
          </button>
        </div>
      </form>
    </div>
  )
} 