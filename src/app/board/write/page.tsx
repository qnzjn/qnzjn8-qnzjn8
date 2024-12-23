'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './write.module.css'

export default function WritePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const generateId = () => {
    const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    if (existingPosts.length === 0) return 1
    
    // 기존 게시글들의 ID 중 가장 큰 값을 찾아서 1을 더함
    const maxId = Math.max(...existingPosts.map((post: any) => post.id))
    return maxId + 1
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 로컬 스토리지에서 기존 게시글 가져오기
    const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    
    // 새 게시글 생성
    const newPost = {
      id: generateId(),
      title: title.trim(),
      content: content.trim(),
      images,
      author: '작성자',
      date: formatDate(new Date()),
      views: 0
    }
    
    // 게시글 저장 (새 게시글을 배열의 앞에 추가)
    localStorage.setItem('posts', JSON.stringify([newPost, ...existingPosts]))
    
    router.push('/board')
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.container}>
      <h1>글쓰기</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
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
            등록
          </button>
        </div>
      </form>
    </div>
  )
} 