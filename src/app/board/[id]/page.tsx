'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './post.module.css'
import { use } from 'react'

interface Comment {
  id: number
  content: string
  author: string
  date: string
  isEditing?: boolean
}

interface Post {
  id: number
  title: string
  content: string
  author: string
  date: string
  views: number
  images?: string[]
  comments?: Comment[]
}

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const resolvedParams = use(params)

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]')
    const currentPost = posts.find((p: Post) => p.id === parseInt(resolvedParams.id))
    if (currentPost) {
      setPost(currentPost)
      setComments(currentPost.comments || [])

      // 조회수 증가
      const updatedPosts = posts.map((p: Post) => {
        if (p.id === currentPost.id) {
          return { ...p, views: p.views + 1 }
        }
        return p
      })
      localStorage.setItem('posts', JSON.stringify(updatedPosts))
    }
  }, [resolvedParams.id])

  const formatDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]')
      const updatedPosts = posts.filter((p: Post) => p.id !== post?.id)
      localStorage.setItem('posts', JSON.stringify(updatedPosts))
      router.push('/board')
    }
  }

  const handleEdit = () => {
    router.push(`/board/edit/${post?.id}`)
  }

  const addComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const newCommentObj: Comment = {
      id: Date.now(),
      content: newComment.trim(),
      author: '작성자',
      date: formatDate()
    }

    const updatedComments = [...comments, newCommentObj]
    setComments(updatedComments)
    setNewComment('')

    // 게시글 업데이트
    if (post) {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]')
      const updatedPosts = posts.map((p: Post) => {
        if (p.id === post.id) {
          return { ...p, comments: updatedComments }
        }
        return p
      })
      localStorage.setItem('posts', JSON.stringify(updatedPosts))
    }
  }

  const startEditingComment = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditedContent(comment.content)
  }

  const saveCommentEdit = (commentId: number) => {
    if (!editedContent.trim()) return

    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content: editedContent.trim() }
      }
      return comment
    })

    setComments(updatedComments)
    setEditingComment(null)
    setEditedContent('')

    // 게시글 업데이트
    if (post) {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]')
      const updatedPosts = posts.map((p: Post) => {
        if (p.id === post.id) {
          return { ...p, comments: updatedComments }
        }
        return p
      })
      localStorage.setItem('posts', JSON.stringify(updatedPosts))
    }
  }

  const deleteComment = (commentId: number) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      const updatedComments = comments.filter(comment => comment.id !== commentId)
      setComments(updatedComments)

      // 게시글 업데이트
      if (post) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]')
        const updatedPosts = posts.map((p: Post) => {
          if (p.id === post.id) {
            return { ...p, comments: updatedComments }
          }
          return p
        })
        localStorage.setItem('posts', JSON.stringify(updatedPosts))
      }
    }
  }

  if (!post) {
    return <div className={styles.container}>게시글을 찾을 수 없습니다.</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.postHeader}>
        <h1>{post.title}</h1>
        <div className={styles.postInfo}>
          <span>작성자: {post.author}</span>
          <span>작성일: {post.date}</span>
          <span>조회수: {post.views}</span>
        </div>
      </div>

      <div className={styles.content}>
        {post.content.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      {post.images && post.images.length > 0 && (
        <div className={styles.imageContainer}>
          {post.images.map((image, index) => (
            <div key={index} className={styles.imageWrapper}>
              <img src={image} alt={`Image ${index + 1}`} />
            </div>
          ))}
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button onClick={() => router.back()} className={styles.backButton}>
          목록으로
        </button>
        <button onClick={handleEdit} className={styles.editButton}>
          수정
        </button>
        <button onClick={handleDelete} className={styles.deleteButton}>
          삭제
        </button>
      </div>

      <div className={styles.commentSection}>
        <h2>댓글 {comments.length}개</h2>
        
        <form onSubmit={addComment} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className={styles.commentInput}
            required
          />
          <button type="submit" className={styles.commentSubmit}>
            댓글 작성
          </button>
        </form>

        <div className={styles.commentList}>
          {Array.isArray(comments) && comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>{comment.author}</span>
                <span className={styles.commentDate}>{comment.date}</span>
              </div>
              
              {editingComment === comment.id ? (
                <div className={styles.commentEditForm}>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className={styles.commentEditInput}
                  />
                  <div className={styles.commentEditButtons}>
                    <button
                      onClick={() => saveCommentEdit(comment.id)}
                      className={styles.saveButton}
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingComment(null)}
                      className={styles.cancelButton}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className={styles.commentContent}>{comment.content}</p>
                  <div className={styles.commentButtons}>
                    <button
                      onClick={() => startEditingComment(comment)}
                      className={styles.editButton}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className={styles.deleteButton}
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 